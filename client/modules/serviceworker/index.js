const VERSION = 1;
const CACHENAME = `wot-clan-manager:${VERSION}`;

const INITAL_CACHED_FILES = ["/index.html"];
const ALLOWED_URLS = ["https?::/localhost/.*"];
const DENIED_URLS = [/[^\/]*\/api\.*/ig];

const matchByFilter = (url, filters) => {
    for(let filter of filters)
        if( (typeof filter ==="string" && filter == url ) || (filter instanceof RegExp && filter.test(url)))
            return true; 
    return false;
}

const isRequestCacheable = (request) => {
    const url = request.url;
    if(matchByFilter(url, DENIED_URLS))
        return false;
    else if(matchByFilter(url, ALLOWED_URLS))
        return true;
    else
        return false;
};

self.oninstall = function (event) {
	event.waitUntil(
		(async () => {
			await self.skipWaiting();
			const cache = await caches.open(CACHENAME);
			cache.addAll(INITAL_CACHED_FILES);
		})(),
	);
};

self.onactivate = function (event) {
	event.waitUntil(
		(async () => {
			await self.clients.claim();

			const cachenames = await caches.keys();
			await Promise.all( cachenames.map((cacheName) => {
					if (cacheName != CACHENAME)
						return caches.delete(cacheName);
				})
			);
		})()
	);
};

self.onfetch = function (event) {
	const request = event.request;
	event.respondWith((async () => {
       let response = await caches.match(request);
       if(response)
        return response;

        response = await fetch(request);
        if(response.ok && response.status < 300 && isRequestCacheable(request)){
            const cache = await caches.open(CACHENAME);
            try{
                cache.put(request, response.clone());
            } catch(e){
                console.warn(e)
            }
        }

        return response;
    
    })());
};

// Communicate via MessageChannel.
self.addEventListener("message", function (event) {
	console.log(`Received message from main thread: ${event.data}`);
	event.ports[0].postMessage(`Got message! Sending direct message back - "${event.data}"`);
});

// Broadcast via postMessage.
function sendMessage(message) {
	self.clients.matchAll().then(function (clients) {
		clients.map(function (client) {
			return client.postMessage(message);
		});
	});
}
