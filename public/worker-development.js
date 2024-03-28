/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
// public/service-worker.js
self.addEventListener('push', function (event) {
  const options = {
    body: event.data.text(),
    icon: 'icon.png'
  };
  event.waitUntil(self.registration.showNotification('WebSocket Notification', options));
});
/******/ })()
;