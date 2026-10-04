/* Territory Tracker service worker: lets the app start with no connection.
   IMPORTANT: change VERSION (and TT_APP_VERSION in index.html) whenever index.html or any file
   below changes, so devices download the new version and show "New version, tap to reload". */
const VERSION = '2026.10.04-2';
const SHELL = 'tt-shell-' + VERSION;
const FILES = [
  './', './index.html', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png',
  './vendor/leaflet/leaflet.js', './vendor/leaflet/leaflet.css',
  './vendor/leaflet/images/marker-icon.png', './vendor/leaflet/images/marker-icon-2x.png', './vendor/leaflet/images/marker-shadow.png',
  './vendor/leaflet/images/layers.png', './vendor/leaflet/images/layers-2x.png',
  './vendor/firebase/firebase-app-compat.js', './vendor/firebase/firebase-auth-compat.js', './vendor/firebase/firebase-firestore-compat.js'
];
self.addEventListener('install', e => {
  // Download a fresh copy of every file (skip the browser's HTTP cache). The new version
  // waits until the page says "reload", so nobody loses work in the middle of a territory.
  e.waitUntil(caches.open(SHELL).then(c => Promise.all(FILES.map(f =>
    fetch(new Request(f, {cache: 'reload'})).then(r => { if (!r.ok) throw Error(f + ' ' + r.status); return c.put(f, r); })
  ))));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k.startsWith('tt-shell-') && k !== SHELL).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
  if (e.data === 'version' && e.source) e.source.postMessage({ttVersion: VERSION});
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Only this app's own files. Maps, buildings, addresses and Firebase go straight to the network
  // (the page keeps its own offline copies of map tiles and buildings).
  if (url.origin !== self.location.origin) return;
  if (url.searchParams.has('ttprobe')) return;   // connection check: always the network
  if (req.mode === 'navigate') {
    // The app page: the stored copy, so it opens instantly with no signal.
    e.respondWith(caches.open(SHELL).then(c => c.match('./index.html')).then(r => r || fetch(req)));
    return;
  }
  e.respondWith(caches.open(SHELL).then(c => c.match(req, {ignoreSearch: true})).then(r => r || fetch(req)));
});
