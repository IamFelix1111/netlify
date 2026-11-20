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
        // Ack on the transfer port: the page waits for this before it starts
        // the download, so the request can never race ahead of the offer.
        if (event.ports && event.ports[0]) event.ports[0].postMessage({ type: 'ready' });
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
    const offer0 = offers.get(path);
    if (offer0) {
        event.respondWith(serveOffer(offer0, path));
        return;
    }
    // The request can still beat the 'offer' message across processes (or a
    // worker restart lost it): wait briefly instead of failing the download
    // outright with 410 ("Failed - No file").
    event.respondWith((async () => {
        for (let i = 0; i < 100; i++) {
            await new Promise(r => setTimeout(r, 50));
            const offer = offers.get(path);
            if (offer) return serveOffer(offer, path);
        }
        return new Response('expired', { status: 410 });
    })());
});

function serveOffer(offer, path) {
    offers.delete(path);
    const ascii = offer.filename.replace(/[^\x20-\x7e]/g, '_').replace(/"/g, "'");
    return new Response(offer.stream, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': String(offer.length),
            'Content-Disposition':
                `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(offer.filename)}`,
        },
    });
}
