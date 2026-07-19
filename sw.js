// WardTrack Service Worker — NETWORK-FIRST
// Always fetches the latest version when online; falls back to cache only when offline.
// This prevents the "stuck on old/broken cached version" problem.

const CACHE = 'wardtrack-v5';

// Install immediately, don't wait
self.addEventListener('install', function (e) {
  self.skipWaiting();
});

// On activate: delete ALL old caches, then take control of open pages
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          if (k !== CACHE) return caches.delete(k);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

// Fetch: network-first with cache fallback
self.addEventListener('fetch', function (e) {
  // Only handle GET requests
  if (e.request.method !== 'GET') return;

  // Never cache Firebase / API traffic — always go straight to network
  var url = e.request.url;
  if (url.indexOf('firebaseio.com') !== -1 ||
      url.indexOf('googleapis.com') !== -1 ||
      url.indexOf('firebase') !== -1 ||
      url.indexOf('gstatic.com') !== -1) {
    return; // let the browser handle it normally
  }

  e.respondWith(
    fetch(e.request)
      .then(function (response) {
        // Got a fresh copy from the network — cache it and return it
        if (response && response.ok) {
          var clone = response.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, clone); });
        }
        return response;
      })
      .catch(function () {
        // Offline — serve the cached copy if we have one
        return caches.match(e.request).then(function (cached) {
          if (cached) return cached;
          // For navigation requests, fall back to the cached app shell
          if (e.request.mode === 'navigate') {
            return caches.match('./index.html') || caches.match('./');
          }
        });
      })
  );
});
