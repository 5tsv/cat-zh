const CACHE_NAME="likexiaCat";const locationUrl=location.origin+location.pathname.replace("serviceWorker.js","");const cdn="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-y/";const strap="https://petercheney.github.io/strap/";const cdnCache=[cdn+"lz-string/1.4.1/lz-string.js",cdn+"jquery/3.6.0/jquery.min.js",cdn+"react/0.14.10/react.min.js",cdn+"dojo/1.6.0/dojo.xd.js",cdn+"systemjs/0.21.6/system.js",strap+"strapdown.js",strap+"strapdown.css",strap+"themes/litera.min.css",strap+"themes/bootstrap-responsive.min.css"];const version=5;const CACHE_LIST=["lf3-cdn-tos.bytecdntp.com",location.host,"petercheney.github.io"];self.addEventListener("install",e=>{e.waitUntil(caches.open("cdn").then(e=>{return e.addAll(cdnCache)}).then(()=>{return self.skipWaiting()}))});self.addEventListener("activate",e=>{e.waitUntil(caches.open(CACHE_NAME).then(function(e){return e.delete(new Request(locationUrl+"index.html"),{ignoreSearch:true}).then(()=>{return e.delete(new Request(locationUrl),{ignoreSearch:true})})}).then(()=>{caches.open("cdn").then(e=>{return e.addAll(cdnCache)}).then(()=>{return self.clients.claim()})}))});self.addEventListener("fetch",function(e){let r=e.request;let t=r.url;let s=new URL(t);let n=t.includes("server.json");let c=t.includes("build.version.json");let i=CACHE_LIST.indexOf(s.host);if(i>-1){e.respondWith(caches.match(r,{ignoreSearch:c||n}).then(function(n,e){let t=true;if(n){if(!navigator.onLine){return n}if(s.search){if(c){t=false}}if(t){return n}}return fetch(r,{cache:"no-cache"}).then(function(e){if(c&&e.status===404){return n}if(!e||e.status!==200||e.type!=="basic"){return e}let t=e.clone();caches.open(CACHE_NAME).then(function(e){return e.delete(r,{ignoreSearch:true}).then(()=>{return e.put(r,t)})});return e}).catch(()=>{if(n){return n}})}))}});self.addEventListener("error",e=>{console.log(e)});