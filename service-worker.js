// ================================
// CONFIG
// ================================
const CACHE_NAME = "abenezer-portfolio-v1";

const STATIC_ASSETS = [
    "/",
    "/index.html",
    "/manifest.json",

    // CSS
    "/assets/css/bootstrap.css",
    "/assets/css/spacing.css",
    "/assets/css/main.css",

    // JS
    "/assets/js/vendor/jquery.js",
    "/assets/js/bootstrap-bundle.js",
    "/assets/js/main.js",

    // Icons
    "/assets/img/icon/pwa/icon-192.png",
    "/assets/img/icon/pwa/icon-512.png"
];

// ================================
// INSTALL: Cache core files
// ================================
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );

    self.skipWaiting();
});

// ================================
// ACTIVATE: Clean old caches
// ================================
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

// ================================
// FETCH: Network + Cache Strategy
// ================================
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Save new response in cache
                const clone = response.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, clone);
                });

                return response;
            })
            .catch(() => {
                // If offline → use cache
                return caches.match(event.request).then((file) => {
                    return file || caches.match("/index.html");
                });
            })
    );
});
