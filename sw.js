importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');
var cacheStorageKey = 'minimal-pwa-1'
var cacheList=[
  '/',
  'index.html',
  'main.css',
  'demo.png'
]
self.addEventListener('install',e =>{
  e.waitUntil(
    caches.open(cacheStorageKey)
    .then(cache => cache.addAll(cacheList))
    .then(() => self.skipWaiting())
  )
})
self.addEventListener('fetch',function(e){
  e.respondWith(
    caches.match(e.request).then(function(response){
      if(response != null){
        return response
      }
      return fetch(e.request.url)
    })
  )
})
self.addEventListener('activate',function(e){
  e.waitUntil(
    // Get cache list names
    caches.keys().then(cacheNames => {
      return Promise.all(
        // update catch
        cacheNames.filter(cacheNames => {
          return cacheNames !== cacheStorageKey
        }).map(cacheNames => {
          return caches.delete(cacheNames)
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})