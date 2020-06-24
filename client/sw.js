// expiration time in seconds: one week
const EXPIRATION = 7 * 24 * 3600;
const EXPIRATION_KEY = 'sw-cache-expires';

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
          const headers = {
            [EXPIRATION_KEY]: new Date(
              Date.now() + EXPIRATION * 1000
            ).toUTCString()
          };
          curr.headers.forEach((v, k) => { headers[k] = v; });
          const clone = curr.clone();
          e.waitUntil(curr.blob().then(body => {
            cache.put(request, new Response(body, {
              status: curr.status,
              statusText: curr.statusText,
              headers
            }));
          }));
          return clone;
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

addEventListener('message', ({data}) => {
  const {action} = data;
  switch (action) {
    case 'purge':
      const now = Date.now();
      openCache.then(cache => {
        cache.keys().then(keys => {
          keys.forEach(key => {
            cache.match(key).then(({headers}) => {
              if (headers.has(EXPIRATION_KEY)) {
                const date = Date.parse(headers.get(EXPIRATION_KEY));
                if (date < now)
                  cache.delete(key);
              }
            });
          });
        });
      });
      break;
  }
});
