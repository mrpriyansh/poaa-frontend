/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable func-names */
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// Register precache routes (static cache)
precacheAndRoute(self.__WB_MANIFEST || []);

// Clean up old cache
cleanupOutdatedCaches();

// Google fonts dynamic cache
registerRoute(
  /^https:\/\/fonts\.googleapis\.com\/.*/i,
  new StaleWhileRevalidate({ cacheName: 'google-fonts-cache' }),
  'GET'
);

// Google fonts dynamic cache
registerRoute(
  /^https:\/\/fonts\.gstatic\.com\/.*/i,
  new StaleWhileRevalidate({ cacheName: 'gstatic-fonts-cache' }),
  'GET'
);

// Dynamic cache for images from `/storage/`
// registerRoute(
//   /.*storage.*/,
//   new CacheFirst({
//     cacheName: 'dynamic-images-cache',
//     plugins: [
//       new ExpirationPlugin({ maxEntries: 500, maxAgeSeconds: 5184e3 }),
//       new CacheableResponsePlugin({ statuses: [0, 200] }),
//     ],
//   }),
//   'GET'
// );

registerRoute(/.*assets.*/, new StaleWhileRevalidate({ cacheName: 'assets' }), 'GET');

registerRoute(/.*locales.*/, new StaleWhileRevalidate({ cacheName: 'assets' }), 'GET');

// Install and activate service worker
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

// Receive push notifications
self.addEventListener('push', function(e) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    // notifications aren't supported or permission not granted!
    // eslint-disable-next-line no-console
    console.info('nononono');
    return;
  }

  if (e.data) {
    const message = e.data.json();
    e.waitUntil(
      self.registration.showNotification(message.title, {
        body: message.body,
        icon: message.icon,
        actions: message.actions,
      })
    );
  }
});

// Click and open notification
self.addEventListener(
  'notificationclick',
  function(event) {
    if (event.action === 'ADD_INSTALLMENT') clients.openWindow('/create-list');
    else clients.openWindow('/');
    event.notification.close();
  },
  false
);
