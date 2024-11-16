importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js");

if (workbox) {
  workbox.core.setCacheNameDetails({
    prefix: "Remote Control",
    suffix: "1.0.0",
    precache: "precache",
    runtime: "run-time",
  });

  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  workbox.routing.registerRoute(
    new RegExp("/pages/.*/index\\.html"),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "html-cache",
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 7 * 24 * 60 * 60,
          maxEntries: 20
        })
      ]
    })
  );
  workbox.routing.registerRoute(
    new RegExp("/pages/.*/script\\.js"),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "js-cache",
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 15 * 24 * 60 * 60,
          maxEntries: 20
        })
      ]
    })
  );

  workbox.routing.registerRoute(
    new RegExp("/assets/.*"),
    new workbox.strategies.CacheFirst({
      cacheName: "assets-cache",
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 30 * 24 * 60 * 60,
          maxEntries: 50
        })
      ]
    })
  );
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("PWA-1.0.0").then((cache) =>
      cache.addAll([
        "/",
        "/pages/home/index.html",
        "/pages/home/script.js",
        "/pages/team/index.html",
        "/pages/team/script.js",
        "/pages/openSource/index.html",
        "/pages/openSource/script.js",
        "/docs",
        "/expressDocsAssets/script.js",
        "/expressDocsAssets/customHTMLHead.html",
        "/expressDocsAssets/customCode.js",
        "/expressDocsAssets/logo.svg",
        "/assets/favicon.ico",
        "/assets/logo.svg",
        "/assets/defaultProfilePictureMan.webp",
        "/assets/defaultProfilePictureWoman.webp",
        "/assets/placeholder.svg"
      ])
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request).then((response) => {
        let responseClone = response.clone();
        caches.open("PWA-1.0.0").then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(() => caches.match("/assets/placeholder.svg"));
    })
  );
});
