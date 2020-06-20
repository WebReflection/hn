// standard modules
import {createServer} from 'http';
import {join} from 'path';
import {env} from 'process';

// dependencies
import firebase from 'firebase';
import ucdn from 'ucdn';
import umeta from 'umeta';
import * as ucontent from 'ucontent';

// node specific
import partial from './args.js';

// isomorphic
import hn from '../client/@/js/hn.js';
import view from '../client/@/js/view.js';

// constants
const ITEMS_PP = 20;
const HTML = {'content-type': 'text/html;charset-utf-8'};

// utils
const {dirName} = umeta(import.meta);
const cdn = ucdn({source: join(dirName, '..', 'client')});

// app
const {stories, story, item, user, parse} = hn(firebase);
const {render, html} = ucontent;

const {
  header, main, footer,
  about, details, profile,
  notFound
} = view(ucontent);

const SSR = html`<script>self.SSR=!0;</script>`;

const addComments = async (model) => {
  const {kids} = model;
  model.comments = kids ? await Promise.all(kids.map(comments)) : [];
  return model;
};

const comments = id => item(id).then(getModel);

const getModel = async (model) => (
  {model: model ? await addComments(model) : null}
);

const renderPage = (res, template, nav, main) => {
  const params = partial(template);
  res.writeHead(200, HTML);
  render(
    res,
    html(...params({
      SSR, main,
      header: header(nav),
      footer: footer()
    }))
  ).end();
};

// serving
createServer(async (req, res) => {
  const {url} = req;
  const {id, page, type, pathname: current, user: name} = parse(url);

  switch (type) {
    // show a specific item details with comments
    case 'item': {
      const model = await item(id);
      if (model)
        renderPage(
          res,
          `${current}/index.html`,
          {page, header: {current, stories}},
          details(await addComments(model))
        );
      else
        renderPage(
          res,
          `about/index.html`,
          {page, header: {current: '', stories}},
          notFound()
        );
      break;
    }

    // show all items associated to this story
    case 'story': {
      const ids = await story(current);
      const total = Math.ceil(ids.length / ITEMS_PP);
      const start = ITEMS_PP * (page - 1);
      const end = ITEMS_PP * page;
      renderPage(
        res,
        `${current}/index.html`,
        {page, header: {current, stories}},
        main(
          current,
          await Promise.all(ids.slice(start, end).map(
            (id, index) => item(id).then(
              model => (
                model ?
                  {model, index: start + index + 1} :
                  {model: {}, index: -1}
              )
            )
          )),
          page,
          total
        )
      );
      break;
    }

    // show user details
    case 'user': {
      const model = await user(name);
      if (model)
        renderPage(
          res,
          `${current}/index.html`,
          {page, header: {current, stories}},
          profile(model)
        );
      else
        renderPage(
          res,
          `about/index.html`,
          {page, header: {current: '', stories}},
          notFound()
        );
      break;
    }

    default: {
      // root of the site
      if (/^\/(?:\?.*)?$/.test(url)) {
        const params = partial('index.html');
        res.writeHead(200, HTML);
        render(res, html(...params())).end();
      }
      // about page
      else if (/\/about\/$/.test(url))
        renderPage(
          res,
          `about/index.html`,
          {page, header: {current: 'about', stories}},
          await about()
        );
      // any other asset with a 404 fallback
      else
        cdn(req, res, () => {
          renderPage(
            res,
            `about/index.html`,
            {page, header: {current: '', stories}},
            notFound()
          );
        });
      break;
    }
  }
})
.listen(
  env.PORT || 0,
  function ({port} = this.address()) {
    console.log(`\x1b[2mvisit\x1b[0m http://localhost:${port}/`);
  }
);
