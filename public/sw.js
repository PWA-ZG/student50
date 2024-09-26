const staticCacheName = "static-cache-v1";

const filesToCache = [
  "/",
  "manifest.json",
  "index.html",
  "offline.html",
  "404.html",

  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
];

self.addEventListener("install", (event) => {
  console.log("Service worker installing…");
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service worker installing…");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          console.log("Found " + event.request.url + " in cache!");
          return response;
        }
        console.log(
          "----------------->> Network request for ",
          event.request.url
        );
        return fetch(event.request)
          .then((response) => {
            console.log("response.status = " + response.status);
            if (response.status === 404) {
              return caches.match("404.html");
            }
            return caches.open(staticCacheName).then((cache) => {
              console.log(">>> Caching: " + event.request.url);
              cache.put(event.request.url, response.clone());
              return response;
            });
          })
          .catch((error) => caches.match("404.html"));
      })
      .catch((error) => {
        console.log("Error", event.request.url, error);
        return caches.match("offline.html");
      })
  );
});
