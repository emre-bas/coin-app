const cache_name = "static_cache";
const assets = [
		"/",
		"/css/style.css",
		"/js/app.js",
];

self.addEventListener("install", event => {
	event.waitUntil(caches.open(cache_name).then(cache => cache.addAll(assets) ));
})

self.addEventListener('activate', event => {
	console.log("service worker activated", event);
})

// self.addEventListener('fetch', event => {
// 	event.respondWith(caches.match(event.request)
// 		.then(response=>{ console.log(response); if(response) return response; })
// 	)
// })