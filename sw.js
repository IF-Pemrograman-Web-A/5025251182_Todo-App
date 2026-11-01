const CACHE_NAME = "study-planner-v1";
const STATIC_CACHE = "study-planner-static-v1";

const APP_SHELL = [
    "./",
    "./index.php",
    "./offline.html",
    "./style.css",
    "./manifest.json",
    "./pwa.js",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(function(cache) {
                return cache.addAll(APP_SHELL);
            })
            .then(function() {
                return self.skipWaiting();
            })
    );
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (
                        cacheName.startsWith("study-planner-") &&
                        cacheName !== STATIC_CACHE &&
                        cacheName !== CACHE_NAME
                    ) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

self.addEventListener("fetch", function(event) {
    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then(function(response) {
                    if (response.ok) {
                        const responseCopy = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(request, responseCopy);
                            });
                    }

                    return response;
                })
                .catch(function() {
                    return caches.match(request, {
                        ignoreSearch: true
                    }).then(function(cachedResponse) {
                        return cachedResponse ||
                            caches.match("./offline.html");
                    });
                })
        );

        return;
    }

    event.respondWith(
        caches.match(request).then(function(cachedResponse) {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request);
        })
    );
});

self.addEventListener("message", function(event) {
    if (event.data && event.data.type === "show-notification") {
        self.registration.showNotification(
            event.data.title,
            {
                body: event.data.body
            }
        );
    }
});

self.addEventListener("notificationclick", function(event) {
    event.notification.close();

    event.waitUntil(
        clients.openWindow("./")
    );
});