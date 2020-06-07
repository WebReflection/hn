const offline = () => new Response('null', teapot);
const teapot = {
  headers: {'Content-Type': 'application/json'},
  status: 418
};

const openCache = caches.open('iHN-teapot');

addEventListener('fetch', e => {
  const {request} = e;
  e.respondWith(
    openCache.then(
      cache => Promise.all([
        cache.match(request),
        fetch(request).catch(offline)
      ]).then(([prev, curr]) => {
        const {status} = curr;
        if (199 < status && status < 400) {
          cache.put(request, curr.clone());
          return curr;
        }
        return prev || curr;
      })
    )
  );
});

addEventListener('install', e => {
  e.waitUntil(
    openCache.then(cache => cache.addAll([
      './@/3rd/uhtml.js',
      './@/css/app.css',
      './@/js/about.js',
      './@/js/app.js',
      './@/js/hn.js',
      './@/js/view.js',
      './about/',
      './top/?1'
    ]))
  );
});
