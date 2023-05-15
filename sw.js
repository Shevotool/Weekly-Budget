self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("my-cache").then(function (cache) {
      return cache.addAll([
        "/",
        "/index.html",
        "/budget.html",
        "/js/app.js",
        "/js/script.js",
        "/css/custom.css",
        "/css/main_queries.css",
        "/css/modal-queries.css",
        "/css/styles.css",
      ]);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
