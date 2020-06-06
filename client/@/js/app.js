const ITEMS_PP = 20;

const rIC = self.requestIdleCallback || setTimeout;

const inject = (src, name) => new Promise($ => {
  const script = document.createElement('script');
  script.onload = () => $(self[name]);
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
});

Promise.all([
  // 3rd parts + local dependencies
  inject('../@/3rd/uhtml.js', 'uhtml'),
  inject('../@/3rd/firebase.js', 'firebase'),
  import('./hn.js'),
  import('./view.js')
])
.then(([uhtml, firebase, {default: hn}, {default: view}]) => {

  const {stories, story, item, user, parse} = hn(firebase);
  const {render, html} = uhtml;
  const {body} = document;

  const {
    header, main, footer,
    about, details, profile,
    notFound
  } = view(uhtml);

  const stopLoading = () => {
    body.classList.remove('loading');
  };

  const updatePage = (header, main) => {
    render(body, html`${header}${main}${footer()}`);
  };

  const reveal = url => {
    body.classList.add('loading');
    const {id, page, type, pathname: current, user: name} = parse(url);
    const nav = header({page, header: {current, stories}});
    let waitingForUpdates = true;
    switch (type) {
      case 'item':
        item(id).then(model => {
          if (model) {
            rIC(stopLoading);
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
              updatePage(nav, details(model));
              waitingForUpdates = true;
            };
            model.comments = (model.kids || []).map(comments);
            update();
          }
          else
            updatePage(nav, notFound());
        });
        break;

      case 'story':
        story(current).then(ids => {
          rIC(stopLoading);
          const total = Math.ceil(ids.length / ITEMS_PP);
          const start = ITEMS_PP * (page - 1);
          const end = ITEMS_PP * page;
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
            updatePage(nav, main(items, page, total));
            waitingForUpdates = true;
          };
          update();
        });
        break;

      case 'user':
        user(name).then(value => {
          if (value) {
            rIC(stopLoading);
            updatePage(nav, profile(value));
          }
          else {
            rIC(stopLoading);
            updatePage(nav, notFound());
          }
        });
        break;

      default:
        if (/\/about\/$/.test(url)) {
          const top = header({page, header: {current: 'about', stories}});
          updatePage(nav, html`<main />`);
          about().then(content => {
            rIC(stopLoading);
            updatePage(top, content);
          });
        }
        else {
          rIC(stopLoading);
          updatePage(nav, notFound());
        }
        break;
    }
  };

  // in case it was not rendered via SSR, reveal the page
  if (!self.SSR)
    reveal(location.href);

  // handle all local routes
  body.addEventListener('click', event => {
    const {target} = event;
    const link = target.closest('a');
    if (link) {
      const {href} = link;
      const {hostname} = new URL(href);
      // consider only local links
      if (hostname === location.hostname) {
        history.pushState(null, document.title, href);
        event.preventDefault();
        reveal(href);
      }
    }
  });

  // reveal previous routes
  self.addEventListener('popstate', () => {
    reveal(location.href);
  });

  // make it a PWA 🎉
  if ('serviceWorker' in navigator)
    navigator.serviceWorker.register('../sw.js', {scope: '../'});
});
