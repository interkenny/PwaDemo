importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');
var cacheStorageKey = 'minimal-pwa-1';
var cacheList=[
  '/',
  '/index.html',
  '/main.css',
  '/demo.png'
];
const fillServiceWorkerCache = function () {
  /*It will not cache and also not reject for individual resources that failed to be added in the cache. unlike fillServiceWorkerCache which stops caching as soon as one problem occurs. see http://stackoverflow.com/questions/41388616/what-can-cause-a-promise-rejected-with-invalidstateerror-here*/
  return caches.open(cacheStorageKey).then(function (cache) {
      return Promise.all(
        cacheList.map(function (url) {
              return cache.add(url).catch(function (reason) {
                  return console.log([url + "failed: " + String(reason)]);
              });
          })
      );
  });
};
self.addEventListener('install',e =>{
  e.waitUntil(
    fillServiceWorkerCache()
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
});
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
});