const CACHE_NAME = 'likexiaCat';
const locationUrl = location.origin + location.pathname.replace('serviceWorker.js', '');

const cdnCache = [
	"https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-y/lz-string/1.4.1/lz-string.js",
	"https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-y/jquery/3.6.0/jquery.min.js",
	"https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-y/react/0.14.10/react.min.js",
	"https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-y/dojo/1.6.0/dojo.xd.js",
	"https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-y/systemjs/0.21.6/system.js",
];

const urlsToCache = [
	locationUrl,
	locationUrl + 'index.html',
];

// 白名单
const CACHE_LIST = [
	'lf3-cdn-tos.bytecdntp.com',
	location.host,
	//'petercheney.gitee.io',
];

const NO_CACHE_LIST = [
	'server.json',
	'build.version.json',
];

self.addEventListener('install', event => {
	//self.skipWaiting();
	// 缓存cdn
	event.waitUntil(
		caches.open('cdn').then(cache => {
			return cache.addAll(cdnCache);
		}).then(() => {
			// 缓存index的重定向
			return caches.open(CACHE_NAME).then(cache => {
				return cache.addAll(urlsToCache);
			}).then(() => {
				// 安装新的
				return self.skipWaiting();
			});
		})
	);
});

self.addEventListener("activate", event => {
	event.waitUntil(
		//caches.keys().then(keys => {
			// 删除旧缓存
			//Promise.all(
			//	keys.map(key => {
			//		//if (CACHE_NAME === key) {
			//		//	return caches.delete(key);
			//		//}
			//	})
			//);
		//}).
		caches.open(CACHE_NAME).then(function(cache) {
			return cache.delete(locationUrl, {
				ignoreSearch: true,
			});
		}).then(() => {
			/* 缓存index的重定向
			//return caches.open(CACHE_NAME).then(cache => {
			//	return cache.addAll(urlsToCache);
			}).then(() => { */
				// 装新的sw
				return self.clients.claim();
			//});
		})
	);
});

self.addEventListener('fetch', function(event) {
	let eventRequest = event.request;
	let requestURL = eventRequest.url;
	let objectURL = new URL(requestURL);
	// 过滤版本号文件
	let serverJson = requestURL.indexOf('server.json');
	let buildJson = requestURL.includes('build.version.json');
	// 过滤 已知其他跨域的
	let skipWorker = CACHE_LIST.indexOf(objectURL.host);
	if (skipWorker > -1) {
		// 无视url参数
		event.respondWith(
			caches.match(eventRequest, {
				ignoreSearch: buildJson,
			}).then(function(response, reject) {
				//没网直接返回
				if (!navigator.onLine) {
					return response;
				}
				let useCache = true;
				if (response) {
					if (objectURL.search) {
						/*serverJson !== -1 || */
						if (objectURL.search.indexOf('=0') !== -1 || buildJson) {
							useCache = false;
						}
					}
					if (useCache) {
						return response;
					}
				}
				return fetch(eventRequest, {
					cache: 'no-cache',
				}).then(function(responseFetch) {
					if (!responseFetch || responseFetch.status !== 200 || responseFetch.type !== 'basic') {
						return responseFetch;
					}
					// 网络获得成功，再缓存
					var responseFetchToCache = responseFetch.clone();
					caches.open(CACHE_NAME).then(function(cache) {
						return cache.delete(eventRequest, {
							ignoreSearch: true,
						}).then(() => {
							return cache.put(eventRequest, responseFetchToCache);
						});
					});
					return responseFetch;
				});
			})
		);
	}
});

self.addEventListener('error', event => {
	console.log(event);
});
