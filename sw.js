const CACHE_NAME = "v1_cache_gradient_generator";
const urlsToCache = [
    "./",
    "./?umt_source=web_app_manifest",
    "./pages/fallback.html",
    "../css/style.html",
    "./img/favicon.png",
    "./img/icon32.png",
    "./img/icon64.png",
    "./img/icon128.png",
    "./img/icon192.png",
    "./img/icon256.png",
    "./img/icon512.png",
    "./img/icon1024.png",
    "./js/main.js",
    "https://unpkg.com/vue@next",
    "./js/mountApp.js",
    "./css/style.css",
    "./manifest.json",
    "https://fonts.googleapis.com/css2?family=Roboto&display=swap"
];

// referencia al propio service worker ( self )
self.addEventListener("install", e => {
    // Al momento de instalar el sw, el navegador debe esperar para ejecutar el codigo dentro de este metodo
    e.waitUntil(
        // caches => es un objeto de javascript
        caches.open(CACHE_NAME).then(
            // Agrega todas las urls al cache
            cache => cache.addAll(urlsToCache).then(
                // Espera a que todo se este agregando al cache
                () => self.skipWaiting()
            ).catch(
                err => console.log(err)
            )
        )
    );
});

// Verifica que todo este activado y que no haya modificaciones en los archivos
self.addEventListener("activate", e => {
    // toma toda la informacion de nuestro cache
    const cacheWitelist = [CACHE_NAME];

    // Espera a que todo se ejecute
    e.waitUntil(
        // obtiene todo lo de nuestro cache, tipo un fecth o recorrer un arreglo
        caches.keys().then(
            // Se comparan los nombres por si cambió algo
            cacheNames => {
                return Promise.all(
                    // Trabaja uno por uno de los url ( map )
                    cacheNames.map(
                        // Ya es una sola url la que se ejecuta
                        cacheName => {
                            if (cacheWitelist.indexOf(cacheName) === -1) {
                                // Borra la url del cache si no existe
                                return caches.delete(cacheName);
                            }
                        }
                    )
                );
            }

        ).then(
            // En caso de que no sea actualizado el cache, lo carga
            () => self.clients.claim()
        )
    );
});

// Encargado de descargar el cache
self.addEventListener("fetch", e => {
    // Responde cuando nuestro objeto de cache haga match con nuestra petición
    e.respondWith(
        caches.match(e.request).then(
            // Respuesta
            res => {
                // Si ya existe un cache lo retorna
                if (res) {
                    return res;
                }

                // Si no hay un cache lo genera
                return fetch(e.request);
            }
        )
        /*.catch(
                    () => caches.match('./pages/fallback.html')
                )*/
    );
});