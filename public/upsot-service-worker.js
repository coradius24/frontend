// public/service-worker.js

self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

// self.addEventListener('push', function (event) {
//   console.log("Service worker got push")
//   const options = {
//     body: event.data.text(),
//     icon: '/icon-192x192.png',
//   };

//   event.waitUntil(
//     self.registration.showNotification('WebSocket Notification', options)
//   );
// });
