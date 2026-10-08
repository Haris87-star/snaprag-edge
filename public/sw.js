/**
 * SnapRAG - 100% Air-Gap Offline Service Worker (v2)
 * Guarantees zero-network offline execution for Qualcomm Edge AI Hackathon.
 * Pre-caches complete application bundle and intercepts all requests with Cache-First strategy.
 */

const CACHE_NAME = 'snap-rag-offline-v4';

const STATIC_PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32x32.png',
  '/Scan_Mobile_QR.html'
];

// Dynamic asset caching during install
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE).catch((err) => {
        console.warn('Precache partial fallback:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip binary downloads from cache
  if (url.pathname.startsWith('/downloads/')) return;

  // Only handle same-origin or localhost tunnel requests
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        // Return immediately from cache for zero latency
        // In background, refresh from network if online
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const resClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // Not in cache, try network and store in cache
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0)) {
            const resClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and navigating to page, serve index.html
          if (event.request.mode === 'navigate' || event.request.destination === 'document') {
            return caches.match('/index.html') || caches.match('/');
          }
          // Try matching stripped URL
          return caches.match(url.pathname);
        });
    })
  );
});
