const EXPIRATION=604800,EXPIRATION_KEY="sw-cache-expires",offline=()=>new Response("null",teapot),teapot={headers:{"Content-Type":"application/json"},status:418},openCache=caches.open("iHN-teapot");addEventListener("fetch",e=>{const{request:t}=e;e.respondWith(openCache.then(e=>Promise.all([e.match(t),fetch(t).catch(offline)]).then(([s,a])=>{const{status:n}=a;if(199<n&&n<400){const s={[EXPIRATION_KEY]:new Date(Date.now()+6048e5).toUTCString()};a.headers.forEach((e,t)=>{s[t]=e});const n=a.clone();return a.blob().then(o=>(e.put(t,new Response(o,{status:a.status,statusText:a.statusText,headers:s})),n))}return s||a})))}),addEventListener("install",e=>{e.waitUntil(openCache.then(e=>e.addAll(["./@/3rd/uhtml.js","./@/css/app.css","./@/js/about.js","./@/js/app.js","./@/js/hn.js","./@/js/view.js","./about/","./top/?1"])))}),addEventListener("message",({data:e})=>{const{action:t}=e;switch(t){case"purge":const e=Date.now();openCache.then(t=>{t.keys().then(s=>{s.forEach(s=>{t.match(s).then(({headers:a})=>{if(a.has(EXPIRATION_KEY)){Date.parse(a.get(EXPIRATION_KEY))<e&&t.delete(s)}})})})})}});