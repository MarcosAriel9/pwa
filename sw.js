const STATIC = 'staticv1';
const STATIC_LIMIT = 15;
const INMUTABLE = "inmutablev1";
const DYNAMIC = 'dynamicv1';
console.log("SERVICE WORKER");
const DYNAMIC_LIMIT = 30;
//Todos aquellos recursos propios d ela aplicacion
const APP_SELL = [
    '/',
    '/index.html',
    'css/styles.css',
    'img/delta.jpg',
    'js/app.js',
    '/pages/offline.html'
];

//todos aquellos recursos que nunca cambian
const APP_SELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js'
];
self.addEventListener("install", function (e) {
    const staticCache = caches.open(STATIC).then(cache => {
        cache.addAll(APP_SELL);
    });
    const inmutableCache = caches.open(INMUTABLE).then((cache) => {
        cache.addAll(APP_SELL_INMUTABLE);
    });
    e.waitUntil(Promise.all([staticCache, inmutableCache]));
});

self.addEventListener("activate", function (e) {
    console.log("Activate event");
    // window.open("/pages/offfline.html","self");
});

//self.addEventListener("fetch", function (e) {

    //5.- Cache and network race
    // const source = new Promise((resolve, reject) => {
    //     let rejected = false;
    //     const failsOnce = () => {
    //         if (rejected) {
    //             if (/\.(png|jpg)/i.test(e.request.url)) {
    //                 resolve(caches.match('/img/not-found.png'));
    //             } else {
    //                 throw Error('SourceNotFound');
    //             }
    //             if (e.request.url.includes("page2.html")) {
    //                 resolve(cache.match("/pages/offfline.html"))
    //             }

    //         } else {
    //             rejected = true;
    //         }
    //     };
    //     fetch(e.request).then(res => {
    //         res.ok ? resolve(res) : failsOnce();
    //     }).catch(failsOnce);
    //     caches.match(e.request).then((cacheRes) => {
    //         cacheRes.ok ? resolve(cacheRes) : failsOnce();
    //     });
    // });
    // e.respondWith(source);

    //4. Cache with network update
    //rendimiento critico, si el rendimiento es bajo usar esta estartegia
    //la desventaja es que toda la aplicacion esta un paso atras
    /*if (e.request.url.includes('bootstrap'))
        return e.respondWith(caches.match(e.request));
    const source = caches.open(STATIC).then(cache => {
        fetch(e.request).then(res => {
            cache.put(e.request, res);
        })
        return cache.match(e.request);
    });
    e.respondWith(source);*/
    //3.- Network with cache fallback va a internet y despues a caché
    // const source = fetch(e.request).then(res => {
    //     if (!res) throw Error('NotFound');
    //     //checar si el recurso ya existe en algun cache.
    //     caches.open(DYNAMIC).then(cache => {
    //         cache.put(e.request, res);
    //     });
    //     return res.clone();
    // })
    //     .catch(() => {
    //         caches.match()
    //         return caches.match(e.request);
    //     });
    // e.respondWith(source);

    //2. Cache with network fallback guarda cache y despues va a internet
    /*const source = caches.match(e.request).then((res) => {
        if (res) return res;
        return fetch(e.request).then(resFetch => {
            caches.open(DYNAMIC).then(cache => {
                cache.put(e.request, resFetch);
            });
            return resFetch.clone();
        });
    });*/
    //1.- oNLY CACHE toda la aplicacion va ser servida desde el caché
    // e.respondWith(caches.match(e.request));
    
//});
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).catch(() => {
            return caches.match('/pages/offline.html');
        })
    );
  });
/* self.addEventListener("push", function (event) {
  console.log("Push event");
});

self.addEventListener("sync", function (event) {
  console.log("Sync event");
});
*/