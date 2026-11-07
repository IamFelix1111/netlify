// Secrets page: Base91 decoder + streaming file decryptor.
//
// The key is the file content's SHA-256 digest, Base91-encoded with the
// site's unambiguous alphabet (printable ASCII minus 0, I, l). Input is
// normalized with the same mapping (0 -> O, I -> 1, l -> 1) before decoding.
// Encryption (tools/Secrets/encrypt.py) XORs the payload with a SHA256-CTR
// keystream: block_i = SHA256(SHA256("Secrets/v1" || digest) || counter_be64).
// Decrypted payload: flag(1B) + inner stream; the (zlib-decompressed) inner
// stream is name\0 + content, streamed out chunk by chunk with backpressure
// and hash-verified against the key's digest (see decryptV2).
window.Base91 = (() => {
    // Build the 91-symbol alphabet: all printable ASCII except 0, I, l.
    const ALPHABET = (() => {
        let s = '';
        for (let c = 0x21; c <= 0x7E; c++) {
            const ch = String.fromCharCode(c);
            if (!'0Il'.includes(ch)) s += ch;
        }
        return s;
    })();

    const KEY_MAP = { '0': 'O', 'I': '1', 'l': '1' };
    const normalizeKey = k => k.replace(/[0Il]/g, c => KEY_MAP[c]);

    const LOOKUP = new Int8Array(128).fill(-1);
    for (let i = 0; i < ALPHABET.length; i++) LOOKUP[ALPHABET.charCodeAt(i)] = i;

    // Decode to raw bytes. Whitespace is ignored; other unknown chars throw.
    function decode(input) {
        const key = normalizeKey(String(input));
        let v = -1, b = 0, n = 0;
        const bytes = [];
        for (const ch of key) {
            if (/\s/.test(ch)) continue;
            const code = ch.charCodeAt(0);
            if (code >= 128 || LOOKUP[code] < 0) throw new Error(`Invalid character: ${ch}`);
            const c = LOOKUP[code];
            if (v < 0) { v = c; continue; }
            v += c * 91;
            b |= v << n;
            n += (v & 8191) > 88 ? 13 : 14;
            do {
                bytes.push(b & 255);
                b >>= 8;
                n -= 8;
            } while (n > 7);
            v = -1;
        }
        if (v >= 0) bytes.push((b | v << n) & 255);
        return Uint8Array.from(bytes);
    }

    // Decode and interpret the bytes as UTF-8 text.
    function decodeToString(input) {
        return new TextDecoder().decode(decode(input));
    }

    return { decode, decodeToString, normalizeKey, ALPHABET };
})();

window.SecretsVault = (() => {
    const VERSION = new TextEncoder().encode('Secrets/v1');

    // Filename tag escaping: keep [A-Za-z0-9_]; every other char becomes
    // '-' + a single code from [0-9a-t] (ASCII order), and '-' itself
    // becomes '--'. Dots and tildes are escaped too, so tags never contain
    // '.', '~' or a bare '-'. Mirrors safe_tag() in tools/Secrets/encrypt.py.
    const TAG_CHARS = "!\"#$%&'()*+,./:;<=>?@[\\]^`{|}~";
    const TAG_CODES = '0123456789abcdefghijklmnopqrst';
    const TAG_MAP = new Map([...TAG_CHARS].map((c, i) => [c, TAG_CODES[i]]));
    const safeTag = s => [...s].map(ch =>
        ch === '-' ? '--' : (TAG_MAP.has(ch) ? '-' + TAG_MAP.get(ch) : ch)).join('');
    // Encrypted resources live under a base location (see resourceLocation())
    // as <tag>.001.enc, <tag>.002.enc, ... (built by tools/Secrets/encrypt.py).
    const resourceBase = key => safeTag(key.slice(0, 4) + key.slice(-2));

    // Default resource location: /assets on this host (assets are hosted
    // separately — e.g. the Pages site's /assets directory).
    // ?location=<url> in the query overrides it (carried by the box's value).
    function defaultLocation() {
        return location.protocol + '//' + location.host + '/assets';
    }

    // The location the box is filled with: ?location=<url> if present,
    // else the default.
    function resourceLocation() {
        const s = new URLSearchParams(location.search);
        const q = s.get('location');
        return q || defaultLocation();
    }

    const sha256 = async bytes =>
        new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
    const hex = b => [...b].map(x => x.toString(16).padStart(2, '0')).join('');
    const concatBytes = arrays => {
        const total = arrays.reduce((s, a) => s + a.length, 0);
        const out = new Uint8Array(total);
        let off = 0;
        for (const a of arrays) { out.set(a, off); off += a.length; }
        return out;
    };
    const u64be = n => {
        const b = new Uint8Array(8);
        new DataView(b.buffer).setBigUint64(0, BigInt(n));
        return b;
    };

    // Keystream provider: block_i = SHA256(encKey || counter_be64), 32 bytes
    // per block. Blocks are produced in batches to hide call latency.
    function makeKeystream(encKey) {
        const BATCH = 64;
        let nextIdx = 0;
        const ready = [];
        async function fill() {
            const start = nextIdx;
            nextIdx += BATCH;
            const jobs = [];
            for (let i = 0; i < BATCH; i++)
                jobs.push(crypto.subtle.digest('SHA-256', concatBytes([encKey, u64be(start + i)])));
            for (const b of await Promise.all(jobs)) ready.push(new Uint8Array(b));
        }
        return {
            async take(n) {
                const out = new Uint8Array(n);
                let off = 0;
                while (off < n) {
                    if (!ready.length) await fill();
                    const blk = ready.shift();
                    const take = Math.min(blk.length, n - off);
                    out.set(blk.subarray(0, take), off);
                    off += take;
                    // A block partially consumed here must serve the next chunk.
                    if (take < blk.length) ready.unshift(blk.subarray(take));
                }
                return out;
            },
        };
    }

    // Incremental SHA-256 (crypto.subtle cannot hash a stream). Fed one
    // decrypted chunk at a time so verification works while writing to disk.
    function makeSha256() {
        const K = new Uint32Array([
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
        ]);
        const H = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
        const w = new Uint32Array(64);
        const buf = new Uint8Array(64);
        let bufLen = 0;
        let totalBytes = 0;
        const rotr = (x, n) => ((x >>> n) | (x << (32 - n))) >>> 0;
        function processBlock(block) {
            const dv = new DataView(block.buffer, block.byteOffset, 64);
            for (let i = 0; i < 16; i++) w[i] = dv.getUint32(i * 4);
            for (let i = 16; i < 64; i++) {
                const x = w[i - 15], y = w[i - 2];
                const s0 = rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3);
                const s1 = rotr(y, 17) ^ rotr(y, 19) ^ (y >>> 10);
                w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
            }
            let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
            for (let i = 0; i < 64; i++) {
                const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
                const ch = (e & f) ^ (~e & g);
                const t1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
                const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
                const maj = (a & b) ^ (a & c) ^ (b & c);
                const t2 = (S0 + maj) >>> 0;
                h = g; g = f; f = e;
                e = (d + t1) >>> 0;
                d = c; c = b; b = a;
                a = (t1 + t2) >>> 0;
            }
            H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
            H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
        }
        function append(data) {  // buffer bytes, no length accounting
            let off = 0;
            if (bufLen) {
                const take = Math.min(64 - bufLen, data.length);
                buf.set(data.subarray(0, take), bufLen);
                bufLen += take;
                off = take;
                if (bufLen === 64) { processBlock(buf); bufLen = 0; }
            }
            while (off + 64 <= data.length) {
                processBlock(data.subarray(off, off + 64));
                off += 64;
            }
            if (off < data.length) {
                buf.set(data.subarray(off), 0);
                bufLen = data.length - off;
            }
        }
        return {
            update(data) {
                totalBytes += data.length;
                append(data);
            },
            digest() {
                // 0x80, zeros, then the 64-bit big-endian bit length.
                const pad = new Uint8Array(bufLen < 56 ? 64 - bufLen : 128 - bufLen);
                pad[0] = 0x80;
                const dv = new DataView(pad.buffer);
                dv.setUint32(pad.length - 8, Math.floor(totalBytes / 536870912));
                dv.setUint32(pad.length - 4, ((totalBytes % 536870912) * 8) >>> 0);
                append(pad);
                const out = new Uint8Array(32);
                const odv = new DataView(out.buffer);
                for (let i = 0; i < 8; i++) odv.setUint32(i * 4, H[i]);
                return out;
            },
        };
    }

    // Streaming inflate: feed chunks into a DecompressionStream and yield
    // the decompressed output. Backpressure propagates end to end — when the
    // consumer stops pulling, the stream queue fills, pending writes block,
    // and the upstream cipher/keystream work pauses in turn.
    async function* decompressStream(chunks, format) {
        const ds = new DecompressionStream(format);
        const writer = ds.writable.getWriter();
        const reader = ds.readable.getReader();
        const pump = (async () => {
            for await (const c of chunks) await writer.write(c);
            await writer.close();
        })();
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                yield value;
            }
            await pump;
        } catch (err) {
            pump.catch(() => {});
            throw err;
        }
    }

    // Decrypt the v2 payload stream. cipherChunks yield the concatenated
    // ciphertext of all segments; decrypting yields flag(1B: 0=stored,
    // 1=zlib) + inner stream, where the (decompressed) inner stream is
    // name\0 + content (a leading \0 means "no name"). The content is hashed
    // incrementally against the key's digest and every chunk is awaited
    // through onChunk, which provides backpressure. onMeta fires (awaited)
    // as soon as the name is parsed, before any content chunk. totalSizeRef
    // is a live { totalSize } ref filled by openResource once segment 1's
    // header is parsed (a plain number is accepted too). Returns
    // { name, size }.
    async function decryptV2(cipherChunks, key, totalSizeRef, hooks) {
        const ts = () => (typeof totalSizeRef === 'number' ? totalSizeRef : totalSizeRef.totalSize);
        const digest = window.Base91.decode(key);
        if (digest.length !== 32) throw new Error('Key must decode to a 32-byte SHA-256 digest');
        const hasher = makeSha256();
        const encKey = await sha256(concatBytes([VERSION, digest]));
        const ks = makeKeystream(encKey);

        async function* plainChunks() {
            for await (const c of cipherChunks) {
                const pad = await ks.take(c.length);
                const out = new Uint8Array(c.length);
                for (let i = 0; i < c.length; i++) out[i] = c[i] ^ pad[i];
                yield out;
            }
        }
        // Read the 1-byte compression flag first.
        const plain = plainChunks();
        let flag = -1;
        let buf = new Uint8Array(0);
        while (flag < 0) {
            const { done, value } = await plain.next();
            if (done) throw new Error('Not a Secrets file');
            buf = concatBytes([buf, value]);
            if (buf.length) { flag = buf[0]; buf = buf.subarray(1); }
        }
        if (flag !== 0 && flag !== 1) throw new Error('Not a Secrets file');
        async function* rest() { if (buf.length) yield buf; yield* plain; }
        const inner = flag === 1 ? decompressStream(rest(), 'deflate') : rest();

        // Parse the NUL-terminated name, then stream the content.
        let name = undefined;
        let nameDone = false;
        const nameParts = [];
        let total = 0;
        for await (const chunk of inner) {
            let c = chunk;
            if (!nameDone) {
                let z = -1;
                for (let i = 0; i < c.length; i++) if (c[i] === 0) { z = i; break; }
                if (z < 0) { nameParts.push(c); continue; }
                nameParts.push(c.subarray(0, z));
                const nb = concatBytes(nameParts);
                if (nb.length === 0) {
                    name = null;  // no stored name
                    // TODO: user-specified handling for name-less resources.
                } else {
                    name = new TextDecoder().decode(nb).replace(/[\\/]/g, '_');
                }
                nameDone = true;
                c = c.subarray(z + 1);
                if (hooks.onMeta) await hooks.onMeta({ name, totalSize: ts() });
            }
            if (c.length) {
                hasher.update(c);
                total += c.length;
                if (hooks.onProgress) hooks.onProgress(total, ts());
                await hooks.onChunk(c);
            }
        }
        if (!nameDone) throw new Error('Not a Secrets file');
        if (hex(hasher.digest()) !== hex(digest)) throw new Error('SHA-256 mismatch');
        return { name, size: total };
    }

    // Sinks: downloadSink streams into a ReadableStream handed to the
    // service worker, so the browser's download manager paces consumption
    // (desiredSize drops while the manager is busy; write() awaits until it
    // drains — decrypt/fetch pause in step with the actual download speed,
    // and a user cancellation in the manager surfaces as a write error);
    // blobSink keeps parts for a final Blob download (fallback, no SW).
    function makeDownloadSink(name, totalSize) {
        let controller = null;
        let cancelled = false;
        const stream = new ReadableStream({
            start(c) { controller = c; },
            cancel() { cancelled = true; },
        });
        const tick = () => new Promise(r => setTimeout(r, 5));
        return {
            stream, name, length: totalSize,
            get cancelled() { return cancelled; },
            async write(chunk) {
                while (!cancelled && controller.desiredSize !== null && controller.desiredSize <= 0) await tick();
                if (cancelled) throw new Error('Download cancelled');
                controller.enqueue(chunk);
            },
            async close() { if (!cancelled) controller.close(); },
            async abort() {
                cancelled = true;
                try { controller.error(new Error('aborted')); } catch (e) { /* already closed */ }
            },
        };
    }
    function fileSink(writable) {
        return {
            write: chunk => writable.write(chunk),
            close: () => writable.close(),
            abort: () => writable.abort(),
        };
    }
    function blobSink() {
        const parts = [];
        return {
            write: async chunk => { parts.push(chunk); },
            close: async () => {},
            abort: async () => { parts.length = 0; },
            result: () => new Blob(parts, { type: 'application/octet-stream' }),
        };
    }

    // Buffering variant used by tests: returns the whole plaintext at once.
    async function decryptFile(cipherChunks, key, totalSize, onProgress) {
        let parts = [];
        const r = await decryptV2(cipherChunks, key, totalSize, {
            onProgress,
            onChunk: async c => { parts.push(c); },
        });
        return { plain: concatBytes(parts), name: r.name };
    }

    // Fetch an encrypted resource and decrypt it while it downloads.
    // v2 segment header (all plaintext, big-endian; segment indices are
    // 0-based everywhere, files are <tag><index-4-hex>.enc):
    //   seg_count (2B)                      always
    //   index (1B; 2B when seg_count > 255) only when seg_count > 1
    //   total_size (8B)                     only in segment 0
    //   cipher_size (4B)                    every segment
    // followed by that segment's slice of the cipher stream. Segments are
    // strictly --size bytes of cipher each (last one holds the remainder) —
    // deliberately NOT aligned to the 32-byte keystream block, since the
    // cipher slices are concatenated before decryption.
    const MAX_SEGMENTS = 65535;
    async function* bodyChunks(resp) {
        const reader = resp.body.getReader();
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                yield value;  // released as soon as the consumer moves on
            }
        } finally {
            reader.cancel().catch(() => {});  // drop the connection on early exit
        }
    }
    function openResource(base) {
        const meta = { segCount: 0, totalSize: -1 };
        async function* oneSegment(resp, expected, isFirst) {
            const reader = resp.body.getReader();
            let buf = new Uint8Array(0);
            const need = async n => {
                while (buf.length < n) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    buf = concatBytes([buf, value]);
                }
                if (buf.length < n) throw new Error('Not a Secrets file');
            };
            await need(2);
            const segCount = (buf[0] << 8) | buf[1];
            if (segCount < 1 || segCount > MAX_SEGMENTS) throw new Error('Not a Secrets file');
            meta.segCount = segCount;
            let headerLen = 2;
            if (segCount > 1) {
                const w = segCount > 255 ? 2 : 1;
                await need(2 + w);
                let index = 0;
                for (let i = 0; i < w; i++) index = (index << 8) | buf[2 + i];
                if (index !== expected) throw new Error('Not a Secrets file');
                headerLen = 2 + w;
            }
            if (isFirst) {
                await need(headerLen + 8);
                meta.totalSize = Number(new DataView(buf.buffer, buf.byteOffset + headerLen).getBigUint64(0));
                headerLen += 8;
            }
            await need(headerLen + 4);
            const cipherSize = ((buf[headerLen] << 24) | (buf[headerLen + 1] << 16)
                | (buf[headerLen + 2] << 8) | buf[headerLen + 3]) >>> 0;
            headerLen += 4;
            if (cipherSize < 1) throw new Error('Not a Secrets file');
            buf = buf.subarray(headerLen);
            try {
                if (buf.length) yield buf;
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    yield value;
                }
            } finally {
                reader.cancel().catch(() => {});  // drop the connection on early exit
            }
        }
        async function* cipher() {
            for (let k = 0; ; k++) {
                const resp = await fetch(`${base}${k.toString(16).padStart(4, '0')}.enc`);
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                yield* oneSegment(resp, k, k === 0);
                if (k + 1 >= meta.segCount) break;
            }
        }
        return { cipher: cipher(), meta };
    }

    // Stream-decrypt a resource into a sink created once the name is known
    // (onMeta fires before the first content chunk). hooks.gate() is awaited
    // before every chunk (pause support) and hooks.token.cancelled aborts
    // with 'Download cancelled'. Returns { name, size, blob } — blob is set
    // when the sink was a blobSink.
    async function downloadDecrypted(base, key, hooks) {
        const res = openResource(base);
        let sink = null;
        const cancelled = () => hooks && hooks.token && hooks.token.cancelled;
        try {
            const r = await decryptV2(res.cipher, key, res.meta, {
                onMeta: async meta => {
                    if (cancelled()) throw new Error('Download cancelled');
                    if (hooks && hooks.onMeta) await hooks.onMeta(meta);
                    if (hooks && hooks.createSink) sink = await hooks.createSink(meta.name);
                },
                onProgress: (d, m) => hooks && hooks.onProgress && hooks.onProgress(d, m),
                onChunk: async c => {
                    if (hooks && hooks.gate) await hooks.gate();
                    if (cancelled()) throw new Error('Download cancelled');
                    if (sink) await sink.write(c);
                },
            });
            if (sink) await sink.close();
            const blob = sink && typeof sink.result === 'function' ? sink.result() : undefined;
            return { name: r.name, size: r.size, blob };
        } catch (err) {
            if (sink) { try { await sink.abort(); } catch (e) { /* best effort */ } }
            throw err;
        }
    }

    // Compatibility helper: fetch and decrypt into an in-memory Blob.
    async function fetchDecrypted(base, key, onProgress) {
        return downloadDecrypted(base, key, {
            onProgress,
            createSink: async () => blobSink(),
        });
    }

    return {
        decryptFile, decryptV2, downloadDecrypted, fetchDecrypted,
        openResource, makeDownloadSink, blobSink, fileSink, makeSha256,
        resourceBase, resourceLocation, defaultLocation, safeTag,
    };
})();

// Wire the key form on the Secrets page (browsers only).
if (typeof document !== 'undefined') {
    const wire = () => {
        const form = document.getElementById('vault');
        if (!form || form.dataset.wired) return;
        form.dataset.wired = '1';
        const status = document.getElementById('status');
        const bar = document.getElementById('bar');
        const setBar = (done, max) => {
            if (!bar) return;
            bar.hidden = false;
            if (max > 0) { bar.max = max; bar.value = done; }
            else { bar.removeAttribute('value'); bar.removeAttribute('max'); }  // indeterminate
        };
        const hideBar = () => { if (bar) bar.hidden = true; };
        const stateEls = status ? [...status.querySelectorAll('[data-state]')] : [];
        // Toggle between the pre-written status lines in index.html instead
        // of setting text from JS, so every message stays translatable.
        const say = (state, tone) => {
            if (!status) return;
            for (const el of stateEls) el.hidden = el.dataset.state !== state;
            status.classList.toggle('ok', tone === true);
            status.classList.toggle('err', tone === false);
        };
        const fillNum = (state, value) => {
            const slot = status && status.querySelector(`[data-state="${state}"] .num`);
            if (slot) slot.textContent = value;
        };

        // Resource location box: filled with the resolved location
        // (?location= override or <origin>/assets); the placeholder keeps
        // showing the static default. Edits win per fetch.
        const locInput = document.getElementById('location');
        if (locInput) {
            locInput.placeholder = window.SecretsVault.defaultLocation();
            locInput.value = window.SecretsVault.resourceLocation();
        }

        // Single key box: the real value stays in the input (so editing, the
        // caret and the selection all stay native), while .key-mask paints the
        // same text with the characters in between replaced by dots.
        const HEAD = 4;        // characters 1-4 stay readable
        const TAIL_FROM = 38;  // 0-based index of character 39; it and everything after stay readable
        const KEY_LEN = 40;    // a 32-byte SHA-256 digest is always 40 Base91 characters
        const keyInput = document.getElementById('key');
        const maskLayer = document.querySelector('.key-mask');
        const submitBtn = form.querySelector('[type="submit"]');

        // Placeholder: 4 random + 34 dots + 2 random Base91 alphabet chars,
        // mimicking the masked-key look without resembling a real one.
        if (keyInput) {
            const A = window.Base91.ALPHABET;
            const pick = () => A[Math.floor(Math.random() * A.length)];
            keyInput.placeholder = pick() + pick() + pick() + pick()
                + '\u2022'.repeat(34) + pick() + pick();
        }

        // Reveal characters 1-4 and 39-end; mask everything between them.
        const maskKey = s => {
            const maskEnd = Math.min(s.length, TAIL_FROM);
            if (maskEnd <= HEAD) return s;
            return s.slice(0, HEAD) + '•'.repeat(maskEnd - HEAD) + s.slice(maskEnd);
        };

        const cleanKey = s => s.replace(/\s+/g, '');

        // Valid = exactly 40 characters, all printable ASCII (0x21-0x7E).
        // The decoder maps 0/I/l to O/1/1, so the whole printable range is
        // acceptable input for the Base91 alphabet.
        const isValidKey = s => {
            const k = cleanKey(s);
            if (k.length !== KEY_LEN) return false;
            for (const ch of k) {
                const c = ch.charCodeAt(0);
                if (c < 0x21 || c > 0x7e) return false;
            }
            return true;
        };

        const renderMask = () => {
            if (!keyInput || !maskLayer) return;
            maskLayer.textContent = maskKey(keyInput.value);
            maskLayer.scrollLeft = keyInput.scrollLeft;
        };

        const refreshSubmit = () => {
            if (submitBtn) submitBtn.disabled = !isValidKey(keyInput ? keyInput.value : '');
        };

        if (keyInput) {
            if (maskLayer) {
                keyInput.parentElement.classList.add('masking');
                keyInput.addEventListener('scroll', renderMask);
            }
            keyInput.addEventListener('input', () => {
                renderMask();
                refreshSubmit();
            });
            renderMask();
            refreshSubmit();
        }

        // Open the page with the key box focused (and selected when filled).
        if (keyInput) {
            keyInput.focus();
            if (keyInput.value) keyInput.select();
        }

        // --- run controls: lock inputs, pause / cancel --------------------
        const pauseBtn = document.getElementById('pauseBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        let running = null;  // { token, pause(), resume(), cancel(), paused }
        const setRunning = run => {
            if (keyInput) keyInput.readOnly = !!run;
            if (locInput) locInput.readOnly = !!run;
            if (submitBtn) submitBtn.disabled = !!run || !isValidKey(keyInput ? keyInput.value : '');
            if (pauseBtn) pauseBtn.hidden = !run;
            if (cancelBtn) cancelBtn.hidden = !run;
            running = run;
            if (run && pauseBtn) pauseBtn.textContent = 'Pause';
        };
        if (pauseBtn) pauseBtn.addEventListener('click', () => {
            if (!running) return;
            if (running.paused) running.resume();
            else running.pause();
            pauseBtn.textContent = running.paused ? 'Resume' : 'Pause';
        });
        if (cancelBtn) cancelBtn.addEventListener('click', () => { if (running) running.cancel(); });

        // Service-worker download: the decrypted stream is served by sw.js,
        // so the download manager shows a completely normal download with
        // native progress/speed — while bytes decrypt on the fly. Only used
        // after a live probe PROVES this worker intercepts the page's
        // requests (activation alone is not enough — the page must be
        // controlled, and claim() can land after the user's first click);
        // otherwise falls back to a blob download.
        let swReady = null;
        const ensureSW = () => {
            if (!swReady) {
                swReady = (async () => {
                    if (!('serviceWorker' in navigator)) return null;
                    try {
                        const reg = await navigator.serviceWorker.register('sw.js');
                        if (!navigator.serviceWorker.controller) {
                            await new Promise((res, rej) => {
                                const t = setTimeout(() => rej(new Error('timeout')), 10000);
                                navigator.serviceWorker.addEventListener('controllerchange',
                                    () => { clearTimeout(t); res(); }, { once: true });
                            });
                        }
                        // Probe: only a controlled page's fetch reaches the
                        // worker, so the custom header proves interception.
                        const ping = await fetch(new URL('__dl/ping', document.baseURI).pathname,
                            { cache: 'no-store' });
                        if (!ping.ok || ping.headers.get('X-Secrets-DL') !== '1') return null;
                        return true;
                    } catch (err) { return null; }
                })();
            }
            return swReady;
        };

        form.addEventListener('submit', async e => {
            e.preventDefault();
            if (running) return;  // a decryption is already in flight
            const key = cleanKey(keyInput ? keyInput.value : '');
            if (!isValidKey(key)) { say('invalid', false); return; }
            const loc = ((locInput && locInput.value.trim()) || window.SecretsVault.defaultLocation())
                .replace(/\/+$/, '');
            const base = loc + '/' + window.SecretsVault.resourceBase(key);

            const token = { cancelled: false };
            let paused = false;
            const waiters = [];
            const gate = () => (paused && !token.cancelled)
                ? new Promise(r => { waiters.push(r); })
                : null;
            setRunning({
                token,
                paused,
                pause() { paused = true; this.paused = true; },
                resume() { paused = false; this.paused = false; waiters.forEach(r => r()); waiters.length = 0; },
                cancel() { token.cancelled = true; waiters.forEach(r => r()); waiters.length = 0; },
            });
            try {
                say('fetching');
                const sw = await ensureSW();
                let dlSink = null;
                const r = await window.SecretsVault.downloadDecrypted(base, key, {
                    token, gate,
                    onProgress: (done, max) => {
                        say('progress');
                        fillNum('progress', max > 0 ? Math.floor(done / max * 100) + '%' : String(done));
                        setBar(done, max);
                    },
                    onMeta: async meta => {
                        const fname = meta.name || 'decoded.bin';
                        if (sw && meta.totalSize >= 0) {
                            try {
                                dlSink = window.SecretsVault.makeDownloadSink(fname, meta.totalSize);
                                const id = [...crypto.getRandomValues(new Uint8Array(8))]
                                    .map(b => b.toString(16).padStart(2, '0')).join('');
                                const url = new URL('__dl/' + id, document.baseURI).pathname;
                                navigator.serviceWorker.controller.postMessage(
                                    { type: 'offer', url, stream: dlSink.stream, filename: fname, length: meta.totalSize },
                                    [dlSink.stream]);
                                const a = document.createElement('a');  // normal download
                                a.href = url;
                                a.download = fname;
                                a.click();
                            } catch (err) { dlSink = null; }  // fall back to blob
                        }
                    },
                    createSink: async () => dlSink || window.SecretsVault.blobSink(),
                });
                hideBar();
                if (r.blob) {  // blob fallback: hand it to the download manager
                    say('downloading', true);
                    const url = URL.createObjectURL(r.blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = r.name || 'decoded.bin';
                    a.click();
                    setTimeout(() => URL.revokeObjectURL(url), 10000);
                }
                say('done', true);
            } catch (err) {
                hideBar();
                if (/Download cancelled/.test(err.message)) { say(''); return; }
                console.error(err);
                const code = /HTTP (\d+)/.exec(err.message);
                if (/SHA-256 mismatch/.test(err.message)) say('mismatch', false);
                else if (code && code[1] === '404') say('notfound', false);
                else if (code) { fillNum('http', code[1]); say('http', false); }
                else say('error', false);
            } finally {
                setRunning(null);
            }
        });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
    else wire();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ()=>document.body.classList.add('with-script'));
else document.body.classList.add('with-script');
