export class Router {
  constructor() {
    this._routes = new Map();
    this._current = '/';
  }

  register(path, handler) {
    this._routes.set(path, handler);
    return this;
  }

  // Binds the hashchange listener and immediately dispatches the current URL.
  start() {
    window.addEventListener('hashchange', () => this._dispatch());
    this._dispatch();
  }

  // Sets window.location.hash, which triggers hashchange → _dispatch.
  navigate(path) {
    window.location.hash = path;
  }

  current() {
    return this._current;
  }

  // Extracts the path portion from the current hash.
  // '' | '#' | '#/' all resolve to '/'.
  _parsePath() {
    const hash = window.location.hash;
    if (!hash || hash === '#' || hash === '#/') return '/';
    const fragment = hash.slice(1); // strip leading '#'
    return fragment.split('?')[0] || '/';
  }

  // Parses any query-string from the hash into a plain object.
  _parseParams() {
    const hash = window.location.hash;
    const qIndex = hash.indexOf('?');
    if (qIndex === -1) return {};
    const params = {};
    new URLSearchParams(hash.slice(qIndex + 1)).forEach((v, k) => {
      params[k] = v;
    });
    return params;
  }

  _dispatch() {
    const path = this._parsePath();
    const params = this._parseParams();

    if (this._routes.has(path)) {
      this._current = path;
      this._routes.get(path)(params);
    } else {
      // Unknown route — fall back to home.
      this.navigate('/');
    }
  }
}

export const router = new Router();
