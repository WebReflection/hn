const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const ago = (created) => {
  const d = new Date();
  const today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const elapsedDays = (today - new Date(created * 1e3)) / (86400 * 1e3);
  if (elapsedDays < 0) return 'today';
  if (elapsedDays < 1) return 'yesterday';
  return Math.ceil(elapsedDays) + ' days ago';
};

const count = (comments = []) => comments.reduce(
  (total, value) => total + count((value.model || {}).comments),
  comments.length
);

const plural = (num, unit) => {
  num = num >>> 0;
  if (num !== 1) unit += 's';
  return `${num} ${unit}`;
};

const selected = (current, story) => current === story  ? 'selected' : '';

const scrollTop = () => {
  scrollTo({top: 0, left: 0, behavior: 'smooth'});
};

let cleanup = 0;
const content = new Map;
const cache = chunk => {
  if (!cleanup)
    cleanup = setTimeout(() => { cleanup = 0; content.clear(); }, 10000);
  const template = [chunk];
  content.set(chunk, template);
  return template;
};

const timeBetween = (
  a = Date.now(),
  b = (Date.now() / 1e3)
) => {
  const elapsed = b - a;
  if (elapsed < HOUR)
    return plural(elapsed / MINUTE, 'minute');
  else if (elapsed < DAY)
    return plural(elapsed / HOUR, 'hour');
  return plural(elapsed / DAY, 'day');
};

// const {head, main, footer} = view(uhtml || ucontent);
export default ({html}) => {

  // internal helpers
  const comment = ({model = {comments: []}}) => html`
    <li
      class=${model.id ? '' : 'placeholder'}
      .hidden=${!!model.deleted}
    >
      <small>
        <a
          onclick=${scrollTop}
          href=${`../user/?${model.by}`}
        >${model.by || '...'}</a>
        ${timeBetween(model.time)} ago
        <a href="#collapse" data-count=${count(model.comments)} />
      </small>
      <div>
        ${html(content.get(model.text || '...') || cache(model.text || '...'))}
      </div>
      <ul class="comments" .hidden=${!model.comments.length}>
        ${model.comments.map(comment)}
      </ul>
    </li>
  `;

  const goBack = () => html`
    <div class="paginator">
      <a href="#back">&lt;</a>
      <span>go back / share</span>
      <a href="#share">📤</a>
    </div>
  `;

  const paginator = (current, page, total) => html`
    <div class="paginator">
      <a
        onclick=${scrollTop}
        href=${`../${current}/?${page - 1}`}
        class=${page === 1 ? 'hidden' : ''}
      >
        &lt;
      </a>
      <span>${page}/${total}</span>
      <a
        onclick=${scrollTop}
        href=${`../${current}/?${page + 1}`}
        class=${page === total ? 'hidden' : ''}
      >
        &gt;
      </a>
    </div>
  `;

  return {
    // the about section contains only static content
    // it is OK in such case to import it on demand, instead of having it
    // bundled within the rest of the logic
    about: () => import('./about.js').then(({default: about}) => about(html)),

    // all other sections are neither too big nor static,
    // so these are grouped in here for simplicity
    header: ({header: {current, stories}}) => html`
      <header>
        <nav>
          <div class='icon'>📰</div>
          <ul>
            ${stories.map(story => html`
              <li>
                <a
                  onclick=${scrollTop}
                  class=${selected(current, story)} href=${`../${story}/?1`}
                >
                  ${story === 'job' ? 'jobs' : story}
                </a>
              </li>`
            )}
            <li class='about'>
              <a
                onclick=${scrollTop}
                class=${selected(current, 'about')} href="../about/"
              >
                about
              </a>
            </li>
          </ul>
        </nav>
      </header>
    `,

    footer: () => html`
      <footer>
        Powered by
        <a href="https://github.com/WebReflection/uhtml#readme">µhtml</a>
        &amp;
        <a href="https://github.com/HackerNews/API">Hacker News API</a>
      </footer>
    `,

    // show all details per story
    main: (current, stories, page, total) => html`
      <main class="stories">
        ${paginator(current, page, total)}
        ${stories.map(({index, model = {}}) => html`
          <article class=${model.id ? '' : 'placeholder'}>
            <div>${index}</div>
            <div>
              <h2>
                <a
                  onclick=${model.url ? Object : scrollTop}
                  href='${model.url || `../item/?${model.id}`}'
                  target=${model.url ? '_blank' : '_self'}
                  rel="noopener"
                >${model.title || '...'}
                  <small>
                    ${(model.hostname || '').replace(/^www\./, '')}
                  </small>
                </a>
              </h2>
              <p>
                ${model.score} points by
                <a
                  onclick=${scrollTop}
                  href='${`../user/?${model.by}`}'
                >${model.by}</a>
                ${timeBetween(model.time)} ago |
                <a
                  class="nowrap"
                  onclick=${scrollTop} href=${`../item/?${model.id}`}
                >${model.descendants || 0} comments</a>
              </p>
            </div>
          </article>
        `)}
        ${paginator(current, page, total)}
      </main>
    `,

    // show all details per item
    details: model => html`
      <main class="details">
        ${goBack()}
        <article>
          <h2>
            <a href=${model.url} target=${model.url ? '_blank' : '_self'} rel="noopener">
              ${model.title}
              <small>${(model.hostname || '').replace(/^www\./, '')}</small>
            </a>
          </h2>
          <p class="meta">
            ${model.score} points by
            <a
              onclick=${scrollTop}
              href=${`../user/?${model.by}`}
            >${model.by}</a>
            ${timeBetween(model.time)} ago
          </p>
        </article>
        <h3>
          ${model.descendants || 0} comments
        </h3>
        <ul .hidden=${!model.comments.length}>
          ${model.comments.map(comment)}
        </ul>
        ${goBack()}
      </main>
    `,

    // show all details per user
    profile: ({about, created, id, karma}) => html`
      <main class="profile">
      ${goBack()}
        <article>
          <h1>${id}</h1>
          <p>
            ... joined <strong>${ago(created || 0)}</strong>,
            and has <strong>${karma}</strong> karma
          </p>
          <p>
            <a href=${`https://news.ycombinator.com/submitted?id=${id}`}
               rel="noopener" target="_blank">submissions</a> /
            <a href=${`https://news.ycombinator.com/threads?id=${id}`}
               rel="noopener" target="_blank">comments</a> /
            <a href=${`https://news.ycombinator.com/favorites?id=${id}`}
               rel="noopener" target="_blank">favourites</a>
          </p>
          <div class='about' .hidden=${!about}>
            ${html([about])}
          </div>
        </article>
        ${goBack()}
      </main>
    `,

    // final fallback to show when something goes wrong
    // such as non-existent user/item
    notFound: () => html`
      <main class="not-found">
        ${goBack()}
        <article>
          <h1>Not Found</h1>
          <p>The page you are looking for is not here.</p>
        </article>
      </main>
    `
  };
};
