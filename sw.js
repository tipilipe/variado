// Este arquivo é obrigatório para que o navegador permita a instalação do PWA.
// Ele permite que o app funcione de forma mais estável.

const CACHE_NAME = 'financas-pro-v4.157';
const assets = [
  '/',
  '/index.html',
  '/App.jsx'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
