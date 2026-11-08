const CACHE = 'minichat-v2';
const FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png',
  'https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Red primero (para recibir siempre la última versión); caché si no hay conexión
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copia = r.clone();
      if (r.ok && (e.request.url.startsWith(self.location.origin) || e.request.url.includes('peerjs.min.js')))
        caches.open(CACHE).then(c => c.put(e.request, copia));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
