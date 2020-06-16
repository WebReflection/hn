const offline = () => new Response('null', teapot);
const teapot = {
  headers: {'Content-Type': 'application/json'},
  status: 418
};

const openCache = caches.open('iHN-teapot');

const get = (cache, request) => fetch(request)
  .then(response => {
    const {status} = response;
    if (199 < status && status < 400)
      cache.put(request, response.clone());
    return response;
  })
  .catch(offline);

//* live first / cache as fallback
const live = request => openCache.then(cache => {
  const remote = get(cache, request);
  return Promise.all([
    cache.match(request).then(value => (value || remote)),
    remote
  ]).then(results => results.pop());
});
//*/

/* cache first / live update regardless
const local = request => openCache.then(cache => {
  const remote = get(cache, request);
  return Promise.race([
    cache.match(request).then(value => (value || remote)),
    remote
  ]);
});
//*/

addEventListener('fetch', e => {
  const {request} = e;
  e.respondWith(live(request));
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
