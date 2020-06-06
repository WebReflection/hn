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
import asTemplate from './as-template.js';

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
const renderPage = (res, template, nav, main) => {
  res.writeHead(200, HTML);
  render(res, html(
    asTemplate(template),
    SSR,
    header(nav),
    main,
    footer()
  )).end();
};

// serving
createServer(async (req, res) => {
  const {url} = req;
  const {id, page, type, pathname: current, user: name} = parse(url);
  switch (type) {
    case 'item': {
      const model = await item(id);
      if (model) {
        const comments = id => item(id).then(async (model) => {
          if (model) {
            model.comments = await Promise.all(
              (model.kids || []).map(comments)
            );
          }
          return {model};
        });
        model.comments = await Promise.all((model.kids || []).map(comments));
        renderPage(
          res,
          `${current}/index.html`,
          {page, header: {current, stories}},
          details(model)
        );
      }
      else
        renderPage(
          res,
          `about/index.html`,
          {page, header: {current: '', stories}},
          notFound()
        );
      break;
    }

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

    default:
      // root of the site
      if (/^\/(?:\?.*)?$/.test(url)) {
        res.writeHead(200, HTML);
        render(res, html(asTemplate('index.html'))).end();
      }
      // about page
      else if (/\/about\/$/.test(url)) {
        renderPage(
          res,
          `about/index.html`,
          {page, header: {current: 'about', stories}},
          await about()
        );
      }
      // any other asset with fallback a 404 fallback
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
})
.listen(
  env.PORT || 0,
  function ({port} = this.address()) {
    console.log(`\x1b[2mvisit\x1b[0m http://localhost:${port}/`);
  }
);
