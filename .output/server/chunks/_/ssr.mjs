import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import React__default, { useRef, createElement as createElement$1, Fragment as Fragment$1 } from 'react';
import { flushSync } from 'react-dom';
import * as v from 'valibot';
import { sql, relations } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { createEnv } from '@t3-oss/env-core';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { AsyncLocalStorage } from 'node:async_hooks';
import { PassThrough, Readable } from 'node:stream';
import ReactDOMServer from 'react-dom/server';
import { ReadableStream as ReadableStream$1 } from 'node:stream/web';

var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var _focused, _cleanup, _setup, _a, _online, _cleanup2, _setup2, _b, _gcTimeout, _c, _initialState, _revertState, _cache, _client, _retryer, _defaultOptions, _abortSignalConsumed, _Query_instances, dispatch_fn, _d, _queries, _e, _observers, _mutationCache, _retryer2, _Mutation_instances, dispatch_fn2, _f, _mutations, _scopes, _mutationId, _g, _queryCache, _mutationCache2, _defaultOptions2, _queryDefaults, _mutationDefaults, _mountCount, _unsubscribeFocus, _unsubscribeOnline, _h;
var prefix = "Invariant failed";
function invariant(condition, message) {
  if (condition) {
    return;
  }
  {
    throw new Error(prefix);
  }
}
function warning(condition, message) {
}
const __storeToDerived = /* @__PURE__ */ new WeakMap();
const __derivedToStore = /* @__PURE__ */ new WeakMap();
const __depsThatHaveWrittenThisTick = {
  current: []
};
let __isFlushing = false;
let __batchDepth = 0;
const __pendingUpdates = /* @__PURE__ */ new Set();
const __initialBatchValues = /* @__PURE__ */ new Map();
function __flush_internals(relatedVals) {
  const sorted = Array.from(relatedVals).sort((a, b) => {
    if (a instanceof Derived && a.options.deps.includes(b)) return 1;
    if (b instanceof Derived && b.options.deps.includes(a)) return -1;
    return 0;
  });
  for (const derived of sorted) {
    if (__depsThatHaveWrittenThisTick.current.includes(derived)) {
      continue;
    }
    __depsThatHaveWrittenThisTick.current.push(derived);
    derived.recompute();
    const stores = __derivedToStore.get(derived);
    if (stores) {
      for (const store of stores) {
        const relatedLinkedDerivedVals = __storeToDerived.get(store);
        if (!relatedLinkedDerivedVals) continue;
        __flush_internals(relatedLinkedDerivedVals);
      }
    }
  }
}
function __notifyListeners(store) {
  store.listeners.forEach(
    (listener) => listener({
      prevVal: store.prevState,
      currentVal: store.state
    })
  );
}
function __notifyDerivedListeners(derived) {
  derived.listeners.forEach(
    (listener) => listener({
      prevVal: derived.prevState,
      currentVal: derived.state
    })
  );
}
function __flush(store) {
  if (__batchDepth > 0 && !__initialBatchValues.has(store)) {
    __initialBatchValues.set(store, store.prevState);
  }
  __pendingUpdates.add(store);
  if (__batchDepth > 0) return;
  if (__isFlushing) return;
  try {
    __isFlushing = true;
    while (__pendingUpdates.size > 0) {
      const stores = Array.from(__pendingUpdates);
      __pendingUpdates.clear();
      for (const store2 of stores) {
        const prevState = __initialBatchValues.get(store2) ?? store2.prevState;
        store2.prevState = prevState;
        __notifyListeners(store2);
      }
      for (const store2 of stores) {
        const derivedVals = __storeToDerived.get(store2);
        if (!derivedVals) continue;
        __depsThatHaveWrittenThisTick.current.push(store2);
        __flush_internals(derivedVals);
      }
      for (const store2 of stores) {
        const derivedVals = __storeToDerived.get(store2);
        if (!derivedVals) continue;
        for (const derived of derivedVals) {
          __notifyDerivedListeners(derived);
        }
      }
    }
  } finally {
    __isFlushing = false;
    __depsThatHaveWrittenThisTick.current = [];
    __initialBatchValues.clear();
  }
}
function batch$1(fn) {
  __batchDepth++;
  try {
    fn();
  } finally {
    __batchDepth--;
    if (__batchDepth === 0) {
      const pendingUpdateToFlush = Array.from(__pendingUpdates)[0];
      if (pendingUpdateToFlush) {
        __flush(pendingUpdateToFlush);
      }
    }
  }
}
class Store {
  constructor(initialState, options) {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = (listener) => {
      var _a2, _b2;
      this.listeners.add(listener);
      const unsub = (_b2 = (_a2 = this.options) == null ? void 0 : _a2.onSubscribe) == null ? void 0 : _b2.call(_a2, listener, this);
      return () => {
        this.listeners.delete(listener);
        unsub == null ? void 0 : unsub();
      };
    };
    this.setState = (updater) => {
      var _a2, _b2, _c2;
      this.prevState = this.state;
      this.state = ((_a2 = this.options) == null ? void 0 : _a2.updateFn) ? this.options.updateFn(this.prevState)(updater) : updater(this.prevState);
      (_c2 = (_b2 = this.options) == null ? void 0 : _b2.onUpdate) == null ? void 0 : _c2.call(_b2);
      __flush(this);
    };
    this.prevState = initialState;
    this.state = initialState;
    this.options = options;
  }
}
class Derived {
  constructor(options) {
    this.listeners = /* @__PURE__ */ new Set();
    this._subscriptions = [];
    this.lastSeenDepValues = [];
    this.getDepVals = () => {
      const prevDepVals = [];
      const currDepVals = [];
      for (const dep of this.options.deps) {
        prevDepVals.push(dep.prevState);
        currDepVals.push(dep.state);
      }
      this.lastSeenDepValues = currDepVals;
      return {
        prevDepVals,
        currDepVals,
        prevVal: this.prevState ?? void 0
      };
    };
    this.recompute = () => {
      var _a2, _b2;
      this.prevState = this.state;
      const { prevDepVals, currDepVals, prevVal } = this.getDepVals();
      this.state = this.options.fn({
        prevDepVals,
        currDepVals,
        prevVal
      });
      (_b2 = (_a2 = this.options).onUpdate) == null ? void 0 : _b2.call(_a2);
    };
    this.checkIfRecalculationNeededDeeply = () => {
      for (const dep of this.options.deps) {
        if (dep instanceof Derived) {
          dep.checkIfRecalculationNeededDeeply();
        }
      }
      let shouldRecompute = false;
      const lastSeenDepValues = this.lastSeenDepValues;
      const { currDepVals } = this.getDepVals();
      for (let i = 0; i < currDepVals.length; i++) {
        if (currDepVals[i] !== lastSeenDepValues[i]) {
          shouldRecompute = true;
          break;
        }
      }
      if (shouldRecompute) {
        this.recompute();
      }
    };
    this.mount = () => {
      this.registerOnGraph();
      this.checkIfRecalculationNeededDeeply();
      return () => {
        this.unregisterFromGraph();
        for (const cleanup of this._subscriptions) {
          cleanup();
        }
      };
    };
    this.subscribe = (listener) => {
      var _a2, _b2;
      this.listeners.add(listener);
      const unsub = (_b2 = (_a2 = this.options).onSubscribe) == null ? void 0 : _b2.call(_a2, listener, this);
      return () => {
        this.listeners.delete(listener);
        unsub == null ? void 0 : unsub();
      };
    };
    this.options = options;
    this.state = options.fn({
      prevDepVals: void 0,
      prevVal: void 0,
      currDepVals: this.getDepVals().currDepVals
    });
  }
  registerOnGraph(deps = this.options.deps) {
    for (const dep of deps) {
      if (dep instanceof Derived) {
        dep.registerOnGraph();
        this.registerOnGraph(dep.options.deps);
      } else if (dep instanceof Store) {
        let relatedLinkedDerivedVals = __storeToDerived.get(dep);
        if (!relatedLinkedDerivedVals) {
          relatedLinkedDerivedVals = /* @__PURE__ */ new Set();
          __storeToDerived.set(dep, relatedLinkedDerivedVals);
        }
        relatedLinkedDerivedVals.add(this);
        let relatedStores = __derivedToStore.get(this);
        if (!relatedStores) {
          relatedStores = /* @__PURE__ */ new Set();
          __derivedToStore.set(this, relatedStores);
        }
        relatedStores.add(dep);
      }
    }
  }
  unregisterFromGraph(deps = this.options.deps) {
    for (const dep of deps) {
      if (dep instanceof Derived) {
        this.unregisterFromGraph(dep.options.deps);
      } else if (dep instanceof Store) {
        const relatedLinkedDerivedVals = __storeToDerived.get(dep);
        if (relatedLinkedDerivedVals) {
          relatedLinkedDerivedVals.delete(this);
        }
        const relatedStores = __derivedToStore.get(this);
        if (relatedStores) {
          relatedStores.delete(dep);
        }
      }
    }
  }
}
const stateIndexKey = "__TSR_index";
const popStateEvent = "popstate";
const beforeUnloadEvent = "beforeunload";
function createHistory(opts) {
  let location = opts.getLocation();
  const subscribers = /* @__PURE__ */ new Set();
  const notify = (action) => {
    location = opts.getLocation();
    subscribers.forEach((subscriber) => subscriber({ location, action }));
  };
  const handleIndexChange = (action) => {
    if (opts.notifyOnIndexChange ?? true) notify(action);
    else location = opts.getLocation();
  };
  const tryNavigation = async ({
    task,
    navigateOpts,
    ...actionInfo
  }) => {
    var _a2, _b2;
    const ignoreBlocker = (navigateOpts == null ? void 0 : navigateOpts.ignoreBlocker) ?? false;
    if (ignoreBlocker) {
      task();
      return;
    }
    const blockers = ((_a2 = opts.getBlockers) == null ? void 0 : _a2.call(opts)) ?? [];
    const isPushOrReplace = actionInfo.type === "PUSH" || actionInfo.type === "REPLACE";
    if (typeof document !== "undefined" && blockers.length && isPushOrReplace) {
      for (const blocker of blockers) {
        const nextLocation = parseHref(actionInfo.path, actionInfo.state);
        const isBlocked = await blocker.blockerFn({
          currentLocation: location,
          nextLocation,
          action: actionInfo.type
        });
        if (isBlocked) {
          (_b2 = opts.onBlocked) == null ? void 0 : _b2.call(opts);
          return;
        }
      }
    }
    task();
  };
  return {
    get location() {
      return location;
    },
    get length() {
      return opts.getLength();
    },
    subscribers,
    subscribe: (cb) => {
      subscribers.add(cb);
      return () => {
        subscribers.delete(cb);
      };
    },
    push: (path, state, navigateOpts) => {
      const currentIndex = location.state[stateIndexKey];
      state = assignKeyAndIndex(currentIndex + 1, state);
      tryNavigation({
        task: () => {
          opts.pushState(path, state);
          notify({ type: "PUSH" });
        },
        navigateOpts,
        type: "PUSH",
        path,
        state
      });
    },
    replace: (path, state, navigateOpts) => {
      const currentIndex = location.state[stateIndexKey];
      state = assignKeyAndIndex(currentIndex, state);
      tryNavigation({
        task: () => {
          opts.replaceState(path, state);
          notify({ type: "REPLACE" });
        },
        navigateOpts,
        type: "REPLACE",
        path,
        state
      });
    },
    go: (index2, navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.go(index2);
          handleIndexChange({ type: "GO", index: index2 });
        },
        navigateOpts,
        type: "GO"
      });
    },
    back: (navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.back((navigateOpts == null ? void 0 : navigateOpts.ignoreBlocker) ?? false);
          handleIndexChange({ type: "BACK" });
        },
        navigateOpts,
        type: "BACK"
      });
    },
    forward: (navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.forward((navigateOpts == null ? void 0 : navigateOpts.ignoreBlocker) ?? false);
          handleIndexChange({ type: "FORWARD" });
        },
        navigateOpts,
        type: "FORWARD"
      });
    },
    canGoBack: () => location.state[stateIndexKey] !== 0,
    createHref: (str) => opts.createHref(str),
    block: (blocker) => {
      var _a2;
      if (!opts.setBlockers) return () => {
      };
      const blockers = ((_a2 = opts.getBlockers) == null ? void 0 : _a2.call(opts)) ?? [];
      opts.setBlockers([...blockers, blocker]);
      return () => {
        var _a22, _b2;
        const blockers2 = ((_a22 = opts.getBlockers) == null ? void 0 : _a22.call(opts)) ?? [];
        (_b2 = opts.setBlockers) == null ? void 0 : _b2.call(opts, blockers2.filter((b) => b !== blocker));
      };
    },
    flush: () => {
      var _a2;
      return (_a2 = opts.flush) == null ? void 0 : _a2.call(opts);
    },
    destroy: () => {
      var _a2;
      return (_a2 = opts.destroy) == null ? void 0 : _a2.call(opts);
    },
    notify
  };
}
function assignKeyAndIndex(index2, state) {
  if (!state) {
    state = {};
  }
  return {
    ...state,
    key: createRandomKey(),
    [stateIndexKey]: index2
  };
}
function createBrowserHistory(opts) {
  var _a2;
  const win = typeof document !== "undefined" ? window : void 0;
  const originalPushState = win.history.pushState;
  const originalReplaceState = win.history.replaceState;
  let blockers = [];
  const _getBlockers = () => blockers;
  const _setBlockers = (newBlockers) => blockers = newBlockers;
  const createHref = (path) => path;
  const parseLocation = () => parseHref(
    `${win.location.pathname}${win.location.search}${win.location.hash}`,
    win.history.state
  );
  if (!((_a2 = win.history.state) == null ? void 0 : _a2.key)) {
    win.history.replaceState(
      {
        [stateIndexKey]: 0,
        key: createRandomKey()
      },
      ""
    );
  }
  let currentLocation = parseLocation();
  let rollbackLocation;
  let nextPopIsGo = false;
  let ignoreNextPop = false;
  let skipBlockerNextPop = false;
  let ignoreNextBeforeUnload = false;
  const getLocation = () => currentLocation;
  let next;
  let scheduled;
  const flush = () => {
    if (!next) {
      return;
    }
    history._ignoreSubscribers = true;
    (next.isPush ? win.history.pushState : win.history.replaceState)(
      next.state,
      "",
      next.href
    );
    history._ignoreSubscribers = false;
    next = void 0;
    scheduled = void 0;
    rollbackLocation = void 0;
  };
  const queueHistoryAction = (type, destHref, state) => {
    const href = createHref(destHref);
    if (!scheduled) {
      rollbackLocation = currentLocation;
    }
    currentLocation = parseHref(destHref, state);
    next = {
      href,
      state,
      isPush: (next == null ? void 0 : next.isPush) || type === "push"
    };
    if (!scheduled) {
      scheduled = Promise.resolve().then(() => flush());
    }
  };
  const onPushPop = (type) => {
    currentLocation = parseLocation();
    history.notify({ type });
  };
  const onPushPopEvent = async () => {
    if (ignoreNextPop) {
      ignoreNextPop = false;
      return;
    }
    const nextLocation = parseLocation();
    const delta = nextLocation.state[stateIndexKey] - currentLocation.state[stateIndexKey];
    const isForward = delta === 1;
    const isBack = delta === -1;
    const isGo = !isForward && !isBack || nextPopIsGo;
    nextPopIsGo = false;
    const action = isGo ? "GO" : isBack ? "BACK" : "FORWARD";
    const notify = isGo ? {
      type: "GO",
      index: delta
    } : {
      type: isBack ? "BACK" : "FORWARD"
    };
    if (skipBlockerNextPop) {
      skipBlockerNextPop = false;
    } else {
      const blockers2 = _getBlockers();
      if (typeof document !== "undefined" && blockers2.length) {
        for (const blocker of blockers2) {
          const isBlocked = await blocker.blockerFn({
            currentLocation,
            nextLocation,
            action
          });
          if (isBlocked) {
            ignoreNextPop = true;
            win.history.go(1);
            history.notify(notify);
            return;
          }
        }
      }
    }
    currentLocation = parseLocation();
    history.notify(notify);
  };
  const onBeforeUnload = (e) => {
    if (ignoreNextBeforeUnload) {
      ignoreNextBeforeUnload = false;
      return;
    }
    let shouldBlock = false;
    const blockers2 = _getBlockers();
    if (typeof document !== "undefined" && blockers2.length) {
      for (const blocker of blockers2) {
        const shouldHaveBeforeUnload = blocker.enableBeforeUnload ?? true;
        if (shouldHaveBeforeUnload === true) {
          shouldBlock = true;
          break;
        }
        if (typeof shouldHaveBeforeUnload === "function" && shouldHaveBeforeUnload() === true) {
          shouldBlock = true;
          break;
        }
      }
    }
    if (shouldBlock) {
      e.preventDefault();
      return e.returnValue = "";
    }
    return;
  };
  const history = createHistory({
    getLocation,
    getLength: () => win.history.length,
    pushState: (href, state) => queueHistoryAction("push", href, state),
    replaceState: (href, state) => queueHistoryAction("replace", href, state),
    back: (ignoreBlocker) => {
      if (ignoreBlocker) skipBlockerNextPop = true;
      ignoreNextBeforeUnload = true;
      return win.history.back();
    },
    forward: (ignoreBlocker) => {
      if (ignoreBlocker) skipBlockerNextPop = true;
      ignoreNextBeforeUnload = true;
      win.history.forward();
    },
    go: (n) => {
      nextPopIsGo = true;
      win.history.go(n);
    },
    createHref: (href) => createHref(href),
    flush,
    destroy: () => {
      win.history.pushState = originalPushState;
      win.history.replaceState = originalReplaceState;
      win.removeEventListener(beforeUnloadEvent, onBeforeUnload, {
        capture: true
      });
      win.removeEventListener(popStateEvent, onPushPopEvent);
    },
    onBlocked: () => {
      if (rollbackLocation && currentLocation !== rollbackLocation) {
        currentLocation = rollbackLocation;
      }
    },
    getBlockers: _getBlockers,
    setBlockers: _setBlockers,
    notifyOnIndexChange: false
  });
  win.addEventListener(beforeUnloadEvent, onBeforeUnload, { capture: true });
  win.addEventListener(popStateEvent, onPushPopEvent);
  win.history.pushState = function(...args) {
    const res = originalPushState.apply(win.history, args);
    if (!history._ignoreSubscribers) onPushPop("PUSH");
    return res;
  };
  win.history.replaceState = function(...args) {
    const res = originalReplaceState.apply(win.history, args);
    if (!history._ignoreSubscribers) onPushPop("REPLACE");
    return res;
  };
  return history;
}
function createMemoryHistory(opts = {
  initialEntries: ["/"]
}) {
  const entries = opts.initialEntries;
  let index2 = opts.initialIndex ? Math.min(Math.max(opts.initialIndex, 0), entries.length - 1) : entries.length - 1;
  const states = entries.map(
    (_entry, index22) => assignKeyAndIndex(index22, void 0)
  );
  const getLocation = () => parseHref(entries[index2], states[index2]);
  return createHistory({
    getLocation,
    getLength: () => entries.length,
    pushState: (path, state) => {
      if (index2 < entries.length - 1) {
        entries.splice(index2 + 1);
        states.splice(index2 + 1);
      }
      states.push(state);
      entries.push(path);
      index2 = Math.max(entries.length - 1, 0);
    },
    replaceState: (path, state) => {
      states[index2] = state;
      entries[index2] = path;
    },
    back: () => {
      index2 = Math.max(index2 - 1, 0);
    },
    forward: () => {
      index2 = Math.min(index2 + 1, entries.length - 1);
    },
    go: (n) => {
      index2 = Math.min(Math.max(index2 + n, 0), entries.length - 1);
    },
    createHref: (path) => path
  });
}
function parseHref(href, state) {
  const hashIndex = href.indexOf("#");
  const searchIndex = href.indexOf("?");
  return {
    href,
    pathname: href.substring(
      0,
      hashIndex > 0 ? searchIndex > 0 ? Math.min(hashIndex, searchIndex) : hashIndex : searchIndex > 0 ? searchIndex : href.length
    ),
    hash: hashIndex > -1 ? href.substring(hashIndex) : "",
    search: searchIndex > -1 ? href.slice(searchIndex, hashIndex === -1 ? void 0 : hashIndex) : "",
    state: state || { [stateIndexKey]: 0, key: createRandomKey() }
  };
}
function createRandomKey() {
  return (Math.random() + 1).toString(36).substring(7);
}
function last(arr) {
  return arr[arr.length - 1];
}
function isFunction(d) {
  return typeof d === "function";
}
function functionalUpdate$1(updater, previous) {
  if (isFunction(updater)) {
    return updater(previous);
  }
  return updater;
}
function pick(parent, keys) {
  return keys.reduce((obj, key) => {
    obj[key] = parent[key];
    return obj;
  }, {});
}
function replaceEqualDeep$1(prev, _next) {
  if (prev === _next) {
    return prev;
  }
  const next = _next;
  const array = isPlainArray$1(prev) && isPlainArray$1(next);
  if (array || isPlainObject$2(prev) && isPlainObject$2(next)) {
    const prevItems = array ? prev : Object.keys(prev);
    const prevSize = prevItems.length;
    const nextItems = array ? next : Object.keys(next);
    const nextSize = nextItems.length;
    const copy2 = array ? [] : {};
    let equalItems = 0;
    for (let i = 0; i < nextSize; i++) {
      const key = array ? i : nextItems[i];
      if ((!array && prevItems.includes(key) || array) && prev[key] === void 0 && next[key] === void 0) {
        copy2[key] = void 0;
        equalItems++;
      } else {
        copy2[key] = replaceEqualDeep$1(prev[key], next[key]);
        if (copy2[key] === prev[key] && prev[key] !== void 0) {
          equalItems++;
        }
      }
    }
    return prevSize === nextSize && equalItems === prevSize ? prev : copy2;
  }
  return next;
}
function isPlainObject$2(o) {
  if (!hasObjectPrototype$1(o)) {
    return false;
  }
  const ctor = o.constructor;
  if (typeof ctor === "undefined") {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype$1(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  return true;
}
function hasObjectPrototype$1(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function isPlainArray$1(value) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
}
function getObjectKeys(obj, ignoreUndefined) {
  let keys = Object.keys(obj);
  if (ignoreUndefined) {
    keys = keys.filter((key) => obj[key] !== void 0);
  }
  return keys;
}
function deepEqual(a, b, opts) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (isPlainObject$2(a) && isPlainObject$2(b)) {
    const ignoreUndefined = (opts == null ? void 0 : opts.ignoreUndefined) ?? true;
    const aKeys = getObjectKeys(a, ignoreUndefined);
    const bKeys = getObjectKeys(b, ignoreUndefined);
    if (!(opts == null ? void 0 : opts.partial) && aKeys.length !== bKeys.length) {
      return false;
    }
    return bKeys.every((key) => deepEqual(a[key], b[key], opts));
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    return !a.some((item, index2) => !deepEqual(item, b[index2], opts));
  }
  return false;
}
function createControlledPromise(onResolve) {
  let resolveLoadPromise;
  let rejectLoadPromise;
  const controlledPromise = new Promise((resolve, reject) => {
    resolveLoadPromise = resolve;
    rejectLoadPromise = reject;
  });
  controlledPromise.status = "pending";
  controlledPromise.resolve = (value) => {
    controlledPromise.status = "resolved";
    controlledPromise.value = value;
    resolveLoadPromise(value);
    onResolve == null ? void 0 : onResolve(value);
  };
  controlledPromise.reject = (e) => {
    controlledPromise.status = "rejected";
    rejectLoadPromise(e);
  };
  return controlledPromise;
}
function hasUriEncodedChars(inputString) {
  const pattern2 = /%[0-9A-Fa-f]{2}/;
  return pattern2.test(inputString);
}
function joinPaths(paths) {
  return cleanPath(
    paths.filter((val) => {
      return val !== void 0;
    }).join("/")
  );
}
function cleanPath(path) {
  return path.replace(/\/{2,}/g, "/");
}
function trimPathLeft(path) {
  return path === "/" ? path : path.replace(/^\/{1,}/, "");
}
function trimPathRight(path) {
  return path === "/" ? path : path.replace(/\/{1,}$/, "");
}
function trimPath(path) {
  return trimPathRight(trimPathLeft(path));
}
function removeTrailingSlash(value, basepath) {
  if ((value == null ? void 0 : value.endsWith("/")) && value !== "/" && value !== `${basepath}/`) {
    return value.slice(0, -1);
  }
  return value;
}
function exactPathTest(pathName1, pathName2, basepath) {
  return removeTrailingSlash(pathName1, basepath) === removeTrailingSlash(pathName2, basepath);
}
function resolvePath({
  basepath,
  base,
  to,
  trailingSlash = "never",
  caseSensitive
}) {
  var _a2, _b2;
  base = removeBasepath(basepath, base, caseSensitive);
  to = removeBasepath(basepath, to, caseSensitive);
  let baseSegments = parsePathname(base);
  const toSegments = parsePathname(to);
  if (baseSegments.length > 1 && ((_a2 = last(baseSegments)) == null ? void 0 : _a2.value) === "/") {
    baseSegments.pop();
  }
  toSegments.forEach((toSegment, index2) => {
    if (toSegment.value === "/") {
      if (!index2) {
        baseSegments = [toSegment];
      } else if (index2 === toSegments.length - 1) {
        baseSegments.push(toSegment);
      } else ;
    } else if (toSegment.value === "..") {
      baseSegments.pop();
    } else if (toSegment.value === ".") ;
    else {
      baseSegments.push(toSegment);
    }
  });
  if (baseSegments.length > 1) {
    if (((_b2 = last(baseSegments)) == null ? void 0 : _b2.value) === "/") {
      if (trailingSlash === "never") {
        baseSegments.pop();
      }
    } else if (trailingSlash === "always") {
      baseSegments.push({ type: "pathname", value: "/" });
    }
  }
  const segmentValues = baseSegments.map((segment) => {
    if (segment.type === "param") {
      const param = segment.value.substring(1);
      if (segment.prefixSegment && segment.suffixSegment) {
        return `${segment.prefixSegment}{$${param}}${segment.suffixSegment}`;
      } else if (segment.prefixSegment) {
        return `${segment.prefixSegment}{$${param}}`;
      } else if (segment.suffixSegment) {
        return `{$${param}}${segment.suffixSegment}`;
      }
    }
    if (segment.type === "wildcard") {
      if (segment.prefixSegment && segment.suffixSegment) {
        return `${segment.prefixSegment}{$}${segment.suffixSegment}`;
      } else if (segment.prefixSegment) {
        return `${segment.prefixSegment}{$}`;
      } else if (segment.suffixSegment) {
        return `{$}${segment.suffixSegment}`;
      }
    }
    return segment.value;
  });
  const joined = joinPaths([basepath, ...segmentValues]);
  return cleanPath(joined);
}
const PARAM_RE = /^\$.{1,}$/;
const PARAM_W_CURLY_BRACES_RE = /^(.*?)\{(\$[a-zA-Z_$][a-zA-Z0-9_$]*)\}(.*)$/;
const WILDCARD_RE = /^\$$/;
const WILDCARD_W_CURLY_BRACES_RE = /^(.*?)\{\$\}(.*)$/;
function parsePathname(pathname) {
  if (!pathname) {
    return [];
  }
  pathname = cleanPath(pathname);
  const segments = [];
  if (pathname.slice(0, 1) === "/") {
    pathname = pathname.substring(1);
    segments.push({
      type: "pathname",
      value: "/"
    });
  }
  if (!pathname) {
    return segments;
  }
  const split = pathname.split("/").filter(Boolean);
  segments.push(
    ...split.map((part) => {
      const wildcardBracesMatch = part.match(WILDCARD_W_CURLY_BRACES_RE);
      if (wildcardBracesMatch) {
        const prefix2 = wildcardBracesMatch[1];
        const suffix = wildcardBracesMatch[2];
        return {
          type: "wildcard",
          value: "$",
          prefixSegment: prefix2 || void 0,
          suffixSegment: suffix || void 0
        };
      }
      const paramBracesMatch = part.match(PARAM_W_CURLY_BRACES_RE);
      if (paramBracesMatch) {
        const prefix2 = paramBracesMatch[1];
        const paramName = paramBracesMatch[2];
        const suffix = paramBracesMatch[3];
        return {
          type: "param",
          value: "" + paramName,
          prefixSegment: prefix2 || void 0,
          suffixSegment: suffix || void 0
        };
      }
      if (PARAM_RE.test(part)) {
        const paramName = part.substring(1);
        return {
          type: "param",
          value: "$" + paramName,
          prefixSegment: void 0,
          suffixSegment: void 0
        };
      }
      if (WILDCARD_RE.test(part)) {
        return {
          type: "wildcard",
          value: "$",
          prefixSegment: void 0,
          suffixSegment: void 0
        };
      }
      return {
        type: "pathname",
        value: part.includes("%25") ? part.split("%25").map((segment) => decodeURI(segment)).join("%25") : decodeURI(part)
      };
    })
  );
  if (pathname.slice(-1) === "/") {
    pathname = pathname.substring(1);
    segments.push({
      type: "pathname",
      value: "/"
    });
  }
  return segments;
}
function interpolatePath({
  path,
  params,
  leaveWildcards,
  leaveParams,
  decodeCharMap
}) {
  const interpolatedPathSegments = parsePathname(path);
  function encodeParam(key) {
    const value = params[key];
    const isValueString = typeof value === "string";
    if (["*", "_splat"].includes(key)) {
      return isValueString ? encodeURI(value) : value;
    } else {
      return isValueString ? encodePathParam(value, decodeCharMap) : value;
    }
  }
  let isMissingParams = false;
  const usedParams = {};
  const interpolatedPath = joinPaths(
    interpolatedPathSegments.map((segment) => {
      if (segment.type === "wildcard") {
        usedParams._splat = params._splat;
        const segmentPrefix = segment.prefixSegment || "";
        const segmentSuffix = segment.suffixSegment || "";
        const value = encodeParam("_splat");
        if (leaveWildcards) {
          return `${segmentPrefix}${segment.value}${value ?? ""}${segmentSuffix}`;
        }
        return `${segmentPrefix}${value}${segmentSuffix}`;
      }
      if (segment.type === "param") {
        const key = segment.value.substring(1);
        if (!isMissingParams && !(key in params)) {
          isMissingParams = true;
        }
        usedParams[key] = params[key];
        const segmentPrefix = segment.prefixSegment || "";
        const segmentSuffix = segment.suffixSegment || "";
        if (leaveParams) {
          const value = encodeParam(segment.value);
          return `${segmentPrefix}${segment.value}${value ?? ""}${segmentSuffix}`;
        }
        return `${segmentPrefix}${encodeParam(key) ?? "undefined"}${segmentSuffix}`;
      }
      return segment.value;
    })
  );
  return { usedParams, interpolatedPath, isMissingParams };
}
function encodePathParam(value, decodeCharMap) {
  let encoded = encodeURIComponent(value);
  if (decodeCharMap) {
    for (const [encodedChar, char] of decodeCharMap) {
      encoded = encoded.replaceAll(encodedChar, char);
    }
  }
  return encoded;
}
function matchPathname(basepath, currentPathname, matchLocation) {
  const pathParams = matchByPath(basepath, currentPathname, matchLocation);
  if (matchLocation.to && !pathParams) {
    return;
  }
  return pathParams ?? {};
}
function removeBasepath(basepath, pathname, caseSensitive = false) {
  const normalizedBasepath = caseSensitive ? basepath : basepath.toLowerCase();
  const normalizedPathname = caseSensitive ? pathname : pathname.toLowerCase();
  switch (true) {
    // default behaviour is to serve app from the root - pathname
    // left untouched
    case normalizedBasepath === "/":
      return pathname;
    // shortcut for removing the basepath if it matches the pathname
    case normalizedPathname === normalizedBasepath:
      return "";
    // in case pathname is shorter than basepath - there is
    // nothing to remove
    case pathname.length < basepath.length:
      return pathname;
    // avoid matching partial segments - strict equality handled
    // earlier, otherwise, basepath separated from pathname with
    // separator, therefore lack of separator means partial
    // segment match (`/app` should not match `/application`)
    case normalizedPathname[normalizedBasepath.length] !== "/":
      return pathname;
    // remove the basepath from the pathname if it starts with it
    case normalizedPathname.startsWith(normalizedBasepath):
      return pathname.slice(basepath.length);
    // otherwise, return the pathname as is
    default:
      return pathname;
  }
}
function matchByPath(basepath, from, matchLocation) {
  if (basepath !== "/" && !from.startsWith(basepath)) {
    return void 0;
  }
  from = removeBasepath(basepath, from, matchLocation.caseSensitive);
  const to = removeBasepath(
    basepath,
    `${matchLocation.to ?? "$"}`,
    matchLocation.caseSensitive
  );
  const baseSegments = parsePathname(from);
  const routeSegments = parsePathname(to);
  if (!from.startsWith("/")) {
    baseSegments.unshift({
      type: "pathname",
      value: "/"
    });
  }
  if (!to.startsWith("/")) {
    routeSegments.unshift({
      type: "pathname",
      value: "/"
    });
  }
  const params = {};
  const isMatch = (() => {
    var _a2;
    for (let i = 0; i < Math.max(baseSegments.length, routeSegments.length); i++) {
      const baseSegment = baseSegments[i];
      const routeSegment = routeSegments[i];
      const isLastBaseSegment = i >= baseSegments.length - 1;
      const isLastRouteSegment = i >= routeSegments.length - 1;
      if (routeSegment) {
        if (routeSegment.type === "wildcard") {
          const remainingBaseSegments = baseSegments.slice(i);
          let _splat;
          if (routeSegment.prefixSegment || routeSegment.suffixSegment) {
            if (!baseSegment) return false;
            const prefix2 = routeSegment.prefixSegment || "";
            const suffix = routeSegment.suffixSegment || "";
            const baseValue = baseSegment.value;
            if ("prefixSegment" in routeSegment) {
              if (!baseValue.startsWith(prefix2)) {
                return false;
              }
            }
            if ("suffixSegment" in routeSegment) {
              if (!((_a2 = baseSegments[baseSegments.length - 1]) == null ? void 0 : _a2.value.endsWith(suffix))) {
                return false;
              }
            }
            let rejoinedSplat = decodeURI(
              joinPaths(remainingBaseSegments.map((d) => d.value))
            );
            if (prefix2 && rejoinedSplat.startsWith(prefix2)) {
              rejoinedSplat = rejoinedSplat.slice(prefix2.length);
            }
            if (suffix && rejoinedSplat.endsWith(suffix)) {
              rejoinedSplat = rejoinedSplat.slice(
                0,
                rejoinedSplat.length - suffix.length
              );
            }
            _splat = rejoinedSplat;
          } else {
            _splat = decodeURI(
              joinPaths(remainingBaseSegments.map((d) => d.value))
            );
          }
          params["*"] = _splat;
          params["_splat"] = _splat;
          return true;
        }
        if (routeSegment.type === "pathname") {
          if (routeSegment.value === "/" && !(baseSegment == null ? void 0 : baseSegment.value)) {
            return true;
          }
          if (baseSegment) {
            if (matchLocation.caseSensitive) {
              if (routeSegment.value !== baseSegment.value) {
                return false;
              }
            } else if (routeSegment.value.toLowerCase() !== baseSegment.value.toLowerCase()) {
              return false;
            }
          }
        }
        if (!baseSegment) {
          return false;
        }
        if (routeSegment.type === "param") {
          if (baseSegment.value === "/") {
            return false;
          }
          let _paramValue;
          if (routeSegment.prefixSegment || routeSegment.suffixSegment) {
            const prefix2 = routeSegment.prefixSegment || "";
            const suffix = routeSegment.suffixSegment || "";
            const baseValue = baseSegment.value;
            if (prefix2 && !baseValue.startsWith(prefix2)) {
              return false;
            }
            if (suffix && !baseValue.endsWith(suffix)) {
              return false;
            }
            let paramValue = baseValue;
            if (prefix2 && paramValue.startsWith(prefix2)) {
              paramValue = paramValue.slice(prefix2.length);
            }
            if (suffix && paramValue.endsWith(suffix)) {
              paramValue = paramValue.slice(
                0,
                paramValue.length - suffix.length
              );
            }
            _paramValue = decodeURIComponent(paramValue);
          } else {
            _paramValue = decodeURIComponent(baseSegment.value);
          }
          params[routeSegment.value.substring(1)] = _paramValue;
        }
      }
      if (!isLastBaseSegment && isLastRouteSegment) {
        params["**"] = joinPaths(baseSegments.slice(i + 1).map((d) => d.value));
        return !!matchLocation.fuzzy && (routeSegment == null ? void 0 : routeSegment.value) !== "/";
      }
    }
    return true;
  })();
  return isMatch ? params : void 0;
}
function isNotFound(obj) {
  return !!(obj == null ? void 0 : obj.isNotFound);
}
function getSafeSessionStorage() {
  try {
    if ("undefined" !== "undefined" && typeof window.sessionStorage === "object") ;
  } catch {
    return void 0;
  }
  return void 0;
}
const storageKey = "tsr-scroll-restoration-v1_3";
const throttle = (fn, wait) => {
  let timeout;
  return (...args) => {
    if (!timeout) {
      timeout = setTimeout(() => {
        fn(...args);
        timeout = null;
      }, wait);
    }
  };
};
function createScrollRestorationCache() {
  const safeSessionStorage = getSafeSessionStorage();
  if (!safeSessionStorage) {
    return void 0;
  }
  const persistedState = safeSessionStorage.getItem(storageKey);
  let state = persistedState ? JSON.parse(persistedState) : {};
  return {
    state,
    // This setter is simply to make sure that we set the sessionStorage right
    // after the state is updated. It doesn't necessarily need to be a functional
    // update.
    set: (updater) => (state = functionalUpdate$1(updater, state) || state, safeSessionStorage.setItem(storageKey, JSON.stringify(state)))
  };
}
const scrollRestorationCache = createScrollRestorationCache();
const defaultGetScrollRestorationKey = (location) => {
  return location.state.key || location.href;
};
function getCssSelector(el) {
  const path = [];
  let parent;
  while (parent = el.parentNode) {
    path.unshift(
      `${el.tagName}:nth-child(${[].indexOf.call(parent.children, el) + 1})`
    );
    el = parent;
  }
  return `${path.join(" > ")}`.toLowerCase();
}
let ignoreScroll = false;
function restoreScroll(storageKey2, key, behavior, shouldScrollRestoration, scrollToTopSelectors) {
  var _a2;
  let byKey;
  try {
    byKey = JSON.parse(sessionStorage.getItem(storageKey2) || "{}");
  } catch (error) {
    console.error(error);
    return;
  }
  const resolvedKey = key || ((_a2 = window.history.state) == null ? void 0 : _a2.key);
  const elementEntries = byKey[resolvedKey];
  ignoreScroll = true;
  (() => {
    if (shouldScrollRestoration && elementEntries) {
      for (const elementSelector in elementEntries) {
        const entry = elementEntries[elementSelector];
        if (elementSelector === "window") {
          window.scrollTo({
            top: entry.scrollY,
            left: entry.scrollX,
            behavior
          });
        } else if (elementSelector) {
          const element = document.querySelector(elementSelector);
          if (element) {
            element.scrollLeft = entry.scrollX;
            element.scrollTop = entry.scrollY;
          }
        }
      }
      return;
    }
    const hash = window.location.hash.split("#")[1];
    if (hash) {
      const hashScrollIntoViewOptions = (window.history.state || {}).__hashScrollIntoViewOptions ?? true;
      if (hashScrollIntoViewOptions) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView(hashScrollIntoViewOptions);
        }
      }
      return;
    }
    [
      "window",
      ...(scrollToTopSelectors == null ? void 0 : scrollToTopSelectors.filter((d) => d !== "window")) ?? []
    ].forEach((selector) => {
      const element = selector === "window" ? window : document.querySelector(selector);
      if (element) {
        element.scrollTo({
          top: 0,
          left: 0,
          behavior
        });
      }
    });
  })();
  ignoreScroll = false;
}
function setupScrollRestoration(router, force) {
  if (scrollRestorationCache === void 0) {
    return;
  }
  const shouldScrollRestoration = router.options.scrollRestoration ?? false;
  if (shouldScrollRestoration) {
    router.isScrollRestoring = true;
  }
  if (typeof document === "undefined" || router.isScrollRestorationSetup) {
    return;
  }
  router.isScrollRestorationSetup = true;
  ignoreScroll = false;
  const getKey = router.options.getScrollRestorationKey || defaultGetScrollRestorationKey;
  window.history.scrollRestoration = "manual";
  const onScroll = (event) => {
    if (ignoreScroll || !router.isScrollRestoring) {
      return;
    }
    let elementSelector = "";
    if (event.target === document || event.target === window) {
      elementSelector = "window";
    } else {
      const attrId = event.target.getAttribute(
        "data-scroll-restoration-id"
      );
      if (attrId) {
        elementSelector = `[data-scroll-restoration-id="${attrId}"]`;
      } else {
        elementSelector = getCssSelector(event.target);
      }
    }
    const restoreKey = getKey(router.state.location);
    scrollRestorationCache.set((state) => {
      const keyEntry = state[restoreKey] = state[restoreKey] || {};
      const elementEntry = keyEntry[elementSelector] = keyEntry[elementSelector] || {};
      if (elementSelector === "window") {
        elementEntry.scrollX = window.scrollX || 0;
        elementEntry.scrollY = window.scrollY || 0;
      } else if (elementSelector) {
        const element = document.querySelector(elementSelector);
        if (element) {
          elementEntry.scrollX = element.scrollLeft || 0;
          elementEntry.scrollY = element.scrollTop || 0;
        }
      }
      return state;
    });
  };
  if (typeof document !== "undefined") {
    document.addEventListener("scroll", throttle(onScroll, 100), true);
  }
  router.subscribe("onRendered", (event) => {
    const cacheKey = getKey(event.toLocation);
    if (!router.resetNextScroll) {
      router.resetNextScroll = true;
      return;
    }
    restoreScroll(
      storageKey,
      cacheKey,
      router.options.scrollRestorationBehavior || void 0,
      router.isScrollRestoring || void 0,
      router.options.scrollToTopSelectors || void 0
    );
    if (router.isScrollRestoring) {
      scrollRestorationCache.set((state) => {
        state[cacheKey] = state[cacheKey] || {};
        return state;
      });
    }
  });
}
function handleHashScroll(router) {
  if (typeof document !== "undefined" && document.querySelector) {
    const hashScrollIntoViewOptions = router.state.location.state.__hashScrollIntoViewOptions ?? true;
    if (hashScrollIntoViewOptions && router.state.location.hash !== "") {
      const el = document.getElementById(router.state.location.hash);
      if (el) {
        el.scrollIntoView(hashScrollIntoViewOptions);
      }
    }
  }
}
function encode(obj, pfx) {
  const normalizedObject = Object.entries(obj).flatMap(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map((v2) => [key, String(v2)]);
    } else {
      return [[key, String(value)]];
    }
  });
  const searchParams = new URLSearchParams(normalizedObject);
  return "" + searchParams.toString();
}
function toValue(mix) {
  if (!mix) return "";
  const str = hasUriEncodedChars(mix) ? decodeURIComponent(mix) : decodeURIComponent(encodeURIComponent(mix));
  if (str === "false") return false;
  if (str === "true") return true;
  return +str * 0 === 0 && +str + "" === str ? +str : str;
}
function decode(str, pfx) {
  const searchParamsPart = str;
  const searchParams = new URLSearchParams(searchParamsPart);
  const entries = [...searchParams.entries()];
  return entries.reduce((acc, [key, value]) => {
    const previousValue = acc[key];
    if (previousValue == null) {
      acc[key] = toValue(value);
    } else {
      acc[key] = Array.isArray(previousValue) ? [...previousValue, toValue(value)] : [previousValue, toValue(value)];
    }
    return acc;
  }, {});
}
const defaultParseSearch = parseSearchWith(JSON.parse);
const defaultStringifySearch = stringifySearchWith(
  JSON.stringify,
  JSON.parse
);
function parseSearchWith(parser) {
  return (searchStr) => {
    if (searchStr.substring(0, 1) === "?") {
      searchStr = searchStr.substring(1);
    }
    const query = decode(searchStr);
    for (const key in query) {
      const value = query[key];
      if (typeof value === "string") {
        try {
          query[key] = parser(value);
        } catch (err) {
        }
      }
    }
    return query;
  };
}
function stringifySearchWith(stringify2, parser) {
  function stringifyValue(val) {
    if (typeof val === "object" && val !== null) {
      try {
        return stringify2(val);
      } catch (err) {
      }
    } else if (typeof val === "string" && typeof parser === "function") {
      try {
        parser(val);
        return stringify2(val);
      } catch (err) {
      }
    }
    return val;
  }
  return (search) => {
    search = { ...search };
    Object.keys(search).forEach((key) => {
      const val = search[key];
      if (typeof val === "undefined" || val === void 0) {
        delete search[key];
      } else {
        search[key] = stringifyValue(val);
      }
    });
    const searchStr = encode(search).toString();
    return searchStr ? `?${searchStr}` : "";
  };
}
const rootRouteId = "__root__";
function isRedirect(obj) {
  return obj instanceof Response && !!obj.options;
}
function isResolvedRedirect(obj) {
  return isRedirect(obj) && !!obj.options.href;
}
function defaultSerializeError(err) {
  if (err instanceof Error) {
    const obj = {
      name: err.name,
      message: err.message
    };
    return obj;
  }
  return {
    data: err
  };
}
function getLocationChangeInfo(routerState) {
  const fromLocation = routerState.resolvedLocation;
  const toLocation = routerState.location;
  const pathChanged = (fromLocation == null ? void 0 : fromLocation.pathname) !== toLocation.pathname;
  const hrefChanged = (fromLocation == null ? void 0 : fromLocation.href) !== toLocation.href;
  const hashChanged = (fromLocation == null ? void 0 : fromLocation.hash) !== toLocation.hash;
  return { fromLocation, toLocation, pathChanged, hrefChanged, hashChanged };
}
class RouterCore {
  /**
   * @deprecated Use the `createRouter` function instead
   */
  constructor(options) {
    this.tempLocationKey = `${Math.round(
      Math.random() * 1e7
    )}`;
    this.resetNextScroll = true;
    this.shouldViewTransition = void 0;
    this.isViewTransitionTypesSupported = void 0;
    this.subscribers = /* @__PURE__ */ new Set();
    this.isScrollRestoring = false;
    this.isScrollRestorationSetup = false;
    this.startTransition = (fn) => fn();
    this.isShell = false;
    this.update = (newOptions) => {
      if (newOptions.notFoundRoute) {
        console.warn(
          "The notFoundRoute API is deprecated and will be removed in the next major version. See https://tanstack.com/router/v1/docs/framework/react/guide/not-found-errors#migrating-from-notfoundroute for more info."
        );
      }
      const previousOptions = this.options;
      this.options = {
        ...this.options,
        ...newOptions
      };
      this.isServer = this.options.isServer ?? typeof document === "undefined";
      this.pathParamsDecodeCharMap = this.options.pathParamsAllowedCharacters ? new Map(
        this.options.pathParamsAllowedCharacters.map((char) => [
          encodeURIComponent(char),
          char
        ])
      ) : void 0;
      if (!this.basepath || newOptions.basepath && newOptions.basepath !== previousOptions.basepath) {
        if (newOptions.basepath === void 0 || newOptions.basepath === "" || newOptions.basepath === "/") {
          this.basepath = "/";
        } else {
          this.basepath = `/${trimPath(newOptions.basepath)}`;
        }
      }
      if (!this.history || this.options.history && this.options.history !== this.history) {
        this.history = this.options.history ?? (this.isServer ? createMemoryHistory({
          initialEntries: [this.basepath || "/"]
        }) : createBrowserHistory());
        this.latestLocation = this.parseLocation();
      }
      if (this.options.routeTree !== this.routeTree) {
        this.routeTree = this.options.routeTree;
        this.buildRouteTree();
      }
      if (!this.__store) {
        this.__store = new Store(getInitialRouterState(this.latestLocation), {
          onUpdate: () => {
            this.__store.state = {
              ...this.state,
              cachedMatches: this.state.cachedMatches.filter(
                (d) => !["redirected"].includes(d.status)
              )
            };
          }
        });
        setupScrollRestoration(this);
      }
      if (this.latestLocation.search.__TSS_SHELL) {
        this.isShell = true;
      }
    };
    this.buildRouteTree = () => {
      const { routesById, routesByPath, flatRoutes } = processRouteTree({
        routeTree: this.routeTree,
        initRoute: (route, i) => {
          route.init({
            originalIndex: i,
            defaultSsr: this.options.defaultSsr
          });
        }
      });
      this.routesById = routesById;
      this.routesByPath = routesByPath;
      this.flatRoutes = flatRoutes;
      const notFoundRoute = this.options.notFoundRoute;
      if (notFoundRoute) {
        notFoundRoute.init({
          originalIndex: 99999999999,
          defaultSsr: this.options.defaultSsr
        });
        this.routesById[notFoundRoute.id] = notFoundRoute;
      }
    };
    this.subscribe = (eventType, fn) => {
      const listener = {
        eventType,
        fn
      };
      this.subscribers.add(listener);
      return () => {
        this.subscribers.delete(listener);
      };
    };
    this.emit = (routerEvent) => {
      this.subscribers.forEach((listener) => {
        if (listener.eventType === routerEvent.type) {
          listener.fn(routerEvent);
        }
      });
    };
    this.parseLocation = (previousLocation, locationToParse) => {
      const parse = ({
        pathname,
        search,
        hash,
        state
      }) => {
        const parsedSearch = this.options.parseSearch(search);
        const searchStr = this.options.stringifySearch(parsedSearch);
        return {
          pathname,
          searchStr,
          search: replaceEqualDeep$1(previousLocation == null ? void 0 : previousLocation.search, parsedSearch),
          hash: hash.split("#").reverse()[0] ?? "",
          href: `${pathname}${searchStr}${hash}`,
          state: replaceEqualDeep$1(previousLocation == null ? void 0 : previousLocation.state, state)
        };
      };
      const location = parse(locationToParse ?? this.history.location);
      const { __tempLocation, __tempKey } = location.state;
      if (__tempLocation && (!__tempKey || __tempKey === this.tempLocationKey)) {
        const parsedTempLocation = parse(__tempLocation);
        parsedTempLocation.state.key = location.state.key;
        delete parsedTempLocation.state.__tempLocation;
        return {
          ...parsedTempLocation,
          maskedLocation: location
        };
      }
      return location;
    };
    this.resolvePathWithBase = (from, path) => {
      const resolvedPath = resolvePath({
        basepath: this.basepath,
        base: from,
        to: cleanPath(path),
        trailingSlash: this.options.trailingSlash,
        caseSensitive: this.options.caseSensitive
      });
      return resolvedPath;
    };
    this.matchRoutes = (pathnameOrNext, locationSearchOrOpts, opts) => {
      if (typeof pathnameOrNext === "string") {
        return this.matchRoutesInternal(
          {
            pathname: pathnameOrNext,
            search: locationSearchOrOpts
          },
          opts
        );
      }
      return this.matchRoutesInternal(pathnameOrNext, locationSearchOrOpts);
    };
    this.getMatchedRoutes = (pathname, routePathname) => {
      return getMatchedRoutes({
        pathname,
        routePathname,
        basepath: this.basepath,
        caseSensitive: this.options.caseSensitive,
        routesByPath: this.routesByPath,
        routesById: this.routesById,
        flatRoutes: this.flatRoutes
      });
    };
    this.cancelMatch = (id) => {
      const match = this.getMatch(id);
      if (!match) return;
      match.abortController.abort();
      clearTimeout(match.pendingTimeout);
    };
    this.cancelMatches = () => {
      var _a2;
      (_a2 = this.state.pendingMatches) == null ? void 0 : _a2.forEach((match) => {
        this.cancelMatch(match.id);
      });
    };
    this.buildLocation = (opts) => {
      const build = (dest = {}) => {
        var _a2;
        const currentLocation = dest._fromLocation || this.latestLocation;
        const allFromMatches = this.matchRoutes(currentLocation, {
          _buildLocation: true
        });
        const lastMatch = last(allFromMatches);
        let fromPath = lastMatch.fullPath;
        if (dest.unsafeRelative === "path") {
          fromPath = currentLocation.pathname;
        } else if (dest.to && dest.from) {
          fromPath = dest.from;
          const existingFrom = [...allFromMatches].reverse().find((d) => {
            return d.fullPath === fromPath || d.fullPath === joinPaths([fromPath, "/"]);
          });
          if (!existingFrom) {
            console.warn(`Could not find match for from: ${dest.from}`);
          }
        }
        const fromSearch = lastMatch.search;
        const fromParams = { ...lastMatch.params };
        const nextTo = dest.to ? this.resolvePathWithBase(fromPath, `${dest.to}`) : fromPath;
        let nextParams = (dest.params ?? true) === true ? fromParams : {
          ...fromParams,
          ...functionalUpdate$1(dest.params, fromParams)
        };
        const destRoutes = this.matchRoutes(
          nextTo,
          {},
          {
            _buildLocation: true
          }
        ).map((d) => this.looseRoutesById[d.routeId]);
        if (Object.keys(nextParams).length > 0) {
          destRoutes.map((route) => {
            var _a22;
            return ((_a22 = route.options.params) == null ? void 0 : _a22.stringify) ?? route.options.stringifyParams;
          }).filter(Boolean).forEach((fn) => {
            nextParams = { ...nextParams, ...fn(nextParams) };
          });
        }
        const nextPathname = interpolatePath({
          path: nextTo,
          params: nextParams ?? {},
          leaveWildcards: false,
          leaveParams: opts.leaveParams,
          decodeCharMap: this.pathParamsDecodeCharMap
        }).interpolatedPath;
        let nextSearch = fromSearch;
        if (opts._includeValidateSearch && ((_a2 = this.options.search) == null ? void 0 : _a2.strict)) {
          let validatedSearch = {};
          destRoutes.forEach((route) => {
            try {
              if (route.options.validateSearch) {
                validatedSearch = {
                  ...validatedSearch,
                  ...validateSearch(route.options.validateSearch, {
                    ...validatedSearch,
                    ...nextSearch
                  }) ?? {}
                };
              }
            } catch {
            }
          });
          nextSearch = validatedSearch;
        }
        nextSearch = applySearchMiddleware({
          search: nextSearch,
          dest,
          destRoutes,
          _includeValidateSearch: opts._includeValidateSearch
        });
        nextSearch = replaceEqualDeep$1(fromSearch, nextSearch);
        const searchStr = this.options.stringifySearch(nextSearch);
        const hash = dest.hash === true ? currentLocation.hash : dest.hash ? functionalUpdate$1(dest.hash, currentLocation.hash) : void 0;
        const hashStr = hash ? `#${hash}` : "";
        let nextState = dest.state === true ? currentLocation.state : dest.state ? functionalUpdate$1(dest.state, currentLocation.state) : {};
        nextState = replaceEqualDeep$1(currentLocation.state, nextState);
        return {
          pathname: nextPathname,
          search: nextSearch,
          searchStr,
          state: nextState,
          hash: hash ?? "",
          href: `${nextPathname}${searchStr}${hashStr}`,
          unmaskOnReload: dest.unmaskOnReload
        };
      };
      const buildWithMatches = (dest = {}, maskedDest) => {
        var _a2;
        const next = build(dest);
        let maskedNext = maskedDest ? build(maskedDest) : void 0;
        if (!maskedNext) {
          let params = {};
          const foundMask = (_a2 = this.options.routeMasks) == null ? void 0 : _a2.find((d) => {
            const match = matchPathname(this.basepath, next.pathname, {
              to: d.from,
              caseSensitive: false,
              fuzzy: false
            });
            if (match) {
              params = match;
              return true;
            }
            return false;
          });
          if (foundMask) {
            const { from: _from, ...maskProps } = foundMask;
            maskedDest = {
              ...pick(opts, ["from"]),
              ...maskProps,
              params
            };
            maskedNext = build(maskedDest);
          }
        }
        if (maskedNext) {
          const maskedFinal = build(maskedDest);
          next.maskedLocation = maskedFinal;
        }
        return next;
      };
      if (opts.mask) {
        return buildWithMatches(opts, {
          ...pick(opts, ["from"]),
          ...opts.mask
        });
      }
      return buildWithMatches(opts);
    };
    this.commitLocation = ({
      viewTransition,
      ignoreBlocker,
      ...next
    }) => {
      const isSameState = () => {
        const ignoredProps = [
          "key",
          "__TSR_index",
          "__hashScrollIntoViewOptions"
        ];
        ignoredProps.forEach((prop) => {
          next.state[prop] = this.latestLocation.state[prop];
        });
        const isEqual = deepEqual(next.state, this.latestLocation.state);
        ignoredProps.forEach((prop) => {
          delete next.state[prop];
        });
        return isEqual;
      };
      const isSameUrl = this.latestLocation.href === next.href;
      const previousCommitPromise = this.commitLocationPromise;
      this.commitLocationPromise = createControlledPromise(() => {
        previousCommitPromise == null ? void 0 : previousCommitPromise.resolve();
      });
      if (isSameUrl && isSameState()) {
        this.load();
      } else {
        let { maskedLocation, hashScrollIntoView, ...nextHistory } = next;
        if (maskedLocation) {
          nextHistory = {
            ...maskedLocation,
            state: {
              ...maskedLocation.state,
              __tempKey: void 0,
              __tempLocation: {
                ...nextHistory,
                search: nextHistory.searchStr,
                state: {
                  ...nextHistory.state,
                  __tempKey: void 0,
                  __tempLocation: void 0,
                  key: void 0
                }
              }
            }
          };
          if (nextHistory.unmaskOnReload ?? this.options.unmaskOnReload ?? false) {
            nextHistory.state.__tempKey = this.tempLocationKey;
          }
        }
        nextHistory.state.__hashScrollIntoViewOptions = hashScrollIntoView ?? this.options.defaultHashScrollIntoView ?? true;
        this.shouldViewTransition = viewTransition;
        this.history[next.replace ? "replace" : "push"](
          nextHistory.href,
          nextHistory.state,
          { ignoreBlocker }
        );
      }
      this.resetNextScroll = next.resetScroll ?? true;
      if (!this.history.subscribers.size) {
        this.load();
      }
      return this.commitLocationPromise;
    };
    this.buildAndCommitLocation = ({
      replace,
      resetScroll,
      hashScrollIntoView,
      viewTransition,
      ignoreBlocker,
      href,
      ...rest
    } = {}) => {
      if (href) {
        const currentIndex = this.history.location.state.__TSR_index;
        const parsed = parseHref(href, {
          __TSR_index: replace ? currentIndex : currentIndex + 1
        });
        rest.to = parsed.pathname;
        rest.search = this.options.parseSearch(parsed.search);
        rest.hash = parsed.hash.slice(1);
      }
      const location = this.buildLocation({
        ...rest,
        _includeValidateSearch: true
      });
      return this.commitLocation({
        ...location,
        viewTransition,
        replace,
        resetScroll,
        hashScrollIntoView,
        ignoreBlocker
      });
    };
    this.navigate = ({ to, reloadDocument, href, ...rest }) => {
      if (!reloadDocument && href) {
        try {
          new URL(`${href}`);
          reloadDocument = true;
        } catch {
        }
      }
      if (reloadDocument) {
        if (!href) {
          const location = this.buildLocation({ to, ...rest });
          href = this.history.createHref(location.href);
        }
        if (rest.replace) {
          window.location.replace(href);
        } else {
          window.location.href = href;
        }
        return;
      }
      return this.buildAndCommitLocation({
        ...rest,
        href,
        to
      });
    };
    this.beforeLoad = () => {
      this.cancelMatches();
      this.latestLocation = this.parseLocation(this.latestLocation);
      const pendingMatches = this.matchRoutes(this.latestLocation);
      this.__store.setState((s) => ({
        ...s,
        status: "pending",
        isLoading: true,
        location: this.latestLocation,
        pendingMatches,
        // If a cached moved to pendingMatches, remove it from cachedMatches
        cachedMatches: s.cachedMatches.filter((d) => {
          return !pendingMatches.find((e) => e.id === d.id);
        })
      }));
    };
    this.load = async (opts) => {
      let redirect;
      let notFound;
      let loadPromise;
      loadPromise = new Promise((resolve) => {
        this.startTransition(async () => {
          var _a2;
          try {
            this.beforeLoad();
            const next = this.latestLocation;
            const prevLocation = this.state.resolvedLocation;
            if (!this.state.redirect) {
              this.emit({
                type: "onBeforeNavigate",
                ...getLocationChangeInfo({
                  resolvedLocation: prevLocation,
                  location: next
                })
              });
            }
            this.emit({
              type: "onBeforeLoad",
              ...getLocationChangeInfo({
                resolvedLocation: prevLocation,
                location: next
              })
            });
            await this.loadMatches({
              sync: opts == null ? void 0 : opts.sync,
              matches: this.state.pendingMatches,
              location: next,
              // eslint-disable-next-line @typescript-eslint/require-await
              onReady: async () => {
                this.startViewTransition(async () => {
                  let exitingMatches;
                  let enteringMatches;
                  let stayingMatches;
                  batch$1(() => {
                    this.__store.setState((s) => {
                      const previousMatches = s.matches;
                      const newMatches = s.pendingMatches || s.matches;
                      exitingMatches = previousMatches.filter(
                        (match) => !newMatches.find((d) => d.id === match.id)
                      );
                      enteringMatches = newMatches.filter(
                        (match) => !previousMatches.find((d) => d.id === match.id)
                      );
                      stayingMatches = previousMatches.filter(
                        (match) => newMatches.find((d) => d.id === match.id)
                      );
                      return {
                        ...s,
                        isLoading: false,
                        loadedAt: Date.now(),
                        matches: newMatches,
                        pendingMatches: void 0,
                        cachedMatches: [
                          ...s.cachedMatches,
                          ...exitingMatches.filter((d) => d.status !== "error")
                        ]
                      };
                    });
                    this.clearExpiredCache();
                  });
                  [
                    [exitingMatches, "onLeave"],
                    [enteringMatches, "onEnter"],
                    [stayingMatches, "onStay"]
                  ].forEach(([matches, hook]) => {
                    matches.forEach((match) => {
                      var _a22, _b2;
                      (_b2 = (_a22 = this.looseRoutesById[match.routeId].options)[hook]) == null ? void 0 : _b2.call(_a22, match);
                    });
                  });
                });
              }
            });
          } catch (err) {
            if (isRedirect(err)) {
              redirect = err;
              if (!this.isServer) {
                this.navigate({
                  ...redirect.options,
                  replace: true,
                  ignoreBlocker: true
                });
              }
            } else if (isNotFound(err)) {
              notFound = err;
            }
            this.__store.setState((s) => ({
              ...s,
              statusCode: redirect ? redirect.status : notFound ? 404 : s.matches.some((d) => d.status === "error") ? 500 : 200,
              redirect
            }));
          }
          if (this.latestLoadPromise === loadPromise) {
            (_a2 = this.commitLocationPromise) == null ? void 0 : _a2.resolve();
            this.latestLoadPromise = void 0;
            this.commitLocationPromise = void 0;
          }
          resolve();
        });
      });
      this.latestLoadPromise = loadPromise;
      await loadPromise;
      while (this.latestLoadPromise && loadPromise !== this.latestLoadPromise) {
        await this.latestLoadPromise;
      }
      if (this.hasNotFoundMatch()) {
        this.__store.setState((s) => ({
          ...s,
          statusCode: 404
        }));
      }
    };
    this.startViewTransition = (fn) => {
      const shouldViewTransition = this.shouldViewTransition ?? this.options.defaultViewTransition;
      delete this.shouldViewTransition;
      if (shouldViewTransition && typeof document !== "undefined" && "startViewTransition" in document && typeof document.startViewTransition === "function") {
        let startViewTransitionParams;
        if (typeof shouldViewTransition === "object" && this.isViewTransitionTypesSupported) {
          const next = this.latestLocation;
          const prevLocation = this.state.resolvedLocation;
          const resolvedViewTransitionTypes = typeof shouldViewTransition.types === "function" ? shouldViewTransition.types(
            getLocationChangeInfo({
              resolvedLocation: prevLocation,
              location: next
            })
          ) : shouldViewTransition.types;
          startViewTransitionParams = {
            update: fn,
            types: resolvedViewTransitionTypes
          };
        } else {
          startViewTransitionParams = fn;
        }
        document.startViewTransition(startViewTransitionParams);
      } else {
        fn();
      }
    };
    this.updateMatch = (id, updater) => {
      var _a2;
      let updated;
      const isPending = (_a2 = this.state.pendingMatches) == null ? void 0 : _a2.find((d) => d.id === id);
      const isMatched = this.state.matches.find((d) => d.id === id);
      const isCached = this.state.cachedMatches.find((d) => d.id === id);
      const matchesKey = isPending ? "pendingMatches" : isMatched ? "matches" : isCached ? "cachedMatches" : "";
      if (matchesKey) {
        this.__store.setState((s) => {
          var _a22;
          return {
            ...s,
            [matchesKey]: (_a22 = s[matchesKey]) == null ? void 0 : _a22.map(
              (d) => d.id === id ? updated = updater(d) : d
            )
          };
        });
      }
      return updated;
    };
    this.getMatch = (matchId) => {
      return [
        ...this.state.cachedMatches,
        ...this.state.pendingMatches ?? [],
        ...this.state.matches
      ].find((d) => d.id === matchId);
    };
    this.loadMatches = async ({
      location,
      matches,
      preload: allPreload,
      onReady,
      updateMatch = this.updateMatch,
      sync
    }) => {
      let firstBadMatchIndex;
      let rendered = false;
      const triggerOnReady = async () => {
        if (!rendered) {
          rendered = true;
          await (onReady == null ? void 0 : onReady());
        }
      };
      const resolvePreload = (matchId) => {
        return !!(allPreload && !this.state.matches.find((d) => d.id === matchId));
      };
      const handleRedirectAndNotFound = (match, err) => {
        var _a2, _b2, _c2, _d2;
        if (isRedirect(err) || isNotFound(err)) {
          if (isRedirect(err)) {
            if (err.redirectHandled) {
              if (!err.options.reloadDocument) {
                throw err;
              }
            }
          }
          updateMatch(match.id, (prev) => ({
            ...prev,
            status: isRedirect(err) ? "redirected" : isNotFound(err) ? "notFound" : "error",
            isFetching: false,
            error: err,
            beforeLoadPromise: void 0,
            loaderPromise: void 0
          }));
          if (!err.routeId) {
            err.routeId = match.routeId;
          }
          (_a2 = match.beforeLoadPromise) == null ? void 0 : _a2.resolve();
          (_b2 = match.loaderPromise) == null ? void 0 : _b2.resolve();
          (_c2 = match.loadPromise) == null ? void 0 : _c2.resolve();
          if (isRedirect(err)) {
            rendered = true;
            err.options._fromLocation = location;
            err.redirectHandled = true;
            err = this.resolveRedirect(err);
            throw err;
          } else if (isNotFound(err)) {
            this._handleNotFound(matches, err, {
              updateMatch
            });
            (_d2 = this.serverSsr) == null ? void 0 : _d2.onMatchSettled({
              router: this,
              match: this.getMatch(match.id)
            });
            throw err;
          }
        }
      };
      try {
        await new Promise((resolveAll, rejectAll) => {
          ;
          (async () => {
            var _a2, _b2, _c2, _d2;
            try {
              const handleSerialError = (index2, err, routerCode) => {
                var _a22, _b22;
                const { id: matchId, routeId } = matches[index2];
                const route = this.looseRoutesById[routeId];
                if (err instanceof Promise) {
                  throw err;
                }
                err.routerCode = routerCode;
                firstBadMatchIndex = firstBadMatchIndex ?? index2;
                handleRedirectAndNotFound(this.getMatch(matchId), err);
                try {
                  (_b22 = (_a22 = route.options).onError) == null ? void 0 : _b22.call(_a22, err);
                } catch (errorHandlerErr) {
                  err = errorHandlerErr;
                  handleRedirectAndNotFound(this.getMatch(matchId), err);
                }
                updateMatch(matchId, (prev) => {
                  var _a3, _b3;
                  (_a3 = prev.beforeLoadPromise) == null ? void 0 : _a3.resolve();
                  (_b3 = prev.loadPromise) == null ? void 0 : _b3.resolve();
                  return {
                    ...prev,
                    error: err,
                    status: "error",
                    isFetching: false,
                    updatedAt: Date.now(),
                    abortController: new AbortController(),
                    beforeLoadPromise: void 0
                  };
                });
              };
              for (const [index2, { id: matchId, routeId }] of matches.entries()) {
                const existingMatch = this.getMatch(matchId);
                const parentMatchId = (_a2 = matches[index2 - 1]) == null ? void 0 : _a2.id;
                const route = this.looseRoutesById[routeId];
                const pendingMs = route.options.pendingMs ?? this.options.defaultPendingMs;
                const shouldPending = !!(onReady && !this.isServer && !resolvePreload(matchId) && (route.options.loader || route.options.beforeLoad || routeNeedsPreload(route)) && typeof pendingMs === "number" && pendingMs !== Infinity && (route.options.pendingComponent ?? ((_b2 = this.options) == null ? void 0 : _b2.defaultPendingComponent)));
                let executeBeforeLoad = true;
                if (
                  // If we are in the middle of a load, either of these will be present
                  // (not to be confused with `loadPromise`, which is always defined)
                  existingMatch.beforeLoadPromise || existingMatch.loaderPromise
                ) {
                  if (shouldPending) {
                    setTimeout(() => {
                      try {
                        triggerOnReady();
                      } catch {
                      }
                    }, pendingMs);
                  }
                  await existingMatch.beforeLoadPromise;
                  executeBeforeLoad = this.getMatch(matchId).status !== "success";
                }
                if (executeBeforeLoad) {
                  try {
                    updateMatch(matchId, (prev) => {
                      const prevLoadPromise = prev.loadPromise;
                      return {
                        ...prev,
                        loadPromise: createControlledPromise(() => {
                          prevLoadPromise == null ? void 0 : prevLoadPromise.resolve();
                        }),
                        beforeLoadPromise: createControlledPromise()
                      };
                    });
                    const abortController = new AbortController();
                    let pendingTimeout;
                    if (shouldPending) {
                      pendingTimeout = setTimeout(() => {
                        try {
                          triggerOnReady();
                        } catch {
                        }
                      }, pendingMs);
                    }
                    const { paramsError, searchError } = this.getMatch(matchId);
                    if (paramsError) {
                      handleSerialError(index2, paramsError, "PARSE_PARAMS");
                    }
                    if (searchError) {
                      handleSerialError(index2, searchError, "VALIDATE_SEARCH");
                    }
                    const getParentMatchContext = () => parentMatchId ? this.getMatch(parentMatchId).context : this.options.context ?? {};
                    updateMatch(matchId, (prev) => ({
                      ...prev,
                      isFetching: "beforeLoad",
                      fetchCount: prev.fetchCount + 1,
                      abortController,
                      pendingTimeout,
                      context: {
                        ...getParentMatchContext(),
                        ...prev.__routeContext
                      }
                    }));
                    const { search, params, context, cause } = this.getMatch(matchId);
                    const preload = resolvePreload(matchId);
                    const beforeLoadFnContext = {
                      search,
                      abortController,
                      params,
                      preload,
                      context,
                      location,
                      navigate: (opts) => this.navigate({ ...opts, _fromLocation: location }),
                      buildLocation: this.buildLocation,
                      cause: preload ? "preload" : cause,
                      matches
                    };
                    const beforeLoadContext = await ((_d2 = (_c2 = route.options).beforeLoad) == null ? void 0 : _d2.call(_c2, beforeLoadFnContext)) ?? {};
                    if (isRedirect(beforeLoadContext) || isNotFound(beforeLoadContext)) {
                      handleSerialError(index2, beforeLoadContext, "BEFORE_LOAD");
                    }
                    updateMatch(matchId, (prev) => {
                      return {
                        ...prev,
                        __beforeLoadContext: beforeLoadContext,
                        context: {
                          ...getParentMatchContext(),
                          ...prev.__routeContext,
                          ...beforeLoadContext
                        },
                        abortController
                      };
                    });
                  } catch (err) {
                    handleSerialError(index2, err, "BEFORE_LOAD");
                  }
                  updateMatch(matchId, (prev) => {
                    var _a22;
                    (_a22 = prev.beforeLoadPromise) == null ? void 0 : _a22.resolve();
                    return {
                      ...prev,
                      beforeLoadPromise: void 0,
                      isFetching: false
                    };
                  });
                }
              }
              const validResolvedMatches = matches.slice(0, firstBadMatchIndex);
              const matchPromises = [];
              validResolvedMatches.forEach(({ id: matchId, routeId }, index2) => {
                matchPromises.push(
                  (async () => {
                    const { loaderPromise: prevLoaderPromise } = this.getMatch(matchId);
                    let loaderShouldRunAsync = false;
                    let loaderIsRunningAsync = false;
                    if (prevLoaderPromise) {
                      await prevLoaderPromise;
                      const match = this.getMatch(matchId);
                      if (match.error) {
                        handleRedirectAndNotFound(match, match.error);
                      }
                    } else {
                      const parentMatchPromise = matchPromises[index2 - 1];
                      const route = this.looseRoutesById[routeId];
                      const getLoaderContext = () => {
                        const {
                          params,
                          loaderDeps,
                          abortController,
                          context,
                          cause
                        } = this.getMatch(matchId);
                        const preload2 = resolvePreload(matchId);
                        return {
                          params,
                          deps: loaderDeps,
                          preload: !!preload2,
                          parentMatchPromise,
                          abortController,
                          context,
                          location,
                          navigate: (opts) => this.navigate({ ...opts, _fromLocation: location }),
                          cause: preload2 ? "preload" : cause,
                          route
                        };
                      };
                      const age = Date.now() - this.getMatch(matchId).updatedAt;
                      const preload = resolvePreload(matchId);
                      const staleAge = preload ? route.options.preloadStaleTime ?? this.options.defaultPreloadStaleTime ?? 3e4 : route.options.staleTime ?? this.options.defaultStaleTime ?? 0;
                      const shouldReloadOption = route.options.shouldReload;
                      const shouldReload = typeof shouldReloadOption === "function" ? shouldReloadOption(getLoaderContext()) : shouldReloadOption;
                      updateMatch(matchId, (prev) => ({
                        ...prev,
                        loaderPromise: createControlledPromise(),
                        preload: !!preload && !this.state.matches.find((d) => d.id === matchId)
                      }));
                      const executeHead = async () => {
                        var _a22, _b22, _c22, _d22, _e2, _f2;
                        const match = this.getMatch(matchId);
                        if (!match) {
                          return;
                        }
                        const assetContext = {
                          matches,
                          match,
                          params: match.params,
                          loaderData: match.loaderData
                        };
                        const headFnContent = await ((_b22 = (_a22 = route.options).head) == null ? void 0 : _b22.call(_a22, assetContext));
                        const meta = headFnContent == null ? void 0 : headFnContent.meta;
                        const links = headFnContent == null ? void 0 : headFnContent.links;
                        const headScripts = headFnContent == null ? void 0 : headFnContent.scripts;
                        const scripts = await ((_d22 = (_c22 = route.options).scripts) == null ? void 0 : _d22.call(_c22, assetContext));
                        const headers = await ((_f2 = (_e2 = route.options).headers) == null ? void 0 : _f2.call(_e2, assetContext));
                        return { meta, links, headScripts, headers, scripts };
                      };
                      const runLoader = async () => {
                        var _a22, _b22, _c22, _d22, _e2;
                        try {
                          const potentialPendingMinPromise = async () => {
                            const latestMatch = this.getMatch(matchId);
                            if (latestMatch.minPendingPromise) {
                              await latestMatch.minPendingPromise;
                            }
                          };
                          try {
                            this.loadRouteChunk(route);
                            updateMatch(matchId, (prev) => ({
                              ...prev,
                              isFetching: "loader"
                            }));
                            const loaderData = await ((_b22 = (_a22 = route.options).loader) == null ? void 0 : _b22.call(_a22, getLoaderContext()));
                            handleRedirectAndNotFound(
                              this.getMatch(matchId),
                              loaderData
                            );
                            await route._lazyPromise;
                            await potentialPendingMinPromise();
                            await route._componentsPromise;
                            updateMatch(matchId, (prev) => ({
                              ...prev,
                              error: void 0,
                              status: "success",
                              isFetching: false,
                              updatedAt: Date.now(),
                              loaderData
                            }));
                            const head = await executeHead();
                            updateMatch(matchId, (prev) => ({
                              ...prev,
                              ...head
                            }));
                          } catch (e) {
                            let error = e;
                            await potentialPendingMinPromise();
                            handleRedirectAndNotFound(this.getMatch(matchId), e);
                            try {
                              (_d22 = (_c22 = route.options).onError) == null ? void 0 : _d22.call(_c22, e);
                            } catch (onErrorError) {
                              error = onErrorError;
                              handleRedirectAndNotFound(
                                this.getMatch(matchId),
                                onErrorError
                              );
                            }
                            const head = await executeHead();
                            updateMatch(matchId, (prev) => ({
                              ...prev,
                              error,
                              status: "error",
                              isFetching: false,
                              ...head
                            }));
                          }
                          (_e2 = this.serverSsr) == null ? void 0 : _e2.onMatchSettled({
                            router: this,
                            match: this.getMatch(matchId)
                          });
                        } catch (err) {
                          const head = await executeHead();
                          updateMatch(matchId, (prev) => ({
                            ...prev,
                            loaderPromise: void 0,
                            ...head
                          }));
                          handleRedirectAndNotFound(this.getMatch(matchId), err);
                        }
                      };
                      const { status, invalid } = this.getMatch(matchId);
                      loaderShouldRunAsync = status === "success" && (invalid || (shouldReload ?? age > staleAge));
                      if (preload && route.options.preload === false) {
                      } else if (loaderShouldRunAsync && !sync) {
                        loaderIsRunningAsync = true;
                        (async () => {
                          try {
                            await runLoader();
                            const { loaderPromise, loadPromise } = this.getMatch(matchId);
                            loaderPromise == null ? void 0 : loaderPromise.resolve();
                            loadPromise == null ? void 0 : loadPromise.resolve();
                            updateMatch(matchId, (prev) => ({
                              ...prev,
                              loaderPromise: void 0
                            }));
                          } catch (err) {
                            if (isRedirect(err)) {
                              await this.navigate(err.options);
                            }
                          }
                        })();
                      } else if (status !== "success" || loaderShouldRunAsync && sync) {
                        await runLoader();
                      } else {
                        const head = await executeHead();
                        updateMatch(matchId, (prev) => ({
                          ...prev,
                          ...head
                        }));
                      }
                    }
                    if (!loaderIsRunningAsync) {
                      const { loaderPromise, loadPromise } = this.getMatch(matchId);
                      loaderPromise == null ? void 0 : loaderPromise.resolve();
                      loadPromise == null ? void 0 : loadPromise.resolve();
                    }
                    updateMatch(matchId, (prev) => ({
                      ...prev,
                      isFetching: loaderIsRunningAsync ? prev.isFetching : false,
                      loaderPromise: loaderIsRunningAsync ? prev.loaderPromise : void 0,
                      invalid: false
                    }));
                    return this.getMatch(matchId);
                  })()
                );
              });
              await Promise.all(matchPromises);
              resolveAll();
            } catch (err) {
              rejectAll(err);
            }
          })();
        });
        await triggerOnReady();
      } catch (err) {
        if (isRedirect(err) || isNotFound(err)) {
          if (isNotFound(err) && !allPreload) {
            await triggerOnReady();
          }
          throw err;
        }
      }
      return matches;
    };
    this.invalidate = (opts) => {
      const invalidate = (d) => {
        var _a2;
        if (((_a2 = opts == null ? void 0 : opts.filter) == null ? void 0 : _a2.call(opts, d)) ?? true) {
          return {
            ...d,
            invalid: true,
            ...d.status === "error" ? { status: "pending", error: void 0 } : {}
          };
        }
        return d;
      };
      this.__store.setState((s) => {
        var _a2;
        return {
          ...s,
          matches: s.matches.map(invalidate),
          cachedMatches: s.cachedMatches.map(invalidate),
          pendingMatches: (_a2 = s.pendingMatches) == null ? void 0 : _a2.map(invalidate)
        };
      });
      return this.load({ sync: opts == null ? void 0 : opts.sync });
    };
    this.resolveRedirect = (redirect) => {
      if (!redirect.options.href) {
        redirect.options.href = this.buildLocation(redirect.options).href;
        redirect.headers.set("Location", redirect.options.href);
      }
      if (!redirect.headers.get("Location")) {
        redirect.headers.set("Location", redirect.options.href);
      }
      return redirect;
    };
    this.clearCache = (opts) => {
      const filter = opts == null ? void 0 : opts.filter;
      if (filter !== void 0) {
        this.__store.setState((s) => {
          return {
            ...s,
            cachedMatches: s.cachedMatches.filter(
              (m) => !filter(m)
            )
          };
        });
      } else {
        this.__store.setState((s) => {
          return {
            ...s,
            cachedMatches: []
          };
        });
      }
    };
    this.clearExpiredCache = () => {
      const filter = (d) => {
        const route = this.looseRoutesById[d.routeId];
        if (!route.options.loader) {
          return true;
        }
        const gcTime = (d.preload ? route.options.preloadGcTime ?? this.options.defaultPreloadGcTime : route.options.gcTime ?? this.options.defaultGcTime) ?? 5 * 60 * 1e3;
        return !(d.status !== "error" && Date.now() - d.updatedAt < gcTime);
      };
      this.clearCache({ filter });
    };
    this.loadRouteChunk = (route) => {
      if (route._lazyPromise === void 0) {
        if (route.lazyFn) {
          route._lazyPromise = route.lazyFn().then((lazyRoute) => {
            const { id: _id, ...options2 } = lazyRoute.options;
            Object.assign(route.options, options2);
          });
        } else {
          route._lazyPromise = Promise.resolve();
        }
      }
      if (route._componentsPromise === void 0) {
        route._componentsPromise = route._lazyPromise.then(
          () => Promise.all(
            componentTypes.map(async (type) => {
              const component = route.options[type];
              if (component == null ? void 0 : component.preload) {
                await component.preload();
              }
            })
          )
        );
      }
      return route._componentsPromise;
    };
    this.preloadRoute = async (opts) => {
      const next = this.buildLocation(opts);
      let matches = this.matchRoutes(next, {
        throwOnError: true,
        preload: true,
        dest: opts
      });
      const activeMatchIds = new Set(
        [...this.state.matches, ...this.state.pendingMatches ?? []].map(
          (d) => d.id
        )
      );
      const loadedMatchIds = /* @__PURE__ */ new Set([
        ...activeMatchIds,
        ...this.state.cachedMatches.map((d) => d.id)
      ]);
      batch$1(() => {
        matches.forEach((match) => {
          if (!loadedMatchIds.has(match.id)) {
            this.__store.setState((s) => ({
              ...s,
              cachedMatches: [...s.cachedMatches, match]
            }));
          }
        });
      });
      try {
        matches = await this.loadMatches({
          matches,
          location: next,
          preload: true,
          updateMatch: (id, updater) => {
            if (activeMatchIds.has(id)) {
              matches = matches.map((d) => d.id === id ? updater(d) : d);
            } else {
              this.updateMatch(id, updater);
            }
          }
        });
        return matches;
      } catch (err) {
        if (isRedirect(err)) {
          if (err.options.reloadDocument) {
            return void 0;
          }
          return await this.preloadRoute({
            ...err.options,
            _fromLocation: next
          });
        }
        if (!isNotFound(err)) {
          console.error(err);
        }
        return void 0;
      }
    };
    this.matchRoute = (location, opts) => {
      const matchLocation = {
        ...location,
        to: location.to ? this.resolvePathWithBase(
          location.from || "",
          location.to
        ) : void 0,
        params: location.params || {},
        leaveParams: true
      };
      const next = this.buildLocation(matchLocation);
      if ((opts == null ? void 0 : opts.pending) && this.state.status !== "pending") {
        return false;
      }
      const pending = (opts == null ? void 0 : opts.pending) === void 0 ? !this.state.isLoading : opts.pending;
      const baseLocation = pending ? this.latestLocation : this.state.resolvedLocation || this.state.location;
      const match = matchPathname(this.basepath, baseLocation.pathname, {
        ...opts,
        to: next.pathname
      });
      if (!match) {
        return false;
      }
      if (location.params) {
        if (!deepEqual(match, location.params, { partial: true })) {
          return false;
        }
      }
      if (match && ((opts == null ? void 0 : opts.includeSearch) ?? true)) {
        return deepEqual(baseLocation.search, next.search, { partial: true }) ? match : false;
      }
      return match;
    };
    this._handleNotFound = (matches, err, {
      updateMatch = this.updateMatch
    } = {}) => {
      var _a2;
      const routeCursor = this.routesById[err.routeId ?? ""] ?? this.routeTree;
      const matchesByRouteId = {};
      for (const match of matches) {
        matchesByRouteId[match.routeId] = match;
      }
      if (!routeCursor.options.notFoundComponent && ((_a2 = this.options) == null ? void 0 : _a2.defaultNotFoundComponent)) {
        routeCursor.options.notFoundComponent = this.options.defaultNotFoundComponent;
      }
      invariant(
        routeCursor.options.notFoundComponent);
      const matchForRoute = matchesByRouteId[routeCursor.id];
      invariant(
        matchForRoute,
        "Could not find match for route: " + routeCursor.id
      );
      updateMatch(matchForRoute.id, (prev) => ({
        ...prev,
        status: "notFound",
        error: err,
        isFetching: false
      }));
      if (err.routerCode === "BEFORE_LOAD" && routeCursor.parentRoute) {
        err.routeId = routeCursor.parentRoute.id;
        this._handleNotFound(matches, err, {
          updateMatch
        });
      }
    };
    this.hasNotFoundMatch = () => {
      return this.__store.state.matches.some(
        (d) => d.status === "notFound" || d.globalNotFound
      );
    };
    this.update({
      defaultPreloadDelay: 50,
      defaultPendingMs: 1e3,
      defaultPendingMinMs: 500,
      context: void 0,
      ...options,
      caseSensitive: options.caseSensitive ?? false,
      notFoundMode: options.notFoundMode ?? "fuzzy",
      stringifySearch: options.stringifySearch ?? defaultStringifySearch,
      parseSearch: options.parseSearch ?? defaultParseSearch
    });
    if (typeof document !== "undefined") {
      window.__TSR_ROUTER__ = this;
    }
  }
  get state() {
    return this.__store.state;
  }
  get looseRoutesById() {
    return this.routesById;
  }
  matchRoutesInternal(next, opts) {
    var _a2;
    const { foundRoute, matchedRoutes, routeParams } = this.getMatchedRoutes(
      next.pathname,
      (_a2 = opts == null ? void 0 : opts.dest) == null ? void 0 : _a2.to
    );
    let isGlobalNotFound = false;
    if (
      // If we found a route, and it's not an index route and we have left over path
      foundRoute ? foundRoute.path !== "/" && routeParams["**"] : (
        // Or if we didn't find a route and we have left over path
        trimPathRight(next.pathname)
      )
    ) {
      if (this.options.notFoundRoute) {
        matchedRoutes.push(this.options.notFoundRoute);
      } else {
        isGlobalNotFound = true;
      }
    }
    const globalNotFoundRouteId = (() => {
      if (!isGlobalNotFound) {
        return void 0;
      }
      if (this.options.notFoundMode !== "root") {
        for (let i = matchedRoutes.length - 1; i >= 0; i--) {
          const route = matchedRoutes[i];
          if (route.children) {
            return route.id;
          }
        }
      }
      return rootRouteId;
    })();
    const parseErrors = matchedRoutes.map((route) => {
      var _a22;
      let parsedParamsError;
      const parseParams = ((_a22 = route.options.params) == null ? void 0 : _a22.parse) ?? route.options.parseParams;
      if (parseParams) {
        try {
          const parsedParams = parseParams(routeParams);
          Object.assign(routeParams, parsedParams);
        } catch (err) {
          parsedParamsError = new PathParamError(err.message, {
            cause: err
          });
          if (opts == null ? void 0 : opts.throwOnError) {
            throw parsedParamsError;
          }
          return parsedParamsError;
        }
      }
      return;
    });
    const matches = [];
    const getParentContext = (parentMatch) => {
      const parentMatchId = parentMatch == null ? void 0 : parentMatch.id;
      const parentContext = !parentMatchId ? this.options.context ?? {} : parentMatch.context ?? this.options.context ?? {};
      return parentContext;
    };
    matchedRoutes.forEach((route, index2) => {
      var _a22, _b2;
      const parentMatch = matches[index2 - 1];
      const [preMatchSearch, strictMatchSearch, searchError] = (() => {
        const parentSearch = (parentMatch == null ? void 0 : parentMatch.search) ?? next.search;
        const parentStrictSearch = (parentMatch == null ? void 0 : parentMatch._strictSearch) ?? {};
        try {
          const strictSearch = validateSearch(route.options.validateSearch, { ...parentSearch }) ?? {};
          return [
            {
              ...parentSearch,
              ...strictSearch
            },
            { ...parentStrictSearch, ...strictSearch },
            void 0
          ];
        } catch (err) {
          let searchParamError = err;
          if (!(err instanceof SearchParamError)) {
            searchParamError = new SearchParamError(err.message, {
              cause: err
            });
          }
          if (opts == null ? void 0 : opts.throwOnError) {
            throw searchParamError;
          }
          return [parentSearch, {}, searchParamError];
        }
      })();
      const loaderDeps = ((_b2 = (_a22 = route.options).loaderDeps) == null ? void 0 : _b2.call(_a22, {
        search: preMatchSearch
      })) ?? "";
      const loaderDepsHash = loaderDeps ? JSON.stringify(loaderDeps) : "";
      const { usedParams, interpolatedPath } = interpolatePath({
        path: route.fullPath,
        params: routeParams,
        decodeCharMap: this.pathParamsDecodeCharMap
      });
      const matchId = interpolatePath({
        path: route.id,
        params: routeParams,
        leaveWildcards: true,
        decodeCharMap: this.pathParamsDecodeCharMap
      }).interpolatedPath + loaderDepsHash;
      const existingMatch = this.getMatch(matchId);
      const previousMatch = this.state.matches.find(
        (d) => d.routeId === route.id
      );
      const cause = previousMatch ? "stay" : "enter";
      let match;
      if (existingMatch) {
        match = {
          ...existingMatch,
          cause,
          params: previousMatch ? replaceEqualDeep$1(previousMatch.params, routeParams) : routeParams,
          _strictParams: usedParams,
          search: previousMatch ? replaceEqualDeep$1(previousMatch.search, preMatchSearch) : replaceEqualDeep$1(existingMatch.search, preMatchSearch),
          _strictSearch: strictMatchSearch
        };
      } else {
        const status = route.options.loader || route.options.beforeLoad || route.lazyFn || routeNeedsPreload(route) ? "pending" : "success";
        match = {
          id: matchId,
          index: index2,
          routeId: route.id,
          params: previousMatch ? replaceEqualDeep$1(previousMatch.params, routeParams) : routeParams,
          _strictParams: usedParams,
          pathname: joinPaths([this.basepath, interpolatedPath]),
          updatedAt: Date.now(),
          search: previousMatch ? replaceEqualDeep$1(previousMatch.search, preMatchSearch) : preMatchSearch,
          _strictSearch: strictMatchSearch,
          searchError: void 0,
          status,
          isFetching: false,
          error: void 0,
          paramsError: parseErrors[index2],
          __routeContext: {},
          __beforeLoadContext: {},
          context: {},
          abortController: new AbortController(),
          fetchCount: 0,
          cause,
          loaderDeps: previousMatch ? replaceEqualDeep$1(previousMatch.loaderDeps, loaderDeps) : loaderDeps,
          invalid: false,
          preload: false,
          links: void 0,
          scripts: void 0,
          headScripts: void 0,
          meta: void 0,
          staticData: route.options.staticData || {},
          loadPromise: createControlledPromise(),
          fullPath: route.fullPath
        };
      }
      if (!(opts == null ? void 0 : opts.preload)) {
        match.globalNotFound = globalNotFoundRouteId === route.id;
      }
      match.searchError = searchError;
      const parentContext = getParentContext(parentMatch);
      match.context = {
        ...parentContext,
        ...match.__routeContext,
        ...match.__beforeLoadContext
      };
      matches.push(match);
    });
    matches.forEach((match, index2) => {
      var _a22, _b2;
      const route = this.looseRoutesById[match.routeId];
      const existingMatch = this.getMatch(match.id);
      if (!existingMatch && (opts == null ? void 0 : opts._buildLocation) !== true) {
        const parentMatch = matches[index2 - 1];
        const parentContext = getParentContext(parentMatch);
        const contextFnContext = {
          deps: match.loaderDeps,
          params: match.params,
          context: parentContext,
          location: next,
          navigate: (opts2) => this.navigate({ ...opts2, _fromLocation: next }),
          buildLocation: this.buildLocation,
          cause: match.cause,
          abortController: match.abortController,
          preload: !!match.preload,
          matches
        };
        match.__routeContext = ((_b2 = (_a22 = route.options).context) == null ? void 0 : _b2.call(_a22, contextFnContext)) ?? {};
        match.context = {
          ...parentContext,
          ...match.__routeContext,
          ...match.__beforeLoadContext
        };
      }
    });
    return matches;
  }
}
class SearchParamError extends Error {
}
class PathParamError extends Error {
}
function getInitialRouterState(location) {
  return {
    loadedAt: 0,
    isLoading: false,
    isTransitioning: false,
    status: "idle",
    resolvedLocation: void 0,
    location,
    matches: [],
    pendingMatches: [],
    cachedMatches: [],
    statusCode: 200
  };
}
function validateSearch(validateSearch2, input) {
  if (validateSearch2 == null) return {};
  if ("~standard" in validateSearch2) {
    const result = validateSearch2["~standard"].validate(input);
    if (result instanceof Promise)
      throw new SearchParamError("Async validation not supported");
    if (result.issues)
      throw new SearchParamError(JSON.stringify(result.issues, void 0, 2), {
        cause: result
      });
    return result.value;
  }
  if ("parse" in validateSearch2) {
    return validateSearch2.parse(input);
  }
  if (typeof validateSearch2 === "function") {
    return validateSearch2(input);
  }
  return {};
}
const componentTypes = [
  "component",
  "errorComponent",
  "pendingComponent",
  "notFoundComponent"
];
function routeNeedsPreload(route) {
  var _a2;
  for (const componentType of componentTypes) {
    if ((_a2 = route.options[componentType]) == null ? void 0 : _a2.preload) {
      return true;
    }
  }
  return false;
}
function processRouteTree({
  routeTree: routeTree2,
  initRoute
}) {
  const routesById = {};
  const routesByPath = {};
  const recurseRoutes = (childRoutes) => {
    childRoutes.forEach((childRoute, i) => {
      initRoute == null ? void 0 : initRoute(childRoute, i);
      const existingRoute = routesById[childRoute.id];
      invariant(
        !existingRoute,
        `Duplicate routes found with id: ${String(childRoute.id)}`
      );
      routesById[childRoute.id] = childRoute;
      if (!childRoute.isRoot && childRoute.path) {
        const trimmedFullPath = trimPathRight(childRoute.fullPath);
        if (!routesByPath[trimmedFullPath] || childRoute.fullPath.endsWith("/")) {
          routesByPath[trimmedFullPath] = childRoute;
        }
      }
      const children2 = childRoute.children;
      if (children2 == null ? void 0 : children2.length) {
        recurseRoutes(children2);
      }
    });
  };
  recurseRoutes([routeTree2]);
  const scoredRoutes = [];
  const routes = Object.values(routesById);
  routes.forEach((d, i) => {
    var _a2;
    if (d.isRoot || !d.path) {
      return;
    }
    const trimmed = trimPathLeft(d.fullPath);
    const parsed = parsePathname(trimmed);
    while (parsed.length > 1 && ((_a2 = parsed[0]) == null ? void 0 : _a2.value) === "/") {
      parsed.shift();
    }
    const scores = parsed.map((segment) => {
      if (segment.value === "/") {
        return 0.75;
      }
      if (segment.type === "param" && segment.prefixSegment && segment.suffixSegment) {
        return 0.55;
      }
      if (segment.type === "param" && segment.prefixSegment) {
        return 0.52;
      }
      if (segment.type === "param" && segment.suffixSegment) {
        return 0.51;
      }
      if (segment.type === "param") {
        return 0.5;
      }
      if (segment.type === "wildcard" && segment.prefixSegment && segment.suffixSegment) {
        return 0.3;
      }
      if (segment.type === "wildcard" && segment.prefixSegment) {
        return 0.27;
      }
      if (segment.type === "wildcard" && segment.suffixSegment) {
        return 0.26;
      }
      if (segment.type === "wildcard") {
        return 0.25;
      }
      return 1;
    });
    scoredRoutes.push({ child: d, trimmed, parsed, index: i, scores });
  });
  const flatRoutes = scoredRoutes.sort((a, b) => {
    const minLength = Math.min(a.scores.length, b.scores.length);
    for (let i = 0; i < minLength; i++) {
      if (a.scores[i] !== b.scores[i]) {
        return b.scores[i] - a.scores[i];
      }
    }
    if (a.scores.length !== b.scores.length) {
      return b.scores.length - a.scores.length;
    }
    for (let i = 0; i < minLength; i++) {
      if (a.parsed[i].value !== b.parsed[i].value) {
        return a.parsed[i].value > b.parsed[i].value ? 1 : -1;
      }
    }
    return a.index - b.index;
  }).map((d, i) => {
    d.child.rank = i;
    return d.child;
  });
  return { routesById, routesByPath, flatRoutes };
}
function getMatchedRoutes({
  pathname,
  routePathname,
  basepath,
  caseSensitive,
  routesByPath,
  routesById,
  flatRoutes
}) {
  let routeParams = {};
  const trimmedPath = trimPathRight(pathname);
  const getMatchedParams = (route) => {
    var _a2;
    const result = matchPathname(basepath, trimmedPath, {
      to: route.fullPath,
      caseSensitive: ((_a2 = route.options) == null ? void 0 : _a2.caseSensitive) ?? caseSensitive,
      fuzzy: true
    });
    return result;
  };
  let foundRoute = routePathname !== void 0 ? routesByPath[routePathname] : void 0;
  if (foundRoute) {
    routeParams = getMatchedParams(foundRoute);
  } else {
    foundRoute = flatRoutes.find((route) => {
      const matchedParams = getMatchedParams(route);
      if (matchedParams) {
        routeParams = matchedParams;
        return true;
      }
      return false;
    });
  }
  let routeCursor = foundRoute || routesById[rootRouteId];
  const matchedRoutes = [routeCursor];
  while (routeCursor.parentRoute) {
    routeCursor = routeCursor.parentRoute;
    matchedRoutes.unshift(routeCursor);
  }
  return { matchedRoutes, routeParams, foundRoute };
}
function applySearchMiddleware({
  search,
  dest,
  destRoutes,
  _includeValidateSearch
}) {
  const allMiddlewares = destRoutes.reduce(
    (acc, route) => {
      var _a2;
      const middlewares = [];
      if ("search" in route.options) {
        if ((_a2 = route.options.search) == null ? void 0 : _a2.middlewares) {
          middlewares.push(...route.options.search.middlewares);
        }
      } else if (route.options.preSearchFilters || route.options.postSearchFilters) {
        const legacyMiddleware = ({
          search: search2,
          next
        }) => {
          let nextSearch = search2;
          if ("preSearchFilters" in route.options && route.options.preSearchFilters) {
            nextSearch = route.options.preSearchFilters.reduce(
              (prev, next2) => next2(prev),
              search2
            );
          }
          const result = next(nextSearch);
          if ("postSearchFilters" in route.options && route.options.postSearchFilters) {
            return route.options.postSearchFilters.reduce(
              (prev, next2) => next2(prev),
              result
            );
          }
          return result;
        };
        middlewares.push(legacyMiddleware);
      }
      if (_includeValidateSearch && route.options.validateSearch) {
        const validate = ({ search: search2, next }) => {
          const result = next(search2);
          try {
            const validatedSearch = {
              ...result,
              ...validateSearch(route.options.validateSearch, result) ?? {}
            };
            return validatedSearch;
          } catch {
            return result;
          }
        };
        middlewares.push(validate);
      }
      return acc.concat(middlewares);
    },
    []
  ) ?? [];
  const final = ({ search: search2 }) => {
    if (!dest.search) {
      return {};
    }
    if (dest.search === true) {
      return search2;
    }
    return functionalUpdate$1(dest.search, search2);
  };
  allMiddlewares.push(final);
  const applyNext = (index2, currentSearch) => {
    if (index2 >= allMiddlewares.length) {
      return currentSearch;
    }
    const middleware = allMiddlewares[index2];
    const next = (newSearch) => {
      return applyNext(index2 + 1, newSearch);
    };
    return middleware({ search: currentSearch, next });
  };
  return applyNext(0, search);
}
const TSR_DEFERRED_PROMISE = Symbol.for("TSR_DEFERRED_PROMISE");
function defer(_promise, options) {
  const promise = _promise;
  if (promise[TSR_DEFERRED_PROMISE]) {
    return promise;
  }
  promise[TSR_DEFERRED_PROMISE] = { status: "pending" };
  promise.then((data) => {
    promise[TSR_DEFERRED_PROMISE].status = "success";
    promise[TSR_DEFERRED_PROMISE].data = data;
  }).catch((error) => {
    promise[TSR_DEFERRED_PROMISE].status = "error";
    promise[TSR_DEFERRED_PROMISE].error = {
      data: defaultSerializeError(error),
      __isServerError: true
    };
  });
  return promise;
}
const preloadWarning = "Error preloading route! ☝️";
class BaseRoute {
  constructor(options) {
    this.init = (opts) => {
      var _a2, _b2;
      this.originalIndex = opts.originalIndex;
      const options2 = this.options;
      const isRoot = !(options2 == null ? void 0 : options2.path) && !(options2 == null ? void 0 : options2.id);
      this.parentRoute = (_b2 = (_a2 = this.options).getParentRoute) == null ? void 0 : _b2.call(_a2);
      if (isRoot) {
        this._path = rootRouteId;
      } else if (!this.parentRoute) {
        invariant(
          false);
      }
      let path = isRoot ? rootRouteId : options2 == null ? void 0 : options2.path;
      if (path && path !== "/") {
        path = trimPathLeft(path);
      }
      const customId = (options2 == null ? void 0 : options2.id) || path;
      let id = isRoot ? rootRouteId : joinPaths([
        this.parentRoute.id === rootRouteId ? "" : this.parentRoute.id,
        customId
      ]);
      if (path === rootRouteId) {
        path = "/";
      }
      if (id !== rootRouteId) {
        id = joinPaths(["/", id]);
      }
      const fullPath = id === rootRouteId ? "/" : joinPaths([this.parentRoute.fullPath, path]);
      this._path = path;
      this._id = id;
      this._fullPath = fullPath;
      this._to = fullPath;
      this._ssr = (options2 == null ? void 0 : options2.ssr) ?? opts.defaultSsr ?? true;
    };
    this.clone = (other) => {
      this._path = other._path;
      this._id = other._id;
      this._fullPath = other._fullPath;
      this._to = other._to;
      this._ssr = other._ssr;
      this.options.getParentRoute = other.options.getParentRoute;
      this.children = other.children;
    };
    this.addChildren = (children2) => {
      return this._addFileChildren(children2);
    };
    this._addFileChildren = (children2) => {
      if (Array.isArray(children2)) {
        this.children = children2;
      }
      if (typeof children2 === "object" && children2 !== null) {
        this.children = Object.values(children2);
      }
      return this;
    };
    this._addFileTypes = () => {
      return this;
    };
    this.updateLoader = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.update = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.lazy = (lazyFn) => {
      this.lazyFn = lazyFn;
      return this;
    };
    this.options = options || {};
    this.isRoot = !(options == null ? void 0 : options.getParentRoute);
    if ((options == null ? void 0 : options.id) && (options == null ? void 0 : options.path)) {
      throw new Error(`Route cannot have both an 'id' and a 'path' option.`);
    }
  }
  get to() {
    return this._to;
  }
  get id() {
    return this._id;
  }
  get path() {
    return this._path;
  }
  get fullPath() {
    return this._fullPath;
  }
  get ssr() {
    return this._ssr;
  }
}
class BaseRootRoute extends BaseRoute {
  constructor(options) {
    super(options);
  }
}
function CatchBoundary(props) {
  const errorComponent = props.errorComponent ?? ErrorComponent;
  return /* @__PURE__ */ jsx(
    CatchBoundaryImpl,
    {
      getResetKey: props.getResetKey,
      onCatch: props.onCatch,
      children: ({ error, reset }) => {
        if (error) {
          return React.createElement(errorComponent, {
            error,
            reset
          });
        }
        return props.children;
      }
    }
  );
}
class CatchBoundaryImpl extends React.Component {
  constructor() {
    super(...arguments);
    this.state = { error: null };
  }
  static getDerivedStateFromProps(props) {
    return { resetKey: props.getResetKey() };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  reset() {
    this.setState({ error: null });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.error && prevState.resetKey !== this.state.resetKey) {
      this.reset();
    }
  }
  componentDidCatch(error, errorInfo) {
    if (this.props.onCatch) {
      this.props.onCatch(error, errorInfo);
    }
  }
  render() {
    return this.props.children({
      error: this.state.resetKey !== this.props.getResetKey() ? null : this.state.error,
      reset: () => {
        this.reset();
      }
    });
  }
}
function ErrorComponent({ error }) {
  const [show, setShow] = React.useState("production" !== "production");
  return /* @__PURE__ */ jsxs("div", { style: { padding: ".5rem", maxWidth: "100%" }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: ".5rem" }, children: [
      /* @__PURE__ */ jsx("strong", { style: { fontSize: "1rem" }, children: "Something went wrong!" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          style: {
            appearance: "none",
            fontSize: ".6em",
            border: "1px solid currentColor",
            padding: ".1rem .2rem",
            fontWeight: "bold",
            borderRadius: ".25rem"
          },
          onClick: () => setShow((d) => !d),
          children: show ? "Hide Error" : "Show Error"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { style: { height: ".25rem" } }),
    show ? /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      "pre",
      {
        style: {
          fontSize: ".7em",
          border: "1px solid red",
          borderRadius: ".25rem",
          padding: ".3rem",
          color: "red",
          overflow: "auto"
        },
        children: error.message ? /* @__PURE__ */ jsx("code", { children: error.message }) : null
      }
    ) }) : null
  ] });
}
function ClientOnly({ children: children2, fallback = null }) {
  return useHydrated() ? /* @__PURE__ */ jsx(React__default.Fragment, { children: children2 }) : /* @__PURE__ */ jsx(React__default.Fragment, { children: fallback });
}
function useHydrated() {
  return React__default.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
function subscribe() {
  return () => {
  };
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var withSelector = { exports: {} };
var withSelector_production = {};
var shim = { exports: {} };
var useSyncExternalStoreShim_production = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredUseSyncExternalStoreShim_production;
function requireUseSyncExternalStoreShim_production() {
  if (hasRequiredUseSyncExternalStoreShim_production) return useSyncExternalStoreShim_production;
  hasRequiredUseSyncExternalStoreShim_production = 1;
  var React2 = React__default;
  React2.useState; React2.useEffect; React2.useLayoutEffect; React2.useDebugValue;
  function useSyncExternalStore$1(subscribe2, getSnapshot) {
    return getSnapshot();
  }
  var shim2 = useSyncExternalStore$1 ;
  useSyncExternalStoreShim_production.useSyncExternalStore = void 0 !== React2.useSyncExternalStore ? React2.useSyncExternalStore : shim2;
  return useSyncExternalStoreShim_production;
}
var hasRequiredShim;
function requireShim() {
  if (hasRequiredShim) return shim.exports;
  hasRequiredShim = 1;
  {
    shim.exports = requireUseSyncExternalStoreShim_production();
  }
  return shim.exports;
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredWithSelector_production;
function requireWithSelector_production() {
  if (hasRequiredWithSelector_production) return withSelector_production;
  hasRequiredWithSelector_production = 1;
  var React2 = React__default, shim2 = requireShim();
  function is(x, y) {
    return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
  }
  var objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = shim2.useSyncExternalStore, useRef2 = React2.useRef, useEffect2 = React2.useEffect, useMemo = React2.useMemo, useDebugValue = React2.useDebugValue;
  withSelector_production.useSyncExternalStoreWithSelector = function(subscribe2, getSnapshot, getServerSnapshot, selector, isEqual) {
    var instRef = useRef2(null);
    if (null === instRef.current) {
      var inst = { hasValue: false, value: null };
      instRef.current = inst;
    } else inst = instRef.current;
    instRef = useMemo(
      function() {
        function memoizedSelector(nextSnapshot) {
          if (!hasMemo) {
            hasMemo = true;
            memoizedSnapshot = nextSnapshot;
            nextSnapshot = selector(nextSnapshot);
            if (void 0 !== isEqual && inst.hasValue) {
              var currentSelection = inst.value;
              if (isEqual(currentSelection, nextSnapshot))
                return memoizedSelection = currentSelection;
            }
            return memoizedSelection = nextSnapshot;
          }
          currentSelection = memoizedSelection;
          if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
          var nextSelection = selector(nextSnapshot);
          if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
            return memoizedSnapshot = nextSnapshot, currentSelection;
          memoizedSnapshot = nextSnapshot;
          return memoizedSelection = nextSelection;
        }
        var hasMemo = false, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
        return [
          function() {
            return memoizedSelector(getSnapshot());
          },
          null === maybeGetServerSnapshot ? void 0 : function() {
            return memoizedSelector(maybeGetServerSnapshot());
          }
        ];
      },
      [getSnapshot, getServerSnapshot, selector, isEqual]
    );
    var value = useSyncExternalStore(subscribe2, instRef[0], instRef[1]);
    useEffect2(
      function() {
        inst.hasValue = true;
        inst.value = value;
      },
      [value]
    );
    useDebugValue(value);
    return value;
  };
  return withSelector_production;
}
var hasRequiredWithSelector;
function requireWithSelector() {
  if (hasRequiredWithSelector) return withSelector.exports;
  hasRequiredWithSelector = 1;
  {
    withSelector.exports = requireWithSelector_production();
  }
  return withSelector.exports;
}
var withSelectorExports = requireWithSelector();
function useStore(store, selector = (d) => d) {
  const slice = withSelectorExports.useSyncExternalStoreWithSelector(
    store.subscribe,
    () => store.state,
    () => store.state,
    selector,
    shallow
  );
  return slice;
}
function shallow(objA, objB) {
  if (Object.is(objA, objB)) {
    return true;
  }
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }
  if (objA instanceof Map && objB instanceof Map) {
    if (objA.size !== objB.size) return false;
    for (const [k, v2] of objA) {
      if (!objB.has(k) || !Object.is(v2, objB.get(k))) return false;
    }
    return true;
  }
  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false;
    for (const v2 of objA) {
      if (!objB.has(v2)) return false;
    }
    return true;
  }
  const keysA = Object.keys(objA);
  if (keysA.length !== Object.keys(objB).length) {
    return false;
  }
  for (let i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }
  return true;
}
const routerContext = React.createContext(null);
function getRouterContext() {
  if (typeof document === "undefined") {
    return routerContext;
  }
  if (window.__TSR_ROUTER_CONTEXT__) {
    return window.__TSR_ROUTER_CONTEXT__;
  }
  window.__TSR_ROUTER_CONTEXT__ = routerContext;
  return routerContext;
}
function useRouter(opts) {
  const value = React.useContext(getRouterContext());
  warning(
    !(((opts == null ? void 0 : opts.warn) ?? true) && !value));
  return value;
}
function useRouterState(opts) {
  const contextRouter = useRouter({
    warn: (opts == null ? void 0 : opts.router) === void 0
  });
  const router = (opts == null ? void 0 : opts.router) || contextRouter;
  const previousResult = useRef(void 0);
  return useStore(router.__store, (state) => {
    if (opts == null ? void 0 : opts.select) {
      if (opts.structuralSharing ?? router.options.defaultStructuralSharing) {
        const newSlice = replaceEqualDeep$1(
          previousResult.current,
          opts.select(state)
        );
        previousResult.current = newSlice;
        return newSlice;
      }
      return opts.select(state);
    }
    return state;
  });
}
const matchContext = React.createContext(void 0);
const dummyMatchContext = React.createContext(
  void 0
);
function useMatch(opts) {
  const nearestMatchId = React.useContext(
    opts.from ? dummyMatchContext : matchContext
  );
  const matchSelection = useRouterState({
    select: (state) => {
      const match = state.matches.find(
        (d) => opts.from ? opts.from === d.routeId : d.id === nearestMatchId
      );
      invariant(
        !((opts.shouldThrow ?? true) && !match),
        `Could not find ${opts.from ? `an active match from "${opts.from}"` : "a nearest match!"}`
      );
      if (match === void 0) {
        return void 0;
      }
      return opts.select ? opts.select(match) : match;
    },
    structuralSharing: opts.structuralSharing
  });
  return matchSelection;
}
function useLoaderData(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    structuralSharing: opts.structuralSharing,
    select: (s) => {
      return opts.select ? opts.select(s.loaderData) : s.loaderData;
    }
  });
}
function useLoaderDeps(opts) {
  const { select, ...rest } = opts;
  return useMatch({
    ...rest,
    select: (s) => {
      return select ? select(s.loaderDeps) : s.loaderDeps;
    }
  });
}
function useParams(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    shouldThrow: opts.shouldThrow,
    structuralSharing: opts.structuralSharing,
    select: (match) => {
      return opts.select ? opts.select(match.params) : match.params;
    }
  });
}
function useSearch(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    shouldThrow: opts.shouldThrow,
    structuralSharing: opts.structuralSharing,
    select: (match) => {
      return opts.select ? opts.select(match.search) : match.search;
    }
  });
}
function useNavigate(_defaultOpts) {
  const { navigate, state } = useRouter();
  const matchIndex = useMatch({
    strict: false,
    select: (match) => match.index
  });
  return React.useCallback(
    (options) => {
      const from = options.from ?? (_defaultOpts == null ? void 0 : _defaultOpts.from) ?? state.matches[matchIndex].fullPath;
      return navigate({
        ...options,
        from
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_defaultOpts == null ? void 0 : _defaultOpts.from, navigate]
  );
}
const useLayoutEffect = React.useEffect;
function usePrevious(value) {
  const ref = React.useRef({
    value,
    prev: null
  });
  const current = ref.current.value;
  if (value !== current) {
    ref.current = {
      value,
      prev: current
    };
  }
  return ref.current.prev;
}
function useIntersectionObserver(ref, callback, intersectionObserverOptions = {}, options = {}) {
  const isIntersectionObserverAvailable = React.useRef(
    typeof IntersectionObserver === "function"
  );
  const observerRef = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !isIntersectionObserverAvailable.current || options.disabled) {
      return;
    }
    observerRef.current = new IntersectionObserver(([entry]) => {
      callback(entry);
    }, intersectionObserverOptions);
    observerRef.current.observe(ref.current);
    return () => {
      var _a2;
      (_a2 = observerRef.current) == null ? void 0 : _a2.disconnect();
    };
  }, [callback, intersectionObserverOptions, options.disabled, ref]);
  return observerRef.current;
}
function useForwardedRef(ref) {
  const innerRef = React.useRef(null);
  React.useImperativeHandle(ref, () => innerRef.current, []);
  return innerRef;
}
function useLinkProps(options, forwardedRef) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const hasRenderFetched = React.useRef(false);
  const innerRef = useForwardedRef(forwardedRef);
  const {
    // custom props
    activeProps = () => ({ className: "active" }),
    inactiveProps = () => ({}),
    activeOptions,
    to,
    preload: userPreload,
    preloadDelay: userPreloadDelay,
    hashScrollIntoView,
    replace,
    startTransition: startTransition2,
    resetScroll,
    viewTransition,
    // element props
    children: children2,
    target,
    disabled,
    style: style2,
    className: className2,
    onClick,
    onFocus,
    onMouseEnter,
    onMouseLeave,
    onTouchStart,
    ignoreBlocker,
    ...rest
  } = options;
  const {
    // prevent these from being returned
    params: _params,
    search: _search,
    hash: _hash,
    state: _state,
    mask: _mask,
    reloadDocument: _reloadDocument,
    ...propsSafeToSpread
  } = rest;
  const type = React.useMemo(() => {
    try {
      new URL(`${to}`);
      return "external";
    } catch {
    }
    return "internal";
  }, [to]);
  const currentSearch = useRouterState({
    select: (s) => s.location.search,
    structuralSharing: true
  });
  const nearestFrom = useMatch({
    strict: false,
    select: (match) => match.fullPath
  });
  const from = options.from ?? nearestFrom;
  options = { ...options, from };
  const next = React.useMemo(
    () => router.buildLocation(options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, options, currentSearch]
  );
  const preload = React.useMemo(() => {
    if (options.reloadDocument) {
      return false;
    }
    return userPreload ?? router.options.defaultPreload;
  }, [router.options.defaultPreload, userPreload, options.reloadDocument]);
  const preloadDelay = userPreloadDelay ?? router.options.defaultPreloadDelay ?? 0;
  const isActive = useRouterState({
    select: (s) => {
      if (activeOptions == null ? void 0 : activeOptions.exact) {
        const testExact = exactPathTest(
          s.location.pathname,
          next.pathname,
          router.basepath
        );
        if (!testExact) {
          return false;
        }
      } else {
        const currentPathSplit = removeTrailingSlash(
          s.location.pathname,
          router.basepath
        ).split("/");
        const nextPathSplit = removeTrailingSlash(
          next.pathname,
          router.basepath
        ).split("/");
        const pathIsFuzzyEqual = nextPathSplit.every(
          (d, i) => d === currentPathSplit[i]
        );
        if (!pathIsFuzzyEqual) {
          return false;
        }
      }
      if ((activeOptions == null ? void 0 : activeOptions.includeSearch) ?? true) {
        const searchTest = deepEqual(s.location.search, next.search, {
          partial: !(activeOptions == null ? void 0 : activeOptions.exact),
          ignoreUndefined: !(activeOptions == null ? void 0 : activeOptions.explicitUndefined)
        });
        if (!searchTest) {
          return false;
        }
      }
      if (activeOptions == null ? void 0 : activeOptions.includeHash) {
        return s.location.hash === next.hash;
      }
      return true;
    }
  });
  const doPreload = React.useCallback(() => {
    router.preloadRoute(options).catch((err) => {
      console.warn(err);
      console.warn(preloadWarning);
    });
  }, [options, router]);
  const preloadViewportIoCallback = React.useCallback(
    (entry) => {
      if (entry == null ? void 0 : entry.isIntersecting) {
        doPreload();
      }
    },
    [doPreload]
  );
  useIntersectionObserver(
    innerRef,
    preloadViewportIoCallback,
    { rootMargin: "100px" },
    { disabled: !!disabled || !(preload === "viewport") }
  );
  useLayoutEffect(() => {
    if (hasRenderFetched.current) {
      return;
    }
    if (!disabled && preload === "render") {
      doPreload();
      hasRenderFetched.current = true;
    }
  }, [disabled, doPreload, preload]);
  if (type === "external") {
    return {
      ...propsSafeToSpread,
      ref: innerRef,
      type,
      href: to,
      ...children2 && { children: children2 },
      ...target && { target },
      ...disabled && { disabled },
      ...style2 && { style: style2 },
      ...className2 && { className: className2 },
      ...onClick && { onClick },
      ...onFocus && { onFocus },
      ...onMouseEnter && { onMouseEnter },
      ...onMouseLeave && { onMouseLeave },
      ...onTouchStart && { onTouchStart }
    };
  }
  const handleClick = (e) => {
    if (!disabled && !isCtrlEvent(e) && !e.defaultPrevented && (!target || target === "_self") && e.button === 0) {
      e.preventDefault();
      flushSync(() => {
        setIsTransitioning(true);
      });
      const unsub = router.subscribe("onResolved", () => {
        unsub();
        setIsTransitioning(false);
      });
      return router.navigate({
        ...options,
        replace,
        resetScroll,
        hashScrollIntoView,
        startTransition: startTransition2,
        viewTransition,
        ignoreBlocker
      });
    }
  };
  const handleFocus = (_) => {
    if (disabled) return;
    if (preload) {
      doPreload();
    }
  };
  const handleTouchStart = handleFocus;
  const handleEnter = (e) => {
    if (disabled) return;
    const eventTarget = e.target || {};
    if (preload) {
      if (eventTarget.preloadTimeout) {
        return;
      }
      if (!preloadDelay) {
        doPreload();
      } else {
        eventTarget.preloadTimeout = setTimeout(() => {
          eventTarget.preloadTimeout = null;
          doPreload();
        }, preloadDelay);
      }
    }
  };
  const handleLeave = (e) => {
    if (disabled) return;
    const eventTarget = e.target || {};
    if (eventTarget.preloadTimeout) {
      clearTimeout(eventTarget.preloadTimeout);
      eventTarget.preloadTimeout = null;
    }
  };
  const composeHandlers = (handlers) => (e) => {
    var _a2;
    (_a2 = e.persist) == null ? void 0 : _a2.call(e);
    handlers.filter(Boolean).forEach((handler) => {
      if (e.defaultPrevented) return;
      handler(e);
    });
  };
  const resolvedActiveProps = isActive ? functionalUpdate$1(activeProps, {}) ?? {} : {};
  const resolvedInactiveProps = isActive ? {} : functionalUpdate$1(inactiveProps, {});
  const resolvedClassName = [
    className2,
    resolvedActiveProps.className,
    resolvedInactiveProps.className
  ].filter(Boolean).join(" ");
  const resolvedStyle = {
    ...style2,
    ...resolvedActiveProps.style,
    ...resolvedInactiveProps.style
  };
  return {
    ...propsSafeToSpread,
    ...resolvedActiveProps,
    ...resolvedInactiveProps,
    href: disabled ? void 0 : next.maskedLocation ? router.history.createHref(next.maskedLocation.href) : router.history.createHref(next.href),
    ref: innerRef,
    onClick: composeHandlers([onClick, handleClick]),
    onFocus: composeHandlers([onFocus, handleFocus]),
    onMouseEnter: composeHandlers([onMouseEnter, handleEnter]),
    onMouseLeave: composeHandlers([onMouseLeave, handleLeave]),
    onTouchStart: composeHandlers([onTouchStart, handleTouchStart]),
    disabled: !!disabled,
    target,
    ...Object.keys(resolvedStyle).length && { style: resolvedStyle },
    ...resolvedClassName && { className: resolvedClassName },
    ...disabled && {
      role: "link",
      "aria-disabled": true
    },
    ...isActive && { "data-status": "active", "aria-current": "page" },
    ...isTransitioning && { "data-transitioning": "transitioning" }
  };
}
const Link = React.forwardRef(
  (props, ref) => {
    const { _asChild, ...rest } = props;
    const {
      type: _type,
      ref: innerRef,
      ...linkProps
    } = useLinkProps(rest, ref);
    const children2 = typeof rest.children === "function" ? rest.children({
      isActive: linkProps["data-status"] === "active"
    }) : rest.children;
    if (typeof _asChild === "undefined") {
      delete linkProps.disabled;
    }
    return React.createElement(
      _asChild ? _asChild : "a",
      {
        ...linkProps,
        ref: innerRef
      },
      children2
    );
  }
);
function isCtrlEvent(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
let Route$7 = class Route extends BaseRoute {
  /**
   * @deprecated Use the `createRoute` function instead.
   */
  constructor(options) {
    super(options);
    this.useMatch = (opts) => {
      return useMatch({
        select: opts == null ? void 0 : opts.select,
        from: this.id,
        structuralSharing: opts == null ? void 0 : opts.structuralSharing
      });
    };
    this.useRouteContext = (opts) => {
      return useMatch({
        ...opts,
        from: this.id,
        select: (d) => (opts == null ? void 0 : opts.select) ? opts.select(d.context) : d.context
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts == null ? void 0 : opts.select,
        structuralSharing: opts == null ? void 0 : opts.structuralSharing,
        from: this.id
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts == null ? void 0 : opts.select,
        structuralSharing: opts == null ? void 0 : opts.structuralSharing,
        from: this.id
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({ ...opts, from: this.id });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({ ...opts, from: this.id });
    };
    this.useNavigate = () => {
      return useNavigate({ from: this.fullPath });
    };
    this.Link = React__default.forwardRef(
      (props, ref) => {
        return /* @__PURE__ */ jsx(Link, { ref, from: this.fullPath, ...props });
      }
    );
    this.$$typeof = Symbol.for("react.memo");
  }
};
function createRoute(options) {
  return new Route$7(options);
}
function createRootRouteWithContext() {
  return (options) => {
    return createRootRoute(options);
  };
}
class RootRoute extends BaseRootRoute {
  /**
   * @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
   */
  constructor(options) {
    super(options);
    this.useMatch = (opts) => {
      return useMatch({
        select: opts == null ? void 0 : opts.select,
        from: this.id,
        structuralSharing: opts == null ? void 0 : opts.structuralSharing
      });
    };
    this.useRouteContext = (opts) => {
      return useMatch({
        ...opts,
        from: this.id,
        select: (d) => (opts == null ? void 0 : opts.select) ? opts.select(d.context) : d.context
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts == null ? void 0 : opts.select,
        structuralSharing: opts == null ? void 0 : opts.structuralSharing,
        from: this.id
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts == null ? void 0 : opts.select,
        structuralSharing: opts == null ? void 0 : opts.structuralSharing,
        from: this.id
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({ ...opts, from: this.id });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({ ...opts, from: this.id });
    };
    this.useNavigate = () => {
      return useNavigate({ from: this.fullPath });
    };
    this.Link = React__default.forwardRef(
      (props, ref) => {
        return /* @__PURE__ */ jsx(Link, { ref, from: this.fullPath, ...props });
      }
    );
    this.$$typeof = Symbol.for("react.memo");
  }
}
function createRootRoute(options) {
  return new RootRoute(options);
}
function createFileRoute(path) {
  if (typeof path === "object") {
    return new FileRoute(path, {
      silent: true
    }).createRoute(path);
  }
  return new FileRoute(path, {
    silent: true
  }).createRoute;
}
class FileRoute {
  constructor(path, _opts) {
    this.path = path;
    this.createRoute = (options) => {
      warning(
        this.silent);
      const route = createRoute(options);
      route.isRoot = false;
      return route;
    };
    this.silent = _opts == null ? void 0 : _opts.silent;
  }
}
class LazyRoute {
  constructor(opts) {
    this.useMatch = (opts2) => {
      return useMatch({
        select: opts2 == null ? void 0 : opts2.select,
        from: this.options.id,
        structuralSharing: opts2 == null ? void 0 : opts2.structuralSharing
      });
    };
    this.useRouteContext = (opts2) => {
      return useMatch({
        from: this.options.id,
        select: (d) => (opts2 == null ? void 0 : opts2.select) ? opts2.select(d.context) : d.context
      });
    };
    this.useSearch = (opts2) => {
      return useSearch({
        select: opts2 == null ? void 0 : opts2.select,
        structuralSharing: opts2 == null ? void 0 : opts2.structuralSharing,
        from: this.options.id
      });
    };
    this.useParams = (opts2) => {
      return useParams({
        select: opts2 == null ? void 0 : opts2.select,
        structuralSharing: opts2 == null ? void 0 : opts2.structuralSharing,
        from: this.options.id
      });
    };
    this.useLoaderDeps = (opts2) => {
      return useLoaderDeps({ ...opts2, from: this.options.id });
    };
    this.useLoaderData = (opts2) => {
      return useLoaderData({ ...opts2, from: this.options.id });
    };
    this.useNavigate = () => {
      const router = useRouter();
      return useNavigate({ from: router.routesById[this.options.id].fullPath });
    };
    this.options = opts;
    this.$$typeof = Symbol.for("react.memo");
  }
}
function createLazyFileRoute(id) {
  if (typeof id === "object") {
    return new LazyRoute(id);
  }
  return (opts) => new LazyRoute({ id, ...opts });
}
function CatchNotFound(props) {
  const resetKey = useRouterState({
    select: (s) => `not-found-${s.location.pathname}-${s.status}`
  });
  return /* @__PURE__ */ jsx(
    CatchBoundary,
    {
      getResetKey: () => resetKey,
      onCatch: (error, errorInfo) => {
        var _a2;
        if (isNotFound(error)) {
          (_a2 = props.onCatch) == null ? void 0 : _a2.call(props, error, errorInfo);
        } else {
          throw error;
        }
      },
      errorComponent: ({ error }) => {
        var _a2;
        if (isNotFound(error)) {
          return (_a2 = props.fallback) == null ? void 0 : _a2.call(props, error);
        } else {
          throw error;
        }
      },
      children: props.children
    }
  );
}
function DefaultGlobalNotFound() {
  return /* @__PURE__ */ jsx("p", { children: "Not Found" });
}
function SafeFragment(props) {
  return /* @__PURE__ */ jsx(Fragment, { children: props.children });
}
function renderRouteNotFound(router, route, data) {
  if (!route.options.notFoundComponent) {
    if (router.options.defaultNotFoundComponent) {
      return /* @__PURE__ */ jsx(router.options.defaultNotFoundComponent, { data });
    }
    return /* @__PURE__ */ jsx(DefaultGlobalNotFound, {});
  }
  return /* @__PURE__ */ jsx(route.options.notFoundComponent, { data });
}
var jsesc_1;
var hasRequiredJsesc;
function requireJsesc() {
  if (hasRequiredJsesc) return jsesc_1;
  hasRequiredJsesc = 1;
  const object = {};
  const hasOwnProperty = object.hasOwnProperty;
  const forOwn = (object2, callback) => {
    for (const key in object2) {
      if (hasOwnProperty.call(object2, key)) {
        callback(key, object2[key]);
      }
    }
  };
  const extend = (destination, source) => {
    if (!source) {
      return destination;
    }
    forOwn(source, (key, value) => {
      destination[key] = value;
    });
    return destination;
  };
  const forEach2 = (array, callback) => {
    const length = array.length;
    let index2 = -1;
    while (++index2 < length) {
      callback(array[index2]);
    }
  };
  const fourHexEscape = (hex) => {
    return "\\u" + ("0000" + hex).slice(-4);
  };
  const hexadecimal = (code, lowercase) => {
    let hexadecimal2 = code.toString(16);
    if (lowercase) return hexadecimal2;
    return hexadecimal2.toUpperCase();
  };
  const toString = object.toString;
  const isArray3 = Array.isArray;
  const isBuffer = (value) => {
    return typeof Buffer === "function" && Buffer.isBuffer(value);
  };
  const isObject = (value) => {
    return toString.call(value) == "[object Object]";
  };
  const isString2 = (value) => {
    return typeof value == "string" || toString.call(value) == "[object String]";
  };
  const isNumber2 = (value) => {
    return typeof value == "number" || toString.call(value) == "[object Number]";
  };
  const isBigInt = (value) => {
    return typeof value == "bigint";
  };
  const isFunction2 = (value) => {
    return typeof value == "function";
  };
  const isMap2 = (value) => {
    return toString.call(value) == "[object Map]";
  };
  const isSet2 = (value) => {
    return toString.call(value) == "[object Set]";
  };
  const singleEscapes = {
    "\\": "\\\\",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "	": "\\t"
    // `\v` is omitted intentionally, because in IE < 9, '\v' == 'v'.
    // '\v': '\\x0B'
  };
  const regexSingleEscape = /[\\\b\f\n\r\t]/;
  const regexDigit = /[0-9]/;
  const regexWhitespace = /[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;
  const escapeEverythingRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['"`])|[^]/g;
  const escapeNonAsciiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['"`])|[^ !#-&\(-\[\]-_a-~]/g;
  const jsesc2 = (argument, options) => {
    const increaseIndentation = () => {
      oldIndent = indent;
      ++options.indentLevel;
      indent = options.indent.repeat(options.indentLevel);
    };
    const defaults = {
      "escapeEverything": false,
      "minimal": false,
      "isScriptContext": false,
      "quotes": "single",
      "wrap": false,
      "es6": false,
      "json": false,
      "compact": true,
      "lowercaseHex": false,
      "numbers": "decimal",
      "indent": "	",
      "indentLevel": 0,
      "__inline1__": false,
      "__inline2__": false
    };
    const json2 = options && options.json;
    if (json2) {
      defaults.quotes = "double";
      defaults.wrap = true;
    }
    options = extend(defaults, options);
    if (options.quotes != "single" && options.quotes != "double" && options.quotes != "backtick") {
      options.quotes = "single";
    }
    const quote = options.quotes == "double" ? '"' : options.quotes == "backtick" ? "`" : "'";
    const compact = options.compact;
    const lowercaseHex = options.lowercaseHex;
    let indent = options.indent.repeat(options.indentLevel);
    let oldIndent = "";
    const inline1 = options.__inline1__;
    const inline2 = options.__inline2__;
    const newLine = compact ? "" : "\n";
    let result;
    let isEmpty = true;
    const useBinNumbers = options.numbers == "binary";
    const useOctNumbers = options.numbers == "octal";
    const useDecNumbers = options.numbers == "decimal";
    const useHexNumbers = options.numbers == "hexadecimal";
    if (json2 && argument && isFunction2(argument.toJSON)) {
      argument = argument.toJSON();
    }
    if (!isString2(argument)) {
      if (isMap2(argument)) {
        if (argument.size == 0) {
          return "new Map()";
        }
        if (!compact) {
          options.__inline1__ = true;
          options.__inline2__ = false;
        }
        return "new Map(" + jsesc2(Array.from(argument), options) + ")";
      }
      if (isSet2(argument)) {
        if (argument.size == 0) {
          return "new Set()";
        }
        return "new Set(" + jsesc2(Array.from(argument), options) + ")";
      }
      if (isBuffer(argument)) {
        if (argument.length == 0) {
          return "Buffer.from([])";
        }
        return "Buffer.from(" + jsesc2(Array.from(argument), options) + ")";
      }
      if (isArray3(argument)) {
        result = [];
        options.wrap = true;
        if (inline1) {
          options.__inline1__ = false;
          options.__inline2__ = true;
        }
        if (!inline2) {
          increaseIndentation();
        }
        forEach2(argument, (value) => {
          isEmpty = false;
          if (inline2) {
            options.__inline2__ = false;
          }
          result.push(
            (compact || inline2 ? "" : indent) + jsesc2(value, options)
          );
        });
        if (isEmpty) {
          return "[]";
        }
        if (inline2) {
          return "[" + result.join(", ") + "]";
        }
        return "[" + newLine + result.join("," + newLine) + newLine + (compact ? "" : oldIndent) + "]";
      } else if (isNumber2(argument) || isBigInt(argument)) {
        if (json2) {
          return JSON.stringify(Number(argument));
        }
        let result2;
        if (useDecNumbers) {
          result2 = String(argument);
        } else if (useHexNumbers) {
          let hexadecimal2 = argument.toString(16);
          if (!lowercaseHex) {
            hexadecimal2 = hexadecimal2.toUpperCase();
          }
          result2 = "0x" + hexadecimal2;
        } else if (useBinNumbers) {
          result2 = "0b" + argument.toString(2);
        } else if (useOctNumbers) {
          result2 = "0o" + argument.toString(8);
        }
        if (isBigInt(argument)) {
          return result2 + "n";
        }
        return result2;
      } else if (isBigInt(argument)) {
        if (json2) {
          return JSON.stringify(Number(argument));
        }
        return argument + "n";
      } else if (!isObject(argument)) {
        if (json2) {
          return JSON.stringify(argument) || "null";
        }
        return String(argument);
      } else {
        result = [];
        options.wrap = true;
        increaseIndentation();
        forOwn(argument, (key, value) => {
          isEmpty = false;
          result.push(
            (compact ? "" : indent) + jsesc2(key, options) + ":" + (compact ? "" : " ") + jsesc2(value, options)
          );
        });
        if (isEmpty) {
          return "{}";
        }
        return "{" + newLine + result.join("," + newLine) + newLine + (compact ? "" : oldIndent) + "}";
      }
    }
    const regex = options.escapeEverything ? escapeEverythingRegex : escapeNonAsciiRegex;
    result = argument.replace(regex, (char, pair, lone, quoteChar, index2, string) => {
      if (pair) {
        if (options.minimal) return pair;
        const first = pair.charCodeAt(0);
        const second = pair.charCodeAt(1);
        if (options.es6) {
          const codePoint = (first - 55296) * 1024 + second - 56320 + 65536;
          const hex2 = hexadecimal(codePoint, lowercaseHex);
          return "\\u{" + hex2 + "}";
        }
        return fourHexEscape(hexadecimal(first, lowercaseHex)) + fourHexEscape(hexadecimal(second, lowercaseHex));
      }
      if (lone) {
        return fourHexEscape(hexadecimal(lone.charCodeAt(0), lowercaseHex));
      }
      if (char == "\0" && !json2 && !regexDigit.test(string.charAt(index2 + 1))) {
        return "\\0";
      }
      if (quoteChar) {
        if (quoteChar == quote || options.escapeEverything) {
          return "\\" + quoteChar;
        }
        return quoteChar;
      }
      if (regexSingleEscape.test(char)) {
        return singleEscapes[char];
      }
      if (options.minimal && !regexWhitespace.test(char)) {
        return char;
      }
      const hex = hexadecimal(char.charCodeAt(0), lowercaseHex);
      if (json2 || hex.length > 2) {
        return fourHexEscape(hex);
      }
      return "\\x" + ("00" + hex).slice(-2);
    });
    if (quote == "`") {
      result = result.replace(/\$\{/g, "\\${");
    }
    if (options.isScriptContext) {
      result = result.replace(/<\/(script|style)/gi, "<\\/$1").replace(/<!--/g, json2 ? "\\u003C!--" : "\\x3C!--");
    }
    if (options.wrap) {
      result = quote + result + quote;
    }
    return result;
  };
  jsesc2.version = "3.0.2";
  jsesc_1 = jsesc2;
  return jsesc_1;
}
var jsescExports = requireJsesc();
const jsesc = /* @__PURE__ */ getDefaultExportFromCjs(jsescExports);
function ScriptOnce({
  children: children2,
  log
}) {
  if (typeof document !== "undefined") {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "script",
    {
      className: "tsr-once",
      dangerouslySetInnerHTML: {
        __html: [
          children2,
          "",
          'if (typeof __TSR_SSR__ !== "undefined") __TSR_SSR__.cleanScripts()'
        ].filter(Boolean).join("\n")
      }
    }
  );
}
function ScrollRestoration() {
  const router = useRouter();
  const getKey = router.options.getScrollRestorationKey || defaultGetScrollRestorationKey;
  const userKey = getKey(router.latestLocation);
  const resolvedKey = userKey !== defaultGetScrollRestorationKey(router.latestLocation) ? userKey : null;
  if (!router.isScrollRestoring || !router.isServer) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    ScriptOnce,
    {
      children: `(${restoreScroll.toString()})(${JSON.stringify(storageKey)},${JSON.stringify(resolvedKey)}, undefined, true)`,
      log: false
    }
  );
}
const Match$1 = React.memo(function MatchImpl({
  matchId
}) {
  var _a2, _b2;
  const router = useRouter();
  const routeId = useRouterState({
    select: (s) => {
      var _a22;
      return (_a22 = s.matches.find((d) => d.id === matchId)) == null ? void 0 : _a22.routeId;
    }
  });
  invariant(
    routeId);
  const route = router.routesById[routeId];
  const PendingComponent = route.options.pendingComponent ?? router.options.defaultPendingComponent;
  const pendingElement = PendingComponent ? /* @__PURE__ */ jsx(PendingComponent, {}) : null;
  const routeErrorComponent = route.options.errorComponent ?? router.options.defaultErrorComponent;
  const routeOnCatch = route.options.onCatch ?? router.options.defaultOnCatch;
  const routeNotFoundComponent = route.isRoot ? (
    // If it's the root route, use the globalNotFound option, with fallback to the notFoundRoute's component
    route.options.notFoundComponent ?? ((_a2 = router.options.notFoundRoute) == null ? void 0 : _a2.options.component)
  ) : route.options.notFoundComponent;
  const ResolvedSuspenseBoundary = (
    // If we're on the root route, allow forcefully wrapping in suspense
    (!route.isRoot || route.options.wrapInSuspense) && (route.options.wrapInSuspense ?? PendingComponent ?? ((_b2 = route.options.errorComponent) == null ? void 0 : _b2.preload)) ? React.Suspense : SafeFragment
  );
  const ResolvedCatchBoundary = routeErrorComponent ? CatchBoundary : SafeFragment;
  const ResolvedNotFoundBoundary = routeNotFoundComponent ? CatchNotFound : SafeFragment;
  const resetKey = useRouterState({
    select: (s) => s.loadedAt
  });
  const parentRouteId = useRouterState({
    select: (s) => {
      var _a22;
      const index2 = s.matches.findIndex((d) => d.id === matchId);
      return (_a22 = s.matches[index2 - 1]) == null ? void 0 : _a22.routeId;
    }
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(matchContext.Provider, { value: matchId, children: /* @__PURE__ */ jsx(ResolvedSuspenseBoundary, { fallback: pendingElement, children: /* @__PURE__ */ jsx(
      ResolvedCatchBoundary,
      {
        getResetKey: () => resetKey,
        errorComponent: routeErrorComponent || ErrorComponent,
        onCatch: (error, errorInfo) => {
          if (isNotFound(error)) throw error;
          routeOnCatch == null ? void 0 : routeOnCatch(error, errorInfo);
        },
        children: /* @__PURE__ */ jsx(
          ResolvedNotFoundBoundary,
          {
            fallback: (error) => {
              if (!routeNotFoundComponent || error.routeId && error.routeId !== routeId || !error.routeId && !route.isRoot)
                throw error;
              return React.createElement(routeNotFoundComponent, error);
            },
            children: /* @__PURE__ */ jsx(MatchInner, { matchId })
          }
        )
      }
    ) }) }),
    parentRouteId === rootRouteId && router.options.scrollRestoration ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(OnRendered, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {})
    ] }) : null
  ] });
});
function OnRendered() {
  const router = useRouter();
  const prevLocationRef = React.useRef(
    void 0
  );
  return /* @__PURE__ */ jsx(
    "script",
    {
      suppressHydrationWarning: true,
      ref: (el) => {
        if (el && (prevLocationRef.current === void 0 || prevLocationRef.current.href !== router.latestLocation.href)) {
          router.emit({
            type: "onRendered",
            ...getLocationChangeInfo(router.state)
          });
          prevLocationRef.current = router.latestLocation;
        }
      }
    },
    router.latestLocation.state.key
  );
}
const MatchInner = React.memo(function MatchInnerImpl({
  matchId
}) {
  var _a2, _b2, _c2;
  const router = useRouter();
  const { match, key, routeId } = useRouterState({
    select: (s) => {
      const matchIndex = s.matches.findIndex((d) => d.id === matchId);
      const match2 = s.matches[matchIndex];
      const routeId2 = match2.routeId;
      const remountFn = router.routesById[routeId2].options.remountDeps ?? router.options.defaultRemountDeps;
      const remountDeps = remountFn == null ? void 0 : remountFn({
        routeId: routeId2,
        loaderDeps: match2.loaderDeps,
        params: match2._strictParams,
        search: match2._strictSearch
      });
      const key2 = remountDeps ? JSON.stringify(remountDeps) : void 0;
      return {
        key: key2,
        routeId: routeId2,
        match: pick(match2, ["id", "status", "error"])
      };
    },
    structuralSharing: true
  });
  const route = router.routesById[routeId];
  const out = React.useMemo(() => {
    const Comp = route.options.component ?? router.options.defaultComponent;
    if (Comp) {
      return /* @__PURE__ */ jsx(Comp, {}, key);
    }
    return /* @__PURE__ */ jsx(Outlet, {});
  }, [key, route.options.component, router.options.defaultComponent]);
  const RouteErrorComponent = (route.options.errorComponent ?? router.options.defaultErrorComponent) || ErrorComponent;
  if (match.status === "notFound") {
    invariant(isNotFound(match.error));
    return renderRouteNotFound(router, route, match.error);
  }
  if (match.status === "redirected") {
    invariant(isRedirect(match.error));
    throw (_a2 = router.getMatch(match.id)) == null ? void 0 : _a2.loadPromise;
  }
  if (match.status === "error") {
    if (router.isServer) {
      return /* @__PURE__ */ jsx(
        RouteErrorComponent,
        {
          error: match.error,
          reset: void 0,
          info: {
            componentStack: ""
          }
        }
      );
    }
    throw match.error;
  }
  if (match.status === "pending") {
    const pendingMinMs = route.options.pendingMinMs ?? router.options.defaultPendingMinMs;
    if (pendingMinMs && !((_b2 = router.getMatch(match.id)) == null ? void 0 : _b2.minPendingPromise)) {
      if (!router.isServer) {
        const minPendingPromise = createControlledPromise();
        Promise.resolve().then(() => {
          router.updateMatch(match.id, (prev) => ({
            ...prev,
            minPendingPromise
          }));
        });
        setTimeout(() => {
          minPendingPromise.resolve();
          router.updateMatch(match.id, (prev) => ({
            ...prev,
            minPendingPromise: void 0
          }));
        }, pendingMinMs);
      }
    }
    throw (_c2 = router.getMatch(match.id)) == null ? void 0 : _c2.loadPromise;
  }
  return out;
});
const Outlet = React.memo(function OutletImpl() {
  const router = useRouter();
  const matchId = React.useContext(matchContext);
  const routeId = useRouterState({
    select: (s) => {
      var _a2;
      return (_a2 = s.matches.find((d) => d.id === matchId)) == null ? void 0 : _a2.routeId;
    }
  });
  const route = router.routesById[routeId];
  const parentGlobalNotFound = useRouterState({
    select: (s) => {
      const matches = s.matches;
      const parentMatch = matches.find((d) => d.id === matchId);
      invariant(
        parentMatch);
      return parentMatch.globalNotFound;
    }
  });
  const childMatchId = useRouterState({
    select: (s) => {
      var _a2;
      const matches = s.matches;
      const index2 = matches.findIndex((d) => d.id === matchId);
      return (_a2 = matches[index2 + 1]) == null ? void 0 : _a2.id;
    }
  });
  const pendingElement = router.options.defaultPendingComponent ? /* @__PURE__ */ jsx(router.options.defaultPendingComponent, {}) : null;
  if (router.isShell)
    return /* @__PURE__ */ jsx(React.Suspense, { fallback: pendingElement, children: /* @__PURE__ */ jsx(ShellInner, {}) });
  if (parentGlobalNotFound) {
    return renderRouteNotFound(router, route, void 0);
  }
  if (!childMatchId) {
    return null;
  }
  const nextMatch = /* @__PURE__ */ jsx(Match$1, { matchId: childMatchId });
  if (matchId === rootRouteId) {
    return /* @__PURE__ */ jsx(React.Suspense, { fallback: pendingElement, children: nextMatch });
  }
  return nextMatch;
});
function ShellInner() {
  throw new Error("ShellBoundaryError");
}
function isModuleNotFoundError(error) {
  if (typeof (error == null ? void 0 : error.message) !== "string") return false;
  return error.message.startsWith("Failed to fetch dynamically imported module") || error.message.startsWith("error loading dynamically imported module") || error.message.startsWith("Importing a module script failed");
}
function lazyRouteComponent(importer, exportName, ssr) {
  let loadPromise;
  let comp;
  let error;
  const load = () => {
    if (typeof document === "undefined" && (ssr == null ? void 0 : ssr()) === false) {
      comp = () => null;
      return Promise.resolve();
    }
    if (!loadPromise) {
      loadPromise = importer().then((res) => {
        loadPromise = void 0;
        comp = res[exportName ?? "default"];
      }).catch((err) => {
        error = err;
        if (isModuleNotFoundError(error)) ;
      });
    }
    return loadPromise;
  };
  const lazyComp = function Lazy(props) {
    if (error) {
      throw error;
    }
    if (!comp) {
      throw load();
    }
    if ((ssr == null ? void 0 : ssr()) === false) {
      return /* @__PURE__ */ jsx(ClientOnly, { fallback: /* @__PURE__ */ jsx(Outlet, {}), children: React.createElement(comp, props) });
    }
    return React.createElement(comp, props);
  };
  lazyComp.preload = load;
  return lazyComp;
}
function Transitioner() {
  const router = useRouter();
  const mountLoadForRouter = React.useRef({ router, mounted: false });
  const isLoading = useRouterState({
    select: ({ isLoading: isLoading2 }) => isLoading2
  });
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const hasPendingMatches = useRouterState({
    select: (s) => s.matches.some((d) => d.status === "pending"),
    structuralSharing: true
  });
  const previousIsLoading = usePrevious(isLoading);
  const isAnyPending = isLoading || isTransitioning || hasPendingMatches;
  const previousIsAnyPending = usePrevious(isAnyPending);
  const isPagePending = isLoading || hasPendingMatches;
  const previousIsPagePending = usePrevious(isPagePending);
  if (!router.isServer) {
    router.startTransition = (fn) => {
      setIsTransitioning(true);
      React.startTransition(() => {
        fn();
        setIsTransitioning(false);
      });
    };
  }
  React.useEffect(() => {
    const unsub = router.history.subscribe(router.load);
    const nextLocation = router.buildLocation({
      to: router.latestLocation.pathname,
      search: true,
      params: true,
      hash: true,
      state: true,
      _includeValidateSearch: true
    });
    if (trimPathRight(router.latestLocation.href) !== trimPathRight(nextLocation.href)) {
      router.commitLocation({ ...nextLocation, replace: true });
    }
    return () => {
      unsub();
    };
  }, [router, router.history]);
  useLayoutEffect(() => {
    if (mountLoadForRouter.current.router === router && mountLoadForRouter.current.mounted) {
      return;
    }
    mountLoadForRouter.current = { router, mounted: true };
    const tryLoad = async () => {
      try {
        await router.load();
      } catch (err) {
        console.error(err);
      }
    };
    tryLoad();
  }, [router]);
  useLayoutEffect(() => {
    if (previousIsLoading && !isLoading) {
      router.emit({
        type: "onLoad",
        // When the new URL has committed, when the new matches have been loaded into state.matches
        ...getLocationChangeInfo(router.state)
      });
    }
  }, [previousIsLoading, router, isLoading]);
  useLayoutEffect(() => {
    if (previousIsPagePending && !isPagePending) {
      router.emit({
        type: "onBeforeRouteMount",
        ...getLocationChangeInfo(router.state)
      });
    }
  }, [isPagePending, previousIsPagePending, router]);
  useLayoutEffect(() => {
    if (previousIsAnyPending && !isAnyPending) {
      router.emit({
        type: "onResolved",
        ...getLocationChangeInfo(router.state)
      });
      router.__store.setState((s) => ({
        ...s,
        status: "idle",
        resolvedLocation: s.location
      }));
      handleHashScroll(router);
    }
  }, [isAnyPending, previousIsAnyPending, router]);
  return null;
}
function Matches() {
  const router = useRouter();
  const pendingElement = router.options.defaultPendingComponent ? /* @__PURE__ */ jsx(router.options.defaultPendingComponent, {}) : null;
  const ResolvedSuspense = router.isServer || typeof document !== "undefined" && router.clientSsr ? SafeFragment : React.Suspense;
  const inner = /* @__PURE__ */ jsxs(ResolvedSuspense, { fallback: pendingElement, children: [
    /* @__PURE__ */ jsx(Transitioner, {}),
    /* @__PURE__ */ jsx(MatchesInner, {})
  ] });
  return router.options.InnerWrap ? /* @__PURE__ */ jsx(router.options.InnerWrap, { children: inner }) : inner;
}
function MatchesInner() {
  const matchId = useRouterState({
    select: (s) => {
      var _a2;
      return (_a2 = s.matches[0]) == null ? void 0 : _a2.id;
    }
  });
  const resetKey = useRouterState({
    select: (s) => s.loadedAt
  });
  return /* @__PURE__ */ jsx(matchContext.Provider, { value: matchId, children: /* @__PURE__ */ jsx(
    CatchBoundary,
    {
      getResetKey: () => resetKey,
      errorComponent: ErrorComponent,
      onCatch: (error) => {
        warning(false, error.message || error.toString());
      },
      children: matchId ? /* @__PURE__ */ jsx(Match$1, { matchId }) : null
    }
  ) });
}
const createRouter$1 = (options) => {
  return new Router(options);
};
class Router extends RouterCore {
  constructor(options) {
    super(options);
  }
}
if (typeof globalThis !== "undefined") {
  globalThis.createFileRoute = createFileRoute;
  globalThis.createLazyFileRoute = createLazyFileRoute;
}
function RouterContextProvider({
  router,
  children: children2,
  ...rest
}) {
  if (Object.keys(rest).length > 0) {
    router.update({
      ...router.options,
      ...rest,
      context: {
        ...router.options.context,
        ...rest.context
      }
    });
  }
  const routerContext2 = getRouterContext();
  const provider = /* @__PURE__ */ jsx(routerContext2.Provider, { value: router, children: children2 });
  if (router.options.Wrap) {
    return /* @__PURE__ */ jsx(router.options.Wrap, { children: provider });
  }
  return provider;
}
function RouterProvider({ router, ...rest }) {
  return /* @__PURE__ */ jsx(RouterContextProvider, { router, ...rest, children: /* @__PURE__ */ jsx(Matches, {}) });
}
function Asset({ tag, attrs, children: children2 }) {
  switch (tag) {
    case "title":
      return /* @__PURE__ */ jsx("title", { ...attrs, suppressHydrationWarning: true, children: children2 });
    case "meta":
      return /* @__PURE__ */ jsx("meta", { ...attrs, suppressHydrationWarning: true });
    case "link":
      return /* @__PURE__ */ jsx("link", { ...attrs, suppressHydrationWarning: true });
    case "style":
      return /* @__PURE__ */ jsx(
        "style",
        {
          ...attrs,
          dangerouslySetInnerHTML: { __html: children2 }
        }
      );
    case "script":
      if (attrs && attrs.src) {
        return /* @__PURE__ */ jsx("script", { ...attrs, suppressHydrationWarning: true });
      }
      if (typeof children2 === "string")
        return /* @__PURE__ */ jsx(
          "script",
          {
            ...attrs,
            dangerouslySetInnerHTML: {
              __html: children2
            },
            suppressHydrationWarning: true
          }
        );
      return null;
    default:
      return null;
  }
}
const useTags = () => {
  const router = useRouter();
  const routeMeta = useRouterState({
    select: (state) => {
      return state.matches.map((match) => match.meta).filter(Boolean);
    }
  });
  const meta = React.useMemo(() => {
    const resultMeta = [];
    const metaByAttribute = {};
    let title;
    [...routeMeta].reverse().forEach((metas) => {
      [...metas].reverse().forEach((m) => {
        if (!m) return;
        if (m.title) {
          if (!title) {
            title = {
              tag: "title",
              children: m.title
            };
          }
        } else {
          const attribute = m.name ?? m.property;
          if (attribute) {
            if (metaByAttribute[attribute]) {
              return;
            } else {
              metaByAttribute[attribute] = true;
            }
          }
          resultMeta.push({
            tag: "meta",
            attrs: {
              ...m
            }
          });
        }
      });
    });
    if (title) {
      resultMeta.push(title);
    }
    resultMeta.reverse();
    return resultMeta;
  }, [routeMeta]);
  const links = useRouterState({
    select: (state) => {
      var _a2;
      const constructed = state.matches.map((match) => match.links).filter(Boolean).flat(1).map((link) => ({
        tag: "link",
        attrs: {
          ...link
        }
      }));
      const manifest = (_a2 = router.ssr) == null ? void 0 : _a2.manifest;
      const assets = state.matches.map((match) => {
        var _a22;
        return ((_a22 = manifest == null ? void 0 : manifest.routes[match.routeId]) == null ? void 0 : _a22.assets) ?? [];
      }).filter(Boolean).flat(1).filter((asset) => asset.tag === "link").map(
        (asset) => ({
          tag: "link",
          attrs: {
            ...asset.attrs,
            suppressHydrationWarning: true
          }
        })
      );
      return [...constructed, ...assets];
    },
    structuralSharing: true
  });
  const preloadMeta = useRouterState({
    select: (state) => {
      const preloadMeta2 = [];
      state.matches.map((match) => router.looseRoutesById[match.routeId]).forEach(
        (route) => {
          var _a2, _b2, _c2, _d2;
          return (_d2 = (_c2 = (_b2 = (_a2 = router.ssr) == null ? void 0 : _a2.manifest) == null ? void 0 : _b2.routes[route.id]) == null ? void 0 : _c2.preloads) == null ? void 0 : _d2.filter(Boolean).forEach((preload) => {
            preloadMeta2.push({
              tag: "link",
              attrs: {
                rel: "modulepreload",
                href: preload
              }
            });
          });
        }
      );
      return preloadMeta2;
    },
    structuralSharing: true
  });
  const headScripts = useRouterState({
    select: (state) => state.matches.map((match) => match.headScripts).flat(1).filter(Boolean).map(({ children: children2, ...script }) => ({
      tag: "script",
      attrs: {
        ...script
      },
      children: children2
    })),
    structuralSharing: true
  });
  return uniqBy(
    [
      ...meta,
      ...preloadMeta,
      ...links,
      ...headScripts
    ],
    (d) => {
      return JSON.stringify(d);
    }
  );
};
function HeadContent() {
  const tags = useTags();
  return tags.map((tag) => /* @__PURE__ */ createElement$1(Asset, { ...tag, key: `tsr-meta-${JSON.stringify(tag)}` }));
}
function uniqBy(arr, fn) {
  const seen = /* @__PURE__ */ new Set();
  return arr.filter((item) => {
    const key = fn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
const Scripts = () => {
  const router = useRouter();
  const assetScripts = useRouterState({
    select: (state) => {
      var _a2;
      const assetScripts2 = [];
      const manifest = (_a2 = router.ssr) == null ? void 0 : _a2.manifest;
      if (!manifest) {
        return [];
      }
      state.matches.map((match) => router.looseRoutesById[match.routeId]).forEach(
        (route) => {
          var _a22, _b2;
          return (_b2 = (_a22 = manifest.routes[route.id]) == null ? void 0 : _a22.assets) == null ? void 0 : _b2.filter((d) => d.tag === "script").forEach((asset) => {
            assetScripts2.push({
              tag: "script",
              attrs: asset.attrs,
              children: asset.children
            });
          });
        }
      );
      return assetScripts2;
    },
    structuralSharing: true
  });
  const { scripts } = useRouterState({
    select: (state) => ({
      scripts: state.matches.map((match) => match.scripts).flat(1).filter(Boolean).map(({ children: children2, ...script }) => ({
        tag: "script",
        attrs: {
          ...script,
          suppressHydrationWarning: true
        },
        children: children2
      }))
    }),
    structuralSharing: true
  });
  const allScripts = [...scripts, ...assetScripts];
  return /* @__PURE__ */ jsx(Fragment, { children: allScripts.map((asset, i) => /* @__PURE__ */ createElement$1(Asset, { ...asset, key: `tsr-scripts-${asset.tag}-${i}` })) });
};
function StartServer(props) {
  return /* @__PURE__ */ jsx(RouterProvider, { router: props.router });
}
var fullPattern = " daum[ /]| deusu/| yadirectfetcher|(?:^|[^g])news(?!sapphire)|(?<! (?:channel/|google/))google(?!(app|/google| pixel))|(?<! cu)bots?(?:\\b|_)|(?<!(?:lib))http|(?<![hg]m)score|(?<!cam)scan|@[a-z][\\w-]+\\.|\\(\\)|\\.com\\b|\\btime/|\\||^<|^[\\w \\.\\-\\(?:\\):%]+(?:/v?\\d+(?:\\.\\d+)?(?:\\.\\d{1,10})*?)?(?:,|$)|^[^ ]{50,}$|^\\d+\\b|^\\w*search\\b|^\\w+/[\\w\\(\\)]*$|^active|^ad muncher|^amaya|^avsdevicesdk/|^biglotron|^bot|^bw/|^clamav[ /]|^client/|^cobweb/|^custom|^ddg[_-]android|^discourse|^dispatch/\\d|^downcast/|^duckduckgo|^email|^facebook|^getright/|^gozilla/|^hobbit|^hotzonu|^hwcdn/|^igetter/|^jeode/|^jetty/|^jigsaw|^microsoft bits|^movabletype|^mozilla/\\d\\.\\d\\s[\\w\\.-]+$|^mozilla/\\d\\.\\d\\s\\(compatible;?(?:\\s\\w+\\/\\d+\\.\\d+)?\\)$|^navermailapp|^netsurf|^offline|^openai/|^owler|^php|^postman|^python|^rank|^read|^reed|^rest|^rss|^snapchat|^space bison|^svn|^swcd |^taringa|^thumbor/|^track|^w3c|^webbandit/|^webcopier|^wget|^whatsapp|^wordpress|^xenu link sleuth|^yahoo|^yandex|^zdm/\\d|^zoom marketplace/|^{{.*}}$|analyzer|archive|ask jeeves/teoma|audit|bit\\.ly/|bluecoat drtr|browsex|burpcollaborator|capture|catch|check\\b|checker|chrome-lighthouse|chromeframe|classifier|cloudflare|convertify|crawl|cypress/|dareboost|datanyze|dejaclick|detect|dmbrowser|download|evc-batch/|exaleadcloudview|feed|firephp|functionize|gomezagent|grab|headless|httrack|hubspot marketing grader|hydra|ibisbrowser|infrawatch|insight|inspect|iplabel|ips-agent|java(?!;)|library|linkcheck|mail\\.ru/|manager|measure|neustar wpm|node|nutch|offbyone|onetrust|optimize|pageburst|pagespeed|parser|perl|phantomjs|pingdom|powermarks|preview|proxy|ptst[ /]\\d|retriever|rexx;|rigor|rss\\b|scrape|server|sogou|sparkler/|speedcurve|spider|splash|statuscake|supercleaner|synapse|synthetic|tools|torrent|transcoder|url|validator|virtuoso|wappalyzer|webglance|webkit2png|whatcms/|xtate/";
var naivePattern = /bot|crawl|http|lighthouse|scan|search|spider/i;
var pattern;
function getPattern() {
  if (pattern instanceof RegExp) {
    return pattern;
  }
  try {
    pattern = new RegExp(fullPattern, "i");
  } catch (error) {
    pattern = naivePattern;
  }
  return pattern;
}
function isbot(userAgent) {
  return Boolean(userAgent) && getPattern().test(userAgent);
}
function transformReadableStreamWithRouter(router, routerStream) {
  return transformStreamWithRouter(router, routerStream);
}
function transformPipeableStreamWithRouter(router, routerStream) {
  return Readable.fromWeb(
    transformStreamWithRouter(router, Readable.toWeb(routerStream))
  );
}
const patternBodyStart = /(<body)/;
const patternBodyEnd = /(<\/body>)/;
const patternHtmlEnd = /(<\/html>)/;
const patternHeadStart = /(<head.*?>)/;
const patternClosingTag = /(<\/[a-zA-Z][\w:.-]*?>)/g;
const textDecoder = new TextDecoder();
function createPassthrough() {
  let controller;
  const encoder = new TextEncoder();
  const stream = new ReadableStream$1({
    start(c) {
      controller = c;
    }
  });
  const res = {
    stream,
    write: (chunk) => {
      controller.enqueue(encoder.encode(chunk));
    },
    end: (chunk) => {
      if (chunk) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
      res.destroyed = true;
    },
    destroy: (error) => {
      controller.error(error);
    },
    destroyed: false
  };
  return res;
}
async function readStream(stream, opts) {
  var _a2, _b2, _c2;
  try {
    const reader = stream.getReader();
    let chunk;
    while (!(chunk = await reader.read()).done) {
      (_a2 = opts.onData) == null ? void 0 : _a2.call(opts, chunk);
    }
    (_b2 = opts.onEnd) == null ? void 0 : _b2.call(opts);
  } catch (error) {
    (_c2 = opts.onError) == null ? void 0 : _c2.call(opts, error);
  }
}
function transformStreamWithRouter(router, appStream) {
  const finalPassThrough = createPassthrough();
  let isAppRendering = true;
  let routerStreamBuffer = "";
  let pendingClosingTags = "";
  let bodyStarted = false;
  let headStarted = false;
  let leftover = "";
  let leftoverHtml = "";
  function getBufferedRouterStream() {
    const html = routerStreamBuffer;
    routerStreamBuffer = "";
    return html;
  }
  function decodeChunk(chunk) {
    if (chunk instanceof Uint8Array) {
      return textDecoder.decode(chunk);
    }
    return String(chunk);
  }
  const injectedHtmlDonePromise = createControlledPromise();
  let processingCount = 0;
  router.serverSsr.injectedHtml.forEach((promise) => {
    handleInjectedHtml(promise);
  });
  const stopListeningToInjectedHtml = router.subscribe(
    "onInjectedHtml",
    (e) => {
      handleInjectedHtml(e.promise);
    }
  );
  function handleInjectedHtml(promise) {
    processingCount++;
    promise.then((html) => {
      if (!bodyStarted) {
        routerStreamBuffer += html;
      } else {
        finalPassThrough.write(html);
      }
    }).catch(injectedHtmlDonePromise.reject).finally(() => {
      processingCount--;
      if (!isAppRendering && processingCount === 0) {
        stopListeningToInjectedHtml();
        injectedHtmlDonePromise.resolve();
      }
    });
  }
  injectedHtmlDonePromise.then(() => {
    const finalHtml = leftoverHtml + getBufferedRouterStream() + pendingClosingTags;
    finalPassThrough.end(finalHtml);
  }).catch((err) => {
    console.error("Error reading routerStream:", err);
    finalPassThrough.destroy(err);
  });
  readStream(appStream, {
    onData: (chunk) => {
      const text2 = decodeChunk(chunk.value);
      let chunkString = leftover + text2;
      const bodyEndMatch = chunkString.match(patternBodyEnd);
      const htmlEndMatch = chunkString.match(patternHtmlEnd);
      if (!bodyStarted) {
        const bodyStartMatch = chunkString.match(patternBodyStart);
        if (bodyStartMatch) {
          bodyStarted = true;
        }
      }
      if (!headStarted) {
        const headStartMatch = chunkString.match(patternHeadStart);
        if (headStartMatch) {
          headStarted = true;
          const index2 = headStartMatch.index;
          const headTag = headStartMatch[0];
          const remaining = chunkString.slice(index2 + headTag.length);
          finalPassThrough.write(
            chunkString.slice(0, index2) + headTag + getBufferedRouterStream()
          );
          chunkString = remaining;
        }
      }
      if (!bodyStarted) {
        finalPassThrough.write(chunkString);
        leftover = "";
        return;
      }
      if (bodyEndMatch && htmlEndMatch && bodyEndMatch.index < htmlEndMatch.index) {
        const bodyEndIndex = bodyEndMatch.index;
        pendingClosingTags = chunkString.slice(bodyEndIndex);
        finalPassThrough.write(
          chunkString.slice(0, bodyEndIndex) + getBufferedRouterStream()
        );
        leftover = "";
        return;
      }
      let result;
      let lastIndex = 0;
      while ((result = patternClosingTag.exec(chunkString)) !== null) {
        lastIndex = result.index + result[0].length;
      }
      if (lastIndex > 0) {
        const processed = chunkString.slice(0, lastIndex) + getBufferedRouterStream() + leftoverHtml;
        finalPassThrough.write(processed);
        leftover = chunkString.slice(lastIndex);
      } else {
        leftover = chunkString;
        leftoverHtml += getBufferedRouterStream();
      }
    },
    onEnd: () => {
      isAppRendering = false;
      if (processingCount === 0) {
        injectedHtmlDonePromise.resolve();
      }
    },
    onError: (error) => {
      console.error("Error reading appStream:", error);
      finalPassThrough.destroy(error);
    }
  });
  return finalPassThrough.stream;
}
function splitSetCookieString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitSetCookieString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start, cookiesString.length));
    }
  }
  return cookiesStrings;
}
function toHeadersInstance(init) {
  if (init instanceof Headers) {
    return new Headers(init);
  } else if (Array.isArray(init)) {
    return new Headers(init);
  } else if (typeof init === "object") {
    return new Headers(init);
  } else {
    return new Headers();
  }
}
function mergeHeaders(...headers) {
  return headers.reduce((acc, header) => {
    const headersInstance = toHeadersInstance(header);
    for (const [key, value] of headersInstance.entries()) {
      if (key === "set-cookie") {
        const splitCookies = splitSetCookieString(value);
        splitCookies.forEach((cookie) => acc.append("set-cookie", cookie));
      } else {
        acc.set(key, value);
      }
    }
    return acc;
  }, new Headers());
}
const startSerializer = {
  stringify: (value) => JSON.stringify(value, function replacer(key, val) {
    const ogVal = this[key];
    const serializer = serializers.find((t) => t.stringifyCondition(ogVal));
    if (serializer) {
      return serializer.stringify(ogVal);
    }
    return val;
  }),
  parse: (value) => JSON.parse(value, function parser(key, val) {
    const ogVal = this[key];
    if (isPlainObject$2(ogVal)) {
      const serializer = serializers.find((t) => t.parseCondition(ogVal));
      if (serializer) {
        return serializer.parse(ogVal);
      }
    }
    return val;
  }),
  encode: (value) => {
    if (Array.isArray(value)) {
      return value.map((v2) => startSerializer.encode(v2));
    }
    if (isPlainObject$2(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, v2]) => [
          key,
          startSerializer.encode(v2)
        ])
      );
    }
    const serializer = serializers.find((t) => t.stringifyCondition(value));
    if (serializer) {
      return serializer.stringify(value);
    }
    return value;
  },
  decode: (value) => {
    if (isPlainObject$2(value)) {
      const serializer = serializers.find((t) => t.parseCondition(value));
      if (serializer) {
        return serializer.parse(value);
      }
    }
    if (Array.isArray(value)) {
      return value.map((v2) => startSerializer.decode(v2));
    }
    if (isPlainObject$2(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, v2]) => [
          key,
          startSerializer.decode(v2)
        ])
      );
    }
    return value;
  }
};
const createSerializer = (key, check, toValue2, fromValue) => ({
  key,
  stringifyCondition: check,
  stringify: (value) => ({ [`$${key}`]: toValue2(value) }),
  parseCondition: (value) => Object.hasOwn(value, `$${key}`),
  parse: (value) => fromValue(value[`$${key}`])
});
const serializers = [
  createSerializer(
    // Key
    "undefined",
    // Check
    (v2) => v2 === void 0,
    // To
    () => 0,
    // From
    () => void 0
  ),
  createSerializer(
    // Key
    "date",
    // Check
    (v2) => v2 instanceof Date,
    // To
    (v2) => v2.toISOString(),
    // From
    (v2) => new Date(v2)
  ),
  createSerializer(
    // Key
    "error",
    // Check
    (v2) => v2 instanceof Error,
    // To
    (v2) => ({
      ...v2,
      message: v2.message,
      stack: void 0,
      cause: v2.cause
    }),
    // From
    (v2) => Object.assign(new Error(v2.message), v2)
  ),
  createSerializer(
    // Key
    "formData",
    // Check
    (v2) => v2 instanceof FormData,
    // To
    (v2) => {
      const entries = {};
      v2.forEach((value, key) => {
        const entry = entries[key];
        if (entry !== void 0) {
          if (Array.isArray(entry)) {
            entry.push(value);
          } else {
            entries[key] = [entry, value];
          }
        } else {
          entries[key] = value;
        }
      });
      return entries;
    },
    // From
    (v2) => {
      const formData = new FormData();
      Object.entries(v2).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((val) => formData.append(key, val));
        } else {
          formData.append(key, value);
        }
      });
      return formData;
    }
  ),
  createSerializer(
    // Key
    "bigint",
    // Check
    (v2) => typeof v2 === "bigint",
    // To
    (v2) => v2.toString(),
    // From
    (v2) => BigInt(v2)
  )
];
const globalMiddleware = [];
function createServerFn(options, __opts) {
  const resolvedOptions = __opts || options || {};
  if (typeof resolvedOptions.method === "undefined") {
    resolvedOptions.method = "GET";
  }
  return {
    options: resolvedOptions,
    middleware: (middleware) => {
      return createServerFn(void 0, Object.assign(resolvedOptions, {
        middleware
      }));
    },
    validator: (validator) => {
      return createServerFn(void 0, Object.assign(resolvedOptions, {
        validator
      }));
    },
    type: (type) => {
      return createServerFn(void 0, Object.assign(resolvedOptions, {
        type
      }));
    },
    handler: (...args) => {
      const [extractedFn, serverFn] = args;
      Object.assign(resolvedOptions, {
        ...extractedFn,
        extractedFn,
        serverFn
      });
      const resolvedMiddleware = [...resolvedOptions.middleware || [], serverFnBaseToMiddleware(resolvedOptions)];
      return Object.assign(async (opts) => {
        return executeMiddleware$1(resolvedMiddleware, "client", {
          ...extractedFn,
          ...resolvedOptions,
          data: opts == null ? void 0 : opts.data,
          headers: opts == null ? void 0 : opts.headers,
          signal: opts == null ? void 0 : opts.signal,
          context: {}
        }).then((d) => {
          if (resolvedOptions.response === "full") {
            return d;
          }
          if (d.error) throw d.error;
          return d.result;
        });
      }, {
        // This copies over the URL, function ID
        ...extractedFn,
        // The extracted function on the server-side calls
        // this function
        __executeServer: async (opts_, signal) => {
          const opts = opts_ instanceof FormData ? extractFormDataContext(opts_) : opts_;
          opts.type = typeof resolvedOptions.type === "function" ? resolvedOptions.type(opts) : resolvedOptions.type;
          const ctx = {
            ...extractedFn,
            ...opts,
            signal
          };
          const run = () => executeMiddleware$1(resolvedMiddleware, "server", ctx).then((d) => ({
            // Only send the result and sendContext back to the client
            result: d.result,
            error: d.error,
            context: d.sendContext
          }));
          if (ctx.type === "static") {
            let response;
            if (serverFnStaticCache == null ? void 0 : serverFnStaticCache.getItem) {
              response = await serverFnStaticCache.getItem(ctx);
            }
            if (!response) {
              response = await run().then((d) => {
                return {
                  ctx: d,
                  error: null
                };
              }).catch((e) => {
                return {
                  ctx: void 0,
                  error: e
                };
              });
              if (serverFnStaticCache == null ? void 0 : serverFnStaticCache.setItem) {
                await serverFnStaticCache.setItem(ctx, response);
              }
            }
            invariant(response);
            if (response.error) {
              throw response.error;
            }
            return response.ctx;
          }
          return run();
        }
      });
    }
  };
}
async function executeMiddleware$1(middlewares, env2, opts) {
  const flattenedMiddlewares = flattenMiddlewares([...globalMiddleware, ...middlewares]);
  const next = async (ctx) => {
    const nextMiddleware = flattenedMiddlewares.shift();
    if (!nextMiddleware) {
      return ctx;
    }
    if (nextMiddleware.options.validator && (env2 === "client" ? nextMiddleware.options.validateClient : true)) {
      ctx.data = await execValidator(nextMiddleware.options.validator, ctx.data);
    }
    const middlewareFn = env2 === "client" ? nextMiddleware.options.client : nextMiddleware.options.server;
    if (middlewareFn) {
      return applyMiddleware(middlewareFn, ctx, async (newCtx) => {
        return next(newCtx).catch((error) => {
          if (isRedirect(error) || isNotFound(error)) {
            return {
              ...newCtx,
              error
            };
          }
          throw error;
        });
      });
    }
    return next(ctx);
  };
  return next({
    ...opts,
    headers: opts.headers || {},
    sendContext: opts.sendContext || {},
    context: opts.context || {}
  });
}
let serverFnStaticCache;
function setServerFnStaticCache(cache) {
  const previousCache = serverFnStaticCache;
  serverFnStaticCache = typeof cache === "function" ? cache() : cache;
  return () => {
    serverFnStaticCache = previousCache;
  };
}
function createServerFnStaticCache(serverFnStaticCache2) {
  return serverFnStaticCache2;
}
async function sha1Hash(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
setServerFnStaticCache(() => {
  const getStaticCacheUrl = async (options, hash) => {
    const filename = await sha1Hash(`${options.functionId}__${hash}`);
    return `/__tsr/staticServerFnCache/${filename}.json`;
  };
  const jsonToFilenameSafeString = (json2) => {
    const sortedKeysReplacer = (key, value) => value && typeof value === "object" && !Array.isArray(value) ? Object.keys(value).sort().reduce((acc, curr) => {
      acc[curr] = value[curr];
      return acc;
    }, {}) : value;
    const jsonString = JSON.stringify(json2 ?? "", sortedKeysReplacer);
    return jsonString.replace(/[/\\?%*:|"<>]/g, "-").replace(/\s+/g, "_");
  };
  const staticClientCache = typeof document !== "undefined" ? /* @__PURE__ */ new Map() : null;
  return createServerFnStaticCache({
    getItem: async (ctx) => {
      if (typeof document === "undefined") {
        const hash = jsonToFilenameSafeString(ctx.data);
        const url = await getStaticCacheUrl(ctx, hash);
        const publicUrl = "/home/dogpawhat/Development/preloading-example/.output/public";
        const {
          promises: fs
        } = await import('node:fs');
        const path = await import('node:path');
        const filePath = path.join(publicUrl, url);
        const [cachedResult, readError] = await fs.readFile(filePath, "utf-8").then((c) => [startSerializer.parse(c), null]).catch((e) => [null, e]);
        if (readError && readError.code !== "ENOENT") {
          throw readError;
        }
        return cachedResult;
      }
      return void 0;
    },
    setItem: async (ctx, response) => {
      const {
        promises: fs
      } = await import('node:fs');
      const path = await import('node:path');
      const hash = jsonToFilenameSafeString(ctx.data);
      const url = await getStaticCacheUrl(ctx, hash);
      const publicUrl = "/home/dogpawhat/Development/preloading-example/.output/public";
      const filePath = path.join(publicUrl, url);
      await fs.mkdir(path.dirname(filePath), {
        recursive: true
      });
      await fs.writeFile(filePath, startSerializer.stringify(response));
    },
    fetchItem: async (ctx) => {
      const hash = jsonToFilenameSafeString(ctx.data);
      const url = await getStaticCacheUrl(ctx, hash);
      let result = staticClientCache == null ? void 0 : staticClientCache.get(url);
      if (!result) {
        result = await fetch(url, {
          method: "GET"
        }).then((r) => r.text()).then((d) => startSerializer.parse(d));
        staticClientCache == null ? void 0 : staticClientCache.set(url, result);
      }
      return result;
    }
  });
});
function extractFormDataContext(formData) {
  const serializedContext = formData.get("__TSR_CONTEXT");
  formData.delete("__TSR_CONTEXT");
  if (typeof serializedContext !== "string") {
    return {
      context: {},
      data: formData
    };
  }
  try {
    const context = startSerializer.parse(serializedContext);
    return {
      context,
      data: formData
    };
  } catch {
    return {
      data: formData
    };
  }
}
function flattenMiddlewares(middlewares) {
  const seen = /* @__PURE__ */ new Set();
  const flattened = [];
  const recurse = (middleware) => {
    middleware.forEach((m) => {
      if (m.options.middleware) {
        recurse(m.options.middleware);
      }
      if (!seen.has(m)) {
        seen.add(m);
        flattened.push(m);
      }
    });
  };
  recurse(middlewares);
  return flattened;
}
const applyMiddleware = async (middlewareFn, ctx, nextFn) => {
  return middlewareFn({
    ...ctx,
    next: async (userCtx = {}) => {
      return nextFn({
        ...ctx,
        ...userCtx,
        context: {
          ...ctx.context,
          ...userCtx.context
        },
        sendContext: {
          ...ctx.sendContext,
          ...userCtx.sendContext ?? {}
        },
        headers: mergeHeaders(ctx.headers, userCtx.headers),
        result: userCtx.result !== void 0 ? userCtx.result : ctx.response === "raw" ? userCtx : ctx.result,
        error: userCtx.error ?? ctx.error
      });
    }
  });
};
function execValidator(validator, input) {
  if (validator == null) return {};
  if ("~standard" in validator) {
    const result = validator["~standard"].validate(input);
    if (result instanceof Promise) throw new Error("Async validation not supported");
    if (result.issues) throw new Error(JSON.stringify(result.issues, void 0, 2));
    return result.value;
  }
  if ("parse" in validator) {
    return validator.parse(input);
  }
  if (typeof validator === "function") {
    return validator(input);
  }
  throw new Error("Invalid validator type!");
}
function serverFnBaseToMiddleware(options) {
  return {
    _types: void 0,
    options: {
      validator: options.validator,
      validateClient: options.validateClient,
      client: async ({
        next,
        sendContext,
        ...ctx
      }) => {
        var _a2;
        const payload = {
          ...ctx,
          // switch the sendContext over to context
          context: sendContext,
          type: typeof ctx.type === "function" ? ctx.type(ctx) : ctx.type
        };
        if (ctx.type === "static" && "production" === "production" && typeof document !== "undefined") {
          invariant(serverFnStaticCache);
          const result = await serverFnStaticCache.fetchItem(payload);
          if (result) {
            if (result.error) {
              throw result.error;
            }
            return next(result.ctx);
          }
          warning(result, `No static cache item found for ${payload.functionId}__${JSON.stringify(payload.data)}, falling back to server function...`);
        }
        const res = await ((_a2 = options.extractedFn) == null ? void 0 : _a2.call(options, payload));
        return next(res);
      },
      server: async ({
        next,
        ...ctx
      }) => {
        var _a2;
        const result = await ((_a2 = options.serverFn) == null ? void 0 : _a2.call(options, ctx));
        return next({
          ...ctx,
          result
        });
      }
    }
  };
}
function json(payload, init) {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: mergeHeaders(
      { "content-type": "application/json" },
      init == null ? void 0 : init.headers
    )
  });
}
function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}
var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class H3Error extends Error {
  constructor(message, opts = {}) {
    super(message, opts);
    __publicField$2(this, "statusCode", 500);
    __publicField$2(this, "fatal", false);
    __publicField$2(this, "unhandled", false);
    __publicField$2(this, "statusMessage");
    __publicField$2(this, "data");
    __publicField$2(this, "cause");
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
__publicField$2(H3Error, "__h3_error__", true);
function createError(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError$1(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function isError$1(input) {
  var _a2;
  return ((_a2 = input == null ? void 0 : input.constructor) == null ? void 0 : _a2.__h3_error__) === true;
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const xForwardedHost = event.node.req.headers["x-forwarded-host"];
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  var _a2;
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return ((_a2 = event.node.req.connection) == null ? void 0 : _a2.encrypted) ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}
function toWebRequest(event) {
  var _a2;
  return ((_a2 = event.web) == null ? void 0 : _a2.request) || new Request(getRequestURL(event), {
    // @ts-ignore Undici option
    duplex: "half",
    method: event.method,
    headers: event.headers,
    body: getRequestWebStream(event)
  });
}
const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  var _a2, _b2;
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || ((_b2 = (_a2 = event.web) == null ? void 0 : _a2.request) == null ? void 0 : _b2.body) || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  var _a2, _b2;
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = ((_b2 = (_a2 = event.web) == null ? void 0 : _a2.request) == null ? void 0 : _b2.body) || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}
typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function getResponseStatus$1(event) {
  return event.node.res.statusCode;
}
function getResponseHeaders$1(event) {
  return event.node.res.getHeaders();
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class H3Event {
  constructor(req, res) {
    __publicField(this, "__is_event__", true);
    __publicField(this, "node");
    __publicField(this, "web");
    __publicField(this, "context", {});
    __publicField(this, "_method");
    __publicField(this, "_path");
    __publicField(this, "_headers");
    __publicField(this, "_requestBody");
    __publicField(this, "_handled", false);
    __publicField(this, "_onBeforeResponseCalled");
    __publicField(this, "_onAfterResponseCalled");
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}
function defineEventHandler$1(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventStorage = new AsyncLocalStorage();
function defineEventHandler(handler) {
  return defineEventHandler$1((event) => {
    return runWithEvent(event, () => handler(event));
  });
}
async function runWithEvent(event, fn) {
  return eventStorage.run(event, fn);
}
function getEvent() {
  const event = eventStorage.getStore();
  if (!event) {
    throw new Error(
      `No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`
    );
  }
  return event;
}
const HTTPEventSymbol = Symbol("$HTTPEvent");
function isEvent(obj) {
  return typeof obj === "object" && (obj instanceof H3Event || (obj == null ? void 0 : obj[HTTPEventSymbol]) instanceof H3Event || (obj == null ? void 0 : obj.__is_event__) === true);
}
function createWrapperFunction(h3Function) {
  return function(...args) {
    const event = args[0];
    if (!isEvent(event)) {
      args.unshift(getEvent());
    } else {
      args[0] = event instanceof H3Event || event.__is_event__ ? event : event[HTTPEventSymbol];
    }
    return h3Function(...args);
  };
}
const getResponseStatus = createWrapperFunction(getResponseStatus$1);
const getResponseHeaders = createWrapperFunction(getResponseHeaders$1);
function requestHandler(handler) {
  return handler;
}
const minifiedTsrBootStrapScript = 'const __TSR_SSR__={matches:[],streamedValues:{},initMatch:o=>(__TSR_SSR__.matches.push(o),o.extracted?.forEach(l=>{if(l.type==="stream"){let r;l.value=new ReadableStream({start(e){r={enqueue:t=>{try{e.enqueue(t)}catch{}},close:()=>{try{e.close()}catch{}}}}}),l.value.controller=r}else{let r,e;l.value=new Promise((t,a)=>{e=a,r=t}),l.value.reject=e,l.value.resolve=r}}),!0),resolvePromise:({matchId:o,id:l,promiseState:r})=>{const e=__TSR_SSR__.matches.find(t=>t.id===o);if(e){const t=e.extracted?.[l];if(t&&t.type==="promise"&&t.value&&r.status==="success")return t.value.resolve(r.data),!0}return!1},injectChunk:({matchId:o,id:l,chunk:r})=>{const e=__TSR_SSR__.matches.find(t=>t.id===o);if(e){const t=e.extracted?.[l];if(t&&t.type==="stream"&&t.value?.controller)return t.value.controller.enqueue(new TextEncoder().encode(r.toString())),!0}return!1},closeStream:({matchId:o,id:l})=>{const r=__TSR_SSR__.matches.find(e=>e.id===o);if(r){const e=r.extracted?.[l];if(e&&e.type==="stream"&&e.value?.controller)return e.value.controller.close(),!0}return!1},cleanScripts:()=>{document.querySelectorAll(".tsr-once").forEach(o=>{o.remove()})}};window.__TSR_SSR__=__TSR_SSR__;\n';
function attachRouterServerSsrUtils(router, manifest) {
  router.ssr = {
    manifest,
    serializer: startSerializer
  };
  router.serverSsr = {
    injectedHtml: [],
    streamedKeys: /* @__PURE__ */ new Set(),
    injectHtml: (getHtml) => {
      const promise = Promise.resolve().then(getHtml);
      router.serverSsr.injectedHtml.push(promise);
      router.emit({
        type: "onInjectedHtml",
        promise
      });
      return promise.then(() => {
      });
    },
    injectScript: (getScript, opts) => {
      return router.serverSsr.injectHtml(async () => {
        const script = await getScript();
        return `<script class='tsr-once'>${script}${""}; if (typeof __TSR_SSR__ !== 'undefined') __TSR_SSR__.cleanScripts()<\/script>`;
      });
    },
    streamValue: (key, value) => {
      warning(
        !router.serverSsr.streamedKeys.has(key));
      router.serverSsr.streamedKeys.add(key);
      router.serverSsr.injectScript(
        () => `__TSR_SSR__.streamedValues['${key}'] = { value: ${jsesc(
          router.ssr.serializer.stringify(value),
          {
            isScriptContext: true,
            wrap: true,
            json: true
          }
        )}}`
      );
    },
    onMatchSettled
  };
  router.serverSsr.injectScript(() => minifiedTsrBootStrapScript, {
    logScript: false
  });
}
function dehydrateRouter(router) {
  var _a2, _b2, _c2;
  const dehydratedRouter = {
    manifest: router.ssr.manifest,
    dehydratedData: (_b2 = (_a2 = router.options).dehydrate) == null ? void 0 : _b2.call(_a2),
    lastMatchId: ((_c2 = router.state.matches[router.state.matches.length - 1]) == null ? void 0 : _c2.id) || ""
  };
  router.serverSsr.injectScript(
    () => `__TSR_SSR__.dehydrated = ${jsesc(
      router.ssr.serializer.stringify(dehydratedRouter),
      {
        isScriptContext: true,
        wrap: true,
        json: true
      }
    )}`
  );
}
function extractAsyncLoaderData(loaderData, ctx) {
  const extracted = [];
  const replaced = replaceBy(loaderData, (value, path) => {
    if (value instanceof ReadableStream) {
      const [copy1, copy2] = value.tee();
      const entry = {
        type: "stream",
        path,
        id: extracted.length,
        matchIndex: ctx.match.index,
        stream: copy2
      };
      extracted.push(entry);
      return copy1;
    } else if (value instanceof Promise) {
      const deferredPromise = defer(value);
      const entry = {
        type: "promise",
        path,
        id: extracted.length,
        matchIndex: ctx.match.index,
        promise: deferredPromise
      };
      extracted.push(entry);
    }
    return value;
  });
  return { replaced, extracted };
}
function onMatchSettled(opts) {
  const { router, match } = opts;
  let extracted = void 0;
  let serializedLoaderData = void 0;
  if (match.loaderData !== void 0) {
    const result = extractAsyncLoaderData(match.loaderData, {
      match
    });
    match.loaderData = result.replaced;
    extracted = result.extracted;
    serializedLoaderData = extracted.reduce(
      (acc, entry) => {
        return deepImmutableSetByPath(acc, ["temp", ...entry.path], void 0);
      },
      { temp: result.replaced }
    ).temp;
  }
  const initCode = `__TSR_SSR__.initMatch(${jsesc(
    {
      id: match.id,
      __beforeLoadContext: router.ssr.serializer.stringify(
        match.__beforeLoadContext
      ),
      loaderData: router.ssr.serializer.stringify(serializedLoaderData),
      error: router.ssr.serializer.stringify(match.error),
      extracted: extracted == null ? void 0 : extracted.map((entry) => pick(entry, ["type", "path"])),
      updatedAt: match.updatedAt,
      status: match.status
    },
    {
      isScriptContext: true,
      wrap: true,
      json: true
    }
  )})`;
  router.serverSsr.injectScript(() => initCode);
  if (extracted) {
    extracted.forEach((entry) => {
      if (entry.type === "promise") return injectPromise(entry);
      return injectStream(entry);
    });
  }
  function injectPromise(entry) {
    router.serverSsr.injectScript(async () => {
      await entry.promise;
      return `__TSR_SSR__.resolvePromise(${jsesc(
        {
          matchId: match.id,
          id: entry.id,
          promiseState: entry.promise[TSR_DEFERRED_PROMISE]
        },
        {
          isScriptContext: true,
          wrap: true,
          json: true
        }
      )})`;
    });
  }
  function injectStream(entry) {
    router.serverSsr.injectHtml(async () => {
      try {
        const reader = entry.stream.getReader();
        let chunk = null;
        while (!(chunk = await reader.read()).done) {
          if (chunk.value) {
            const code = `__TSR_SSR__.injectChunk(${jsesc(
              {
                matchId: match.id,
                id: entry.id,
                chunk: chunk.value
              },
              {
                isScriptContext: true,
                wrap: true,
                json: true
              }
            )})`;
            router.serverSsr.injectScript(() => code);
          }
        }
        router.serverSsr.injectScript(
          () => `__TSR_SSR__.closeStream(${jsesc(
            {
              matchId: match.id,
              id: entry.id
            },
            {
              isScriptContext: true,
              wrap: true,
              json: true
            }
          )})`
        );
      } catch (err) {
        console.error("stream read error", err);
      }
      return "";
    });
  }
}
function deepImmutableSetByPath(obj, path, value) {
  if (path.length === 0) {
    return value;
  }
  const [key, ...rest] = path;
  if (Array.isArray(obj)) {
    return obj.map((item, i) => {
      if (i === Number(key)) {
        return deepImmutableSetByPath(item, rest, value);
      }
      return item;
    });
  }
  if (isPlainObject$2(obj)) {
    return {
      ...obj,
      [key]: deepImmutableSetByPath(obj[key], rest, value)
    };
  }
  return obj;
}
function replaceBy(obj, cb, path = []) {
  if (isPlainArray$1(obj)) {
    return obj.map((value, i) => replaceBy(value, cb, [...path, `${i}`]));
  }
  if (isPlainObject$2(obj)) {
    const newObj2 = {};
    for (const key in obj) {
      newObj2[key] = replaceBy(obj[key], cb, [...path, key]);
    }
    return newObj2;
  }
  const newObj = cb(obj, path);
  if (newObj !== obj) {
    return newObj;
  }
  return obj;
}
const tsrStartManifest = () => ({ "routes": { "__root__": { "filePath": "__root.tsx", "children": ["/", "/basic", "/intent-preloading", "/pagination", "/preloading", "/suspense"], "preloads": ["/assets/main-C_SO_aYE.js"], "assets": [{ "tag": "script", "attrs": { "src": "/assets/main-C_SO_aYE.js", "type": "module" } }] }, "/": { "filePath": "index.tsx", "assets": [], "preloads": ["/assets/index-Cb09vRb3.js"] }, "/basic": { "filePath": "basic.tsx", "assets": [], "preloads": ["/assets/basic-D_HBRECz.js", "/assets/table-BGKcx7UY.js"] }, "/intent-preloading": { "filePath": "intent-preloading.tsx", "assets": [], "preloads": ["/assets/intent-preloading-BYVPES3z.js"] }, "/pagination": { "filePath": "pagination.tsx", "assets": [], "preloads": ["/assets/pagination-DT5U_TVa.js"] }, "/preloading": { "filePath": "preloading.tsx", "assets": [], "preloads": ["/assets/preloading-CF6-eBB1.js"] }, "/suspense": { "filePath": "suspense.tsx", "assets": [], "preloads": ["/assets/suspense-CVRJPFh1.js"] } } });
function getStartManifest() {
  const startManifest = tsrStartManifest();
  const rootRoute = startManifest.routes[rootRouteId] = startManifest.routes[rootRouteId] || {};
  rootRoute.assets = rootRoute.assets || [];
  const manifest = {
    ...startManifest,
    routes: Object.fromEntries(
      Object.entries(startManifest.routes).map(([k, v2]) => {
        const { preloads, assets } = v2;
        return [
          k,
          {
            preloads,
            assets
          }
        ];
      })
    )
  };
  return manifest;
}
const _serverFnManifest = {
  "src_util_pokemon_ts--getServerPokemonList_createServerFn_handler": {
    functionName: "getServerPokemonList_createServerFn_handler",
    importer: () => import('./pokemon-BBQDA5Ex.mjs')
  }
};
const serverFnManifest = _serverFnManifest;
function sanitizeBase$1(base) {
  return base.replace(/^\/|\/$/g, "");
}
const handleServerAction = async ({
  request
}) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const abort = () => controller.abort();
  request.signal.addEventListener("abort", abort);
  const method = request.method;
  const url = new URL(request.url, "http://localhost:3000");
  const regex = new RegExp(`${sanitizeBase$1("/_serverFn")}/([^/?#]+)`);
  const match = url.pathname.match(regex);
  const serverFnId = match ? match[1] : null;
  const search = Object.fromEntries(url.searchParams.entries());
  const isCreateServerFn = "createServerFn" in search;
  const isRaw = "raw" in search;
  if (typeof serverFnId !== "string") {
    throw new Error("Invalid server action param for serverFnId: " + serverFnId);
  }
  const serverFnInfo = serverFnManifest[serverFnId];
  if (!serverFnInfo) {
    console.info("serverFnManifest", serverFnManifest);
    throw new Error("Server function info not found for " + serverFnId);
  }
  const fnModule = await serverFnInfo.importer();
  if (!fnModule) {
    console.info("serverFnInfo", serverFnInfo);
    throw new Error("Server function module not resolved for " + serverFnId);
  }
  const action = fnModule[serverFnInfo.functionName];
  if (!action) {
    console.info("serverFnInfo", serverFnInfo);
    console.info("fnModule", fnModule);
    throw new Error(`Server function module export not resolved for serverFn ID: ${serverFnId}`);
  }
  const formDataContentTypes = ["multipart/form-data", "application/x-www-form-urlencoded"];
  const response = await (async () => {
    try {
      let result = await (async () => {
        if (request.headers.get("Content-Type") && formDataContentTypes.some((type) => {
          var _a2;
          return (_a2 = request.headers.get("Content-Type")) == null ? void 0 : _a2.includes(type);
        })) {
          invariant(method.toLowerCase() !== "get", "GET requests with FormData payloads are not supported");
          return await action(await request.formData(), signal);
        }
        if (method.toLowerCase() === "get") {
          let payload2 = search;
          if (isCreateServerFn) {
            payload2 = search.payload;
          }
          payload2 = payload2 ? startSerializer.parse(payload2) : payload2;
          return await action(payload2, signal);
        }
        const jsonPayloadAsString = await request.text();
        const payload = startSerializer.parse(jsonPayloadAsString);
        if (isCreateServerFn) {
          return await action(payload, signal);
        }
        return await action(...payload, signal);
      })();
      if (result.result instanceof Response) {
        return result.result;
      }
      if (!isCreateServerFn) {
        result = result.result;
        if (result instanceof Response) {
          return result;
        }
      }
      if (isNotFound(result)) {
        return isNotFoundResponse(result);
      }
      return new Response(result !== void 0 ? startSerializer.stringify(result) : void 0, {
        status: getResponseStatus(getEvent()),
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }
      if (isNotFound(error)) {
        return isNotFoundResponse(error);
      }
      console.info();
      console.info("Server Fn Error!");
      console.info();
      console.error(error);
      console.info();
      return new Response(startSerializer.stringify(error), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  })();
  request.signal.removeEventListener("abort", abort);
  if (isRaw) {
    return response;
  }
  return response;
};
function isNotFoundResponse(error) {
  const {
    headers,
    ...rest
  } = error;
  return new Response(JSON.stringify(rest), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...headers || {}
    }
  });
}
function getStartResponseHeaders(opts) {
  let headers = mergeHeaders(
    getResponseHeaders(),
    {
      "Content-Type": "text/html; charset=UTF-8"
    },
    ...opts.router.state.matches.map((match) => {
      return match.headers;
    })
  );
  const { redirect } = opts.router.state;
  if (redirect) {
    headers = mergeHeaders(headers, redirect.headers);
  }
  return headers;
}
function createStartHandler({
  createRouter: createRouter2
}) {
  return (cb) => {
    const originalFetch = globalThis.fetch;
    const startRequestResolver = async ({ request }) => {
      globalThis.fetch = async function(input, init) {
        function resolve(url2, requestOptions) {
          const fetchRequest = new Request(url2, requestOptions);
          return startRequestResolver({ request: fetchRequest });
        }
        function getOrigin() {
          return request.headers.get("Origin") || request.headers.get("Referer") || "http://localhost";
        }
        if (typeof input === "string" && input.startsWith("/")) {
          const url2 = new URL(input, getOrigin());
          return resolve(url2, init);
        } else if (typeof input === "object" && "url" in input && typeof input.url === "string" && input.url.startsWith("/")) {
          const url2 = new URL(input.url, getOrigin());
          return resolve(url2, init);
        }
        return originalFetch(input, init);
      };
      const url = new URL(request.url);
      const href = url.href.replace(url.origin, "");
      const history = createMemoryHistory({
        initialEntries: [href]
      });
      const router = createRouter2();
      attachRouterServerSsrUtils(router, getStartManifest());
      router.update({
        history
      });
      const response = await (async () => {
        try {
          if (false) ;
          const serverFnBase = joinPaths([
            "/",
            trimPath("/_serverFn"),
            "/"
          ]);
          if (href.startsWith(serverFnBase)) {
            return await handleServerAction({ request });
          }
          const serverRouteTreeModule = await (async () => {
            try {
              return await import(
                // @ts-expect-error
                './routeTree.gen-C-haoEjS.mjs'
              );
            } catch (e) {
              console.log(e);
              return void 0;
            }
          })();
          if (serverRouteTreeModule) {
            const [_matchedRoutes, response3] = await handleServerRoutes({
              routeTree: serverRouteTreeModule.routeTree,
              request
            });
            if (response3) return response3;
          }
          const requestAcceptHeader = request.headers.get("Accept") || "*/*";
          const splitRequestAcceptHeader = requestAcceptHeader.split(",");
          const supportedMimeTypes = ["*/*", "text/html"];
          const isRouterAcceptSupported = supportedMimeTypes.some(
            (mimeType) => splitRequestAcceptHeader.some(
              (acceptedMimeType) => acceptedMimeType.trim().startsWith(mimeType)
            )
          );
          if (!isRouterAcceptSupported) {
            return json(
              {
                error: "Only HTML requests are supported here"
              },
              {
                status: 500
              }
            );
          }
          await router.load();
          if (router.state.redirect) return router.state.redirect;
          dehydrateRouter(router);
          const responseHeaders = getStartResponseHeaders({ router });
          const response2 = await cb({
            request,
            router,
            responseHeaders
          });
          return response2;
        } catch (err) {
          if (err instanceof Response) {
            return err;
          }
          throw err;
        }
      })();
      if (isRedirect(response)) {
        if (isResolvedRedirect(response)) {
          if (request.headers.get("x-tsr-redirect") === "manual") {
            return json(
              {
                ...response.options,
                isSerializedRedirect: true
              },
              {
                headers: response.headers
              }
            );
          }
          return response;
        }
        if (response.options.to && typeof response.options.to === "string" && !response.options.to.startsWith("/")) {
          throw new Error(
            `Server side redirects must use absolute paths via the 'href' or 'to' options. Received: ${JSON.stringify(response.options)}`
          );
        }
        if (["params", "search", "hash"].some(
          (d) => typeof response.options[d] === "function"
        )) {
          throw new Error(
            `Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(
              response.options
            ).filter((d) => typeof response.options[d] === "function").map((d) => `"${d}"`).join(", ")}`
          );
        }
        const redirect = router.resolveRedirect(response);
        if (request.headers.get("x-tsr-redirect") === "manual") {
          return json(
            {
              ...response.options,
              isSerializedRedirect: true
            },
            {
              headers: response.headers
            }
          );
        }
        return redirect;
      }
      return response;
    };
    return requestHandler(startRequestResolver);
  };
}
async function handleServerRoutes({
  routeTree: routeTree2,
  request
}) {
  const { flatRoutes, routesById, routesByPath } = processRouteTree({
    routeTree: routeTree2,
    initRoute: (route, i) => {
      route.init({
        originalIndex: i
      });
    }
  });
  const url = new URL(request.url);
  const pathname = url.pathname;
  const history = createMemoryHistory({
    initialEntries: [pathname]
  });
  const { matchedRoutes, foundRoute, routeParams } = getMatchedRoutes({
    pathname: history.location.pathname,
    basepath: "/",
    caseSensitive: true,
    routesByPath,
    routesById,
    flatRoutes
  });
  let response;
  if (foundRoute && foundRoute.id !== rootRouteId) {
    const method = Object.keys(foundRoute.options.methods).find(
      (method2) => method2.toLowerCase() === request.method.toLowerCase()
    );
    if (method) {
      const handler = foundRoute.options.methods[method];
      if (handler) {
        const middlewares = flattenMiddlewares(
          matchedRoutes.flatMap((r) => r.options.middleware).filter(Boolean)
        ).map((d) => d.options.server);
        middlewares.push(handlerToMiddleware(handler));
        const ctx = await executeMiddleware(middlewares, {
          request,
          context: {},
          params: routeParams,
          pathname: history.location.pathname
        });
        response = ctx.response;
      }
    }
  }
  return [matchedRoutes, response];
}
function handlerToMiddleware(handler) {
  return async ({ next: _next, ...rest }) => ({
    response: await handler(rest)
  });
}
function executeMiddleware(middlewares, ctx) {
  let index2 = -1;
  const next = async (ctx2) => {
    index2++;
    const middleware = middlewares[index2];
    if (!middleware) return ctx2;
    const result = await middleware({
      ...ctx2,
      // Allow the middleware to call the next middleware in the chain
      next: async (nextCtx) => {
        const nextResult = await next({ ...ctx2, ...nextCtx });
        return Object.assign(ctx2, handleCtxResult(nextResult));
      }
      // Allow the middleware result to extend the return context
    }).catch((err) => {
      if (isSpecialResponse(err)) {
        return {
          response: err
        };
      }
      throw err;
    });
    return Object.assign(ctx2, handleCtxResult(result));
  };
  return handleCtxResult(next(ctx));
}
function handleCtxResult(result) {
  if (isSpecialResponse(result)) {
    return {
      response: result
    };
  }
  return result;
}
function isSpecialResponse(err) {
  return isResponse(err) || isRedirect(err);
}
function isResponse(response) {
  return response instanceof Response;
}
function defineHandlerCallback(handler) {
  return handler;
}
const defaultStreamHandler = defineHandlerCallback(
  async ({ request, router, responseHeaders }) => {
    if (typeof ReactDOMServer.renderToReadableStream === "function") {
      const stream = await ReactDOMServer.renderToReadableStream(
        /* @__PURE__ */ jsx(StartServer, { router }),
        {
          signal: request.signal
        }
      );
      if (isbot(request.headers.get("User-Agent"))) {
        await stream.allReady;
      }
      const responseStream = transformReadableStreamWithRouter(
        router,
        stream
      );
      return new Response(responseStream, {
        status: router.state.statusCode,
        headers: responseHeaders
      });
    }
    if (typeof ReactDOMServer.renderToPipeableStream === "function") {
      const reactAppPassthrough = new PassThrough();
      try {
        const pipeable = ReactDOMServer.renderToPipeableStream(
          /* @__PURE__ */ jsx(StartServer, { router }),
          {
            ...isbot(request.headers.get("User-Agent")) ? {
              onAllReady() {
                pipeable.pipe(reactAppPassthrough);
              }
            } : {
              onShellReady() {
                pipeable.pipe(reactAppPassthrough);
              }
            },
            onError: (error, info) => {
              if (error instanceof Error && error.message === "ShellBoundaryError")
                return;
              console.error("Error in renderToPipeableStream:", error, info);
            }
          }
        );
      } catch (e) {
        console.error("Error in renderToPipeableStream:", e);
      }
      const responseStream = transformPipeableStreamWithRouter(
        router,
        reactAppPassthrough
      );
      return new Response(responseStream, {
        status: router.state.statusCode,
        headers: responseHeaders
      });
    }
    throw new Error(
      "No renderToReadableStream or renderToPipeableStream found in react-dom/server. Ensure you are using a version of react-dom that supports streaming."
    );
  }
);
var Subscribable = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = this.subscribe.bind(this);
  }
  subscribe(listener) {
    this.listeners.add(listener);
    this.onSubscribe();
    return () => {
      this.listeners.delete(listener);
      this.onUnsubscribe();
    };
  }
  hasListeners() {
    return this.listeners.size > 0;
  }
  onSubscribe() {
  }
  onUnsubscribe() {
  }
};
var isServer = "undefined" === "undefined";
function noop() {
}
function functionalUpdate(updater, input) {
  return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
  return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
  return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function resolveStaleTime(staleTime, query) {
  return typeof staleTime === "function" ? staleTime(query) : staleTime;
}
function resolveEnabled(enabled, query) {
  return typeof enabled === "function" ? enabled(query) : enabled;
}
function matchQuery(filters, query) {
  const {
    type = "all",
    exact,
    fetchStatus,
    predicate,
    queryKey,
    stale
  } = filters;
  if (queryKey) {
    if (exact) {
      if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
        return false;
      }
    } else if (!partialMatchKey(query.queryKey, queryKey)) {
      return false;
    }
  }
  if (type !== "all") {
    const isActive = query.isActive();
    if (type === "active" && !isActive) {
      return false;
    }
    if (type === "inactive" && isActive) {
      return false;
    }
  }
  if (typeof stale === "boolean" && query.isStale() !== stale) {
    return false;
  }
  if (fetchStatus && fetchStatus !== query.state.fetchStatus) {
    return false;
  }
  if (predicate && !predicate(query)) {
    return false;
  }
  return true;
}
function matchMutation(filters, mutation) {
  const { exact, status, predicate, mutationKey } = filters;
  if (mutationKey) {
    if (!mutation.options.mutationKey) {
      return false;
    }
    if (exact) {
      if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) {
        return false;
      }
    } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
      return false;
    }
  }
  if (status && mutation.state.status !== status) {
    return false;
  }
  if (predicate && !predicate(mutation)) {
    return false;
  }
  return true;
}
function hashQueryKeyByOptions(queryKey, options) {
  const hashFn = (options == null ? void 0 : options.queryKeyHashFn) || hashKey;
  return hashFn(queryKey);
}
function hashKey(queryKey) {
  return JSON.stringify(
    queryKey,
    (_, val) => isPlainObject$1(val) ? Object.keys(val).sort().reduce((result, key) => {
      result[key] = val[key];
      return result;
    }, {}) : val
  );
}
function partialMatchKey(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    return Object.keys(b).every((key) => partialMatchKey(a[key], b[key]));
  }
  return false;
}
function replaceEqualDeep(a, b) {
  if (a === b) {
    return a;
  }
  const array = isPlainArray(a) && isPlainArray(b);
  if (array || isPlainObject$1(a) && isPlainObject$1(b)) {
    const aItems = array ? a : Object.keys(a);
    const aSize = aItems.length;
    const bItems = array ? b : Object.keys(b);
    const bSize = bItems.length;
    const copy2 = array ? [] : {};
    let equalItems = 0;
    for (let i = 0; i < bSize; i++) {
      const key = array ? i : bItems[i];
      if ((!array && aItems.includes(key) || array) && a[key] === void 0 && b[key] === void 0) {
        copy2[key] = void 0;
        equalItems++;
      } else {
        copy2[key] = replaceEqualDeep(a[key], b[key]);
        if (copy2[key] === a[key] && a[key] !== void 0) {
          equalItems++;
        }
      }
    }
    return aSize === bSize && equalItems === aSize ? a : copy2;
  }
  return b;
}
function shallowEqualObjects(a, b) {
  if (!b || Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }
  for (const key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}
function isPlainArray(value) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject$1(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  }
  const ctor = o.constructor;
  if (ctor === void 0) {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  if (Object.getPrototypeOf(o) !== Object.prototype) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
function replaceData(prevData, data, options) {
  if (typeof options.structuralSharing === "function") {
    return options.structuralSharing(prevData, data);
  } else if (options.structuralSharing !== false) {
    return replaceEqualDeep(prevData, data);
  }
  return data;
}
function addToEnd(items, item, max = 0) {
  const newItems = [...items, item];
  return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
  const newItems = [item, ...items];
  return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
var skipToken = Symbol();
function ensureQueryFn(options, fetchOptions) {
  if (!options.queryFn && (fetchOptions == null ? void 0 : fetchOptions.initialPromise)) {
    return () => fetchOptions.initialPromise;
  }
  if (!options.queryFn || options.queryFn === skipToken) {
    return () => Promise.reject(new Error(`Missing queryFn: '${options.queryHash}'`));
  }
  return options.queryFn;
}
function shouldThrowError(throwOnError, params) {
  if (typeof throwOnError === "function") {
    return throwOnError(...params);
  }
  return !!throwOnError;
}
var FocusManager = (_a = class extends Subscribable {
  constructor() {
    super();
    __privateAdd(this, _focused);
    __privateAdd(this, _cleanup);
    __privateAdd(this, _setup);
    __privateSet(this, _setup, (onFocus) => {
      return;
    });
  }
  onSubscribe() {
    if (!__privateGet(this, _cleanup)) {
      this.setEventListener(__privateGet(this, _setup));
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _cleanup)) == null ? void 0 : _a2.call(this);
      __privateSet(this, _cleanup, void 0);
    }
  }
  setEventListener(setup) {
    var _a2;
    __privateSet(this, _setup, setup);
    (_a2 = __privateGet(this, _cleanup)) == null ? void 0 : _a2.call(this);
    __privateSet(this, _cleanup, setup((focused) => {
      if (typeof focused === "boolean") {
        this.setFocused(focused);
      } else {
        this.onFocus();
      }
    }));
  }
  setFocused(focused) {
    const changed = __privateGet(this, _focused) !== focused;
    if (changed) {
      __privateSet(this, _focused, focused);
      this.onFocus();
    }
  }
  onFocus() {
    const isFocused = this.isFocused();
    this.listeners.forEach((listener) => {
      listener(isFocused);
    });
  }
  isFocused() {
    var _a2;
    if (typeof __privateGet(this, _focused) === "boolean") {
      return __privateGet(this, _focused);
    }
    return ((_a2 = globalThis.document) == null ? void 0 : _a2.visibilityState) !== "hidden";
  }
}, _focused = new WeakMap(), _cleanup = new WeakMap(), _setup = new WeakMap(), _a);
var focusManager = new FocusManager();
var OnlineManager = (_b = class extends Subscribable {
  constructor() {
    super();
    __privateAdd(this, _online, true);
    __privateAdd(this, _cleanup2);
    __privateAdd(this, _setup2);
    __privateSet(this, _setup2, (onOnline) => {
      return;
    });
  }
  onSubscribe() {
    if (!__privateGet(this, _cleanup2)) {
      this.setEventListener(__privateGet(this, _setup2));
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _cleanup2)) == null ? void 0 : _a2.call(this);
      __privateSet(this, _cleanup2, void 0);
    }
  }
  setEventListener(setup) {
    var _a2;
    __privateSet(this, _setup2, setup);
    (_a2 = __privateGet(this, _cleanup2)) == null ? void 0 : _a2.call(this);
    __privateSet(this, _cleanup2, setup(this.setOnline.bind(this)));
  }
  setOnline(online) {
    const changed = __privateGet(this, _online) !== online;
    if (changed) {
      __privateSet(this, _online, online);
      this.listeners.forEach((listener) => {
        listener(online);
      });
    }
  }
  isOnline() {
    return __privateGet(this, _online);
  }
}, _online = new WeakMap(), _cleanup2 = new WeakMap(), _setup2 = new WeakMap(), _b);
var onlineManager = new OnlineManager();
function pendingThenable() {
  let resolve;
  let reject;
  const thenable = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  thenable.status = "pending";
  thenable.catch(() => {
  });
  function finalize(data) {
    Object.assign(thenable, data);
    delete thenable.resolve;
    delete thenable.reject;
  }
  thenable.resolve = (value) => {
    finalize({
      status: "fulfilled",
      value
    });
    resolve(value);
  };
  thenable.reject = (reason) => {
    finalize({
      status: "rejected",
      reason
    });
    reject(reason);
  };
  return thenable;
}
function tryResolveSync(promise) {
  var _a2;
  let data;
  (_a2 = promise.then((result) => {
    data = result;
    return result;
  })) == null ? void 0 : _a2.catch(noop);
  if (data !== void 0) {
    return { data };
  }
  return void 0;
}
function defaultRetryDelay(failureCount) {
  return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
  return (networkMode ?? "online") === "online" ? onlineManager.isOnline() : true;
}
var CancelledError = class extends Error {
  constructor(options) {
    super("CancelledError");
    this.revert = options == null ? void 0 : options.revert;
    this.silent = options == null ? void 0 : options.silent;
  }
};
function isCancelledError(value) {
  return value instanceof CancelledError;
}
function createRetryer(config) {
  let isRetryCancelled = false;
  let failureCount = 0;
  let isResolved = false;
  let continueFn;
  const thenable = pendingThenable();
  const cancel = (cancelOptions) => {
    var _a2;
    if (!isResolved) {
      reject(new CancelledError(cancelOptions));
      (_a2 = config.abort) == null ? void 0 : _a2.call(config);
    }
  };
  const cancelRetry = () => {
    isRetryCancelled = true;
  };
  const continueRetry = () => {
    isRetryCancelled = false;
  };
  const canContinue = () => focusManager.isFocused() && (config.networkMode === "always" || onlineManager.isOnline()) && config.canRun();
  const canStart = () => canFetch(config.networkMode) && config.canRun();
  const resolve = (value) => {
    var _a2;
    if (!isResolved) {
      isResolved = true;
      (_a2 = config.onSuccess) == null ? void 0 : _a2.call(config, value);
      continueFn == null ? void 0 : continueFn();
      thenable.resolve(value);
    }
  };
  const reject = (value) => {
    var _a2;
    if (!isResolved) {
      isResolved = true;
      (_a2 = config.onError) == null ? void 0 : _a2.call(config, value);
      continueFn == null ? void 0 : continueFn();
      thenable.reject(value);
    }
  };
  const pause = () => {
    return new Promise((continueResolve) => {
      var _a2;
      continueFn = (value) => {
        if (isResolved || canContinue()) {
          continueResolve(value);
        }
      };
      (_a2 = config.onPause) == null ? void 0 : _a2.call(config);
    }).then(() => {
      var _a2;
      continueFn = void 0;
      if (!isResolved) {
        (_a2 = config.onContinue) == null ? void 0 : _a2.call(config);
      }
    });
  };
  const run = () => {
    if (isResolved) {
      return;
    }
    let promiseOrValue;
    const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
    try {
      promiseOrValue = initialPromise ?? config.fn();
    } catch (error) {
      promiseOrValue = Promise.reject(error);
    }
    Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
      var _a2;
      if (isResolved) {
        return;
      }
      const retry = config.retry ?? (0 );
      const retryDelay = config.retryDelay ?? defaultRetryDelay;
      const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
      const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
      if (isRetryCancelled || !shouldRetry) {
        reject(error);
        return;
      }
      failureCount++;
      (_a2 = config.onFail) == null ? void 0 : _a2.call(config, failureCount, error);
      sleep(delay).then(() => {
        return canContinue() ? void 0 : pause();
      }).then(() => {
        if (isRetryCancelled) {
          reject(error);
        } else {
          run();
        }
      });
    });
  };
  return {
    promise: thenable,
    cancel,
    continue: () => {
      continueFn == null ? void 0 : continueFn();
      return thenable;
    },
    cancelRetry,
    continueRetry,
    canStart,
    start: () => {
      if (canStart()) {
        run();
      } else {
        pause().then(run);
      }
      return thenable;
    }
  };
}
var defaultScheduler = (cb) => setTimeout(cb, 0);
function createNotifyManager() {
  let queue = [];
  let transactions = 0;
  let notifyFn = (callback) => {
    callback();
  };
  let batchNotifyFn = (callback) => {
    callback();
  };
  let scheduleFn = defaultScheduler;
  const schedule = (callback) => {
    if (transactions) {
      queue.push(callback);
    } else {
      scheduleFn(() => {
        notifyFn(callback);
      });
    }
  };
  const flush = () => {
    const originalQueue = queue;
    queue = [];
    if (originalQueue.length) {
      scheduleFn(() => {
        batchNotifyFn(() => {
          originalQueue.forEach((callback) => {
            notifyFn(callback);
          });
        });
      });
    }
  };
  return {
    batch: (callback) => {
      let result;
      transactions++;
      try {
        result = callback();
      } finally {
        transactions--;
        if (!transactions) {
          flush();
        }
      }
      return result;
    },
    /**
     * All calls to the wrapped function will be batched.
     */
    batchCalls: (callback) => {
      return (...args) => {
        schedule(() => {
          callback(...args);
        });
      };
    },
    schedule,
    /**
     * Use this method to set a custom notify function.
     * This can be used to for example wrap notifications with `React.act` while running tests.
     */
    setNotifyFunction: (fn) => {
      notifyFn = fn;
    },
    /**
     * Use this method to set a custom function to batch notifications together into a single tick.
     * By default React Query will use the batch function provided by ReactDOM or React Native.
     */
    setBatchNotifyFunction: (fn) => {
      batchNotifyFn = fn;
    },
    setScheduler: (fn) => {
      scheduleFn = fn;
    }
  };
}
var notifyManager = createNotifyManager();
var Removable = (_c = class {
  constructor() {
    __privateAdd(this, _gcTimeout);
  }
  destroy() {
    this.clearGcTimeout();
  }
  scheduleGc() {
    this.clearGcTimeout();
    if (isValidTimeout(this.gcTime)) {
      __privateSet(this, _gcTimeout, setTimeout(() => {
        this.optionalRemove();
      }, this.gcTime));
    }
  }
  updateGcTime(newGcTime) {
    this.gcTime = Math.max(
      this.gcTime || 0,
      newGcTime ?? (Infinity )
    );
  }
  clearGcTimeout() {
    if (__privateGet(this, _gcTimeout)) {
      clearTimeout(__privateGet(this, _gcTimeout));
      __privateSet(this, _gcTimeout, void 0);
    }
  }
}, _gcTimeout = new WeakMap(), _c);
var Query = (_d = class extends Removable {
  constructor(config) {
    super();
    __privateAdd(this, _Query_instances);
    __privateAdd(this, _initialState);
    __privateAdd(this, _revertState);
    __privateAdd(this, _cache);
    __privateAdd(this, _client);
    __privateAdd(this, _retryer);
    __privateAdd(this, _defaultOptions);
    __privateAdd(this, _abortSignalConsumed);
    __privateSet(this, _abortSignalConsumed, false);
    __privateSet(this, _defaultOptions, config.defaultOptions);
    this.setOptions(config.options);
    this.observers = [];
    __privateSet(this, _client, config.client);
    __privateSet(this, _cache, __privateGet(this, _client).getQueryCache());
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    __privateSet(this, _initialState, getDefaultState$1(this.options));
    this.state = config.state ?? __privateGet(this, _initialState);
    this.scheduleGc();
  }
  get meta() {
    return this.options.meta;
  }
  get promise() {
    var _a2;
    return (_a2 = __privateGet(this, _retryer)) == null ? void 0 : _a2.promise;
  }
  setOptions(options) {
    this.options = { ...__privateGet(this, _defaultOptions), ...options };
    this.updateGcTime(this.options.gcTime);
  }
  optionalRemove() {
    if (!this.observers.length && this.state.fetchStatus === "idle") {
      __privateGet(this, _cache).remove(this);
    }
  }
  setData(newData, options) {
    const data = replaceData(this.state.data, newData, this.options);
    __privateMethod(this, _Query_instances, dispatch_fn).call(this, {
      data,
      type: "success",
      dataUpdatedAt: options == null ? void 0 : options.updatedAt,
      manual: options == null ? void 0 : options.manual
    });
    return data;
  }
  setState(state, setStateOptions) {
    __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "setState", state, setStateOptions });
  }
  cancel(options) {
    var _a2, _b2;
    const promise = (_a2 = __privateGet(this, _retryer)) == null ? void 0 : _a2.promise;
    (_b2 = __privateGet(this, _retryer)) == null ? void 0 : _b2.cancel(options);
    return promise ? promise.then(noop).catch(noop) : Promise.resolve();
  }
  destroy() {
    super.destroy();
    this.cancel({ silent: true });
  }
  reset() {
    this.destroy();
    this.setState(__privateGet(this, _initialState));
  }
  isActive() {
    return this.observers.some(
      (observer) => resolveEnabled(observer.options.enabled, this) !== false
    );
  }
  isDisabled() {
    if (this.getObserversCount() > 0) {
      return !this.isActive();
    }
    return this.options.queryFn === skipToken || this.state.dataUpdateCount + this.state.errorUpdateCount === 0;
  }
  isStale() {
    if (this.state.isInvalidated) {
      return true;
    }
    if (this.getObserversCount() > 0) {
      return this.observers.some(
        (observer) => observer.getCurrentResult().isStale
      );
    }
    return this.state.data === void 0;
  }
  isStaleByTime(staleTime = 0) {
    return this.state.isInvalidated || this.state.data === void 0 || !timeUntilStale(this.state.dataUpdatedAt, staleTime);
  }
  onFocus() {
    var _a2;
    const observer = this.observers.find((x) => x.shouldFetchOnWindowFocus());
    observer == null ? void 0 : observer.refetch({ cancelRefetch: false });
    (_a2 = __privateGet(this, _retryer)) == null ? void 0 : _a2.continue();
  }
  onOnline() {
    var _a2;
    const observer = this.observers.find((x) => x.shouldFetchOnReconnect());
    observer == null ? void 0 : observer.refetch({ cancelRefetch: false });
    (_a2 = __privateGet(this, _retryer)) == null ? void 0 : _a2.continue();
  }
  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      this.clearGcTimeout();
      __privateGet(this, _cache).notify({ type: "observerAdded", query: this, observer });
    }
  }
  removeObserver(observer) {
    if (this.observers.includes(observer)) {
      this.observers = this.observers.filter((x) => x !== observer);
      if (!this.observers.length) {
        if (__privateGet(this, _retryer)) {
          if (__privateGet(this, _abortSignalConsumed)) {
            __privateGet(this, _retryer).cancel({ revert: true });
          } else {
            __privateGet(this, _retryer).cancelRetry();
          }
        }
        this.scheduleGc();
      }
      __privateGet(this, _cache).notify({ type: "observerRemoved", query: this, observer });
    }
  }
  getObserversCount() {
    return this.observers.length;
  }
  invalidate() {
    if (!this.state.isInvalidated) {
      __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "invalidate" });
    }
  }
  fetch(options, fetchOptions) {
    var _a2, _b2, _c2;
    if (this.state.fetchStatus !== "idle") {
      if (this.state.data !== void 0 && (fetchOptions == null ? void 0 : fetchOptions.cancelRefetch)) {
        this.cancel({ silent: true });
      } else if (__privateGet(this, _retryer)) {
        __privateGet(this, _retryer).continueRetry();
        return __privateGet(this, _retryer).promise;
      }
    }
    if (options) {
      this.setOptions(options);
    }
    if (!this.options.queryFn) {
      const observer = this.observers.find((x) => x.options.queryFn);
      if (observer) {
        this.setOptions(observer.options);
      }
    }
    const abortController = new AbortController();
    const addSignalProperty = (object) => {
      Object.defineProperty(object, "signal", {
        enumerable: true,
        get: () => {
          __privateSet(this, _abortSignalConsumed, true);
          return abortController.signal;
        }
      });
    };
    const fetchFn = () => {
      const queryFn = ensureQueryFn(this.options, fetchOptions);
      const queryFnContext = {
        client: __privateGet(this, _client),
        queryKey: this.queryKey,
        meta: this.meta
      };
      addSignalProperty(queryFnContext);
      __privateSet(this, _abortSignalConsumed, false);
      if (this.options.persister) {
        return this.options.persister(
          queryFn,
          queryFnContext,
          this
        );
      }
      return queryFn(queryFnContext);
    };
    const context = {
      fetchOptions,
      options: this.options,
      queryKey: this.queryKey,
      client: __privateGet(this, _client),
      state: this.state,
      fetchFn
    };
    addSignalProperty(context);
    (_a2 = this.options.behavior) == null ? void 0 : _a2.onFetch(
      context,
      this
    );
    __privateSet(this, _revertState, this.state);
    if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== ((_b2 = context.fetchOptions) == null ? void 0 : _b2.meta)) {
      __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "fetch", meta: (_c2 = context.fetchOptions) == null ? void 0 : _c2.meta });
    }
    const onError = (error) => {
      var _a3, _b3, _c3, _d2;
      if (!(isCancelledError(error) && error.silent)) {
        __privateMethod(this, _Query_instances, dispatch_fn).call(this, {
          type: "error",
          error
        });
      }
      if (!isCancelledError(error)) {
        (_b3 = (_a3 = __privateGet(this, _cache).config).onError) == null ? void 0 : _b3.call(
          _a3,
          error,
          this
        );
        (_d2 = (_c3 = __privateGet(this, _cache).config).onSettled) == null ? void 0 : _d2.call(
          _c3,
          this.state.data,
          error,
          this
        );
      }
      this.scheduleGc();
    };
    __privateSet(this, _retryer, createRetryer({
      initialPromise: fetchOptions == null ? void 0 : fetchOptions.initialPromise,
      fn: context.fetchFn,
      abort: abortController.abort.bind(abortController),
      onSuccess: (data) => {
        var _a3, _b3, _c3, _d2;
        if (data === void 0) {
          onError(new Error(`${this.queryHash} data is undefined`));
          return;
        }
        try {
          this.setData(data);
        } catch (error) {
          onError(error);
          return;
        }
        (_b3 = (_a3 = __privateGet(this, _cache).config).onSuccess) == null ? void 0 : _b3.call(_a3, data, this);
        (_d2 = (_c3 = __privateGet(this, _cache).config).onSettled) == null ? void 0 : _d2.call(
          _c3,
          data,
          this.state.error,
          this
        );
        this.scheduleGc();
      },
      onError,
      onFail: (failureCount, error) => {
        __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "failed", failureCount, error });
      },
      onPause: () => {
        __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "pause" });
      },
      onContinue: () => {
        __privateMethod(this, _Query_instances, dispatch_fn).call(this, { type: "continue" });
      },
      retry: context.options.retry,
      retryDelay: context.options.retryDelay,
      networkMode: context.options.networkMode,
      canRun: () => true
    }));
    return __privateGet(this, _retryer).start();
  }
}, _initialState = new WeakMap(), _revertState = new WeakMap(), _cache = new WeakMap(), _client = new WeakMap(), _retryer = new WeakMap(), _defaultOptions = new WeakMap(), _abortSignalConsumed = new WeakMap(), _Query_instances = new WeakSet(), dispatch_fn = function(action) {
  const reducer = (state) => {
    switch (action.type) {
      case "failed":
        return {
          ...state,
          fetchFailureCount: action.failureCount,
          fetchFailureReason: action.error
        };
      case "pause":
        return {
          ...state,
          fetchStatus: "paused"
        };
      case "continue":
        return {
          ...state,
          fetchStatus: "fetching"
        };
      case "fetch":
        return {
          ...state,
          ...fetchState(state.data, this.options),
          fetchMeta: action.meta ?? null
        };
      case "success":
        return {
          ...state,
          data: action.data,
          dataUpdateCount: state.dataUpdateCount + 1,
          dataUpdatedAt: action.dataUpdatedAt ?? Date.now(),
          error: null,
          isInvalidated: false,
          status: "success",
          ...!action.manual && {
            fetchStatus: "idle",
            fetchFailureCount: 0,
            fetchFailureReason: null
          }
        };
      case "error":
        const error = action.error;
        if (isCancelledError(error) && error.revert && __privateGet(this, _revertState)) {
          return { ...__privateGet(this, _revertState), fetchStatus: "idle" };
        }
        return {
          ...state,
          error,
          errorUpdateCount: state.errorUpdateCount + 1,
          errorUpdatedAt: Date.now(),
          fetchFailureCount: state.fetchFailureCount + 1,
          fetchFailureReason: error,
          fetchStatus: "idle",
          status: "error"
        };
      case "invalidate":
        return {
          ...state,
          isInvalidated: true
        };
      case "setState":
        return {
          ...state,
          ...action.state
        };
    }
  };
  this.state = reducer(this.state);
  notifyManager.batch(() => {
    this.observers.forEach((observer) => {
      observer.onQueryUpdate();
    });
    __privateGet(this, _cache).notify({ query: this, type: "updated", action });
  });
}, _d);
function fetchState(data, options) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: canFetch(options.networkMode) ? "fetching" : "paused",
    ...data === void 0 && {
      error: null,
      status: "pending"
    }
  };
}
function getDefaultState$1(options) {
  const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
  const hasData = data !== void 0;
  const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
  return {
    data,
    dataUpdateCount: 0,
    dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: false,
    status: hasData ? "success" : "pending",
    fetchStatus: "idle"
  };
}
var QueryCache = (_e = class extends Subscribable {
  constructor(config = {}) {
    super();
    __privateAdd(this, _queries);
    this.config = config;
    __privateSet(this, _queries, /* @__PURE__ */ new Map());
  }
  build(client, options, state) {
    const queryKey = options.queryKey;
    const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
    let query = this.get(queryHash);
    if (!query) {
      query = new Query({
        client,
        queryKey,
        queryHash,
        options: client.defaultQueryOptions(options),
        state,
        defaultOptions: client.getQueryDefaults(queryKey)
      });
      this.add(query);
    }
    return query;
  }
  add(query) {
    if (!__privateGet(this, _queries).has(query.queryHash)) {
      __privateGet(this, _queries).set(query.queryHash, query);
      this.notify({
        type: "added",
        query
      });
    }
  }
  remove(query) {
    const queryInMap = __privateGet(this, _queries).get(query.queryHash);
    if (queryInMap) {
      query.destroy();
      if (queryInMap === query) {
        __privateGet(this, _queries).delete(query.queryHash);
      }
      this.notify({ type: "removed", query });
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        this.remove(query);
      });
    });
  }
  get(queryHash) {
    return __privateGet(this, _queries).get(queryHash);
  }
  getAll() {
    return [...__privateGet(this, _queries).values()];
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (query) => matchQuery(defaultedFilters, query)
    );
  }
  findAll(filters = {}) {
    const queries = this.getAll();
    return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries;
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  onFocus() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onFocus();
      });
    });
  }
  onOnline() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onOnline();
      });
    });
  }
}, _queries = new WeakMap(), _e);
var Mutation = (_f = class extends Removable {
  constructor(config) {
    super();
    __privateAdd(this, _Mutation_instances);
    __privateAdd(this, _observers);
    __privateAdd(this, _mutationCache);
    __privateAdd(this, _retryer2);
    this.mutationId = config.mutationId;
    __privateSet(this, _mutationCache, config.mutationCache);
    __privateSet(this, _observers, []);
    this.state = config.state || getDefaultState();
    this.setOptions(config.options);
    this.scheduleGc();
  }
  setOptions(options) {
    this.options = options;
    this.updateGcTime(this.options.gcTime);
  }
  get meta() {
    return this.options.meta;
  }
  addObserver(observer) {
    if (!__privateGet(this, _observers).includes(observer)) {
      __privateGet(this, _observers).push(observer);
      this.clearGcTimeout();
      __privateGet(this, _mutationCache).notify({
        type: "observerAdded",
        mutation: this,
        observer
      });
    }
  }
  removeObserver(observer) {
    __privateSet(this, _observers, __privateGet(this, _observers).filter((x) => x !== observer));
    this.scheduleGc();
    __privateGet(this, _mutationCache).notify({
      type: "observerRemoved",
      mutation: this,
      observer
    });
  }
  optionalRemove() {
    if (!__privateGet(this, _observers).length) {
      if (this.state.status === "pending") {
        this.scheduleGc();
      } else {
        __privateGet(this, _mutationCache).remove(this);
      }
    }
  }
  continue() {
    var _a2;
    return ((_a2 = __privateGet(this, _retryer2)) == null ? void 0 : _a2.continue()) ?? // continuing a mutation assumes that variables are set, mutation must have been dehydrated before
    this.execute(this.state.variables);
  }
  async execute(variables) {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
    const onContinue = () => {
      __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "continue" });
    };
    __privateSet(this, _retryer2, createRetryer({
      fn: () => {
        if (!this.options.mutationFn) {
          return Promise.reject(new Error("No mutationFn found"));
        }
        return this.options.mutationFn(variables);
      },
      onFail: (failureCount, error) => {
        __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "failed", failureCount, error });
      },
      onPause: () => {
        __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "pause" });
      },
      onContinue,
      retry: this.options.retry ?? 0,
      retryDelay: this.options.retryDelay,
      networkMode: this.options.networkMode,
      canRun: () => __privateGet(this, _mutationCache).canRun(this)
    }));
    const restored = this.state.status === "pending";
    const isPaused = !__privateGet(this, _retryer2).canStart();
    try {
      if (restored) {
        onContinue();
      } else {
        __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "pending", variables, isPaused });
        await ((_b2 = (_a2 = __privateGet(this, _mutationCache).config).onMutate) == null ? void 0 : _b2.call(
          _a2,
          variables,
          this
        ));
        const context = await ((_d2 = (_c2 = this.options).onMutate) == null ? void 0 : _d2.call(_c2, variables));
        if (context !== this.state.context) {
          __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, {
            type: "pending",
            context,
            variables,
            isPaused
          });
        }
      }
      const data = await __privateGet(this, _retryer2).start();
      await ((_f2 = (_e2 = __privateGet(this, _mutationCache).config).onSuccess) == null ? void 0 : _f2.call(
        _e2,
        data,
        variables,
        this.state.context,
        this
      ));
      await ((_h2 = (_g2 = this.options).onSuccess) == null ? void 0 : _h2.call(_g2, data, variables, this.state.context));
      await ((_j2 = (_i2 = __privateGet(this, _mutationCache).config).onSettled) == null ? void 0 : _j2.call(
        _i2,
        data,
        null,
        this.state.variables,
        this.state.context,
        this
      ));
      await ((_l = (_k = this.options).onSettled) == null ? void 0 : _l.call(_k, data, null, variables, this.state.context));
      __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "success", data });
      return data;
    } catch (error) {
      try {
        await ((_n = (_m = __privateGet(this, _mutationCache).config).onError) == null ? void 0 : _n.call(
          _m,
          error,
          variables,
          this.state.context,
          this
        ));
        await ((_p = (_o = this.options).onError) == null ? void 0 : _p.call(
          _o,
          error,
          variables,
          this.state.context
        ));
        await ((_r = (_q = __privateGet(this, _mutationCache).config).onSettled) == null ? void 0 : _r.call(
          _q,
          void 0,
          error,
          this.state.variables,
          this.state.context,
          this
        ));
        await ((_t = (_s = this.options).onSettled) == null ? void 0 : _t.call(
          _s,
          void 0,
          error,
          variables,
          this.state.context
        ));
        throw error;
      } finally {
        __privateMethod(this, _Mutation_instances, dispatch_fn2).call(this, { type: "error", error });
      }
    } finally {
      __privateGet(this, _mutationCache).runNext(this);
    }
  }
}, _observers = new WeakMap(), _mutationCache = new WeakMap(), _retryer2 = new WeakMap(), _Mutation_instances = new WeakSet(), dispatch_fn2 = function(action) {
  const reducer = (state) => {
    switch (action.type) {
      case "failed":
        return {
          ...state,
          failureCount: action.failureCount,
          failureReason: action.error
        };
      case "pause":
        return {
          ...state,
          isPaused: true
        };
      case "continue":
        return {
          ...state,
          isPaused: false
        };
      case "pending":
        return {
          ...state,
          context: action.context,
          data: void 0,
          failureCount: 0,
          failureReason: null,
          error: null,
          isPaused: action.isPaused,
          status: "pending",
          variables: action.variables,
          submittedAt: Date.now()
        };
      case "success":
        return {
          ...state,
          data: action.data,
          failureCount: 0,
          failureReason: null,
          error: null,
          status: "success",
          isPaused: false
        };
      case "error":
        return {
          ...state,
          data: void 0,
          error: action.error,
          failureCount: state.failureCount + 1,
          failureReason: action.error,
          isPaused: false,
          status: "error"
        };
    }
  };
  this.state = reducer(this.state);
  notifyManager.batch(() => {
    __privateGet(this, _observers).forEach((observer) => {
      observer.onMutationUpdate(action);
    });
    __privateGet(this, _mutationCache).notify({
      mutation: this,
      type: "updated",
      action
    });
  });
}, _f);
function getDefaultState() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    status: "idle",
    variables: void 0,
    submittedAt: 0
  };
}
var MutationCache = (_g = class extends Subscribable {
  constructor(config = {}) {
    super();
    __privateAdd(this, _mutations);
    __privateAdd(this, _scopes);
    __privateAdd(this, _mutationId);
    this.config = config;
    __privateSet(this, _mutations, /* @__PURE__ */ new Set());
    __privateSet(this, _scopes, /* @__PURE__ */ new Map());
    __privateSet(this, _mutationId, 0);
  }
  build(client, options, state) {
    const mutation = new Mutation({
      mutationCache: this,
      mutationId: ++__privateWrapper(this, _mutationId)._,
      options: client.defaultMutationOptions(options),
      state
    });
    this.add(mutation);
    return mutation;
  }
  add(mutation) {
    __privateGet(this, _mutations).add(mutation);
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const scopedMutations = __privateGet(this, _scopes).get(scope);
      if (scopedMutations) {
        scopedMutations.push(mutation);
      } else {
        __privateGet(this, _scopes).set(scope, [mutation]);
      }
    }
    this.notify({ type: "added", mutation });
  }
  remove(mutation) {
    if (__privateGet(this, _mutations).delete(mutation)) {
      const scope = scopeFor(mutation);
      if (typeof scope === "string") {
        const scopedMutations = __privateGet(this, _scopes).get(scope);
        if (scopedMutations) {
          if (scopedMutations.length > 1) {
            const index2 = scopedMutations.indexOf(mutation);
            if (index2 !== -1) {
              scopedMutations.splice(index2, 1);
            }
          } else if (scopedMutations[0] === mutation) {
            __privateGet(this, _scopes).delete(scope);
          }
        }
      }
    }
    this.notify({ type: "removed", mutation });
  }
  canRun(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const mutationsWithSameScope = __privateGet(this, _scopes).get(scope);
      const firstPendingMutation = mutationsWithSameScope == null ? void 0 : mutationsWithSameScope.find(
        (m) => m.state.status === "pending"
      );
      return !firstPendingMutation || firstPendingMutation === mutation;
    } else {
      return true;
    }
  }
  runNext(mutation) {
    var _a2;
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const foundMutation = (_a2 = __privateGet(this, _scopes).get(scope)) == null ? void 0 : _a2.find((m) => m !== mutation && m.state.isPaused);
      return (foundMutation == null ? void 0 : foundMutation.continue()) ?? Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }
  clear() {
    notifyManager.batch(() => {
      __privateGet(this, _mutations).forEach((mutation) => {
        this.notify({ type: "removed", mutation });
      });
      __privateGet(this, _mutations).clear();
      __privateGet(this, _scopes).clear();
    });
  }
  getAll() {
    return Array.from(__privateGet(this, _mutations));
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (mutation) => matchMutation(defaultedFilters, mutation)
    );
  }
  findAll(filters = {}) {
    return this.getAll().filter((mutation) => matchMutation(filters, mutation));
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  resumePausedMutations() {
    const pausedMutations = this.getAll().filter((x) => x.state.isPaused);
    return notifyManager.batch(
      () => Promise.all(
        pausedMutations.map((mutation) => mutation.continue().catch(noop))
      )
    );
  }
}, _mutations = new WeakMap(), _scopes = new WeakMap(), _mutationId = new WeakMap(), _g);
function scopeFor(mutation) {
  var _a2;
  return (_a2 = mutation.options.scope) == null ? void 0 : _a2.id;
}
function infiniteQueryBehavior(pages) {
  return {
    onFetch: (context, query) => {
      var _a2, _b2, _c2, _d2, _e2;
      const options = context.options;
      const direction = (_c2 = (_b2 = (_a2 = context.fetchOptions) == null ? void 0 : _a2.meta) == null ? void 0 : _b2.fetchMore) == null ? void 0 : _c2.direction;
      const oldPages = ((_d2 = context.state.data) == null ? void 0 : _d2.pages) || [];
      const oldPageParams = ((_e2 = context.state.data) == null ? void 0 : _e2.pageParams) || [];
      let result = { pages: [], pageParams: [] };
      let currentPage = 0;
      const fetchFn = async () => {
        let cancelled = false;
        const addSignalProperty = (object) => {
          Object.defineProperty(object, "signal", {
            enumerable: true,
            get: () => {
              if (context.signal.aborted) {
                cancelled = true;
              } else {
                context.signal.addEventListener("abort", () => {
                  cancelled = true;
                });
              }
              return context.signal;
            }
          });
        };
        const queryFn = ensureQueryFn(context.options, context.fetchOptions);
        const fetchPage = async (data, param, previous) => {
          if (cancelled) {
            return Promise.reject();
          }
          if (param == null && data.pages.length) {
            return Promise.resolve(data);
          }
          const queryFnContext = {
            client: context.client,
            queryKey: context.queryKey,
            pageParam: param,
            direction: previous ? "backward" : "forward",
            meta: context.options.meta
          };
          addSignalProperty(queryFnContext);
          const page = await queryFn(
            queryFnContext
          );
          const { maxPages } = context.options;
          const addTo = previous ? addToStart : addToEnd;
          return {
            pages: addTo(data.pages, page, maxPages),
            pageParams: addTo(data.pageParams, param, maxPages)
          };
        };
        if (direction && oldPages.length) {
          const previous = direction === "backward";
          const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
          const oldData = {
            pages: oldPages,
            pageParams: oldPageParams
          };
          const param = pageParamFn(options, oldData);
          result = await fetchPage(oldData, param, previous);
        } else {
          const remainingPages = pages ?? oldPages.length;
          do {
            const param = currentPage === 0 ? oldPageParams[0] ?? options.initialPageParam : getNextPageParam(options, result);
            if (currentPage > 0 && param == null) {
              break;
            }
            result = await fetchPage(result, param);
            currentPage++;
          } while (currentPage < remainingPages);
        }
        return result;
      };
      if (context.options.persister) {
        context.fetchFn = () => {
          var _a3, _b3;
          return (_b3 = (_a3 = context.options).persister) == null ? void 0 : _b3.call(
            _a3,
            fetchFn,
            {
              client: context.client,
              queryKey: context.queryKey,
              meta: context.options.meta,
              signal: context.signal
            },
            query
          );
        };
      } else {
        context.fetchFn = fetchFn;
      }
    }
  };
}
function getNextPageParam(options, { pages, pageParams }) {
  const lastIndex = pages.length - 1;
  return pages.length > 0 ? options.getNextPageParam(
    pages[lastIndex],
    pages,
    pageParams[lastIndex],
    pageParams
  ) : void 0;
}
function getPreviousPageParam(options, { pages, pageParams }) {
  var _a2;
  return pages.length > 0 ? (_a2 = options.getPreviousPageParam) == null ? void 0 : _a2.call(options, pages[0], pages, pageParams[0], pageParams) : void 0;
}
var QueryClient = (_h = class {
  constructor(config = {}) {
    __privateAdd(this, _queryCache);
    __privateAdd(this, _mutationCache2);
    __privateAdd(this, _defaultOptions2);
    __privateAdd(this, _queryDefaults);
    __privateAdd(this, _mutationDefaults);
    __privateAdd(this, _mountCount);
    __privateAdd(this, _unsubscribeFocus);
    __privateAdd(this, _unsubscribeOnline);
    __privateSet(this, _queryCache, config.queryCache || new QueryCache());
    __privateSet(this, _mutationCache2, config.mutationCache || new MutationCache());
    __privateSet(this, _defaultOptions2, config.defaultOptions || {});
    __privateSet(this, _queryDefaults, /* @__PURE__ */ new Map());
    __privateSet(this, _mutationDefaults, /* @__PURE__ */ new Map());
    __privateSet(this, _mountCount, 0);
  }
  mount() {
    __privateWrapper(this, _mountCount)._++;
    if (__privateGet(this, _mountCount) !== 1) return;
    __privateSet(this, _unsubscribeFocus, focusManager.subscribe(async (focused) => {
      if (focused) {
        await this.resumePausedMutations();
        __privateGet(this, _queryCache).onFocus();
      }
    }));
    __privateSet(this, _unsubscribeOnline, onlineManager.subscribe(async (online) => {
      if (online) {
        await this.resumePausedMutations();
        __privateGet(this, _queryCache).onOnline();
      }
    }));
  }
  unmount() {
    var _a2, _b2;
    __privateWrapper(this, _mountCount)._--;
    if (__privateGet(this, _mountCount) !== 0) return;
    (_a2 = __privateGet(this, _unsubscribeFocus)) == null ? void 0 : _a2.call(this);
    __privateSet(this, _unsubscribeFocus, void 0);
    (_b2 = __privateGet(this, _unsubscribeOnline)) == null ? void 0 : _b2.call(this);
    __privateSet(this, _unsubscribeOnline, void 0);
  }
  isFetching(filters) {
    return __privateGet(this, _queryCache).findAll({ ...filters, fetchStatus: "fetching" }).length;
  }
  isMutating(filters) {
    return __privateGet(this, _mutationCache2).findAll({ ...filters, status: "pending" }).length;
  }
  /**
   * Imperative (non-reactive) way to retrieve data for a QueryKey.
   * Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
   *
   * Hint: Do not use this function inside a component, because it won't receive updates.
   * Use `useQuery` to create a `QueryObserver` that subscribes to changes.
   */
  getQueryData(queryKey) {
    var _a2;
    const options = this.defaultQueryOptions({ queryKey });
    return (_a2 = __privateGet(this, _queryCache).get(options.queryHash)) == null ? void 0 : _a2.state.data;
  }
  ensureQueryData(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    const query = __privateGet(this, _queryCache).build(this, defaultedOptions);
    const cachedData = query.state.data;
    if (cachedData === void 0) {
      return this.fetchQuery(options);
    }
    if (options.revalidateIfStale && query.isStaleByTime(resolveStaleTime(defaultedOptions.staleTime, query))) {
      void this.prefetchQuery(defaultedOptions);
    }
    return Promise.resolve(cachedData);
  }
  getQueriesData(filters) {
    return __privateGet(this, _queryCache).findAll(filters).map(({ queryKey, state }) => {
      const data = state.data;
      return [queryKey, data];
    });
  }
  setQueryData(queryKey, updater, options) {
    const defaultedOptions = this.defaultQueryOptions({ queryKey });
    const query = __privateGet(this, _queryCache).get(
      defaultedOptions.queryHash
    );
    const prevData = query == null ? void 0 : query.state.data;
    const data = functionalUpdate(updater, prevData);
    if (data === void 0) {
      return void 0;
    }
    return __privateGet(this, _queryCache).build(this, defaultedOptions).setData(data, { ...options, manual: true });
  }
  setQueriesData(filters, updater, options) {
    return notifyManager.batch(
      () => __privateGet(this, _queryCache).findAll(filters).map(({ queryKey }) => [
        queryKey,
        this.setQueryData(queryKey, updater, options)
      ])
    );
  }
  getQueryState(queryKey) {
    var _a2;
    const options = this.defaultQueryOptions({ queryKey });
    return (_a2 = __privateGet(this, _queryCache).get(
      options.queryHash
    )) == null ? void 0 : _a2.state;
  }
  removeQueries(filters) {
    const queryCache = __privateGet(this, _queryCache);
    notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        queryCache.remove(query);
      });
    });
  }
  resetQueries(filters, options) {
    const queryCache = __privateGet(this, _queryCache);
    return notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        query.reset();
      });
      return this.refetchQueries(
        {
          type: "active",
          ...filters
        },
        options
      );
    });
  }
  cancelQueries(filters, cancelOptions = {}) {
    const defaultedCancelOptions = { revert: true, ...cancelOptions };
    const promises = notifyManager.batch(
      () => __privateGet(this, _queryCache).findAll(filters).map((query) => query.cancel(defaultedCancelOptions))
    );
    return Promise.all(promises).then(noop).catch(noop);
  }
  invalidateQueries(filters, options = {}) {
    return notifyManager.batch(() => {
      __privateGet(this, _queryCache).findAll(filters).forEach((query) => {
        query.invalidate();
      });
      if ((filters == null ? void 0 : filters.refetchType) === "none") {
        return Promise.resolve();
      }
      return this.refetchQueries(
        {
          ...filters,
          type: (filters == null ? void 0 : filters.refetchType) ?? (filters == null ? void 0 : filters.type) ?? "active"
        },
        options
      );
    });
  }
  refetchQueries(filters, options = {}) {
    const fetchOptions = {
      ...options,
      cancelRefetch: options.cancelRefetch ?? true
    };
    const promises = notifyManager.batch(
      () => __privateGet(this, _queryCache).findAll(filters).filter((query) => !query.isDisabled()).map((query) => {
        let promise = query.fetch(void 0, fetchOptions);
        if (!fetchOptions.throwOnError) {
          promise = promise.catch(noop);
        }
        return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
      })
    );
    return Promise.all(promises).then(noop);
  }
  fetchQuery(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    if (defaultedOptions.retry === void 0) {
      defaultedOptions.retry = false;
    }
    const query = __privateGet(this, _queryCache).build(this, defaultedOptions);
    return query.isStaleByTime(
      resolveStaleTime(defaultedOptions.staleTime, query)
    ) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
  }
  prefetchQuery(options) {
    return this.fetchQuery(options).then(noop).catch(noop);
  }
  fetchInfiniteQuery(options) {
    options.behavior = infiniteQueryBehavior(options.pages);
    return this.fetchQuery(options);
  }
  prefetchInfiniteQuery(options) {
    return this.fetchInfiniteQuery(options).then(noop).catch(noop);
  }
  ensureInfiniteQueryData(options) {
    options.behavior = infiniteQueryBehavior(options.pages);
    return this.ensureQueryData(options);
  }
  resumePausedMutations() {
    if (onlineManager.isOnline()) {
      return __privateGet(this, _mutationCache2).resumePausedMutations();
    }
    return Promise.resolve();
  }
  getQueryCache() {
    return __privateGet(this, _queryCache);
  }
  getMutationCache() {
    return __privateGet(this, _mutationCache2);
  }
  getDefaultOptions() {
    return __privateGet(this, _defaultOptions2);
  }
  setDefaultOptions(options) {
    __privateSet(this, _defaultOptions2, options);
  }
  setQueryDefaults(queryKey, options) {
    __privateGet(this, _queryDefaults).set(hashKey(queryKey), {
      queryKey,
      defaultOptions: options
    });
  }
  getQueryDefaults(queryKey) {
    const defaults = [...__privateGet(this, _queryDefaults).values()];
    const result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(queryKey, queryDefault.queryKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  setMutationDefaults(mutationKey, options) {
    __privateGet(this, _mutationDefaults).set(hashKey(mutationKey), {
      mutationKey,
      defaultOptions: options
    });
  }
  getMutationDefaults(mutationKey) {
    const defaults = [...__privateGet(this, _mutationDefaults).values()];
    const result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(mutationKey, queryDefault.mutationKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  defaultQueryOptions(options) {
    if (options._defaulted) {
      return options;
    }
    const defaultedOptions = {
      ...__privateGet(this, _defaultOptions2).queries,
      ...this.getQueryDefaults(options.queryKey),
      ...options,
      _defaulted: true
    };
    if (!defaultedOptions.queryHash) {
      defaultedOptions.queryHash = hashQueryKeyByOptions(
        defaultedOptions.queryKey,
        defaultedOptions
      );
    }
    if (defaultedOptions.refetchOnReconnect === void 0) {
      defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
    }
    if (defaultedOptions.throwOnError === void 0) {
      defaultedOptions.throwOnError = !!defaultedOptions.suspense;
    }
    if (!defaultedOptions.networkMode && defaultedOptions.persister) {
      defaultedOptions.networkMode = "offlineFirst";
    }
    if (defaultedOptions.queryFn === skipToken) {
      defaultedOptions.enabled = false;
    }
    return defaultedOptions;
  }
  defaultMutationOptions(options) {
    if (options == null ? void 0 : options._defaulted) {
      return options;
    }
    return {
      ...__privateGet(this, _defaultOptions2).mutations,
      ...(options == null ? void 0 : options.mutationKey) && this.getMutationDefaults(options.mutationKey),
      ...options,
      _defaulted: true
    };
  }
  clear() {
    __privateGet(this, _queryCache).clear();
    __privateGet(this, _mutationCache2).clear();
  }
}, _queryCache = new WeakMap(), _mutationCache2 = new WeakMap(), _defaultOptions2 = new WeakMap(), _queryDefaults = new WeakMap(), _mutationDefaults = new WeakMap(), _mountCount = new WeakMap(), _unsubscribeFocus = new WeakMap(), _unsubscribeOnline = new WeakMap(), _h);
function defaultTransformerFn(data) {
  return data;
}
function dehydrateMutation(mutation) {
  return {
    mutationKey: mutation.options.mutationKey,
    state: mutation.state,
    ...mutation.options.scope && { scope: mutation.options.scope },
    ...mutation.meta && { meta: mutation.meta }
  };
}
function dehydrateQuery(query, serializeData, shouldRedactErrors) {
  var _a2;
  return {
    dehydratedAt: Date.now(),
    state: {
      ...query.state,
      ...query.state.data !== void 0 && {
        data: serializeData(query.state.data)
      }
    },
    queryKey: query.queryKey,
    queryHash: query.queryHash,
    ...query.state.status === "pending" && {
      promise: (_a2 = query.promise) == null ? void 0 : _a2.then(serializeData).catch((error) => {
        if (!shouldRedactErrors(error)) {
          return Promise.reject(error);
        }
        return Promise.reject(new Error("redacted"));
      })
    },
    ...query.meta && { meta: query.meta }
  };
}
function defaultShouldDehydrateMutation(mutation) {
  return mutation.state.isPaused;
}
function defaultShouldDehydrateQuery(query) {
  return query.state.status === "success";
}
function defaultShouldRedactErrors(_) {
  return true;
}
function dehydrate(client, options = {}) {
  var _a2, _b2, _c2, _d2;
  const filterMutation = options.shouldDehydrateMutation ?? ((_a2 = client.getDefaultOptions().dehydrate) == null ? void 0 : _a2.shouldDehydrateMutation) ?? defaultShouldDehydrateMutation;
  const mutations = client.getMutationCache().getAll().flatMap(
    (mutation) => filterMutation(mutation) ? [dehydrateMutation(mutation)] : []
  );
  const filterQuery = options.shouldDehydrateQuery ?? ((_b2 = client.getDefaultOptions().dehydrate) == null ? void 0 : _b2.shouldDehydrateQuery) ?? defaultShouldDehydrateQuery;
  const shouldRedactErrors = options.shouldRedactErrors ?? ((_c2 = client.getDefaultOptions().dehydrate) == null ? void 0 : _c2.shouldRedactErrors) ?? defaultShouldRedactErrors;
  const serializeData = options.serializeData ?? ((_d2 = client.getDefaultOptions().dehydrate) == null ? void 0 : _d2.serializeData) ?? defaultTransformerFn;
  const queries = client.getQueryCache().getAll().flatMap(
    (query) => filterQuery(query) ? [dehydrateQuery(query, serializeData, shouldRedactErrors)] : []
  );
  return { mutations, queries };
}
function hydrate(client, dehydratedState, options) {
  var _a2;
  if (typeof dehydratedState !== "object" || dehydratedState === null) {
    return;
  }
  const mutationCache = client.getMutationCache();
  const queryCache = client.getQueryCache();
  const deserializeData = ((_a2 = client.getDefaultOptions().hydrate) == null ? void 0 : _a2.deserializeData) ?? defaultTransformerFn;
  const mutations = dehydratedState.mutations || [];
  const queries = dehydratedState.queries || [];
  mutations.forEach(({ state, ...mutationOptions }) => {
    var _a3, _b2;
    mutationCache.build(
      client,
      {
        ...(_a3 = client.getDefaultOptions().hydrate) == null ? void 0 : _a3.mutations,
        ...(_b2 = void 0 ) == null ? void 0 : _b2.mutations,
        ...mutationOptions
      },
      state
    );
  });
  queries.forEach(
    ({ queryKey, state, queryHash, meta, promise, dehydratedAt }) => {
      var _a3, _b2;
      const syncData = promise ? tryResolveSync(promise) : void 0;
      const rawData = state.data === void 0 ? syncData == null ? void 0 : syncData.data : state.data;
      const data = rawData === void 0 ? rawData : deserializeData(rawData);
      let query = queryCache.get(queryHash);
      const existingQueryIsPending = (query == null ? void 0 : query.state.status) === "pending";
      if (query) {
        const hasNewerSyncData = syncData && // We only need this undefined check to handle older dehydration
        // payloads that might not have dehydratedAt
        dehydratedAt !== void 0 && dehydratedAt > query.state.dataUpdatedAt;
        if (state.dataUpdatedAt > query.state.dataUpdatedAt || hasNewerSyncData) {
          const { fetchStatus: _ignored, ...serializedState } = state;
          query.setState({
            ...serializedState,
            data
          });
        }
      } else {
        query = queryCache.build(
          client,
          {
            ...(_a3 = client.getDefaultOptions().hydrate) == null ? void 0 : _a3.queries,
            ...(_b2 = void 0 ) == null ? void 0 : _b2.queries,
            queryKey,
            queryHash,
            meta
          },
          // Reset fetch status to idle to avoid
          // query being stuck in fetching state upon hydration
          {
            ...state,
            data,
            fetchStatus: "idle",
            status: data !== void 0 ? "success" : state.status
          }
        );
      }
      if (promise && !existingQueryIsPending && // Only hydrate if dehydration is newer than any existing data,
      // this is always true for new queries
      (dehydratedAt === void 0 || dehydratedAt > query.state.dataUpdatedAt)) {
        void query.fetch(void 0, {
          // RSC transformed promises are not thenable
          initialPromise: Promise.resolve(promise).then(deserializeData)
        });
      }
    }
  );
}
var QueryClientContext = React.createContext(
  void 0
);
var useQueryClient = (queryClient) => {
  const client = React.useContext(QueryClientContext);
  if (queryClient) {
    return queryClient;
  }
  if (!client) {
    throw new Error("No QueryClient set, use QueryClientProvider to set one");
  }
  return client;
};
var QueryClientProvider = ({
  client,
  children: children2
}) => {
  React.useEffect(() => {
    client.mount();
    return () => {
      client.unmount();
    };
  }, [client]);
  return /* @__PURE__ */ jsx(QueryClientContext.Provider, { value: client, children: children2 });
};
function queryOptions(options) {
  return options;
}
function routerWithQueryClient(router, queryClient, additionalOpts) {
  const seenQueryKeys = /* @__PURE__ */ new Set();
  const streamedQueryKeys = /* @__PURE__ */ new Set();
  const ogClientOptions = queryClient.getDefaultOptions();
  queryClient.setDefaultOptions({
    ...ogClientOptions,
    queries: {
      ...ogClientOptions.queries,
      _experimental_beforeQuery: (options) => {
        var _a2, _b2;
        (_b2 = (_a2 = ogClientOptions.queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b2.call(_a2, options);
        const hash = options.queryKeyHashFn || hashKey;
        if (router.isServer) {
          if (seenQueryKeys.has(hash(options.queryKey))) {
            return;
          }
          seenQueryKeys.add(hash(options.queryKey));
          if (queryClient.getQueryData(options.queryKey) !== void 0) {
            options.__skipInjection = true;
            return;
          }
        } else {
          const dehydratedClient = router.clientSsr.getStreamedValue(
            "__QueryClient__" + hash(options.queryKey)
          );
          if (dehydratedClient && !dehydratedClient.hydrated) {
            dehydratedClient.hydrated = true;
            hydrate(queryClient, dehydratedClient);
          }
        }
      },
      _experimental_afterQuery: (options, _result) => {
        var _a2, _b2;
        const hash = options.queryKeyHashFn || hashKey;
        if (router.isServer && !options.__skipInjection && queryClient.getQueryData(options.queryKey) !== void 0 && !streamedQueryKeys.has(hash(options.queryKey))) {
          streamedQueryKeys.add(hash(options.queryKey));
          router.serverSsr.streamValue(
            "__QueryClient__" + hash(options.queryKey),
            dehydrate(queryClient, {
              shouldDehydrateMutation: () => false,
              shouldDehydrateQuery: (query) => hash(query.queryKey) === hash(options.queryKey)
            })
          );
        }
        (_b2 = (_a2 = ogClientOptions.queries) == null ? void 0 : _a2._experimental_afterQuery) == null ? void 0 : _b2.call(
          _a2,
          options,
          _result
        );
      }
    }
  });
  {
    const ogMutationCacheConfig = queryClient.getMutationCache().config;
    queryClient.getMutationCache().config = {
      ...ogMutationCacheConfig,
      onError: (error, _variables, _context, _mutation) => {
        var _a2;
        if (isRedirect(error)) {
          error.options._fromLocation = router.state.location;
          return router.navigate(router.resolveRedirect(error).options);
        }
        return (_a2 = ogMutationCacheConfig.onError) == null ? void 0 : _a2.call(
          ogMutationCacheConfig,
          error,
          _variables,
          _context,
          _mutation
        );
      }
    };
    const ogQueryCacheConfig = queryClient.getQueryCache().config;
    queryClient.getQueryCache().config = {
      ...ogQueryCacheConfig,
      onError: (error, _query) => {
        var _a2;
        if (isRedirect(error)) {
          error.options._fromLocation = router.state.location;
          return router.navigate(router.resolveRedirect(error).options);
        }
        return (_a2 = ogQueryCacheConfig.onError) == null ? void 0 : _a2.call(ogQueryCacheConfig, error, _query);
      }
    };
  }
  const ogOptions = router.options;
  router.options = {
    ...router.options,
    dehydrate: () => {
      var _a2;
      return {
        ...(_a2 = ogOptions.dehydrate) == null ? void 0 : _a2.call(ogOptions),
        // When critical data is dehydrated, we also dehydrate the query client
        dehydratedQueryClient: dehydrate(queryClient)
      };
    },
    hydrate: (dehydrated) => {
      var _a2;
      (_a2 = ogOptions.hydrate) == null ? void 0 : _a2.call(ogOptions, dehydrated);
      hydrate(queryClient, dehydrated.dehydratedQueryClient);
    },
    context: {
      ...ogOptions.context,
      // Pass the query client to the context, so we can access it in loaders
      queryClient
    },
    // Wrap the app in a QueryClientProvider
    Wrap: ({ children: children2 }) => {
      const OuterWrapper = Fragment$1;
      const OGWrap = ogOptions.Wrap || Fragment$1;
      return /* @__PURE__ */ jsx(OuterWrapper, { children: /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(OGWrap, { children: children2 }) }) });
    }
  };
  return router;
}
var IS_DEV = false;
var equalFn = (a, b) => a === b;
var $PROXY = Symbol("solid-proxy");
var SUPPORTS_PROXY = typeof Proxy === "function";
var $TRACK = Symbol("solid-track");
var signalOptions = {
  equals: equalFn
};
var runEffects = runQueue;
var STALE = 1;
var PENDING = 2;
var UNOWNED = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var Owner = null;
var Transition = null;
var ExternalSourceConfig = null;
var Listener = null;
var Updates = null;
var Effects = null;
var ExecCount = 0;
function createRoot(fn, detachedOwner) {
  const listener = Listener, owner = Owner, unowned = fn.length === 0, current = detachedOwner === void 0 ? owner : detachedOwner, root = unowned ? UNOWNED : {
    owned: null,
    cleanups: null,
    context: current ? current.context : null,
    owner: current
  }, updateFn = unowned ? fn : () => fn(() => untrack(() => cleanNode(root)));
  Owner = root;
  Listener = null;
  try {
    return runUpdates(updateFn, true);
  } finally {
    Listener = listener;
    Owner = owner;
  }
}
function createSignal$1(value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const s = {
    value,
    observers: null,
    observerSlots: null,
    comparator: options.equals || void 0
  };
  const setter = (value2) => {
    if (typeof value2 === "function") {
      value2 = value2(s.value);
    }
    return writeSignal(s, value2);
  };
  return [readSignal.bind(s), setter];
}
function createComputed(fn, value, options) {
  const c = createComputation(fn, value, true, STALE);
  updateComputation(c);
}
function createRenderEffect(fn, value, options) {
  const c = createComputation(fn, value, false, STALE);
  updateComputation(c);
}
function createEffect(fn, value, options) {
  runEffects = runUserEffects;
  const c = createComputation(fn, value, false, STALE);
  if (!options || !options.render) c.user = true;
  Effects ? Effects.push(c) : updateComputation(c);
}
function createMemo(fn, value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const c = createComputation(fn, value, true, 0);
  c.observers = null;
  c.observerSlots = null;
  c.comparator = options.equals || void 0;
  updateComputation(c);
  return readSignal.bind(c);
}
function batch(fn) {
  return runUpdates(fn, false);
}
function untrack(fn) {
  if (Listener === null) return fn();
  const listener = Listener;
  Listener = null;
  try {
    if (ExternalSourceConfig) ;
    return fn();
  } finally {
    Listener = listener;
  }
}
function on(deps, fn, options) {
  const isArray3 = Array.isArray(deps);
  let prevInput;
  let defer2 = options && options.defer;
  return (prevValue) => {
    let input;
    if (isArray3) {
      input = Array(deps.length);
      for (let i = 0; i < deps.length; i++) input[i] = deps[i]();
    } else input = deps();
    if (defer2) {
      defer2 = false;
      return prevValue;
    }
    const result = untrack(() => fn(input, prevInput, prevValue));
    prevInput = input;
    return result;
  };
}
function onMount(fn) {
  createEffect(() => untrack(fn));
}
function onCleanup(fn) {
  if (Owner === null) ;
  else if (Owner.cleanups === null) Owner.cleanups = [fn];
  else Owner.cleanups.push(fn);
  return fn;
}
function getOwner() {
  return Owner;
}
function runWithOwner(o, fn) {
  const prev = Owner;
  const prevListener = Listener;
  Owner = o;
  Listener = null;
  try {
    return runUpdates(fn, true);
  } catch (err) {
    handleError(err);
  } finally {
    Owner = prev;
    Listener = prevListener;
  }
}
function startTransition(fn) {
  const l = Listener;
  const o = Owner;
  return Promise.resolve().then(() => {
    Listener = l;
    Owner = o;
    runUpdates(fn, false);
    Listener = Owner = null;
    return void 0;
  });
}
var [transPending, setTransPending] = /* @__PURE__ */ createSignal$1(false);
function useTransition() {
  return [transPending, startTransition];
}
function createContext(defaultValue, options) {
  const id = Symbol("context");
  return {
    id,
    Provider: createProvider(id),
    defaultValue
  };
}
function useContext(context) {
  let value;
  return Owner && Owner.context && (value = Owner.context[context.id]) !== void 0 ? value : context.defaultValue;
}
function children(fn) {
  const children2 = createMemo(fn);
  const memo = createMemo(() => resolveChildren(children2()));
  memo.toArray = () => {
    const c = memo();
    return Array.isArray(c) ? c : c != null ? [c] : [];
  };
  return memo;
}
function readSignal() {
  if (this.sources && this.state) {
    if (this.state === STALE) updateComputation(this);
    else {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(this), false);
      Updates = updates;
    }
  }
  if (Listener) {
    const sSlot = this.observers ? this.observers.length : 0;
    if (!Listener.sources) {
      Listener.sources = [this];
      Listener.sourceSlots = [sSlot];
    } else {
      Listener.sources.push(this);
      Listener.sourceSlots.push(sSlot);
    }
    if (!this.observers) {
      this.observers = [Listener];
      this.observerSlots = [Listener.sources.length - 1];
    } else {
      this.observers.push(Listener);
      this.observerSlots.push(Listener.sources.length - 1);
    }
  }
  return this.value;
}
function writeSignal(node, value, isComp) {
  let current = node.value;
  if (!node.comparator || !node.comparator(current, value)) {
    node.value = value;
    if (node.observers && node.observers.length) {
      runUpdates(() => {
        for (let i = 0; i < node.observers.length; i += 1) {
          const o = node.observers[i];
          const TransitionRunning = Transition && Transition.running;
          if (TransitionRunning && Transition.disposed.has(o)) ;
          if (TransitionRunning ? !o.tState : !o.state) {
            if (o.pure) Updates.push(o);
            else Effects.push(o);
            if (o.observers) markDownstream(o);
          }
          if (!TransitionRunning) o.state = STALE;
        }
        if (Updates.length > 1e6) {
          Updates = [];
          if (IS_DEV) ;
          throw new Error();
        }
      }, false);
    }
  }
  return value;
}
function updateComputation(node) {
  if (!node.fn) return;
  cleanNode(node);
  const time = ExecCount;
  runComputation(
    node,
    node.value,
    time
  );
}
function runComputation(node, value, time) {
  let nextValue;
  const owner = Owner, listener = Listener;
  Listener = Owner = node;
  try {
    nextValue = node.fn(value);
  } catch (err) {
    if (node.pure) {
      {
        node.state = STALE;
        node.owned && node.owned.forEach(cleanNode);
        node.owned = null;
      }
    }
    node.updatedAt = time + 1;
    return handleError(err);
  } finally {
    Listener = listener;
    Owner = owner;
  }
  if (!node.updatedAt || node.updatedAt <= time) {
    if (node.updatedAt != null && "observers" in node) {
      writeSignal(node, nextValue);
    } else node.value = nextValue;
    node.updatedAt = time;
  }
}
function createComputation(fn, init, pure, state = STALE, options) {
  const c = {
    fn,
    state,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: init,
    owner: Owner,
    context: Owner ? Owner.context : null,
    pure
  };
  if (Owner === null) ;
  else if (Owner !== UNOWNED) {
    {
      if (!Owner.owned) Owner.owned = [c];
      else Owner.owned.push(c);
    }
  }
  return c;
}
function runTop(node) {
  if (node.state === 0) return;
  if (node.state === PENDING) return lookUpstream(node);
  if (node.suspense && untrack(node.suspense.inFallback)) return node.suspense.effects.push(node);
  const ancestors = [node];
  while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
    if (node.state) ancestors.push(node);
  }
  for (let i = ancestors.length - 1; i >= 0; i--) {
    node = ancestors[i];
    if (node.state === STALE) {
      updateComputation(node);
    } else if (node.state === PENDING) {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(node, ancestors[0]), false);
      Updates = updates;
    }
  }
}
function runUpdates(fn, init) {
  if (Updates) return fn();
  let wait = false;
  if (!init) Updates = [];
  if (Effects) wait = true;
  else Effects = [];
  ExecCount++;
  try {
    const res = fn();
    completeUpdates(wait);
    return res;
  } catch (err) {
    if (!wait) Effects = null;
    Updates = null;
    handleError(err);
  }
}
function completeUpdates(wait) {
  if (Updates) {
    runQueue(Updates);
    Updates = null;
  }
  if (wait) return;
  const e = Effects;
  Effects = null;
  if (e.length) runUpdates(() => runEffects(e), false);
}
function runQueue(queue) {
  for (let i = 0; i < queue.length; i++) runTop(queue[i]);
}
function runUserEffects(queue) {
  let i, userLength = 0;
  for (i = 0; i < queue.length; i++) {
    const e = queue[i];
    if (!e.user) runTop(e);
    else queue[userLength++] = e;
  }
  for (i = 0; i < userLength; i++) runTop(queue[i]);
}
function lookUpstream(node, ignore) {
  node.state = 0;
  for (let i = 0; i < node.sources.length; i += 1) {
    const source = node.sources[i];
    if (source.sources) {
      const state = source.state;
      if (state === STALE) {
        if (source !== ignore && (!source.updatedAt || source.updatedAt < ExecCount))
          runTop(source);
      } else if (state === PENDING) lookUpstream(source, ignore);
    }
  }
}
function markDownstream(node) {
  for (let i = 0; i < node.observers.length; i += 1) {
    const o = node.observers[i];
    if (!o.state) {
      o.state = PENDING;
      if (o.pure) Updates.push(o);
      else Effects.push(o);
      o.observers && markDownstream(o);
    }
  }
}
function cleanNode(node) {
  let i;
  if (node.sources) {
    while (node.sources.length) {
      const source = node.sources.pop(), index2 = node.sourceSlots.pop(), obs = source.observers;
      if (obs && obs.length) {
        const n = obs.pop(), s = source.observerSlots.pop();
        if (index2 < obs.length) {
          n.sourceSlots[s] = index2;
          obs[index2] = n;
          source.observerSlots[index2] = s;
        }
      }
    }
  }
  if (node.tOwned) {
    for (i = node.tOwned.length - 1; i >= 0; i--) cleanNode(node.tOwned[i]);
    delete node.tOwned;
  }
  if (node.owned) {
    for (i = node.owned.length - 1; i >= 0; i--) cleanNode(node.owned[i]);
    node.owned = null;
  }
  if (node.cleanups) {
    for (i = node.cleanups.length - 1; i >= 0; i--) node.cleanups[i]();
    node.cleanups = null;
  }
  node.state = 0;
}
function castError(err) {
  if (err instanceof Error) return err;
  return new Error(typeof err === "string" ? err : "Unknown error", {
    cause: err
  });
}
function handleError(err, owner = Owner) {
  const error = castError(err);
  throw error;
}
function resolveChildren(children2) {
  if (typeof children2 === "function" && !children2.length) return resolveChildren(children2());
  if (Array.isArray(children2)) {
    const results = [];
    for (let i = 0; i < children2.length; i++) {
      const result = resolveChildren(children2[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children2;
}
function createProvider(id, options) {
  return function provider(props) {
    let res;
    createRenderEffect(
      () => res = untrack(() => {
        Owner.context = {
          ...Owner.context,
          [id]: props.value
        };
        return children(() => props.children);
      }),
      void 0
    );
    return res;
  };
}
var FALLBACK = Symbol("fallback");
function dispose(d) {
  for (let i = 0; i < d.length; i++) d[i]();
}
function mapArray(list, mapFn, options = {}) {
  let items = [], mapped = [], disposers = [], len = 0, indexes = mapFn.length > 1 ? [] : null;
  onCleanup(() => dispose(disposers));
  return () => {
    let newItems = list() || [], newLen = newItems.length, i, j;
    newItems[$TRACK];
    return untrack(() => {
      let newIndices, newIndicesNext, temp, tempdisposers, tempIndexes, start, end, newEnd, item;
      if (newLen === 0) {
        if (len !== 0) {
          dispose(disposers);
          disposers = [];
          items = [];
          mapped = [];
          len = 0;
          indexes && (indexes = []);
        }
        if (options.fallback) {
          items = [FALLBACK];
          mapped[0] = createRoot((disposer) => {
            disposers[0] = disposer;
            return options.fallback();
          });
          len = 1;
        }
      } else if (len === 0) {
        mapped = new Array(newLen);
        for (j = 0; j < newLen; j++) {
          items[j] = newItems[j];
          mapped[j] = createRoot(mapper);
        }
        len = newLen;
      } else {
        temp = new Array(newLen);
        tempdisposers = new Array(newLen);
        indexes && (tempIndexes = new Array(newLen));
        for (start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++) ;
        for (end = len - 1, newEnd = newLen - 1; end >= start && newEnd >= start && items[end] === newItems[newEnd]; end--, newEnd--) {
          temp[newEnd] = mapped[end];
          tempdisposers[newEnd] = disposers[end];
          indexes && (tempIndexes[newEnd] = indexes[end]);
        }
        newIndices = /* @__PURE__ */ new Map();
        newIndicesNext = new Array(newEnd + 1);
        for (j = newEnd; j >= start; j--) {
          item = newItems[j];
          i = newIndices.get(item);
          newIndicesNext[j] = i === void 0 ? -1 : i;
          newIndices.set(item, j);
        }
        for (i = start; i <= end; i++) {
          item = items[i];
          j = newIndices.get(item);
          if (j !== void 0 && j !== -1) {
            temp[j] = mapped[i];
            tempdisposers[j] = disposers[i];
            indexes && (tempIndexes[j] = indexes[i]);
            j = newIndicesNext[j];
            newIndices.set(item, j);
          } else disposers[i]();
        }
        for (j = start; j < newLen; j++) {
          if (j in temp) {
            mapped[j] = temp[j];
            disposers[j] = tempdisposers[j];
            if (indexes) {
              indexes[j] = tempIndexes[j];
              indexes[j](j);
            }
          } else mapped[j] = createRoot(mapper);
        }
        mapped = mapped.slice(0, len = newLen);
        items = newItems.slice(0);
      }
      return mapped;
    });
    function mapper(disposer) {
      disposers[j] = disposer;
      if (indexes) {
        const [s, set] = createSignal$1(j);
        indexes[j] = set;
        return mapFn(newItems[j], s);
      }
      return mapFn(newItems[j]);
    }
  };
}
function indexArray(list, mapFn, options = {}) {
  let items = [], mapped = [], disposers = [], signals = [], len = 0, i;
  onCleanup(() => dispose(disposers));
  return () => {
    const newItems = list() || [], newLen = newItems.length;
    newItems[$TRACK];
    return untrack(() => {
      if (newLen === 0) {
        if (len !== 0) {
          dispose(disposers);
          disposers = [];
          items = [];
          mapped = [];
          len = 0;
          signals = [];
        }
        if (options.fallback) {
          items = [FALLBACK];
          mapped[0] = createRoot((disposer) => {
            disposers[0] = disposer;
            return options.fallback();
          });
          len = 1;
        }
        return mapped;
      }
      if (items[0] === FALLBACK) {
        disposers[0]();
        disposers = [];
        items = [];
        mapped = [];
        len = 0;
      }
      for (i = 0; i < newLen; i++) {
        if (i < items.length && items[i] !== newItems[i]) {
          signals[i](() => newItems[i]);
        } else if (i >= items.length) {
          mapped[i] = createRoot(mapper);
        }
      }
      for (; i < items.length; i++) {
        disposers[i]();
      }
      len = signals.length = disposers.length = newLen;
      items = newItems.slice(0);
      return mapped = mapped.slice(0, len);
    });
    function mapper(disposer) {
      disposers[i] = disposer;
      const [s, set] = createSignal$1(newItems[i]);
      signals[i] = set;
      return mapFn(s, i);
    }
  };
}
function createComponent(Comp, props) {
  return untrack(() => Comp(props || {}));
}
function trueFn() {
  return true;
}
var propTraps = {
  get(_, property, receiver) {
    if (property === $PROXY) return receiver;
    return _.get(property);
  },
  has(_, property) {
    if (property === $PROXY) return true;
    return _.has(property);
  },
  set: trueFn,
  deleteProperty: trueFn,
  getOwnPropertyDescriptor(_, property) {
    return {
      configurable: true,
      enumerable: true,
      get() {
        return _.get(property);
      },
      set: trueFn,
      deleteProperty: trueFn
    };
  },
  ownKeys(_) {
    return _.keys();
  }
};
function resolveSource(s) {
  return !(s = typeof s === "function" ? s() : s) ? {} : s;
}
function resolveSources() {
  for (let i = 0, length = this.length; i < length; ++i) {
    const v2 = this[i]();
    if (v2 !== void 0) return v2;
  }
}
function mergeProps(...sources) {
  let proxy = false;
  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    proxy = proxy || !!s && $PROXY in s;
    sources[i] = typeof s === "function" ? (proxy = true, createMemo(s)) : s;
  }
  if (SUPPORTS_PROXY && proxy) {
    return new Proxy(
      {
        get(property) {
          for (let i = sources.length - 1; i >= 0; i--) {
            const v2 = resolveSource(sources[i])[property];
            if (v2 !== void 0) return v2;
          }
        },
        has(property) {
          for (let i = sources.length - 1; i >= 0; i--) {
            if (property in resolveSource(sources[i])) return true;
          }
          return false;
        },
        keys() {
          const keys = [];
          for (let i = 0; i < sources.length; i++)
            keys.push(...Object.keys(resolveSource(sources[i])));
          return [...new Set(keys)];
        }
      },
      propTraps
    );
  }
  const sourcesMap = {};
  const defined = /* @__PURE__ */ Object.create(null);
  for (let i = sources.length - 1; i >= 0; i--) {
    const source = sources[i];
    if (!source) continue;
    const sourceKeys = Object.getOwnPropertyNames(source);
    for (let i2 = sourceKeys.length - 1; i2 >= 0; i2--) {
      const key = sourceKeys[i2];
      if (key === "__proto__" || key === "constructor") continue;
      const desc = Object.getOwnPropertyDescriptor(source, key);
      if (!defined[key]) {
        defined[key] = desc.get ? {
          enumerable: true,
          configurable: true,
          get: resolveSources.bind(sourcesMap[key] = [desc.get.bind(source)])
        } : desc.value !== void 0 ? desc : void 0;
      } else {
        const sources2 = sourcesMap[key];
        if (sources2) {
          if (desc.get) sources2.push(desc.get.bind(source));
          else if (desc.value !== void 0) sources2.push(() => desc.value);
        }
      }
    }
  }
  const target = {};
  const definedKeys = Object.keys(defined);
  for (let i = definedKeys.length - 1; i >= 0; i--) {
    const key = definedKeys[i], desc = defined[key];
    if (desc && desc.get) Object.defineProperty(target, key, desc);
    else target[key] = desc ? desc.value : void 0;
  }
  return target;
}
function splitProps(props, ...keys) {
  if (SUPPORTS_PROXY && $PROXY in props) {
    const blocked = new Set(keys.length > 1 ? keys.flat() : keys[0]);
    const res = keys.map((k) => {
      return new Proxy(
        {
          get(property) {
            return k.includes(property) ? props[property] : void 0;
          },
          has(property) {
            return k.includes(property) && property in props;
          },
          keys() {
            return k.filter((property) => property in props);
          }
        },
        propTraps
      );
    });
    res.push(
      new Proxy(
        {
          get(property) {
            return blocked.has(property) ? void 0 : props[property];
          },
          has(property) {
            return blocked.has(property) ? false : property in props;
          },
          keys() {
            return Object.keys(props).filter((k) => !blocked.has(k));
          }
        },
        propTraps
      )
    );
    return res;
  }
  const otherObject = {};
  const objects = keys.map(() => ({}));
  for (const propName of Object.getOwnPropertyNames(props)) {
    const desc = Object.getOwnPropertyDescriptor(props, propName);
    const isDefaultDesc = !desc.get && !desc.set && desc.enumerable && desc.writable && desc.configurable;
    let blocked = false;
    let objectIndex = 0;
    for (const k of keys) {
      if (k.includes(propName)) {
        blocked = true;
        isDefaultDesc ? objects[objectIndex][propName] = desc.value : Object.defineProperty(objects[objectIndex], propName, desc);
      }
      ++objectIndex;
    }
    if (!blocked) {
      isDefaultDesc ? otherObject[propName] = desc.value : Object.defineProperty(otherObject, propName, desc);
    }
  }
  return [...objects, otherObject];
}
var counter = 0;
function createUniqueId() {
  return `cl-${counter++}`;
}
var narrowedError = (name) => `Stale read from <${name}>.`;
function For(props) {
  const fallback = "fallback" in props && {
    fallback: () => props.fallback
  };
  return createMemo(mapArray(() => props.each, props.children, fallback || void 0));
}
function Index(props) {
  const fallback = "fallback" in props && {
    fallback: () => props.fallback
  };
  return createMemo(indexArray(() => props.each, props.children, fallback || void 0));
}
function Show(props) {
  const keyed = props.keyed;
  const conditionValue = createMemo(() => props.when, void 0, void 0);
  const condition = keyed ? conditionValue : createMemo(conditionValue, void 0, {
    equals: (a, b) => !a === !b
  });
  return createMemo(
    () => {
      const c = condition();
      if (c) {
        const child = props.children;
        const fn = typeof child === "function" && child.length > 0;
        return fn ? untrack(
          () => child(
            keyed ? c : () => {
              if (!untrack(condition)) throw narrowedError("Show");
              return conditionValue();
            }
          )
        ) : child;
      }
      return props.fallback;
    },
    void 0,
    void 0
  );
}
function Switch(props) {
  const chs = children(() => props.children);
  const switchFunc = createMemo(() => {
    const ch = chs();
    const mps = Array.isArray(ch) ? ch : [ch];
    let func = () => void 0;
    for (let i = 0; i < mps.length; i++) {
      const index2 = i;
      const mp = mps[i];
      const prevFunc = func;
      const conditionValue = createMemo(
        () => prevFunc() ? void 0 : mp.when,
        void 0,
        void 0
      );
      const condition = mp.keyed ? conditionValue : createMemo(conditionValue, void 0, {
        equals: (a, b) => !a === !b
      });
      func = () => prevFunc() || (condition() ? [index2, conditionValue, mp] : void 0);
    }
    return func;
  });
  return createMemo(
    () => {
      const sel = switchFunc()();
      if (!sel) return props.fallback;
      const [index2, conditionValue, mp] = sel;
      const child = mp.children;
      const fn = typeof child === "function" && child.length > 0;
      return fn ? untrack(
        () => child(
          mp.keyed ? conditionValue() : () => {
            var _a2;
            if (((_a2 = untrack(switchFunc)()) == null ? void 0 : _a2[0]) !== index2) throw narrowedError("Match");
            return conditionValue();
          }
        )
      ) : child;
    },
    void 0,
    void 0
  );
}
function Match(props) {
  return props;
}
var booleans = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "hidden",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected"
];
var Properties = /* @__PURE__ */ new Set([
  "className",
  "value",
  "readOnly",
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  ...booleans
]);
var ChildProperties = /* @__PURE__ */ new Set([
  "innerHTML",
  "textContent",
  "innerText",
  "children"
]);
var Aliases = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  className: "class",
  htmlFor: "for"
});
var PropAliases = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(null), {
  class: "className",
  formnovalidate: {
    $: "formNoValidate",
    BUTTON: 1,
    INPUT: 1
  },
  ismap: {
    $: "isMap",
    IMG: 1
  },
  nomodule: {
    $: "noModule",
    SCRIPT: 1
  },
  playsinline: {
    $: "playsInline",
    VIDEO: 1
  },
  readonly: {
    $: "readOnly",
    INPUT: 1,
    TEXTAREA: 1
  }
});
function getPropAlias(prop, tagName) {
  const a = PropAliases[prop];
  return typeof a === "object" ? a[tagName] ? a["$"] : void 0 : a;
}
var DelegatedEvents = /* @__PURE__ */ new Set([
  "beforeinput",
  "click",
  "dblclick",
  "contextmenu",
  "focusin",
  "focusout",
  "input",
  "keydown",
  "keyup",
  "mousedown",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "pointerdown",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointerup",
  "touchend",
  "touchmove",
  "touchstart"
]);
var SVGElements = /* @__PURE__ */ new Set([
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animate",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "circle",
  "clipPath",
  "color-profile",
  "cursor",
  "defs",
  "desc",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "font",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignObject",
  "g",
  "glyph",
  "glyphRef",
  "hkern",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "metadata",
  "missing-glyph",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "set",
  "stop",
  "svg",
  "switch",
  "symbol",
  "text",
  "textPath",
  "tref",
  "tspan",
  "use",
  "view",
  "vkern"
]);
var SVGNamespace = {
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace"
};
function reconcileArrays(parentNode, a, b) {
  let bLength = b.length, aEnd = a.length, bEnd = bLength, aStart = 0, bStart = 0, after = a[aEnd - 1].nextSibling, map = null;
  while (aStart < aEnd || bStart < bEnd) {
    if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
      continue;
    }
    while (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    if (aEnd === aStart) {
      const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
      while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node);
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(a[aStart])) a[aStart].remove();
        aStart++;
      }
    } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
      const node = a[--aEnd].nextSibling;
      parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
      parentNode.insertBefore(b[--bEnd], node);
      a[aEnd] = b[bEnd];
    } else {
      if (!map) {
        map = /* @__PURE__ */ new Map();
        let i = bStart;
        while (i < bEnd) map.set(b[i], i++);
      }
      const index2 = map.get(a[aStart]);
      if (index2 != null) {
        if (bStart < index2 && index2 < bEnd) {
          let i = aStart, sequence = 1, t;
          while (++i < aEnd && i < bEnd) {
            if ((t = map.get(a[i])) == null || t !== index2 + sequence) break;
            sequence++;
          }
          if (sequence > index2 - bStart) {
            const node = a[aStart];
            while (bStart < index2) parentNode.insertBefore(b[bStart++], node);
          } else parentNode.replaceChild(b[bStart++], a[aStart++]);
        } else aStart++;
      } else a[aStart++].remove();
    }
  }
}
var $$EVENTS = "_$DX_DELEGATE";
function template(html, isImportNode, isSVG, isMathML) {
  let node;
  const create = () => {
    const t = document.createElement("template");
    t.innerHTML = html;
    return t.content.firstChild;
  };
  const fn = () => (node || (node = create())).cloneNode(true);
  fn.cloneNode = fn;
  return fn;
}
function delegateEvents(eventNames, document2 = window.document) {
  const e = document2[$$EVENTS] || (document2[$$EVENTS] = /* @__PURE__ */ new Set());
  for (let i = 0, l = eventNames.length; i < l; i++) {
    const name = eventNames[i];
    if (!e.has(name)) {
      e.add(name);
      document2.addEventListener(name, eventHandler);
    }
  }
}
function clearDelegatedEvents(document2 = window.document) {
  if (document2[$$EVENTS]) {
    for (let name of document2[$$EVENTS].keys()) document2.removeEventListener(name, eventHandler);
    delete document2[$$EVENTS];
  }
}
function setAttribute(node, name, value) {
  if (value == null) node.removeAttribute(name);
  else node.setAttribute(name, value);
}
function setAttributeNS(node, namespace, name, value) {
  if (value == null) node.removeAttributeNS(namespace, name);
  else node.setAttributeNS(namespace, name, value);
}
function setBoolAttribute(node, name, value) {
  value ? node.setAttribute(name, "") : node.removeAttribute(name);
}
function className(node, value) {
  if (value == null) node.removeAttribute("class");
  else node.className = value;
}
function addEventListener(node, name, handler, delegate) {
  if (delegate) {
    if (Array.isArray(handler)) {
      node[`$$${name}`] = handler[0];
      node[`$$${name}Data`] = handler[1];
    } else node[`$$${name}`] = handler;
  } else if (Array.isArray(handler)) {
    const handlerFn = handler[0];
    node.addEventListener(name, handler[0] = (e) => handlerFn.call(node, handler[1], e));
  } else node.addEventListener(name, handler, typeof handler !== "function" && handler);
}
function classList(node, value, prev = {}) {
  const classKeys = Object.keys(value || {}), prevKeys = Object.keys(prev);
  let i, len;
  for (i = 0, len = prevKeys.length; i < len; i++) {
    const key = prevKeys[i];
    if (!key || key === "undefined" || value[key]) continue;
    toggleClassKey(node, key, false);
    delete prev[key];
  }
  for (i = 0, len = classKeys.length; i < len; i++) {
    const key = classKeys[i], classValue = !!value[key];
    if (!key || key === "undefined" || prev[key] === classValue || !classValue) continue;
    toggleClassKey(node, key, true);
    prev[key] = classValue;
  }
  return prev;
}
function style(node, value, prev) {
  if (!value) return prev ? setAttribute(node, "style") : value;
  const nodeStyle = node.style;
  if (typeof value === "string") return nodeStyle.cssText = value;
  typeof prev === "string" && (nodeStyle.cssText = prev = void 0);
  prev || (prev = {});
  value || (value = {});
  let v2, s;
  for (s in prev) {
    value[s] == null && nodeStyle.removeProperty(s);
    delete prev[s];
  }
  for (s in value) {
    v2 = value[s];
    if (v2 !== prev[s]) {
      nodeStyle.setProperty(s, v2);
      prev[s] = v2;
    }
  }
  return prev;
}
function spread(node, props = {}, isSVG, skipChildren) {
  const prevProps = {};
  if (!skipChildren) {
    createRenderEffect(
      () => prevProps.children = insertExpression(node, props.children, prevProps.children)
    );
  }
  createRenderEffect(() => typeof props.ref === "function" && use(props.ref, node));
  createRenderEffect(() => assign(node, props, isSVG, true, prevProps, true));
  return prevProps;
}
function use(fn, element, arg) {
  return untrack(() => fn(element, arg));
}
function insert(parent, accessor, marker, initial) {
  if (marker !== void 0 && !initial) initial = [];
  if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
  createRenderEffect((current) => insertExpression(parent, accessor(), current, marker), initial);
}
function assign(node, props, isSVG, skipChildren, prevProps = {}, skipRef = false) {
  props || (props = {});
  for (const prop in prevProps) {
    if (!(prop in props)) {
      if (prop === "children") continue;
      prevProps[prop] = assignProp(node, prop, null, prevProps[prop], isSVG, skipRef, props);
    }
  }
  for (const prop in props) {
    if (prop === "children") {
      continue;
    }
    const value = props[prop];
    prevProps[prop] = assignProp(node, prop, value, prevProps[prop], isSVG, skipRef, props);
  }
}
function toPropertyName(name) {
  return name.toLowerCase().replace(/-([a-z])/g, (_, w) => w.toUpperCase());
}
function toggleClassKey(node, key, value) {
  const classNames = key.trim().split(/\s+/);
  for (let i = 0, nameLen = classNames.length; i < nameLen; i++)
    node.classList.toggle(classNames[i], value);
}
function assignProp(node, prop, value, prev, isSVG, skipRef, props) {
  let isCE, isProp, isChildProp, propAlias, forceProp;
  if (prop === "style") return style(node, value, prev);
  if (prop === "classList") return classList(node, value, prev);
  if (value === prev) return prev;
  if (prop === "ref") {
    if (!skipRef) value(node);
  } else if (prop.slice(0, 3) === "on:") {
    const e = prop.slice(3);
    prev && node.removeEventListener(e, prev, typeof prev !== "function" && prev);
    value && node.addEventListener(e, value, typeof value !== "function" && value);
  } else if (prop.slice(0, 10) === "oncapture:") {
    const e = prop.slice(10);
    prev && node.removeEventListener(e, prev, true);
    value && node.addEventListener(e, value, true);
  } else if (prop.slice(0, 2) === "on") {
    const name = prop.slice(2).toLowerCase();
    const delegate = DelegatedEvents.has(name);
    if (!delegate && prev) {
      const h = Array.isArray(prev) ? prev[0] : prev;
      node.removeEventListener(name, h);
    }
    if (delegate || value) {
      addEventListener(node, name, value, delegate);
      delegate && delegateEvents([name]);
    }
  } else if (prop.slice(0, 5) === "attr:") {
    setAttribute(node, prop.slice(5), value);
  } else if (prop.slice(0, 5) === "bool:") {
    setBoolAttribute(node, prop.slice(5), value);
  } else if ((forceProp = prop.slice(0, 5) === "prop:") || (isChildProp = ChildProperties.has(prop)) || !isSVG && ((propAlias = getPropAlias(prop, node.tagName)) || (isProp = Properties.has(prop))) || (isCE = node.nodeName.includes("-") || "is" in props)) {
    if (forceProp) {
      prop = prop.slice(5);
      isProp = true;
    }
    if (prop === "class" || prop === "className") className(node, value);
    else if (isCE && !isProp && !isChildProp) node[toPropertyName(prop)] = value;
    else node[propAlias || prop] = value;
  } else {
    const ns = isSVG && prop.indexOf(":") > -1 && SVGNamespace[prop.split(":")[0]];
    if (ns) setAttributeNS(node, ns, prop, value);
    else setAttribute(node, Aliases[prop] || prop, value);
  }
  return value;
}
function eventHandler(e) {
  let node = e.target;
  const key = `$$${e.type}`;
  const oriTarget = e.target;
  const oriCurrentTarget = e.currentTarget;
  const retarget = (value) => Object.defineProperty(e, "target", {
    configurable: true,
    value
  });
  const handleNode = () => {
    const handler = node[key];
    if (handler && !node.disabled) {
      const data = node[`${key}Data`];
      data !== void 0 ? handler.call(node, data, e) : handler.call(node, e);
      if (e.cancelBubble) return;
    }
    node.host && typeof node.host !== "string" && !node.host._$host && node.contains(e.target) && retarget(node.host);
    return true;
  };
  const walkUpTree = () => {
    while (handleNode() && (node = node._$host || node.parentNode || node.host)) ;
  };
  Object.defineProperty(e, "currentTarget", {
    configurable: true,
    get() {
      return node || document;
    }
  });
  if (e.composedPath) {
    const path = e.composedPath();
    retarget(path[0]);
    for (let i = 0; i < path.length - 2; i++) {
      node = path[i];
      if (!handleNode()) break;
      if (node._$host) {
        node = node._$host;
        walkUpTree();
        break;
      }
      if (node.parentNode === oriCurrentTarget) {
        break;
      }
    }
  } else walkUpTree();
  retarget(oriTarget);
}
function insertExpression(parent, value, current, marker, unwrapArray) {
  while (typeof current === "function") current = current();
  if (value === current) return current;
  const t = typeof value, multi = marker !== void 0;
  parent = multi && current[0] && current[0].parentNode || parent;
  if (t === "string" || t === "number") {
    if (t === "number") {
      value = value.toString();
      if (value === current) return current;
    }
    if (multi) {
      let node = current[0];
      if (node && node.nodeType === 3) {
        node.data !== value && (node.data = value);
      } else node = document.createTextNode(value);
      current = cleanChildren(parent, current, marker, node);
    } else {
      if (current !== "" && typeof current === "string") {
        current = parent.firstChild.data = value;
      } else current = parent.textContent = value;
    }
  } else if (value == null || t === "boolean") {
    current = cleanChildren(parent, current, marker);
  } else if (t === "function") {
    createRenderEffect(() => {
      let v2 = value();
      while (typeof v2 === "function") v2 = v2();
      current = insertExpression(parent, v2, current, marker);
    });
    return () => current;
  } else if (Array.isArray(value)) {
    const array = [];
    const currentArray = current && Array.isArray(current);
    if (normalizeIncomingArray(array, value, current, unwrapArray)) {
      createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
      return () => current;
    }
    if (array.length === 0) {
      current = cleanChildren(parent, current, marker);
      if (multi) return current;
    } else if (currentArray) {
      if (current.length === 0) {
        appendNodes(parent, array, marker);
      } else reconcileArrays(parent, current, array);
    } else {
      current && cleanChildren(parent);
      appendNodes(parent, array);
    }
    current = array;
  } else if (value.nodeType) {
    if (Array.isArray(current)) {
      if (multi) return current = cleanChildren(parent, current, marker, value);
      cleanChildren(parent, current, null, value);
    } else if (current == null || current === "" || !parent.firstChild) {
      parent.appendChild(value);
    } else parent.replaceChild(value, parent.firstChild);
    current = value;
  } else ;
  return current;
}
function normalizeIncomingArray(normalized, array, current, unwrap) {
  let dynamic = false;
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i], prev = current && current[normalized.length], t;
    if (item == null || item === true || item === false) ;
    else if ((t = typeof item) === "object" && item.nodeType) {
      normalized.push(item);
    } else if (Array.isArray(item)) {
      dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
    } else if (t === "function") {
      if (unwrap) {
        while (typeof item === "function") item = item();
        dynamic = normalizeIncomingArray(
          normalized,
          Array.isArray(item) ? item : [item],
          Array.isArray(prev) ? prev : [prev]
        ) || dynamic;
      } else {
        normalized.push(item);
        dynamic = true;
      }
    } else {
      const value = String(item);
      if (prev && prev.nodeType === 3 && prev.data === value) normalized.push(prev);
      else normalized.push(document.createTextNode(value));
    }
  }
  return dynamic;
}
function appendNodes(parent, array, marker = null) {
  for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
}
function cleanChildren(parent, current, marker, replacement) {
  if (marker === void 0) return parent.textContent = "";
  const node = replacement || document.createTextNode("");
  if (current.length) {
    let inserted = false;
    for (let i = current.length - 1; i >= 0; i--) {
      const el = current[i];
      if (node !== el) {
        const isParent = el.parentNode === parent;
        if (!inserted && !i)
          isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);
        else isParent && el.remove();
      } else inserted = true;
    }
  } else parent.insertBefore(node, marker);
  return [node];
}
var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
function createElement(tagName, isSVG = false) {
  return isSVG ? document.createElementNS(SVG_NAMESPACE, tagName) : document.createElement(tagName);
}
function Portal(props) {
  const { useShadow } = props, marker = document.createTextNode(""), mount = () => props.mount || document.body, owner = getOwner();
  let content;
  createEffect(
    () => {
      content || (content = runWithOwner(owner, () => createMemo(() => props.children)));
      const el = mount();
      if (el instanceof HTMLHeadElement) {
        const [clean, setClean] = createSignal$1(false);
        const cleanup = () => setClean(true);
        createRoot((dispose2) => insert(el, () => !clean() ? content() : dispose2(), null));
        onCleanup(cleanup);
      } else {
        const container = createElement(props.isSVG ? "g" : "div", props.isSVG), renderRoot = useShadow && container.attachShadow ? container.attachShadow({
          mode: "open"
        }) : container;
        Object.defineProperty(container, "_$host", {
          get() {
            return marker.parentNode;
          },
          configurable: true
        });
        insert(renderRoot, content);
        el.appendChild(container);
        props.ref && props.ref(container);
        onCleanup(() => el.removeChild(container));
      }
    },
    void 0,
    {
      render: true
    }
  );
  return marker;
}
function createDynamic(component, props) {
  const cached = createMemo(component);
  return createMemo(() => {
    const component2 = cached();
    switch (typeof component2) {
      case "function":
        return untrack(() => component2(props));
      case "string":
        const isSvg = SVGElements.has(component2);
        const el = createElement(component2, isSvg);
        spread(el, props, isSvg);
        return el;
    }
  });
}
function Dynamic(props) {
  const [, others] = splitProps(props, ["component"]);
  return createDynamic(() => props.component, others);
}
var DoubleIndexedKV = class {
  constructor() {
    this.keyToValue = /* @__PURE__ */ new Map();
    this.valueToKey = /* @__PURE__ */ new Map();
  }
  set(key, value) {
    this.keyToValue.set(key, value);
    this.valueToKey.set(value, key);
  }
  getByKey(key) {
    return this.keyToValue.get(key);
  }
  getByValue(value) {
    return this.valueToKey.get(value);
  }
  clear() {
    this.keyToValue.clear();
    this.valueToKey.clear();
  }
};
var Registry = class {
  constructor(generateIdentifier) {
    this.generateIdentifier = generateIdentifier;
    this.kv = new DoubleIndexedKV();
  }
  register(value, identifier) {
    if (this.kv.getByValue(value)) {
      return;
    }
    if (!identifier) {
      identifier = this.generateIdentifier(value);
    }
    this.kv.set(identifier, value);
  }
  clear() {
    this.kv.clear();
  }
  getIdentifier(value) {
    return this.kv.getByValue(value);
  }
  getValue(identifier) {
    return this.kv.getByKey(identifier);
  }
};
var ClassRegistry = class extends Registry {
  constructor() {
    super((c) => c.name);
    this.classToAllowedProps = /* @__PURE__ */ new Map();
  }
  register(value, options) {
    if (typeof options === "object") {
      if (options.allowProps) {
        this.classToAllowedProps.set(value, options.allowProps);
      }
      super.register(value, options.identifier);
    } else {
      super.register(value, options);
    }
  }
  getAllowedProps(value) {
    return this.classToAllowedProps.get(value);
  }
};
function valuesOfObj(record) {
  if ("values" in Object) {
    return Object.values(record);
  }
  const values = [];
  for (const key in record) {
    if (record.hasOwnProperty(key)) {
      values.push(record[key]);
    }
  }
  return values;
}
function find(record, predicate) {
  const values = valuesOfObj(record);
  if ("find" in values) {
    return values.find(predicate);
  }
  const valuesNotNever = values;
  for (let i = 0; i < valuesNotNever.length; i++) {
    const value = valuesNotNever[i];
    if (predicate(value)) {
      return value;
    }
  }
  return void 0;
}
function forEach(record, run) {
  Object.entries(record).forEach(([key, value]) => run(value, key));
}
function includes(arr, value) {
  return arr.indexOf(value) !== -1;
}
function findArr(record, predicate) {
  for (let i = 0; i < record.length; i++) {
    const value = record[i];
    if (predicate(value)) {
      return value;
    }
  }
  return void 0;
}
var CustomTransformerRegistry = class {
  constructor() {
    this.transfomers = {};
  }
  register(transformer) {
    this.transfomers[transformer.name] = transformer;
  }
  findApplicable(v2) {
    return find(this.transfomers, (transformer) => transformer.isApplicable(v2));
  }
  findByName(name) {
    return this.transfomers[name];
  }
};
var getType = (payload) => Object.prototype.toString.call(payload).slice(8, -1);
var isUndefined = (payload) => typeof payload === "undefined";
var isNull = (payload) => payload === null;
var isPlainObject = (payload) => {
  if (typeof payload !== "object" || payload === null)
    return false;
  if (payload === Object.prototype)
    return false;
  if (Object.getPrototypeOf(payload) === null)
    return true;
  return Object.getPrototypeOf(payload) === Object.prototype;
};
var isEmptyObject = (payload) => isPlainObject(payload) && Object.keys(payload).length === 0;
var isArray = (payload) => Array.isArray(payload);
var isString = (payload) => typeof payload === "string";
var isNumber = (payload) => typeof payload === "number" && !isNaN(payload);
var isBoolean = (payload) => typeof payload === "boolean";
var isRegExp = (payload) => payload instanceof RegExp;
var isMap = (payload) => payload instanceof Map;
var isSet = (payload) => payload instanceof Set;
var isSymbol = (payload) => getType(payload) === "Symbol";
var isDate = (payload) => payload instanceof Date && !isNaN(payload.valueOf());
var isError = (payload) => payload instanceof Error;
var isNaNValue = (payload) => typeof payload === "number" && isNaN(payload);
var isPrimitive = (payload) => isBoolean(payload) || isNull(payload) || isUndefined(payload) || isNumber(payload) || isString(payload) || isSymbol(payload);
var isBigint = (payload) => typeof payload === "bigint";
var isInfinite = (payload) => payload === Infinity || payload === -Infinity;
var isTypedArray = (payload) => ArrayBuffer.isView(payload) && !(payload instanceof DataView);
var isURL = (payload) => payload instanceof URL;
var escapeKey = (key) => key.replace(/\./g, "\\.");
var stringifyPath = (path) => path.map(String).map(escapeKey).join(".");
var parsePath = (string) => {
  const result = [];
  let segment = "";
  for (let i = 0; i < string.length; i++) {
    let char = string.charAt(i);
    const isEscapedDot = char === "\\" && string.charAt(i + 1) === ".";
    if (isEscapedDot) {
      segment += ".";
      i++;
      continue;
    }
    const isEndOfSegment = char === ".";
    if (isEndOfSegment) {
      result.push(segment);
      segment = "";
      continue;
    }
    segment += char;
  }
  const lastSegment = segment;
  result.push(lastSegment);
  return result;
};
function simpleTransformation(isApplicable, annotation, transform, untransform) {
  return {
    isApplicable,
    annotation,
    transform,
    untransform
  };
}
var simpleRules = [
  simpleTransformation(isUndefined, "undefined", () => null, () => void 0),
  simpleTransformation(isBigint, "bigint", (v2) => v2.toString(), (v2) => {
    if (typeof BigInt !== "undefined") {
      return BigInt(v2);
    }
    return v2;
  }),
  simpleTransformation(isDate, "Date", (v2) => v2.toISOString(), (v2) => new Date(v2)),
  simpleTransformation(isError, "Error", (v2, superJson) => {
    const baseError = {
      name: v2.name,
      message: v2.message
    };
    superJson.allowedErrorProps.forEach((prop) => {
      baseError[prop] = v2[prop];
    });
    return baseError;
  }, (v2, superJson) => {
    const e = new Error(v2.message);
    e.name = v2.name;
    e.stack = v2.stack;
    superJson.allowedErrorProps.forEach((prop) => {
      e[prop] = v2[prop];
    });
    return e;
  }),
  simpleTransformation(isRegExp, "regexp", (v2) => "" + v2, (regex) => {
    const body = regex.slice(1, regex.lastIndexOf("/"));
    const flags = regex.slice(regex.lastIndexOf("/") + 1);
    return new RegExp(body, flags);
  }),
  simpleTransformation(
    isSet,
    "set",
    // (sets only exist in es6+)
    // eslint-disable-next-line es5/no-es6-methods
    (v2) => [...v2.values()],
    (v2) => new Set(v2)
  ),
  simpleTransformation(isMap, "map", (v2) => [...v2.entries()], (v2) => new Map(v2)),
  simpleTransformation((v2) => isNaNValue(v2) || isInfinite(v2), "number", (v2) => {
    if (isNaNValue(v2)) {
      return "NaN";
    }
    if (v2 > 0) {
      return "Infinity";
    } else {
      return "-Infinity";
    }
  }, Number),
  simpleTransformation((v2) => v2 === 0 && 1 / v2 === -Infinity, "number", () => {
    return "-0";
  }, Number),
  simpleTransformation(isURL, "URL", (v2) => v2.toString(), (v2) => new URL(v2))
];
function compositeTransformation(isApplicable, annotation, transform, untransform) {
  return {
    isApplicable,
    annotation,
    transform,
    untransform
  };
}
var symbolRule = compositeTransformation((s, superJson) => {
  if (isSymbol(s)) {
    const isRegistered = !!superJson.symbolRegistry.getIdentifier(s);
    return isRegistered;
  }
  return false;
}, (s, superJson) => {
  const identifier = superJson.symbolRegistry.getIdentifier(s);
  return ["symbol", identifier];
}, (v2) => v2.description, (_, a, superJson) => {
  const value = superJson.symbolRegistry.getValue(a[1]);
  if (!value) {
    throw new Error("Trying to deserialize unknown symbol");
  }
  return value;
});
var constructorToName = [
  Int8Array,
  Uint8Array,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  Uint8ClampedArray
].reduce((obj, ctor) => {
  obj[ctor.name] = ctor;
  return obj;
}, {});
var typedArrayRule = compositeTransformation(isTypedArray, (v2) => ["typed-array", v2.constructor.name], (v2) => [...v2], (v2, a) => {
  const ctor = constructorToName[a[1]];
  if (!ctor) {
    throw new Error("Trying to deserialize unknown typed array");
  }
  return new ctor(v2);
});
function isInstanceOfRegisteredClass(potentialClass, superJson) {
  if (potentialClass == null ? void 0 : potentialClass.constructor) {
    const isRegistered = !!superJson.classRegistry.getIdentifier(potentialClass.constructor);
    return isRegistered;
  }
  return false;
}
var classRule = compositeTransformation(isInstanceOfRegisteredClass, (clazz, superJson) => {
  const identifier = superJson.classRegistry.getIdentifier(clazz.constructor);
  return ["class", identifier];
}, (clazz, superJson) => {
  const allowedProps = superJson.classRegistry.getAllowedProps(clazz.constructor);
  if (!allowedProps) {
    return { ...clazz };
  }
  const result = {};
  allowedProps.forEach((prop) => {
    result[prop] = clazz[prop];
  });
  return result;
}, (v2, a, superJson) => {
  const clazz = superJson.classRegistry.getValue(a[1]);
  if (!clazz) {
    throw new Error("Trying to deserialize unknown class - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564");
  }
  return Object.assign(Object.create(clazz.prototype), v2);
});
var customRule = compositeTransformation((value, superJson) => {
  return !!superJson.customTransformerRegistry.findApplicable(value);
}, (value, superJson) => {
  const transformer = superJson.customTransformerRegistry.findApplicable(value);
  return ["custom", transformer.name];
}, (value, superJson) => {
  const transformer = superJson.customTransformerRegistry.findApplicable(value);
  return transformer.serialize(value);
}, (v2, a, superJson) => {
  const transformer = superJson.customTransformerRegistry.findByName(a[1]);
  if (!transformer) {
    throw new Error("Trying to deserialize unknown custom value");
  }
  return transformer.deserialize(v2);
});
var compositeRules = [classRule, symbolRule, customRule, typedArrayRule];
var transformValue = (value, superJson) => {
  const applicableCompositeRule = findArr(compositeRules, (rule) => rule.isApplicable(value, superJson));
  if (applicableCompositeRule) {
    return {
      value: applicableCompositeRule.transform(value, superJson),
      type: applicableCompositeRule.annotation(value, superJson)
    };
  }
  const applicableSimpleRule = findArr(simpleRules, (rule) => rule.isApplicable(value, superJson));
  if (applicableSimpleRule) {
    return {
      value: applicableSimpleRule.transform(value, superJson),
      type: applicableSimpleRule.annotation
    };
  }
  return void 0;
};
var simpleRulesByAnnotation = {};
simpleRules.forEach((rule) => {
  simpleRulesByAnnotation[rule.annotation] = rule;
});
var untransformValue = (json2, type, superJson) => {
  if (isArray(type)) {
    switch (type[0]) {
      case "symbol":
        return symbolRule.untransform(json2, type, superJson);
      case "class":
        return classRule.untransform(json2, type, superJson);
      case "custom":
        return customRule.untransform(json2, type, superJson);
      case "typed-array":
        return typedArrayRule.untransform(json2, type, superJson);
      default:
        throw new Error("Unknown transformation: " + type);
    }
  } else {
    const transformation = simpleRulesByAnnotation[type];
    if (!transformation) {
      throw new Error("Unknown transformation: " + type);
    }
    return transformation.untransform(json2, superJson);
  }
};
var getNthKey = (value, n) => {
  const keys = value.keys();
  while (n > 0) {
    keys.next();
    n--;
  }
  return keys.next().value;
};
function validatePath(path) {
  if (includes(path, "__proto__")) {
    throw new Error("__proto__ is not allowed as a property");
  }
  if (includes(path, "prototype")) {
    throw new Error("prototype is not allowed as a property");
  }
  if (includes(path, "constructor")) {
    throw new Error("constructor is not allowed as a property");
  }
}
var getDeep = (object, path) => {
  validatePath(path);
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    if (isSet(object)) {
      object = getNthKey(object, +key);
    } else if (isMap(object)) {
      const row = +key;
      const type = +path[++i] === 0 ? "key" : "value";
      const keyOfRow = getNthKey(object, row);
      switch (type) {
        case "key":
          object = keyOfRow;
          break;
        case "value":
          object = object.get(keyOfRow);
          break;
      }
    } else {
      object = object[key];
    }
  }
  return object;
};
var setDeep = (object, path, mapper) => {
  validatePath(path);
  if (path.length === 0) {
    return mapper(object);
  }
  let parent = object;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (isArray(parent)) {
      const index2 = +key;
      parent = parent[index2];
    } else if (isPlainObject(parent)) {
      parent = parent[key];
    } else if (isSet(parent)) {
      const row = +key;
      parent = getNthKey(parent, row);
    } else if (isMap(parent)) {
      const isEnd = i === path.length - 2;
      if (isEnd) {
        break;
      }
      const row = +key;
      const type = +path[++i] === 0 ? "key" : "value";
      const keyOfRow = getNthKey(parent, row);
      switch (type) {
        case "key":
          parent = keyOfRow;
          break;
        case "value":
          parent = parent.get(keyOfRow);
          break;
      }
    }
  }
  const lastKey = path[path.length - 1];
  if (isArray(parent)) {
    parent[+lastKey] = mapper(parent[+lastKey]);
  } else if (isPlainObject(parent)) {
    parent[lastKey] = mapper(parent[lastKey]);
  }
  if (isSet(parent)) {
    const oldValue = getNthKey(parent, +lastKey);
    const newValue = mapper(oldValue);
    if (oldValue !== newValue) {
      parent.delete(oldValue);
      parent.add(newValue);
    }
  }
  if (isMap(parent)) {
    const row = +path[path.length - 2];
    const keyToRow = getNthKey(parent, row);
    const type = +lastKey === 0 ? "key" : "value";
    switch (type) {
      case "key": {
        const newKey = mapper(keyToRow);
        parent.set(newKey, parent.get(keyToRow));
        if (newKey !== keyToRow) {
          parent.delete(keyToRow);
        }
        break;
      }
      case "value": {
        parent.set(keyToRow, mapper(parent.get(keyToRow)));
        break;
      }
    }
  }
  return object;
};
function traverse(tree, walker2, origin = []) {
  if (!tree) {
    return;
  }
  if (!isArray(tree)) {
    forEach(tree, (subtree, key) => traverse(subtree, walker2, [...origin, ...parsePath(key)]));
    return;
  }
  const [nodeValue, children2] = tree;
  if (children2) {
    forEach(children2, (child, key) => {
      traverse(child, walker2, [...origin, ...parsePath(key)]);
    });
  }
  walker2(nodeValue, origin);
}
function applyValueAnnotations(plain, annotations, superJson) {
  traverse(annotations, (type, path) => {
    plain = setDeep(plain, path, (v2) => untransformValue(v2, type, superJson));
  });
  return plain;
}
function applyReferentialEqualityAnnotations(plain, annotations) {
  function apply(identicalPaths, path) {
    const object = getDeep(plain, parsePath(path));
    identicalPaths.map(parsePath).forEach((identicalObjectPath) => {
      plain = setDeep(plain, identicalObjectPath, () => object);
    });
  }
  if (isArray(annotations)) {
    const [root, other] = annotations;
    root.forEach((identicalPath) => {
      plain = setDeep(plain, parsePath(identicalPath), () => plain);
    });
    if (other) {
      forEach(other, apply);
    }
  } else {
    forEach(annotations, apply);
  }
  return plain;
}
var isDeep = (object, superJson) => isPlainObject(object) || isArray(object) || isMap(object) || isSet(object) || isInstanceOfRegisteredClass(object, superJson);
function addIdentity(object, path, identities) {
  const existingSet = identities.get(object);
  if (existingSet) {
    existingSet.push(path);
  } else {
    identities.set(object, [path]);
  }
}
function generateReferentialEqualityAnnotations(identitites, dedupe) {
  const result = {};
  let rootEqualityPaths = void 0;
  identitites.forEach((paths) => {
    if (paths.length <= 1) {
      return;
    }
    if (!dedupe) {
      paths = paths.map((path) => path.map(String)).sort((a, b) => a.length - b.length);
    }
    const [representativePath, ...identicalPaths] = paths;
    if (representativePath.length === 0) {
      rootEqualityPaths = identicalPaths.map(stringifyPath);
    } else {
      result[stringifyPath(representativePath)] = identicalPaths.map(stringifyPath);
    }
  });
  if (rootEqualityPaths) {
    if (isEmptyObject(result)) {
      return [rootEqualityPaths];
    } else {
      return [rootEqualityPaths, result];
    }
  } else {
    return isEmptyObject(result) ? void 0 : result;
  }
}
var walker = (object, identities, superJson, dedupe, path = [], objectsInThisPath = [], seenObjects = /* @__PURE__ */ new Map()) => {
  const primitive = isPrimitive(object);
  if (!primitive) {
    addIdentity(object, path, identities);
    const seen = seenObjects.get(object);
    if (seen) {
      return dedupe ? {
        transformedValue: null
      } : seen;
    }
  }
  if (!isDeep(object, superJson)) {
    const transformed2 = transformValue(object, superJson);
    const result2 = transformed2 ? {
      transformedValue: transformed2.value,
      annotations: [transformed2.type]
    } : {
      transformedValue: object
    };
    if (!primitive) {
      seenObjects.set(object, result2);
    }
    return result2;
  }
  if (includes(objectsInThisPath, object)) {
    return {
      transformedValue: null
    };
  }
  const transformationResult = transformValue(object, superJson);
  const transformed = (transformationResult == null ? void 0 : transformationResult.value) ?? object;
  const transformedValue = isArray(transformed) ? [] : {};
  const innerAnnotations = {};
  forEach(transformed, (value, index2) => {
    if (index2 === "__proto__" || index2 === "constructor" || index2 === "prototype") {
      throw new Error(`Detected property ${index2}. This is a prototype pollution risk, please remove it from your object.`);
    }
    const recursiveResult = walker(value, identities, superJson, dedupe, [...path, index2], [...objectsInThisPath, object], seenObjects);
    transformedValue[index2] = recursiveResult.transformedValue;
    if (isArray(recursiveResult.annotations)) {
      innerAnnotations[index2] = recursiveResult.annotations;
    } else if (isPlainObject(recursiveResult.annotations)) {
      forEach(recursiveResult.annotations, (tree, key) => {
        innerAnnotations[escapeKey(index2) + "." + key] = tree;
      });
    }
  });
  const result = isEmptyObject(innerAnnotations) ? {
    transformedValue,
    annotations: !!transformationResult ? [transformationResult.type] : void 0
  } : {
    transformedValue,
    annotations: !!transformationResult ? [transformationResult.type, innerAnnotations] : innerAnnotations
  };
  if (!primitive) {
    seenObjects.set(object, result);
  }
  return result;
};
function getType2(payload) {
  return Object.prototype.toString.call(payload).slice(8, -1);
}
function isArray2(payload) {
  return getType2(payload) === "Array";
}
function isPlainObject2(payload) {
  if (getType2(payload) !== "Object")
    return false;
  const prototype = Object.getPrototypeOf(payload);
  return !!prototype && prototype.constructor === Object && prototype === Object.prototype;
}
function assignProp2(carry, key, newVal, originalObject, includeNonenumerable) {
  const propType = {}.propertyIsEnumerable.call(originalObject, key) ? "enumerable" : "nonenumerable";
  if (propType === "enumerable")
    carry[key] = newVal;
  if (includeNonenumerable && propType === "nonenumerable") {
    Object.defineProperty(carry, key, {
      value: newVal,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
}
function copy(target, options = {}) {
  if (isArray2(target)) {
    return target.map((item) => copy(item, options));
  }
  if (!isPlainObject2(target)) {
    return target;
  }
  const props = Object.getOwnPropertyNames(target);
  const symbols = Object.getOwnPropertySymbols(target);
  return [...props, ...symbols].reduce((carry, key) => {
    if (isArray2(options.props) && !options.props.includes(key)) {
      return carry;
    }
    const val = target[key];
    const newVal = copy(val, options);
    assignProp2(carry, key, newVal, target, options.nonenumerable);
    return carry;
  }, {});
}
var SuperJSON = class {
  /**
   * @param dedupeReferentialEqualities  If true, SuperJSON will make sure only one instance of referentially equal objects are serialized and the rest are replaced with `null`.
   */
  constructor({ dedupe = false } = {}) {
    this.classRegistry = new ClassRegistry();
    this.symbolRegistry = new Registry((s) => s.description ?? "");
    this.customTransformerRegistry = new CustomTransformerRegistry();
    this.allowedErrorProps = [];
    this.dedupe = dedupe;
  }
  serialize(object) {
    const identities = /* @__PURE__ */ new Map();
    const output = walker(object, identities, this, this.dedupe);
    const res = {
      json: output.transformedValue
    };
    if (output.annotations) {
      res.meta = {
        ...res.meta,
        values: output.annotations
      };
    }
    const equalityAnnotations = generateReferentialEqualityAnnotations(identities, this.dedupe);
    if (equalityAnnotations) {
      res.meta = {
        ...res.meta,
        referentialEqualities: equalityAnnotations
      };
    }
    return res;
  }
  deserialize(payload) {
    const { json: json2, meta } = payload;
    let result = copy(json2);
    if (meta == null ? void 0 : meta.values) {
      result = applyValueAnnotations(result, meta.values, this);
    }
    if (meta == null ? void 0 : meta.referentialEqualities) {
      result = applyReferentialEqualityAnnotations(result, meta.referentialEqualities);
    }
    return result;
  }
  stringify(object) {
    return JSON.stringify(this.serialize(object));
  }
  parse(string) {
    return this.deserialize(JSON.parse(string));
  }
  registerClass(v2, options) {
    this.classRegistry.register(v2, options);
  }
  registerSymbol(v2, identifier) {
    this.symbolRegistry.register(v2, identifier);
  }
  registerCustom(transformer, name) {
    this.customTransformerRegistry.register({
      name,
      ...transformer
    });
  }
  allowErrorProps(...props) {
    this.allowedErrorProps.push(...props);
  }
};
SuperJSON.defaultInstance = new SuperJSON();
SuperJSON.serialize = SuperJSON.defaultInstance.serialize.bind(SuperJSON.defaultInstance);
SuperJSON.deserialize = SuperJSON.defaultInstance.deserialize.bind(SuperJSON.defaultInstance);
SuperJSON.stringify = SuperJSON.defaultInstance.stringify.bind(SuperJSON.defaultInstance);
SuperJSON.parse = SuperJSON.defaultInstance.parse.bind(SuperJSON.defaultInstance);
SuperJSON.registerClass = SuperJSON.defaultInstance.registerClass.bind(SuperJSON.defaultInstance);
SuperJSON.registerSymbol = SuperJSON.defaultInstance.registerSymbol.bind(SuperJSON.defaultInstance);
SuperJSON.registerCustom = SuperJSON.defaultInstance.registerCustom.bind(SuperJSON.defaultInstance);
SuperJSON.allowErrorProps = SuperJSON.defaultInstance.allowErrorProps.bind(SuperJSON.defaultInstance);
var serialize = SuperJSON.serialize;
var stringify = SuperJSON.stringify;
function getQueryStatusLabel(query) {
  return query.state.fetchStatus === "fetching" ? "fetching" : !query.getObserversCount() ? "inactive" : query.state.fetchStatus === "paused" ? "paused" : query.isStale() ? "stale" : "fresh";
}
function getSidedProp(prop, side) {
  return `${prop}${side.charAt(0).toUpperCase() + side.slice(1)}`;
}
function getQueryStatusColor({
  queryState,
  observerCount,
  isStale
}) {
  return queryState.fetchStatus === "fetching" ? "blue" : !observerCount ? "gray" : queryState.fetchStatus === "paused" ? "purple" : isStale ? "yellow" : "green";
}
function getMutationStatusColor({
  status,
  isPaused
}) {
  return isPaused ? "purple" : status === "error" ? "red" : status === "pending" ? "yellow" : status === "success" ? "green" : "gray";
}
function getQueryStatusColorByLabel(label) {
  return label === "fresh" ? "green" : label === "stale" ? "yellow" : label === "paused" ? "purple" : label === "inactive" ? "gray" : "blue";
}
var displayValue = (value, beautify = false) => {
  const {
    json: json2
  } = serialize(value);
  return JSON.stringify(json2, null, beautify ? 2 : void 0);
};
var getStatusRank = (q) => q.state.fetchStatus !== "idle" ? 0 : !q.getObserversCount() ? 3 : q.isStale() ? 2 : 1;
var queryHashSort = (a, b) => a.queryHash.localeCompare(b.queryHash);
var dateSort = (a, b) => a.state.dataUpdatedAt < b.state.dataUpdatedAt ? 1 : -1;
var statusAndDateSort = (a, b) => {
  if (getStatusRank(a) === getStatusRank(b)) {
    return dateSort(a, b);
  }
  return getStatusRank(a) > getStatusRank(b) ? 1 : -1;
};
var sortFns = {
  status: statusAndDateSort,
  "query hash": queryHashSort,
  "last updated": dateSort
};
var getMutationStatusRank = (m) => m.state.isPaused ? 0 : m.state.status === "error" ? 2 : m.state.status === "pending" ? 1 : 3;
var mutationDateSort = (a, b) => a.state.submittedAt < b.state.submittedAt ? 1 : -1;
var mutationStatusSort = (a, b) => {
  if (getMutationStatusRank(a) === getMutationStatusRank(b)) {
    return mutationDateSort(a, b);
  }
  return getMutationStatusRank(a) > getMutationStatusRank(b) ? 1 : -1;
};
var mutationSortFns = {
  status: mutationStatusSort,
  "last updated": mutationDateSort
};
var convertRemToPixels = (rem) => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};
var getPreferredColorScheme = () => {
  const [colorScheme, setColorScheme] = createSignal$1("dark");
  onMount(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    setColorScheme(query.matches ? "dark" : "light");
    const listener = (e) => {
      setColorScheme(e.matches ? "dark" : "light");
    };
    query.addEventListener("change", listener);
    onCleanup(() => query.removeEventListener("change", listener));
  });
  return colorScheme;
};
var updateNestedDataByPath = (oldData, updatePath, value) => {
  if (updatePath.length === 0) {
    return value;
  }
  if (oldData instanceof Map) {
    const newData = new Map(oldData);
    if (updatePath.length === 1) {
      newData.set(updatePath[0], value);
      return newData;
    }
    const [head, ...tail] = updatePath;
    newData.set(head, updateNestedDataByPath(newData.get(head), tail, value));
    return newData;
  }
  if (oldData instanceof Set) {
    const setAsArray = updateNestedDataByPath(Array.from(oldData), updatePath, value);
    return new Set(setAsArray);
  }
  if (Array.isArray(oldData)) {
    const newData = [...oldData];
    if (updatePath.length === 1) {
      newData[updatePath[0]] = value;
      return newData;
    }
    const [head, ...tail] = updatePath;
    newData[head] = updateNestedDataByPath(newData[head], tail, value);
    return newData;
  }
  if (oldData instanceof Object) {
    const newData = {
      ...oldData
    };
    if (updatePath.length === 1) {
      newData[updatePath[0]] = value;
      return newData;
    }
    const [head, ...tail] = updatePath;
    newData[head] = updateNestedDataByPath(newData[head], tail, value);
    return newData;
  }
  return oldData;
};
var deleteNestedDataByPath = (oldData, deletePath) => {
  if (oldData instanceof Map) {
    const newData = new Map(oldData);
    if (deletePath.length === 1) {
      newData.delete(deletePath[0]);
      return newData;
    }
    const [head, ...tail] = deletePath;
    newData.set(head, deleteNestedDataByPath(newData.get(head), tail));
    return newData;
  }
  if (oldData instanceof Set) {
    const setAsArray = deleteNestedDataByPath(Array.from(oldData), deletePath);
    return new Set(setAsArray);
  }
  if (Array.isArray(oldData)) {
    const newData = [...oldData];
    if (deletePath.length === 1) {
      return newData.filter((_, idx) => idx.toString() !== deletePath[0]);
    }
    const [head, ...tail] = deletePath;
    newData[head] = deleteNestedDataByPath(newData[head], tail);
    return newData;
  }
  if (oldData instanceof Object) {
    const newData = {
      ...oldData
    };
    if (deletePath.length === 1) {
      delete newData[deletePath[0]];
      return newData;
    }
    const [head, ...tail] = deletePath;
    newData[head] = deleteNestedDataByPath(newData[head], tail);
    return newData;
  }
  return oldData;
};
var ReactQueryDevtools2 = function() {
  return null;
} ;
var R = ((a) => (a[a.AggregateError = 1] = "AggregateError", a[a.ArrowFunction = 2] = "ArrowFunction", a[a.ErrorPrototypeStack = 4] = "ErrorPrototypeStack", a[a.ObjectAssign = 8] = "ObjectAssign", a[a.BigIntTypedArray = 16] = "BigIntTypedArray", a))(R || {});
var T = "__SEROVAL_REFS__";
var O = /* @__PURE__ */ new Map();
typeof globalThis != "undefined" ? Object.defineProperty(globalThis, T, { value: O, configurable: true, writable: false, enumerable: false }) : typeof self != "undefined" ? Object.defineProperty(self, T, { value: O, configurable: true, writable: false, enumerable: false }) : typeof global != "undefined" && Object.defineProperty(global, T, { value: O, configurable: true, writable: false, enumerable: false });
R.AggregateError | R.BigIntTypedArray;
const TanStackRouterDevtools = function() {
  return null;
} ;
function Header() {
  return /* @__PURE__ */ jsx("header", { className: "p-2 flex gap-2 bg-white text-black justify-between", children: /* @__PURE__ */ jsxs("nav", { className: "flex flex-row", children: [
    /* @__PURE__ */ jsx("div", { className: "px-2", children: /* @__PURE__ */ jsx(Link, { to: "/", activeProps: { className: "font-bold" }, children: "Home" }) }),
    /* @__PURE__ */ jsx("div", { className: "px-2", children: /* @__PURE__ */ jsx(Link, { to: "/basic", activeProps: { className: "font-bold" }, children: "Basic Example" }) }),
    /* @__PURE__ */ jsx("div", { className: "px-2", children: /* @__PURE__ */ jsx(Link, { to: "/suspense", activeProps: { className: "font-bold" }, children: "Suspense Example" }) }),
    /* @__PURE__ */ jsx("div", { className: "px-2", children: /* @__PURE__ */ jsx(Link, { to: "/preloading", activeProps: { className: "font-bold" }, children: "Preloading Example" }) }),
    /* @__PURE__ */ jsx("div", { className: "px-2", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/intent-preloading",
        preload: "intent",
        activeProps: { className: "font-bold" },
        children: "Intent Preloading Example"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "px-2", children: /* @__PURE__ */ jsx(Link, { to: "/pagination", activeProps: { className: "font-bold" }, children: "Pagination Example" }) })
  ] }) });
}
const appCss = "/assets/global-B8kMkExK.css";
const Route$6 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "fizzbuzz"
      }
    ],
    links: [
      { rel: "icon", href: "/favicon.ico" },
      { rel: "stylesheet", href: appCss }
    ]
  }),
  component: RootComponent
});
function RootComponent() {
  return /* @__PURE__ */ jsx(RootDocument, { children: /* @__PURE__ */ jsx(Outlet, {}) });
}
function RootDocument(props) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Header, {}),
      props.children,
      /* @__PURE__ */ jsx(TanStackRouterDevtools, {}),
      /* @__PURE__ */ jsx(ReactQueryDevtools2, { buttonPosition: "bottom-right" }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function sanitizeBase(base) {
  return base.replace(/^\/|\/$/g, "");
}
const createServerRpc = (functionId, serverBase, splitImportFn) => {
  invariant(
    splitImportFn);
  const url = `/${sanitizeBase(serverBase)}/${functionId}`;
  return Object.assign(splitImportFn, {
    url,
    functionId
  });
};
const env = createEnv({
  server: {
    DB_NAME: v.string()
  },
  runtimeEnv: process.env
});
const pokemon = sqliteTable("pokemon", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  dexId: integer("dex_id").notNull()
});
const pokemonRelations = relations(pokemon, ({ many }) => ({
  types: many(pokemonTypes)
}));
const types = sqliteTable("types", {
  id: integer("id").primaryKey(),
  name: text("name").notNull()
});
const typesRelations = relations(types, ({ many }) => ({
  pokemon: many(pokemonTypes)
}));
const pokemonTypes = sqliteTable(
  "pokemon_types",
  {
    id: integer("id").primaryKey(),
    pokemonId: integer("pokemon_id").notNull().references(() => pokemon.id),
    typeId: integer("type_id").notNull().references(() => types.id)
  },
  (table) => [
    index("idx_pt_pokemon").on(table.pokemonId),
    index("idx_pt_type").on(table.typeId)
  ]
);
const pokemonTypesRelations = relations(pokemonTypes, ({ one }) => ({
  pokemon: one(pokemon, {
    fields: [pokemonTypes.pokemonId],
    references: [pokemon.id]
  }),
  type: one(types, {
    fields: [pokemonTypes.typeId],
    references: [types.id]
  })
}));
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  pokemon,
  pokemonRelations,
  pokemonTypes,
  pokemonTypesRelations,
  types,
  typesRelations
}, Symbol.toStringTag, { value: "Module" }));
const db = drizzle(env.DB_NAME, { schema });
const preparedGetPokemonAtOffset = db.query.pokemon.findMany({
  columns: {
    id: true,
    name: true,
    dexId: true
  },
  orderBy: (pokemon2, { asc }) => [asc(pokemon2.dexId)],
  limit: sql.placeholder("limit"),
  offset: sql.placeholder("offset"),
  with: {
    types: {
      orderBy: (types2, { asc }) => [asc(types2.typeId)],
      columns: {},
      with: {
        type: {
          columns: {
            name: true
          }
        }
      }
    }
  }
}).prepare();
const DB = {
  queries: {
    getPokemonAtOffset: async (offset, limit) => {
      return preparedGetPokemonAtOffset.execute({
        limit,
        offset
      });
    }
  }
};
const POKEMON_LIMIT$3 = 25;
const PokemonListParamsSchema = v.object({
  offset: v.optional(v.number())
});
const innerGetPokemonList = async (offset) => {
  const pokemon2 = await DB.queries.getPokemonAtOffset(offset, POKEMON_LIMIT$3 + 1);
  const hasMore = pokemon2.length > POKEMON_LIMIT$3;
  const results = hasMore ? pokemon2.slice(0, -1) : pokemon2;
  console.log("results", results);
  return {
    pokemon: results,
    nextOffset: hasMore ? offset + POKEMON_LIMIT$3 : null,
    prevOffset: offset > 0 ? Math.max(0, offset - POKEMON_LIMIT$3) : null
  };
};
const getServerPokemonList_createServerFn_handler = createServerRpc("src_util_pokemon_ts--getServerPokemonList_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getServerPokemonList.__executeServer(opts, signal);
});
const getServerPokemonList = createServerFn({
  method: "GET"
}).validator((params) => {
  const validated = v.parse(PokemonListParamsSchema, params);
  const offset = validated.offset ?? 0;
  if (offset < 0) throw new Error("Offset must be greater than or equal to 0");
  return {
    offset
  };
}).handler(getServerPokemonList_createServerFn_handler, async ({
  data
}) => {
  return await innerGetPokemonList(data.offset);
});
const $$splitErrorComponentImporter$3 = () => import('./suspense-CDby3_eA.mjs');
const $$splitNotFoundComponentImporter$3 = () => import('./suspense-eUhkQotn.mjs');
const $$splitComponentImporter$5 = () => import('./suspense-wbT_yPoJ.mjs');
const searchParamsSchema$4 = v.object({
  offset: v.optional(v.number(), 0)
});
const Route$5 = createFileRoute({
  validateSearch: searchParamsSchema$4,
  component: lazyRouteComponent($$splitComponentImporter$5, "component", () => Route$5.ssr),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$3, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$3, "errorComponent"),
  pendingComponent: LoadingComponent$3
});
function LoadingComponent$3() {
  return /* @__PURE__ */ jsx("div", { children: "Loading..." });
}
const $$splitErrorComponentImporter$2 = () => import('./preloading-CDby3_eA.mjs');
const $$splitNotFoundComponentImporter$2 = () => import('./preloading-eUhkQotn.mjs');
const $$splitComponentImporter$4 = () => import('./preloading-D-Pu2kHV.mjs');
const POKEMON_LIMIT$2 = 20;
const searchParamsSchema$3 = v.object({
  offset: v.optional(v.number(), 0)
});
const Route$4 = createFileRoute({
  validateSearch: searchParamsSchema$3,
  loaderDeps: ({
    search
  }) => ({
    offset: search.offset
  }),
  context: ({
    deps
  }) => {
    const newKey = ["pokemon-list", "preloading", {
      limit: POKEMON_LIMIT$2,
      offset: deps.offset
    }];
    const pokemonListOptions = queryOptions({
      queryKey: newKey,
      queryFn: async () => {
        const result = await getServerPokemonList({
          data: {
            offset: deps.offset
          }
        });
        return {
          results: result.pokemon.map((p) => ({
            name: p.name,
            url: `/api/v2/pokemon/${p.id}/`
          })),
          next: result.nextOffset !== null ? `/api/v2/pokemon/?offset=${result.nextOffset}` : null,
          previous: result.prevOffset !== null ? `/api/v2/pokemon/?offset=${result.prevOffset}` : null
        };
      }
    });
    return {
      pokemonListOptions
    };
  },
  loader: ({
    context
  }) => {
    context.queryClient.prefetchQuery(context.pokemonListOptions);
  },
  component: lazyRouteComponent($$splitComponentImporter$4, "component", () => Route$4.ssr),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$2, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent"),
  pendingComponent: LoadingComponent$2
});
function LoadingComponent$2() {
  return /* @__PURE__ */ jsx("div", { children: "Loading..." });
}
const $$splitErrorComponentImporter$1 = () => import('./pagination-CDby3_eA.mjs');
const $$splitNotFoundComponentImporter$1 = () => import('./pagination-eUhkQotn.mjs');
const $$splitComponentImporter$3 = () => import('./pagination-Cw9fMujH.mjs');
const POKEMON_LIMIT$1 = 20;
const searchParamsSchema$2 = v.object({
  offset: v.optional(v.number(), 0)
});
const Route$3 = createFileRoute({
  validateSearch: searchParamsSchema$2,
  loaderDeps: ({
    search
  }) => ({
    offset: search.offset
  }),
  context: ({
    deps
  }) => {
    const newKey = ["pokemon-list", "pagination", {
      limit: POKEMON_LIMIT$1,
      offset: deps.offset
    }];
    const pokemonListOptions = queryOptions({
      queryKey: newKey,
      queryFn: async ({
        queryKey
      }) => {
        const result = await getServerPokemonList({
          data: {
            offset: queryKey[2].offset
          }
        });
        return result.pokemon;
      }
    });
    return {
      pokemonListOptions
    };
  },
  loader: ({
    context
  }) => {
    context.queryClient.prefetchQuery(context.pokemonListOptions);
  },
  component: lazyRouteComponent($$splitComponentImporter$3, "component", () => Route$3.ssr),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent"),
  pendingComponent: LoadingComponent$1
});
function LoadingComponent$1() {
  return /* @__PURE__ */ jsx("div", { children: "Loading..." });
}
const $$splitErrorComponentImporter = () => import('./intent-preloading-CDby3_eA.mjs');
const $$splitNotFoundComponentImporter = () => import('./intent-preloading-eUhkQotn.mjs');
const $$splitComponentImporter$2 = () => import('./intent-preloading-BGRNd4ca.mjs');
const POKEMON_LIMIT = 20;
const searchParamsSchema$1 = v.object({
  offset: v.optional(v.number(), 0)
});
const Route$2 = createFileRoute({
  validateSearch: searchParamsSchema$1,
  loaderDeps: ({
    search
  }) => ({
    offset: search.offset
  }),
  context: ({
    deps
  }) => {
    const newKey = ["pokemon-list", "intent-preloading", {
      limit: POKEMON_LIMIT,
      offset: deps.offset
    }];
    const pokemonListOptions = queryOptions({
      queryKey: newKey,
      queryFn: async () => {
        const result = await getServerPokemonList({
          data: {
            offset: deps.offset
          }
        });
        return {
          results: result.pokemon.map((p) => ({
            name: p.name,
            url: `/api/v2/pokemon/${p.id}/`
          })),
          next: result.nextOffset !== null ? `/api/v2/pokemon/?offset=${result.nextOffset}` : null,
          previous: result.prevOffset !== null ? `/api/v2/pokemon/?offset=${result.prevOffset}` : null
        };
      }
    });
    return {
      pokemonListOptions
    };
  },
  loader: ({
    context
  }) => {
    context.queryClient.prefetchQuery(context.pokemonListOptions);
  },
  component: lazyRouteComponent($$splitComponentImporter$2, "component", () => Route$2.ssr),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  pendingComponent: LoadingComponent
});
function LoadingComponent() {
  return /* @__PURE__ */ jsx("div", { children: "Loading..." });
}
const $$splitComponentImporter$1 = () => import('./basic-D2SeuWcm.mjs');
const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0)
});
const Route$1 = createFileRoute({
  validateSearch: searchParamsSchema,
  component: lazyRouteComponent($$splitComponentImporter$1, "component", () => Route$1.ssr)
});
const $$splitComponentImporter = () => import('./index-DR_wIx-E.mjs');
const Route2 = createFileRoute({
  component: lazyRouteComponent($$splitComponentImporter, "component", () => Route2.ssr)
});
const SuspenseRoute = Route$5.update({
  id: "/suspense",
  path: "/suspense",
  getParentRoute: () => Route$6
});
const PreloadingRoute = Route$4.update({
  id: "/preloading",
  path: "/preloading",
  getParentRoute: () => Route$6
});
const PaginationRoute = Route$3.update({
  id: "/pagination",
  path: "/pagination",
  getParentRoute: () => Route$6
});
const IntentPreloadingRoute = Route$2.update({
  id: "/intent-preloading",
  path: "/intent-preloading",
  getParentRoute: () => Route$6
});
const BasicRoute = Route$1.update({
  id: "/basic",
  path: "/basic",
  getParentRoute: () => Route$6
});
const IndexRoute = Route2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$6
});
const rootRouteChildren = {
  IndexRoute,
  BasicRoute,
  IntentPreloadingRoute,
  PaginationRoute,
  PreloadingRoute,
  SuspenseRoute
};
const routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
function createRouter() {
  const queryClient = new QueryClient();
  const router = routerWithQueryClient(
    createRouter$1({
      routeTree,
      scrollRestoration: true,
      defaultPreload: false,
      defaultStructuralSharing: true,
      defaultPreloadStaleTime: 0,
      defaultPendingMs: 0,
      defaultErrorComponent: () => /* @__PURE__ */ jsx("div", { children: "Error" }),
      defaultPendingComponent: () => /* @__PURE__ */ jsx("div", { children: "Loading..." }),
      defaultNotFoundComponent: () => /* @__PURE__ */ jsx("div", { children: "Not Found" }),
      context: {
        queryClient
      }
    }),
    queryClient
  );
  return router;
}
const serverEntry$1 = createStartHandler({
  createRouter
})(defaultStreamHandler);
const serverEntry = defineEventHandler(function(event) {
  const request = toWebRequest(event);
  return serverEntry$1({ request });
});

export { getSidedProp as $, createServerFn as A, getPreferredColorScheme as B, createMemo as C, DB as D, createComponent as E, createContext as F, createSignal$1 as G, onMount as H, createEffect as I, Portal as J, Show as K, Link as L, template as M, insert as N, createRenderEffect as O, POKEMON_LIMIT$3 as P, className as Q, Route$5 as R, Subscribable as S, clearDelegatedEvents as T, delegateEvents as U, useContext as V, onCleanup as W, sortFns as X, mutationSortFns as Y, on as Z, setAttribute as _, Route$4 as a, use as a0, createUniqueId as a1, batch as a2, getQueryStatusLabel as a3, getMutationStatusColor as a4, getQueryStatusColor as a5, getQueryStatusColorByLabel as a6, displayValue as a7, For as a8, convertRemToPixels as a9, untrack as aa, $TRACK as ab, useTransition as ac, spread as ad, mergeProps as ae, createRoot as af, serialize as ag, Index as ah, updateNestedDataByPath as ai, addEventListener as aj, stringify as ak, Match as al, Switch as am, deleteNestedDataByPath as an, splitProps as ao, Dynamic as ap, createComputed as aq, Route$3 as b, Route$2 as c, useRouter as d, serverEntry as default, Route$1 as e, resolveEnabled as f, getServerPokemonList as g, shallowEqualObjects as h, isRedirect as i, joinPaths as j, resolveStaleTime as k, isServer as l, isValidTimeout as m, noop as n, timeUntilStale as o, pendingThenable as p, focusManager as q, rootRouteId as r, skipToken as s, trimPathLeft as t, useQueryClient as u, fetchState as v, replaceData as w, notifyManager as x, shouldThrowError as y, createServerRpc as z };
//# sourceMappingURL=ssr.mjs.map
