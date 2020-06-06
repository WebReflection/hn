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

const plural = (num, unit) => {
  num = num >>> 0;
  if (num !== 1) unit += 's';
  return `${num} ${unit}`;
};

const selected = (current, story) => current === story  ? 'selected' : '';

const scrollTop = () => {
  scrollTo({top: 0, left: 0, behavior: 'smooth'});
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
    <li class=${model.id ? '' : 'placeholder'}>
      <small>
        <a
          onclick=${scrollTop}
          href=${`../user/?${model.by}`}
        >
          ${model.by || '...'}
        </a>
        ${timeBetween(model.time)} ago
      </small>
      <div>
        ${html([model.text || '...'])}
      </div>
      <ul class="comments" .hidden=${!model.comments.length}>
        ${model.comments.map(comment)}
      </ul>
    </li>
  `;

  const paginator = (page, total) => html`
    <div class="paginator">
      <a
        onclick=${scrollTop}
        href=${`./?${page - 1}`} class=${page === 1 ? 'hidden' : ''}
      >
        &lt;
      </a>
      <span>${page}/${total}</span>
      <a
        onclick=${scrollTop}
        href=${`./?${page + 1}`} class=${page === total ? 'hidden' : ''}
      >
        &gt;
      </a>
    </div>
  `;

  // exposed renders
  return {
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

    main: (stories, page, total) => html`
      <main class="stories">
        ${paginator(page, total)}
        ${stories.map(({index, model = {}}) => html`
          <article  class=${model.id ? '' : 'placeholder'}>
            <div>${index}</div>
            <div>
              <h2>
                <a
                  onclick=${scrollTop}
                  href='${model.url || `../item/?${model.id}`}'
                >
                  ${model.title || '...'}
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
                >
                  ${model.by}
                </a>
                ${timeBetween(model.time)} ago |
                <a onclick=${scrollTop} href=${`../item/?${model.id}`}>
                  ${model.descendants || 0} comments
                </a>
              </p>
            </div>
          </article>
        `)}
        ${paginator(page, total)}
      </main>
    `,

    footer: () => html`
      <footer>
        Powered by
        <a href="https://github.com/WebReflection/uhtml#readme">µhtml</a>
        &amp;
        <a href="https://github.com/HackerNews/API">Hacker News API</a>
      </footer>
    `,

    // the about section contains only static content
    // it is OK in such case to import it on demand, instead of having it
    // bundled within the rest of the logic
    about: () => import('./about.js').then(({default: about}) => about(html)),

    details: model => html`
      <main class="details">
        <article>
          <h2>
            <a href="${model.url}">
              ${model.title}
              <small>${(model.hostname || '').replace(/^www\./, '')}</small>
            </a>
          </h2>
          <p class="meta">
            ${model.score} points by
            <a onclick=${scrollTop} href=${`../user/?${model.by}`}>
              ${model.by}
            </a>
            ${timeBetween(model.time)} ago
          </p>
        </article>
        <h3>
          ${model.descendants || 0} comments
        </h3>
        <ul .hidden=${!model.comments.length}>
          ${model.comments.map(comment)}
        </ul>
      </main>
    `,

    profile: ({about, created, id, karma}) => html`
      <main class="profile">
        <article>
          <h1>${id}</h1>
          <p>
            ... joined <strong>${ago(created || 0)}</strong>,
            and has <strong>${karma}</strong> karma
          </p>
          <p>
            <a href=${`https://news.ycombinator.com/submitted?id=${id}`}>submissions</a> /
            <a href=${`https://news.ycombinator.com/threads?id=${id}`}>comments</a> /
            <a href=${`https://news.ycombinator.com/favorites?id=${id}`}>favourites</a>
          </p>
          <div class='about' .hidden=${!about}>
            ${html([about])}
          </div>
        </article>
      </main>
    `,

    notFound: () => html`
      <main class="not-found">
        <article>
          <h1>Not Found</h1>
          <p>The page you are looking for is not here.</p>
        </article>
      </main>
    `
  };
};
