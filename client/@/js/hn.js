// 5 minutes cache per item
const MAX_AGE = 1000 * 60 * 5;

const remove = (map, key) => {
  map.delete(key);
};

export default firebase => {
  firebase.initializeApp({
    databaseURL: 'https://hacker-news.firebaseio.com'
  });

  const db = firebase.database().ref('v0');

  const stories = [
    'top',
    'new',
    'show',
    'ask',
    'job'
  ];

  const map = new Map;
  const set = (key, value) => {
    const details = {
      t: setTimeout(remove, MAX_AGE, map, key),
      $: value
    };
    map.set(key, details);
    return details;
  };

  const load = key => (map.get(key) || set(key, new Promise($ => {
    db.child(key).once('value', snap => $(snap.val()));
  }))).$;

  return {
    stories,
    item: id => load(`/item/${id}`),
    user: id => load(`/user/${id}`),
    story: type => load(`${type}stories`),
    parse: url => {
      const result = {
        type: 'unknown',
        id: -1,
        page: 1,
        user: '',
        pathname: ''
      };
      if (/\/([a-z]+)\/(\?[^&]+)$/.test(url)) {
        const {$1: pathname, $2: search} = RegExp;
        const sliced = search.slice(1);
        if (pathname === 'user') {
          result.pathname = pathname;
          result.type = 'user';
          result.user = sliced;
        }
        else if (pathname === 'item') {
          const id = parseInt(sliced, 10);
          if (id && 0 < id) {
            result.pathname = pathname;
            result.type = 'item';
            result.id = id;
          }
        }
        else if (stories.includes(pathname)) {
          result.pathname = pathname;
          result.type = 'story';
          result.page = Math.max(parseInt(sliced, 10) || 1, 1);
        }
      }
      return result;
    }
  };
};
