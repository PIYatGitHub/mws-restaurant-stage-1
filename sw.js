var staticCacheName = 'restaurant-reviews-static-v6';

self.addEventListener('install', function (event) {
    var urlsToCache = [
        '/',
        '/restaurant.html',
        'js/main.js',
        'js/dbhelper.js',
        'js/restaurant_info.js',
        'css/styles.css',
        'http://localhost:8000/restaurants'
    ];


    event.waitUntil(
      caches.open(staticCacheName).then(function (cache) {
          cache.addAll(urlsToCache);
      })
    )
});

self.addEventListener('activate', function (event) {
   event.waitUntil (
       caches.keys().then(function (cacheNames) {

        return Promise.all(
            cacheNames.filter(function (cacheName) {
                return cacheName.startsWith('restaurant-') &&
                    cacheName != staticCacheName;
            }).map(function (cacheName) {
                return caches.delete(cacheName)
            })
        );

       })
   )
});

self.addEventListener('fetch', function(event) {
    // console.log(event.request);
    event.respondWith(
        // fetch(event.request).then(function(response) {
        //     if(response.status == 404) {
        //        return fetch('/img/1.jpg')
        //     }
        //     return response;
        // }).catch(function(){
        //     return new Response("Totally failed");
        // })
        caches.match(event.request).then(function (response) {
            if (response) return response;
            return fetch(event.request);
        })
     );
});