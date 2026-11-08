// Service worker for the Secrets page: turns an in-memory decrypted stream
// into what the browser treats as a completely normal download — progress,
// speed and cancellation live in the native download manager while bytes are
// produced by the page's decryptor on the fly.
const offers = new Map();

self.addEventListener('message', event => {
    const msg = event.data;
    if (msg && msg.type === 'offer' && msg.url && msg.stream) {
        offers.set(msg.url, msg);
        // Cap pending offers; old unretrieved ones expire.
        if (offers.size > 4) offers.delete(offers.keys().next().value);
    }
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    const path = new URL(event.request.url).pathname;
    if (!path.includes('/__dl/')) return;
    if (path.endsWith('/__dl/ping')) {
        // Control probe from the page: only reachable when this worker
        // intercepts the request, which proves the page is controlled.
        event.respondWith(new Response('ok', { headers: { 'X-Secrets-DL': '1' } }));
        return;
    }
    const offer = offers.get(path);
    if (!offer) {
        event.respondWith(new Response('expired', { status: 410 }));
        return;
    }
    offers.delete(path);
    const ascii = offer.filename.replace(/[^\x20-\x7e]/g, '_').replace(/"/g, "'");
    event.respondWith(new Response(offer.stream, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': String(offer.length),
            'Content-Disposition':
                `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(offer.filename)}`,
        },
    }));
});
