const ITEMS_PP = 20;
const MAX_STATE = 50;

// the most minimal implementation of firebase.js
// needed to fetch hacker-news.firebaseio.com
const fakebase = {
  initializeApp({databaseURL}) {
    this.databaseURL = databaseURL;
  },
  database() {
    const {databaseURL} = this;
    const asJSON = b => b.json();
    const options = {credentials: 'same-origin'};
    return {
      ref: v => ({
        child: path => ({
          once(_, value) {
            fetch(`${databaseURL}/${v}/${path}.json`, options)
              .then(asJSON)
              .then($ => value({val: () => $}))
          }
        })
      })
    };
  }
};

// given a function that returns an "effect"
// that should run before being invoked again,
// it grants such effect is indeed invoked,
// then it executes it with new arguments
// and it stores the returned effect (repeat)
const fx = (f, x = () => {}) => ({
  next($) { x(); x = f($); }
});

// promisify a <script> injection, assuming
// the script will have a global export
// that is passed along as promise resolution
const inject = (src, name) => new Promise($ => {
  const script = document.createElement('script');
  script.onload = () => $(self[name]);
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
});

// avoid history API shenanigans on standalone mode,
// return true if the Web App is running as PWA (installed)
const isPWA = () => (
  matchMedia('(display-mode: standalone)').matches ||
  navigator.standalone ||
  document.referrer.includes('android-app://')
);

// used to avoid keeping the CPU busy all time
const rIC = self.requestIdleCallback || setTimeout;

// 3rd parts + local dependencies
Promise.all([
  inject('../@/3rd/uhtml.js', 'uhtml'),
  import('./hn.js'),
  import('./view.js')
])
.then(([uhtml, {default: hn}, {default: view}]) => {

  const IS_BROWSER = !isPWA();

  const {stories, story, item, user, parse, cache} = hn(fakebase);
  const {render, html} = uhtml;
  const {body} = document;

  const {
    header, main, footer,
    about, details, profile,
    notFound
  } = view(uhtml);

  // main Web App handler: route in, output out
  // it returns an "effect" to stop rendering if
  // the user navigated somewhere else while it
  // incrementally keeps loading content previously requested
  const reveal = url => {
    body.classList.add('loading');

    const {id, page, type, pathname: current, user: name} = parse(url);
    const nav = header({page, header: {current, stories}});

    let revealing = true;
    let waitingForUpdates = true;

    // ugly Firefox workaround when it gets stuck with the network
    const clear = () => clearTimeout(timeout);
    const timeout = setTimeout(
      () => {
        if (revealing)
          location.reload(true);
      },
      5000
    );

    switch (type) {
      // show a specific item details with comments
      case 'item':
        item(id).then(model => {
          clear();
          if (model) {
            rIC(stopLoading);
            document.title = `iHN: ${model.title}`;
            const comments = id => {
              const story = item(id);
              story.then(model => {
                if (model) {
                  story.model = model;
                  model.comments = (model.kids || []).map(comments);
                  if (waitingForUpdates) {
                    waitingForUpdates = !waitingForUpdates;
                    rIC(update);
                  }
                }
              });
              return story;
            };
            const update = () => {
              if (revealing) {
                updatePage(nav, details(model));
                waitingForUpdates = true;
              }
            };
            model.comments = (model.kids || []).map(comments);
            update();
          }
          else
            updatePage(nav, notFound());
        });
        break;

      // show all items associated to this story
      case 'story':
        story(current).then(ids => {
          clear();
          rIC(stopLoading);
          const total = Math.ceil(ids.length / ITEMS_PP);
          const start = ITEMS_PP * (page - 1);
          const end = ITEMS_PP * page;
          document.title = `iHN: ${current} (${page}/${total})`;
          const items = ids.slice(start, end).map((id, index) => {
            const story = item(id);
            story.then(model => {
              if (model) {
                story.index = start + index + 1;
                story.model = model;
                if (waitingForUpdates) {
                  waitingForUpdates = !waitingForUpdates;
                  rIC(update);
                }
              }
            });
            return story;
          });
          const update = () => {
            if (revealing) {
              updatePage(nav, main(current, items, page, total));
              waitingForUpdates = true;
            }
          };
          update();
        });
        break;

      // show user details
      case 'user':
        user(name).then(value => {
          clear();
          if (revealing) {
            if (value) {
              rIC(stopLoading);
              document.title = `iHN: user ${value.id}`;
              updatePage(nav, profile(value));
            }
            else {
              rIC(stopLoading);
              updatePage(nav, notFound());
            }
          }
        });
        break;

      default:
        // about page
        if (/\/about\/$/.test(url)) {
          const top = header({page, header: {current: 'about', stories}});
          about().then(content => {
            clear();
            if (revealing) {
              rIC(stopLoading);
              document.title = 'iHN: about';
              updatePage(top, content);
            }
          });
        }
        // the 404 fallback
        else {
          clear();
          rIC(stopLoading);
          updatePage(nav, notFound());
        }
        break;
    }
    return () => {
      revealing = false;
    };
  };

  const stopLoading = () => {
    body.classList.remove('loading');
  };

  const updatePage = (header, main) => {
    render(body, html`${header}${main}${footer()}`);
  };

  // guards against delayed answers
  let show = fx(reveal);

  // used to provide a back action in standalone mode
  const state = [location.href];

  // in case it was not rendered via SSR, reveal the page
  if (!self.SSR)
    show.next(location.href);

  // handle all local routes
  body.addEventListener('click', event => {
    const {target} = event;
    const link = target.closest('a');
    if (link) {
      event.preventDefault();
      // consider only local links without
      // resolving through link.href ;-)
      const href = link.getAttribute('href');
      switch (true) {
        case href === '#back':
          if (IS_BROWSER)
            history.back();
          else if (1 < state.length) {
            state.pop();
            show.next(state[state.length - 1]);
          }
          break;
        case href === '#collapse':
          link.closest('li').classList.toggle('collapsed');
          break;
        case href === '#share':
          const url = IS_BROWSER ? location.href : state[state.length - 1];
          const {title} = document;
          if (navigator.share)
            navigator.share({
              text: url,
              title,
              url
            });
          else {
            const {previousElementSibling} = link;
            const fail = () => {
              previousElementSibling.textContent = '⚠ error';
            };
            navigator.permissions.query({
              name: 'clipboard-write'
            }).then(({state}) => {
              if (/^(?:granted|prompt)$/.test(state))
                navigator.clipboard.writeText(url).then(
                  () => {
                    previousElementSibling.textContent = '✔ copied';
                  },
                  fail
                );
              else
                fail();
            });
          }
          break;
        case /^(?:\.|\/)/.test(href):
          show.next(href);
          if (IS_BROWSER)
            history.pushState(null, document.title, href);
          else if (MAX_STATE < state.push(href))
            state.shift();
          break;
        default:
          open(href);
          break;
      }
    }
  });

  // reveal previous routes if in browser
  if (IS_BROWSER)
    addEventListener('popstate', () => {
      show.next(location.href);
    });

  // retry to load items when the browser goes online
  addEventListener('online', () => cache.clear());

  // make it a PWA 🎉
  if ('serviceWorker' in navigator) {
    const {serviceWorker} = navigator;
    const waitController = new Promise($ => {
      if (serviceWorker.controller)
        $(serviceWorker.controller);
      else
        serviceWorker.register('./sw.js', {scope: './'})
          .then(() => serviceWorker.ready)
          .then(() => serviceWorker.getRegistration())
          .then(({active}) => $(active));
    });
    waitController.then(controller => {
      controller.postMessage({action: 'purge'});
    });
  }
});
