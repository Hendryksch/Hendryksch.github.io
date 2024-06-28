const CACHE_NAME = 'my-cache-v1.0.5b'; // Aktualisiere die Versionsnummer bei Änderungen
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon_512x512.png'
];

// Installations-Ereignis
self.addEventListener('install', function(event) {
  console.log('Service Worker: Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker: Caching Files');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Aktivierungs-Ereignis
self.addEventListener('activate', function(event) {
  console.log('Service Worker: Activate');
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch-Ereignis
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        fetchAndUpdateCache(event.request); // Aktualisiere den Cache im Hintergrund
        return response; // Verwende die gecachte Version
      }
      return fetchAndUpdateCache(event.request); // Fallback auf das Netzwerk und aktualisiere den Cache
    })
  );
});

// Funktion zum Abrufen und Aktualisieren des Caches
function fetchAndUpdateCache(request) {
  return fetch(request).then(function(response) {
    if (!response || response.status !== 200 || response.type !== 'basic') {
      return response;
    }
    var responseToCache = response.clone();
    caches.open(CACHE_NAME).then(function(cache) {
      cache.put(request, responseToCache);
    });
    return response;
  }).catch(function() {
    return caches.match(request); // Falls das Netzwerk fehlschlägt, verwende den Cache
  });
}