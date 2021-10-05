console.log(123)
const cache_name = "offline_cache";
const assets = [
    "/",
    "/css/style.css",
    "/js/app.js",
]
self.addEventListener("install", installEvent => {
    installEvent.waitUntil(caches.open(cache_name).then(cache => {
        cache.addAll(assets)
    }))
})
