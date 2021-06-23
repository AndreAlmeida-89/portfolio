// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/glightbox/src/js/utils/helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extend = extend;
exports.each = each;
exports.getNodeEvents = getNodeEvents;
exports.addEvent = addEvent;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.hasClass = hasClass;
exports.closest = closest;
exports.animateElement = animateElement;
exports.cssTransform = cssTransform;
exports.show = show;
exports.hide = hide;
exports.createHTML = createHTML;
exports.windowSize = windowSize;
exports.whichAnimationEvent = whichAnimationEvent;
exports.whichTransitionEvent = whichTransitionEvent;
exports.createIframe = createIframe;
exports.waitUntil = waitUntil;
exports.injectAssets = injectAssets;
exports.isMobile = isMobile;
exports.isTouch = isTouch;
exports.isFunction = isFunction;
exports.isString = isString;
exports.isNode = isNode;
exports.isArray = isArray;
exports.isArrayLike = isArrayLike;
exports.isObject = isObject;
exports.isNil = isNil;
exports.has = has;
exports.size = size;
exports.isNumber = isNumber;
const uid = Date.now();
/**
 * Merge two or more objects
 */

function extend() {
  let extended = {};
  let deep = true;
  let i = 0;
  let length = arguments.length;

  if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
    deep = arguments[0];
    i++;
  }

  let merge = obj => {
    for (let prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
          extended[prop] = extend(true, extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  for (; i < length; i++) {
    let obj = arguments[i];
    merge(obj);
  }

  return extended;
}
/**
 * Each
 *
 * @param {mixed} node list, array, object
 * @param {function} callback
 */


function each(collection, callback) {
  if (isNode(collection) || collection === window || collection === document) {
    collection = [collection];
  }

  if (!isArrayLike(collection) && !isObject(collection)) {
    collection = [collection];
  }

  if (size(collection) == 0) {
    return;
  }

  if (isArrayLike(collection) && !isObject(collection)) {
    let l = collection.length,
        i = 0;

    for (; i < l; i++) {
      if (callback.call(collection[i], collection[i], i, collection) === false) {
        break;
      }
    }
  } else if (isObject(collection)) {
    for (let key in collection) {
      if (has(collection, key)) {
        if (callback.call(collection[key], collection[key], key, collection) === false) {
          break;
        }
      }
    }
  }
}
/**
 * Get nde events
 * return node events and optionally
 * check if the node has already a specific event
 * to avoid duplicated callbacks
 *
 * @param {node} node
 * @param {string} name event name
 * @param {object} fn callback
 * @returns {object}
 */


function getNodeEvents(node, name = null, fn = null) {
  const cache = node[uid] = node[uid] || [];
  const data = {
    all: cache,
    evt: null,
    found: null
  };

  if (name && fn && size(cache) > 0) {
    each(cache, (cl, i) => {
      if (cl.eventName == name && cl.fn.toString() == fn.toString()) {
        data.found = true;
        data.evt = i;
        return false;
      }
    });
  }

  return data;
}
/**
 * Add Event
 * Add an event listener
 *
 * @param {string} eventName
 * @param {object} detials
 */


function addEvent(eventName, {
  onElement,
  withCallback,
  avoidDuplicate = true,
  once = false,
  useCapture = false
} = {}, thisArg) {
  let element = onElement || [];

  if (isString(element)) {
    element = document.querySelectorAll(element);
  }

  function handler(event) {
    if (isFunction(withCallback)) {
      withCallback.call(thisArg, event, this);
    }

    if (once) {
      handler.destroy();
    }
  }

  handler.destroy = function () {
    each(element, el => {
      const events = getNodeEvents(el, eventName, handler);

      if (events.found) {
        events.all.splice(events.evt, 1);
      }

      if (el.removeEventListener) {
        el.removeEventListener(eventName, handler, useCapture);
      }
    });
  };

  each(element, el => {
    const events = getNodeEvents(el, eventName, handler);

    if (el.addEventListener && avoidDuplicate && !events.found || !avoidDuplicate) {
      el.addEventListener(eventName, handler, useCapture);
      events.all.push({
        eventName: eventName,
        fn: handler
      });
    }
  });
  return handler;
}
/**
 * Add element class
 *
 * @param {node} element
 * @param {string} class name
 */


function addClass(node, name) {
  each(name.split(' '), cl => node.classList.add(cl));
}
/**
 * Remove element class
 *
 * @param {node} element
 * @param {string} class name
 */


function removeClass(node, name) {
  each(name.split(' '), cl => node.classList.remove(cl));
}
/**
 * Has class
 *
 * @param {node} element
 * @param {string} class name
 */


function hasClass(node, name) {
  return node.classList.contains(name);
}
/**
 * Get the closestElement
 *
 * @param {node} element
 * @param {string} class name
 */


function closest(elem, selector) {
  while (elem !== document.body) {
    elem = elem.parentElement;

    if (!elem) {
      return false;
    }

    const matches = typeof elem.matches == 'function' ? elem.matches(selector) : elem.msMatchesSelector(selector);

    if (matches) {
      return elem;
    }
  }
}
/**
 * CSS Animations
 *
 * @param {node} element
 * @param {string} animation name
 * @param {function} callback
 */


function animateElement(element, animation = '', callback = false) {
  if (!element || animation === '') {
    return false;
  }

  if (animation == 'none') {
    if (isFunction(callback)) {
      callback();
    }

    return false;
  }

  const animationEnd = whichAnimationEvent();
  const animationNames = animation.split(' ');
  each(animationNames, name => {
    addClass(element, 'g' + name);
  });
  addEvent(animationEnd, {
    onElement: element,
    avoidDuplicate: false,
    once: true,
    withCallback: (event, target) => {
      each(animationNames, name => {
        removeClass(target, 'g' + name);
      });

      if (isFunction(callback)) {
        callback();
      }
    }
  });
}

function cssTransform(node, translate = '') {
  if (translate == '') {
    node.style.webkitTransform = '';
    node.style.MozTransform = '';
    node.style.msTransform = '';
    node.style.OTransform = '';
    node.style.transform = '';
    return false;
  }

  node.style.webkitTransform = translate;
  node.style.MozTransform = translate;
  node.style.msTransform = translate;
  node.style.OTransform = translate;
  node.style.transform = translate;
}
/**
 * Show element
 *
 * @param {node} element
 */


function show(element) {
  element.style.display = 'block';
}
/**
 * Hide element
 */


function hide(element) {
  element.style.display = 'none';
}
/**
 * Create a document fragment
 *
 * @param {string} html code
 */


function createHTML(htmlStr) {
  let frag = document.createDocumentFragment(),
      temp = document.createElement('div');
  temp.innerHTML = htmlStr;

  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }

  return frag;
}
/**
 * Return screen size
 * return the current screen dimensions
 *
 * @returns {object}
 */


function windowSize() {
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  };
}
/**
 * Determine animation events
 */


function whichAnimationEvent() {
  let t,
      el = document.createElement('fakeelement');
  let animations = {
    animation: 'animationend',
    OAnimation: 'oAnimationEnd',
    MozAnimation: 'animationend',
    WebkitAnimation: 'webkitAnimationEnd'
  };

  for (t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
}
/**
 * Determine transition events
 */


function whichTransitionEvent() {
  let t,
      el = document.createElement('fakeelement');
  const transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  };

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
}
/**
 * Create an iframe element
 *
 * @param {string} url
 * @param {numeric} width
 * @param {numeric} height
 * @param {function} callback
 */


function createIframe(config) {
  let {
    url,
    allow,
    callback,
    appendTo
  } = config;
  let iframe = document.createElement('iframe');
  iframe.className = 'vimeo-video gvideo';
  iframe.src = url;
  iframe.style.width = '100%';
  iframe.style.height = '100%';

  if (allow) {
    iframe.setAttribute('allow', allow);
  }

  iframe.onload = function () {
    addClass(iframe, 'node-ready');

    if (isFunction(callback)) {
      callback();
    }
  };

  if (appendTo) {
    appendTo.appendChild(iframe);
  }

  return iframe;
}
/**
 * Wait until
 * wait until all the validations
 * are passed
 *
 * @param {function} check
 * @param {function} onComplete
 * @param {numeric} delay
 * @param {numeric} timeout
 */


function waitUntil(check, onComplete, delay, timeout) {
  if (check()) {
    onComplete();
    return;
  }

  if (!delay) {
    delay = 100;
  }

  let timeoutPointer;
  let intervalPointer = setInterval(() => {
    if (!check()) {
      return;
    }

    clearInterval(intervalPointer);

    if (timeoutPointer) {
      clearTimeout(timeoutPointer);
    }

    onComplete();
  }, delay);

  if (timeout) {
    timeoutPointer = setTimeout(() => {
      clearInterval(intervalPointer);
    }, timeout);
  }
}
/**
 * Inject videos api
 * used for video player
 *
 * @param {string} url
 * @param {function} callback
 */


function injectAssets(url, waitFor, callback) {
  if (isNil(url)) {
    console.error('Inject assets error');
    return;
  }

  if (isFunction(waitFor)) {
    callback = waitFor;
    waitFor = false;
  }

  if (isString(waitFor) && waitFor in window) {
    if (isFunction(callback)) {
      callback();
    }

    return;
  }

  let found;

  if (url.indexOf('.css') !== -1) {
    found = document.querySelectorAll('link[href="' + url + '"]');

    if (found && found.length > 0) {
      if (isFunction(callback)) {
        callback();
      }

      return;
    }

    const head = document.getElementsByTagName('head')[0];
    const headStyles = head.querySelectorAll('link[rel="stylesheet"]');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.media = 'all';

    if (headStyles) {
      head.insertBefore(link, headStyles[0]);
    } else {
      head.appendChild(link);
    }

    if (isFunction(callback)) {
      callback();
    }

    return;
  }

  found = document.querySelectorAll('script[src="' + url + '"]');

  if (found && found.length > 0) {
    if (isFunction(callback)) {
      if (isString(waitFor)) {
        waitUntil(() => {
          return typeof window[waitFor] !== 'undefined';
        }, () => {
          callback();
        });
        return false;
      }

      callback();
    }

    return;
  }

  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;

  script.onload = () => {
    if (isFunction(callback)) {
      if (isString(waitFor)) {
        waitUntil(() => {
          return typeof window[waitFor] !== 'undefined';
        }, () => {
          callback();
        });
        return false;
      }

      callback();
    }
  };

  document.body.appendChild(script);
  return;
}

function isMobile() {
  return 'navigator' in window && window.navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i);
}

function isTouch() {
  return isMobile() !== null || document.createTouch !== undefined || 'ontouchstart' in window || 'onmsgesturechange' in window || navigator.msMaxTouchPoints;
}

function isFunction(f) {
  return typeof f === 'function';
}

function isString(s) {
  return typeof s === 'string';
}

function isNode(el) {
  return !!(el && el.nodeType && el.nodeType == 1);
}

function isArray(ar) {
  return Array.isArray(ar);
}

function isArrayLike(ar) {
  return ar && ar.length && isFinite(ar.length);
}

function isObject(o) {
  let type = typeof o;
  return type === 'object' && o != null && !isFunction(o) && !isArray(o);
}

function isNil(o) {
  return o == null;
}

function has(obj, key) {
  return obj !== null && hasOwnProperty.call(obj, key);
}

function size(o) {
  if (isObject(o)) {
    if (o.keys) {
      return o.keys().length;
    }

    let l = 0;

    for (let k in o) {
      if (has(o, k)) {
        l++;
      }
    }

    return l;
  } else {
    return o.length;
  }
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
},{}],"node_modules/glightbox/src/js/core/keyboard-navigation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = keyboardNavigation;

var _helpers = require("../utils/helpers.js");

/**
 * Keyboard Navigation
 * Allow navigation using the keyboard
 *
 * @param {object} instance
 */
function getNextFocusElement(current = -1) {
  const btns = document.querySelectorAll('.gbtn[data-taborder]:not(.disabled)');

  if (!btns.length) {
    return false;
  }

  if (btns.length == 1) {
    return btns[0];
  }

  if (typeof current == 'string') {
    current = parseInt(current);
  }

  let newIndex = current < 0 ? 1 : current + 1;

  if (newIndex > btns.length) {
    newIndex = '1';
  }

  const orders = [];
  (0, _helpers.each)(btns, btn => {
    orders.push(btn.getAttribute('data-taborder'));
  });
  const nextOrders = orders.filter(el => el >= parseInt(newIndex));
  const nextFocus = nextOrders.sort()[0];
  return document.querySelector(`.gbtn[data-taborder="${nextFocus}"]`);
}

function keyboardNavigation(instance) {
  if (instance.events.hasOwnProperty('keyboard')) {
    return false;
  }

  instance.events['keyboard'] = (0, _helpers.addEvent)('keydown', {
    onElement: window,
    withCallback: (event, target) => {
      event = event || window.event;
      const key = event.keyCode;

      if (key == 9) {
        //prettier-ignore
        const focusedButton = document.querySelector('.gbtn.focused');

        if (!focusedButton) {
          const activeElement = document.activeElement && document.activeElement.nodeName ? document.activeElement.nodeName.toLocaleLowerCase() : false;

          if (activeElement == 'input' || activeElement == 'textarea' || activeElement == 'button') {
            return;
          }
        }

        event.preventDefault();
        const btns = document.querySelectorAll('.gbtn[data-taborder]');

        if (!btns || btns.length <= 0) {
          return;
        }

        if (!focusedButton) {
          const first = getNextFocusElement();

          if (first) {
            first.focus();
            (0, _helpers.addClass)(first, 'focused');
          }

          return;
        }

        let currentFocusOrder = focusedButton.getAttribute('data-taborder');
        let nextFocus = getNextFocusElement(currentFocusOrder);
        (0, _helpers.removeClass)(focusedButton, 'focused');

        if (nextFocus) {
          nextFocus.focus();
          (0, _helpers.addClass)(nextFocus, 'focused');
        }
      }

      if (key == 39) {
        instance.nextSlide();
      }

      if (key == 37) {
        instance.prevSlide();
      }

      if (key == 27) {
        instance.close();
      }
    }
  });
}
},{"../utils/helpers.js":"node_modules/glightbox/src/js/utils/helpers.js"}],"node_modules/glightbox/src/js/core/touch-events.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function getLen(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

function dot(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
}

function getAngle(v1, v2) {
  var mr = getLen(v1) * getLen(v2);

  if (mr === 0) {
    return 0;
  }

  var r = dot(v1, v2) / mr;

  if (r > 1) {
    r = 1;
  }

  return Math.acos(r);
}

function cross(v1, v2) {
  return v1.x * v2.y - v2.x * v1.y;
}

function getRotateAngle(v1, v2) {
  var angle = getAngle(v1, v2);

  if (cross(v1, v2) > 0) {
    angle *= -1;
  }

  return angle * 180 / Math.PI;
}

class EventsHandlerAdmin {
  constructor(el) {
    this.handlers = [];
    this.el = el;
  }

  add(handler) {
    this.handlers.push(handler);
  }

  del(handler) {
    if (!handler) {
      this.handlers = [];
    }

    for (var i = this.handlers.length; i >= 0; i--) {
      if (this.handlers[i] === handler) {
        this.handlers.splice(i, 1);
      }
    }
  }

  dispatch() {
    for (var i = 0, len = this.handlers.length; i < len; i++) {
      var handler = this.handlers[i];

      if (typeof handler === 'function') {
        handler.apply(this.el, arguments);
      }
    }
  }

}

function wrapFunc(el, handler) {
  var EventshandlerAdmin = new EventsHandlerAdmin(el);
  EventshandlerAdmin.add(handler);
  return EventshandlerAdmin;
} // Modified version of AlloyFinger


class TouchEvents {
  constructor(el, option) {
    this.element = typeof el == 'string' ? document.querySelector(el) : el;
    this.start = this.start.bind(this);
    this.move = this.move.bind(this);
    this.end = this.end.bind(this);
    this.cancel = this.cancel.bind(this);
    this.element.addEventListener('touchstart', this.start, false);
    this.element.addEventListener('touchmove', this.move, false);
    this.element.addEventListener('touchend', this.end, false);
    this.element.addEventListener('touchcancel', this.cancel, false);
    this.preV = {
      x: null,
      y: null
    };
    this.pinchStartLen = null;
    this.zoom = 1;
    this.isDoubleTap = false;

    var noop = function () {};

    this.rotate = wrapFunc(this.element, option.rotate || noop);
    this.touchStart = wrapFunc(this.element, option.touchStart || noop);
    this.multipointStart = wrapFunc(this.element, option.multipointStart || noop);
    this.multipointEnd = wrapFunc(this.element, option.multipointEnd || noop);
    this.pinch = wrapFunc(this.element, option.pinch || noop);
    this.swipe = wrapFunc(this.element, option.swipe || noop);
    this.tap = wrapFunc(this.element, option.tap || noop);
    this.doubleTap = wrapFunc(this.element, option.doubleTap || noop);
    this.longTap = wrapFunc(this.element, option.longTap || noop);
    this.singleTap = wrapFunc(this.element, option.singleTap || noop);
    this.pressMove = wrapFunc(this.element, option.pressMove || noop);
    this.twoFingerPressMove = wrapFunc(this.element, option.twoFingerPressMove || noop);
    this.touchMove = wrapFunc(this.element, option.touchMove || noop);
    this.touchEnd = wrapFunc(this.element, option.touchEnd || noop);
    this.touchCancel = wrapFunc(this.element, option.touchCancel || noop);
    this.translateContainer = this.element;
    this._cancelAllHandler = this.cancelAll.bind(this);
    window.addEventListener('scroll', this._cancelAllHandler);
    this.delta = null;
    this.last = null;
    this.now = null;
    this.tapTimeout = null;
    this.singleTapTimeout = null;
    this.longTapTimeout = null;
    this.swipeTimeout = null;
    this.x1 = this.x2 = this.y1 = this.y2 = null;
    this.preTapPosition = {
      x: null,
      y: null
    };
  }

  start(evt) {
    if (!evt.touches) {
      return;
    } // Fix Media Buttons Not responding on Android #233


    const ignoreDragFor = ['a', 'button', 'input'];

    if (evt.target && evt.target.nodeName && ignoreDragFor.indexOf(evt.target.nodeName.toLowerCase()) >= 0) {
      console.log('ignore drag for this touched element', evt.target.nodeName.toLowerCase());
      return;
    }

    this.now = Date.now();
    this.x1 = evt.touches[0].pageX;
    this.y1 = evt.touches[0].pageY;
    this.delta = this.now - (this.last || this.now);
    this.touchStart.dispatch(evt, this.element);

    if (this.preTapPosition.x !== null) {
      this.isDoubleTap = this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30;

      if (this.isDoubleTap) {
        clearTimeout(this.singleTapTimeout);
      }
    }

    this.preTapPosition.x = this.x1;
    this.preTapPosition.y = this.y1;
    this.last = this.now;
    var preV = this.preV,
        len = evt.touches.length;

    if (len > 1) {
      this._cancelLongTap();

      this._cancelSingleTap();

      var v = {
        x: evt.touches[1].pageX - this.x1,
        y: evt.touches[1].pageY - this.y1
      };
      preV.x = v.x;
      preV.y = v.y;
      this.pinchStartLen = getLen(preV);
      this.multipointStart.dispatch(evt, this.element);
    }

    this._preventTap = false;
    this.longTapTimeout = setTimeout(function () {
      this.longTap.dispatch(evt, this.element);
      this._preventTap = true;
    }.bind(this), 750);
  }

  move(evt) {
    if (!evt.touches) {
      return;
    }

    var preV = this.preV,
        len = evt.touches.length,
        currentX = evt.touches[0].pageX,
        currentY = evt.touches[0].pageY;
    this.isDoubleTap = false;

    if (len > 1) {
      var sCurrentX = evt.touches[1].pageX,
          sCurrentY = evt.touches[1].pageY;
      var v = {
        x: evt.touches[1].pageX - currentX,
        y: evt.touches[1].pageY - currentY
      };

      if (preV.x !== null) {
        if (this.pinchStartLen > 0) {
          evt.zoom = getLen(v) / this.pinchStartLen;
          this.pinch.dispatch(evt, this.element);
        }

        evt.angle = getRotateAngle(v, preV);
        this.rotate.dispatch(evt, this.element);
      }

      preV.x = v.x;
      preV.y = v.y;

      if (this.x2 !== null && this.sx2 !== null) {
        evt.deltaX = (currentX - this.x2 + sCurrentX - this.sx2) / 2;
        evt.deltaY = (currentY - this.y2 + sCurrentY - this.sy2) / 2;
      } else {
        evt.deltaX = 0;
        evt.deltaY = 0;
      }

      this.twoFingerPressMove.dispatch(evt, this.element);
      this.sx2 = sCurrentX;
      this.sy2 = sCurrentY;
    } else {
      if (this.x2 !== null) {
        evt.deltaX = currentX - this.x2;
        evt.deltaY = currentY - this.y2;
        var movedX = Math.abs(this.x1 - this.x2),
            movedY = Math.abs(this.y1 - this.y2);

        if (movedX > 10 || movedY > 10) {
          this._preventTap = true;
        }
      } else {
        evt.deltaX = 0;
        evt.deltaY = 0;
      }

      this.pressMove.dispatch(evt, this.element);
    }

    this.touchMove.dispatch(evt, this.element);

    this._cancelLongTap();

    this.x2 = currentX;
    this.y2 = currentY;

    if (len > 1) {
      evt.preventDefault();
    }
  }

  end(evt) {
    if (!evt.changedTouches) {
      return;
    }

    this._cancelLongTap();

    var self = this;

    if (evt.touches.length < 2) {
      this.multipointEnd.dispatch(evt, this.element);
      this.sx2 = this.sy2 = null;
    } //swipe


    if (this.x2 && Math.abs(this.x1 - this.x2) > 30 || this.y2 && Math.abs(this.y1 - this.y2) > 30) {
      evt.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2);
      this.swipeTimeout = setTimeout(function () {
        self.swipe.dispatch(evt, self.element);
      }, 0);
    } else {
      this.tapTimeout = setTimeout(function () {
        if (!self._preventTap) {
          self.tap.dispatch(evt, self.element);
        } // trigger double tap immediately


        if (self.isDoubleTap) {
          self.doubleTap.dispatch(evt, self.element);
          self.isDoubleTap = false;
        }
      }, 0);

      if (!self.isDoubleTap) {
        self.singleTapTimeout = setTimeout(function () {
          self.singleTap.dispatch(evt, self.element);
        }, 250);
      }
    }

    this.touchEnd.dispatch(evt, this.element);
    this.preV.x = 0;
    this.preV.y = 0;
    this.zoom = 1;
    this.pinchStartLen = null;
    this.x1 = this.x2 = this.y1 = this.y2 = null;
  }

  cancelAll() {
    this._preventTap = true;
    clearTimeout(this.singleTapTimeout);
    clearTimeout(this.tapTimeout);
    clearTimeout(this.longTapTimeout);
    clearTimeout(this.swipeTimeout);
  }

  cancel(evt) {
    this.cancelAll();
    this.touchCancel.dispatch(evt, this.element);
  }

  _cancelLongTap() {
    clearTimeout(this.longTapTimeout);
  }

  _cancelSingleTap() {
    clearTimeout(this.singleTapTimeout);
  }

  _swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? 'Left' : 'Right' : y1 - y2 > 0 ? 'Up' : 'Down';
  }

  on(evt, handler) {
    if (this[evt]) {
      this[evt].add(handler);
    }
  }

  off(evt, handler) {
    if (this[evt]) {
      this[evt].del(handler);
    }
  }

  destroy() {
    if (this.singleTapTimeout) {
      clearTimeout(this.singleTapTimeout);
    }

    if (this.tapTimeout) {
      clearTimeout(this.tapTimeout);
    }

    if (this.longTapTimeout) {
      clearTimeout(this.longTapTimeout);
    }

    if (this.swipeTimeout) {
      clearTimeout(this.swipeTimeout);
    }

    this.element.removeEventListener('touchstart', this.start);
    this.element.removeEventListener('touchmove', this.move);
    this.element.removeEventListener('touchend', this.end);
    this.element.removeEventListener('touchcancel', this.cancel);
    this.rotate.del();
    this.touchStart.del();
    this.multipointStart.del();
    this.multipointEnd.del();
    this.pinch.del();
    this.swipe.del();
    this.tap.del();
    this.doubleTap.del();
    this.longTap.del();
    this.singleTap.del();
    this.pressMove.del();
    this.twoFingerPressMove.del();
    this.touchMove.del();
    this.touchEnd.del();
    this.touchCancel.del();
    this.preV = this.pinchStartLen = this.zoom = this.isDoubleTap = this.delta = this.last = this.now = this.tapTimeout = this.singleTapTimeout = this.longTapTimeout = this.swipeTimeout = this.x1 = this.x2 = this.y1 = this.y2 = this.preTapPosition = this.rotate = this.touchStart = this.multipointStart = this.multipointEnd = this.pinch = this.swipe = this.tap = this.doubleTap = this.longTap = this.singleTap = this.pressMove = this.touchMove = this.touchEnd = this.touchCancel = this.twoFingerPressMove = null;
    window.removeEventListener('scroll', this._cancelAllHandler);
    return null;
  }

}

exports.default = TouchEvents;
},{}],"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/glightbox/src/js/core/touch-navigation.js":[function(require,module,exports) {
var process = require("process");
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = touchNavigation;

var _touchEvents = _interopRequireDefault(require("./touch-events.js"));

var _helpers = require("../utils/helpers.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Touch Navigation
 * Allow navigation using touch events
 *
 * @param {object} instance
 */
function resetSlideMove(slide) {
  const transitionEnd = (0, _helpers.whichTransitionEvent)();
  const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  let media = (0, _helpers.hasClass)(slide, 'gslide-media') ? slide : slide.querySelector('.gslide-media');
  let container = (0, _helpers.closest)(media, '.ginner-container');
  let desc = slide.querySelector('.gslide-description');

  if (windowWidth > 769) {
    media = container;
  }

  (0, _helpers.addClass)(media, 'greset');
  (0, _helpers.cssTransform)(media, 'translate3d(0, 0, 0)');
  (0, _helpers.addEvent)(transitionEnd, {
    onElement: media,
    once: true,
    withCallback: (event, target) => {
      (0, _helpers.removeClass)(media, 'greset');
    }
  });
  media.style.opacity = '';

  if (desc) {
    desc.style.opacity = '';
  }
}

function touchNavigation(instance) {
  if (instance.events.hasOwnProperty('touch')) {
    return false;
  }

  let winSize = (0, _helpers.windowSize)();
  let winWidth = winSize.width;
  let winHeight = winSize.height;
  let process = false;
  let currentSlide = null;
  let media = null;
  let mediaImage = null;
  let doingMove = false;
  let initScale = 1;
  let maxScale = 4.5;
  let currentScale = 1;
  let doingZoom = false;
  let imageZoomed = false;
  let zoomedPosX = null;
  let zoomedPosY = null;
  let lastZoomedPosX = null;
  let lastZoomedPosY = null;
  let hDistance;
  let vDistance;
  let hDistancePercent = 0;
  let vDistancePercent = 0;
  let vSwipe = false;
  let hSwipe = false;
  let startCoords = {};
  let endCoords = {};
  let xDown = 0;
  let yDown = 0;
  let isInlined;
  const sliderWrapper = document.getElementById('glightbox-slider');
  const overlay = document.querySelector('.goverlay');
  const touchInstance = new _touchEvents.default(sliderWrapper, {
    touchStart: e => {
      process = true; // TODO: More tests for inline content slides

      if ((0, _helpers.hasClass)(e.targetTouches[0].target, 'ginner-container') || (0, _helpers.closest)(e.targetTouches[0].target, '.gslide-desc') || e.targetTouches[0].target.nodeName.toLowerCase() == 'a') {
        process = false;
      }

      if ((0, _helpers.closest)(e.targetTouches[0].target, '.gslide-inline') && !(0, _helpers.hasClass)(e.targetTouches[0].target.parentNode, 'gslide-inline')) {
        process = false;
      }

      if (process) {
        endCoords = e.targetTouches[0];
        startCoords.pageX = e.targetTouches[0].pageX;
        startCoords.pageY = e.targetTouches[0].pageY;
        xDown = e.targetTouches[0].clientX;
        yDown = e.targetTouches[0].clientY;
        currentSlide = instance.activeSlide;
        media = currentSlide.querySelector('.gslide-media');
        isInlined = currentSlide.querySelector('.gslide-inline');
        mediaImage = null;

        if ((0, _helpers.hasClass)(media, 'gslide-image')) {
          mediaImage = media.querySelector('img');
        }

        const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        if (windowWidth > 769) {
          media = currentSlide.querySelector('.ginner-container');
        }

        (0, _helpers.removeClass)(overlay, 'greset');

        if (e.pageX > 20 && e.pageX < window.innerWidth - 20) {
          return;
        }

        e.preventDefault();
      }
    },
    touchMove: e => {
      if (!process) {
        return;
      }

      endCoords = e.targetTouches[0];

      if (doingZoom || imageZoomed) {
        return;
      }

      if (isInlined && isInlined.offsetHeight > winHeight) {
        // Allow scroll without moving the slide
        const moved = startCoords.pageX - endCoords.pageX;

        if (Math.abs(moved) <= 13) {
          return false;
        }
      }

      doingMove = true;
      let xUp = e.targetTouches[0].clientX;
      let yUp = e.targetTouches[0].clientY;
      let xDiff = xDown - xUp;
      let yDiff = yDown - yUp;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        vSwipe = false;
        hSwipe = true;
      } else {
        hSwipe = false;
        vSwipe = true;
      }

      hDistance = endCoords.pageX - startCoords.pageX;
      hDistancePercent = hDistance * 100 / winWidth;
      vDistance = endCoords.pageY - startCoords.pageY;
      vDistancePercent = vDistance * 100 / winHeight;
      let opacity;

      if (vSwipe && mediaImage) {
        opacity = 1 - Math.abs(vDistance) / winHeight;
        overlay.style.opacity = opacity;

        if (instance.settings.touchFollowAxis) {
          hDistancePercent = 0;
        }
      }

      if (hSwipe) {
        opacity = 1 - Math.abs(hDistance) / winWidth;
        media.style.opacity = opacity;

        if (instance.settings.touchFollowAxis) {
          vDistancePercent = 0;
        }
      }

      if (!mediaImage) {
        return (0, _helpers.cssTransform)(media, `translate3d(${hDistancePercent}%, 0, 0)`);
      }

      (0, _helpers.cssTransform)(media, `translate3d(${hDistancePercent}%, ${vDistancePercent}%, 0)`);
    },
    touchEnd: () => {
      if (!process) {
        return;
      }

      doingMove = false;

      if (imageZoomed || doingZoom) {
        lastZoomedPosX = zoomedPosX;
        lastZoomedPosY = zoomedPosY;
        return;
      }

      const v = Math.abs(parseInt(vDistancePercent));
      const h = Math.abs(parseInt(hDistancePercent));

      if (v > 29 && mediaImage) {
        instance.close();
        return;
      }

      if (v < 29 && h < 25) {
        (0, _helpers.addClass)(overlay, 'greset');
        overlay.style.opacity = 1;
        return resetSlideMove(media);
      }
    },
    multipointEnd: () => {
      setTimeout(() => {
        doingZoom = false;
      }, 50);
    },
    multipointStart: () => {
      doingZoom = true;
      initScale = currentScale ? currentScale : 1;
    },
    pinch: evt => {
      if (!mediaImage || doingMove) {
        return false;
      }

      doingZoom = true;
      mediaImage.scaleX = mediaImage.scaleY = initScale * evt.zoom;
      let scale = initScale * evt.zoom;
      imageZoomed = true;

      if (scale <= 1) {
        imageZoomed = false;
        scale = 1;
        lastZoomedPosY = null;
        lastZoomedPosX = null;
        zoomedPosX = null;
        zoomedPosY = null;
        mediaImage.setAttribute('style', '');
        return;
      }

      if (scale > maxScale) {
        // max scale zoom
        scale = maxScale;
      }

      mediaImage.style.transform = `scale3d(${scale}, ${scale}, 1)`;
      currentScale = scale;
    },
    pressMove: e => {
      if (imageZoomed && !doingZoom) {
        var mhDistance = endCoords.pageX - startCoords.pageX;
        var mvDistance = endCoords.pageY - startCoords.pageY;

        if (lastZoomedPosX) {
          mhDistance = mhDistance + lastZoomedPosX;
        }

        if (lastZoomedPosY) {
          mvDistance = mvDistance + lastZoomedPosY;
        }

        zoomedPosX = mhDistance;
        zoomedPosY = mvDistance;
        let style = `translate3d(${mhDistance}px, ${mvDistance}px, 0)`;

        if (currentScale) {
          style += ` scale3d(${currentScale}, ${currentScale}, 1)`;
        }

        (0, _helpers.cssTransform)(mediaImage, style);
      }
    },
    swipe: evt => {
      if (imageZoomed) {
        return;
      }

      if (doingZoom) {
        doingZoom = false;
        return;
      }

      if (evt.direction == 'Left') {
        if (instance.index == instance.elements.length - 1) {
          return resetSlideMove(media);
        }

        instance.nextSlide();
      }

      if (evt.direction == 'Right') {
        if (instance.index == 0) {
          return resetSlideMove(media);
        }

        instance.prevSlide();
      }
    }
  });
  instance.events['touch'] = touchInstance;
}
},{"./touch-events.js":"node_modules/glightbox/src/js/core/touch-events.js","../utils/helpers.js":"node_modules/glightbox/src/js/utils/helpers.js","process":"node_modules/process/browser.js"}],"node_modules/glightbox/src/js/core/zoom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * ZoomImages
 * Allow imaes to zoom and drag
 * for desktops
 *
 * @param {node} img node
 * @param {node} slide container
 * @param {function} function to trigger on close
 */
class ZoomImages {
  constructor(el, slide, onclose = null) {
    this.img = el;
    this.slide = slide;
    this.onclose = onclose;

    if (this.img.setZoomEvents) {
      return false;
    }

    this.active = false;
    this.zoomedIn = false;
    this.dragging = false;
    this.currentX = null;
    this.currentY = null;
    this.initialX = null;
    this.initialY = null;
    this.xOffset = 0;
    this.yOffset = 0;
    this.img.addEventListener('mousedown', e => this.dragStart(e), false);
    this.img.addEventListener('mouseup', e => this.dragEnd(e), false);
    this.img.addEventListener('mousemove', e => this.drag(e), false);
    this.img.addEventListener('click', e => {
      if (this.slide.classList.contains('dragging-nav')) {
        this.zoomOut();
        return false;
      }

      if (!this.zoomedIn) {
        return this.zoomIn();
      }

      if (this.zoomedIn && !this.dragging) {
        this.zoomOut();
      }
    }, false);
    this.img.setZoomEvents = true;
  }

  zoomIn() {
    let winWidth = this.widowWidth();

    if (this.zoomedIn || winWidth <= 768) {
      return;
    }

    const img = this.img;
    img.setAttribute('data-style', img.getAttribute('style'));
    img.style.maxWidth = img.naturalWidth + 'px';
    img.style.maxHeight = img.naturalHeight + 'px';

    if (img.naturalWidth > winWidth) {
      let centerX = winWidth / 2 - img.naturalWidth / 2;
      this.setTranslate(this.img.parentNode, centerX, 0);
    }

    this.slide.classList.add('zoomed');
    this.zoomedIn = true;
  }

  zoomOut() {
    this.img.parentNode.setAttribute('style', '');
    this.img.setAttribute('style', this.img.getAttribute('data-style'));
    this.slide.classList.remove('zoomed');
    this.zoomedIn = false;
    this.currentX = null;
    this.currentY = null;
    this.initialX = null;
    this.initialY = null;
    this.xOffset = 0;
    this.yOffset = 0;

    if (this.onclose && typeof this.onclose == 'function') {
      this.onclose();
    }
  }

  dragStart(e) {
    e.preventDefault();

    if (!this.zoomedIn) {
      this.active = false;
      return;
    }

    if (e.type === 'touchstart') {
      this.initialX = e.touches[0].clientX - this.xOffset;
      this.initialY = e.touches[0].clientY - this.yOffset;
    } else {
      this.initialX = e.clientX - this.xOffset;
      this.initialY = e.clientY - this.yOffset;
    }

    if (e.target === this.img) {
      this.active = true;
      this.img.classList.add('dragging');
    }
  }

  dragEnd(e) {
    e.preventDefault();
    this.initialX = this.currentX;
    this.initialY = this.currentY;
    this.active = false;
    setTimeout(() => {
      this.dragging = false;
      this.img.isDragging = false;
      this.img.classList.remove('dragging');
    }, 100);
  }

  drag(e) {
    if (this.active) {
      e.preventDefault();

      if (e.type === 'touchmove') {
        this.currentX = e.touches[0].clientX - this.initialX;
        this.currentY = e.touches[0].clientY - this.initialY;
      } else {
        this.currentX = e.clientX - this.initialX;
        this.currentY = e.clientY - this.initialY;
      }

      this.xOffset = this.currentX;
      this.yOffset = this.currentY;
      this.img.isDragging = true;
      this.dragging = true;
      this.setTranslate(this.img, this.currentX, this.currentY);
    }
  }

  onMove(e) {
    if (!this.zoomedIn) {
      return;
    }

    let xOffset = e.clientX - this.img.naturalWidth / 2;
    let yOffset = e.clientY - this.img.naturalHeight / 2;
    this.setTranslate(this.img, xOffset, yOffset);
  }

  setTranslate(node, xPos, yPos) {
    node.style.transform = 'translate3d(' + xPos + 'px, ' + yPos + 'px, 0)';
  }

  widowWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }

}

exports.default = ZoomImages;
},{}],"node_modules/glightbox/src/js/core/drag.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helpers = require("../utils/helpers.js");

/**
 * DragSlides
 * Allow imaes to be dragged for prev and next
 * in desktops
 *
 * @param { object } config
 */
class DragSlides {
  constructor(config = {}) {
    let {
      dragEl,
      toleranceX = 40,
      toleranceY = 65,
      slide = null,
      instance = null
    } = config;
    this.el = dragEl;
    this.active = false;
    this.dragging = false;
    this.currentX = null;
    this.currentY = null;
    this.initialX = null;
    this.initialY = null;
    this.xOffset = 0;
    this.yOffset = 0;
    this.direction = null;
    this.lastDirection = null;
    this.toleranceX = toleranceX;
    this.toleranceY = toleranceY;
    this.toleranceReached = false;
    this.dragContainer = this.el;
    this.slide = slide;
    this.instance = instance;
    this.el.addEventListener('mousedown', e => this.dragStart(e), false);
    this.el.addEventListener('mouseup', e => this.dragEnd(e), false);
    this.el.addEventListener('mousemove', e => this.drag(e), false);
  }

  dragStart(e) {
    if (this.slide.classList.contains('zoomed')) {
      this.active = false;
      return;
    }

    if (e.type === 'touchstart') {
      this.initialX = e.touches[0].clientX - this.xOffset;
      this.initialY = e.touches[0].clientY - this.yOffset;
    } else {
      this.initialX = e.clientX - this.xOffset;
      this.initialY = e.clientY - this.yOffset;
    }

    let clicked = e.target.nodeName.toLowerCase();
    let exludeClicks = ['input', 'select', 'textarea', 'button', 'a'];

    if (e.target.classList.contains('nodrag') || (0, _helpers.closest)(e.target, '.nodrag') || exludeClicks.indexOf(clicked) !== -1) {
      this.active = false;
      return;
    }

    e.preventDefault();

    if (e.target === this.el || clicked !== 'img' && (0, _helpers.closest)(e.target, '.gslide-inline')) {
      this.active = true;
      this.el.classList.add('dragging');
      this.dragContainer = (0, _helpers.closest)(e.target, '.ginner-container');
    }
  }

  dragEnd(e) {
    e && e.preventDefault();
    this.initialX = 0;
    this.initialY = 0;
    this.currentX = null;
    this.currentY = null;
    this.initialX = null;
    this.initialY = null;
    this.xOffset = 0;
    this.yOffset = 0;
    this.active = false;

    if (this.doSlideChange) {
      this.instance.preventOutsideClick = true;
      this.doSlideChange == 'right' && this.instance.prevSlide();
      this.doSlideChange == 'left' && this.instance.nextSlide();
    }

    if (this.doSlideClose) {
      this.instance.close();
    }

    if (!this.toleranceReached) {
      this.setTranslate(this.dragContainer, 0, 0, true);
    }

    setTimeout(() => {
      this.instance.preventOutsideClick = false;
      this.toleranceReached = false;
      this.lastDirection = null;
      this.dragging = false;
      this.el.isDragging = false;
      this.el.classList.remove('dragging');
      this.slide.classList.remove('dragging-nav');
      this.dragContainer.style.transform = '';
      this.dragContainer.style.transition = '';
    }, 100);
  }

  drag(e) {
    if (this.active) {
      e.preventDefault();
      this.slide.classList.add('dragging-nav');

      if (e.type === 'touchmove') {
        this.currentX = e.touches[0].clientX - this.initialX;
        this.currentY = e.touches[0].clientY - this.initialY;
      } else {
        this.currentX = e.clientX - this.initialX;
        this.currentY = e.clientY - this.initialY;
      }

      this.xOffset = this.currentX;
      this.yOffset = this.currentY;
      this.el.isDragging = true;
      this.dragging = true;
      this.doSlideChange = false;
      this.doSlideClose = false;
      let currentXInt = Math.abs(this.currentX);
      let currentYInt = Math.abs(this.currentY); // Horizontal drag

      if (currentXInt > 0 && currentXInt >= Math.abs(this.currentY) && (!this.lastDirection || this.lastDirection == 'x')) {
        this.yOffset = 0;
        this.lastDirection = 'x';
        this.setTranslate(this.dragContainer, this.currentX, 0);
        let doChange = this.shouldChange();

        if (!this.instance.settings.dragAutoSnap && doChange) {
          this.doSlideChange = doChange;
        }

        if (this.instance.settings.dragAutoSnap && doChange) {
          this.instance.preventOutsideClick = true;
          this.toleranceReached = true;
          this.active = false;
          this.instance.preventOutsideClick = true;
          this.dragEnd(null);
          doChange == 'right' && this.instance.prevSlide();
          doChange == 'left' && this.instance.nextSlide();
          return;
        }
      } // Vertical drag


      if (this.toleranceY > 0 && currentYInt > 0 && currentYInt >= currentXInt && (!this.lastDirection || this.lastDirection == 'y')) {
        this.xOffset = 0;
        this.lastDirection = 'y';
        this.setTranslate(this.dragContainer, 0, this.currentY);
        let doClose = this.shouldClose();

        if (!this.instance.settings.dragAutoSnap && doClose) {
          this.doSlideClose = true;
        }

        if (this.instance.settings.dragAutoSnap && doClose) {
          this.instance.close();
        }

        return;
      }
    }
  }

  shouldChange() {
    let doChange = false;
    let currentXInt = Math.abs(this.currentX);

    if (currentXInt >= this.toleranceX) {
      let dragDir = this.currentX > 0 ? 'right' : 'left';

      if (dragDir == 'left' && this.slide !== this.slide.parentNode.lastChild || dragDir == 'right' && this.slide !== this.slide.parentNode.firstChild) {
        doChange = dragDir;
      }
    }

    return doChange;
  }

  shouldClose() {
    let doClose = false;
    let currentYInt = Math.abs(this.currentY);

    if (currentYInt >= this.toleranceY) {
      doClose = true;
    }

    return doClose;
  }

  setTranslate(node, xPos, yPos, animated = false) {
    if (animated) {
      node.style.transition = 'all .2s ease';
    } else {
      node.style.transition = '';
    }

    node.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }

}

exports.default = DragSlides;
},{"../utils/helpers.js":"node_modules/glightbox/src/js/utils/helpers.js"}],"node_modules/glightbox/src/js/slides/image.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = slideImage;

var _helpers = require("../utils/helpers.js");

/**
 * Set slide inline content
 * we'll extend this to make http
 * requests using the fetch api
 * but for now we keep it simple
 *
 * @param {node} slide
 * @param {object} data
 * @param {int} index
 * @param {function} callback
 */
function slideImage(slide, data, index, callback) {
  const slideMedia = slide.querySelector('.gslide-media');
  let img = new Image();
  let titleID = 'gSlideTitle_' + index;
  let textID = 'gSlideDesc_' + index; // prettier-ignore

  img.addEventListener('load', () => {
    if ((0, _helpers.isFunction)(callback)) {
      callback();
    }
  }, false);
  img.src = data.href;
  img.alt = ''; // https://davidwalsh.name/accessibility-tip-empty-alt-attributes

  if (data.title !== '') {
    img.setAttribute('aria-labelledby', titleID);
  }

  if (data.description !== '') {
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute#Example_2_A_Close_Button
    img.setAttribute('aria-describedby', textID);
  }

  if (data.hasOwnProperty('_hasCustomWidth') && data._hasCustomWidth) {
    img.style.width = data.width;
  }

  if (data.hasOwnProperty('_hasCustomHeight') && data._hasCustomHeight) {
    img.style.height = data.height;
  }

  slideMedia.insertBefore(img, slideMedia.firstChild);
  return;
}
},{"../utils/helpers.js":"node_modules/glightbox/src/js/utils/helpers.js"}],"node_modules/glightbox/src/js/slides/video.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = slideVideo;

var _helpers = require("../utils/helpers.js");

/**
 * Set slide video
 *
 * @param {node} slide
 * @param {object} data
 * @param {int} index
 * @param {function} callback
 */
function slideVideo(slide, data, index, callback) {
  const slideContainer = slide.querySelector('.ginner-container');
  const videoID = 'gvideo' + index;
  const slideMedia = slide.querySelector('.gslide-media');
  const videoPlayers = this.getAllPlayers();
  (0, _helpers.addClass)(slideContainer, 'gvideo-container');
  slideMedia.insertBefore((0, _helpers.createHTML)('<div class="gvideo-wrapper"></div>'), slideMedia.firstChild);
  const videoWrapper = slide.querySelector('.gvideo-wrapper');
  (0, _helpers.injectAssets)(this.settings.plyr.css, 'Plyr');
  let url = data.href;
  let protocol = location.protocol.replace(':', '');
  let videoSource = '';
  let embedID = '';
  let customPlaceholder = false;

  if (protocol == 'file') {
    protocol = 'http';
  }

  slideMedia.style.maxWidth = data.width;
  (0, _helpers.injectAssets)(this.settings.plyr.js, 'Plyr', () => {
    // Set vimeo videos
    if (url.match(/vimeo\.com\/([0-9]*)/)) {
      const vimeoID = /vimeo.*\/(\d+)/i.exec(url);
      videoSource = 'vimeo';
      embedID = vimeoID[1];
    } // Set youtube videos


    if (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || url.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/)) {
      const youtubeID = getYoutubeID(url);
      videoSource = 'youtube';
      embedID = youtubeID;
    } // Set local videos


    if (url.match(/\.(mp4|ogg|webm|mov)$/) !== null) {
      videoSource = 'local';
      let html = '<video id="' + videoID + '" ';
      html += `style="background:#000; max-width: ${data.width};" `;
      html += 'preload="metadata" ';
      html += 'x-webkit-airplay="allow" ';
      html += 'webkit-playsinline="" ';
      html += 'controls ';
      html += 'class="gvideo-local">';
      let format = url.toLowerCase().split('.').pop();
      let sources = {
        mp4: '',
        ogg: '',
        webm: ''
      };
      format = format == 'mov' ? 'mp4' : format;
      sources[format] = url;

      for (let key in sources) {
        if (sources.hasOwnProperty(key)) {
          let videoFile = sources[key];

          if (data.hasOwnProperty(key)) {
            videoFile = data[key];
          }

          if (videoFile !== '') {
            html += `<source src="${videoFile}" type="video/${key}">`;
          }
        }
      }

      html += '</video>';
      customPlaceholder = (0, _helpers.createHTML)(html);
    } // prettier-ignore


    const placeholder = customPlaceholder ? customPlaceholder : (0, _helpers.createHTML)(`<div id="${videoID}" data-plyr-provider="${videoSource}" data-plyr-embed-id="${embedID}"></div>`);
    (0, _helpers.addClass)(videoWrapper, `${videoSource}-video gvideo`);
    videoWrapper.appendChild(placeholder);
    videoWrapper.setAttribute('data-id', videoID);
    videoWrapper.setAttribute('data-index', index);
    const playerConfig = (0, _helpers.has)(this.settings.plyr, 'config') ? this.settings.plyr.config : {};
    const player = new Plyr('#' + videoID, playerConfig);
    player.on('ready', event => {
      const instance = event.detail.plyr;
      videoPlayers[videoID] = instance;

      if ((0, _helpers.isFunction)(callback)) {
        callback();
      }
    });
    (0, _helpers.waitUntil)(() => {
      return slide.querySelector('iframe') && slide.querySelector('iframe').dataset.ready == 'true';
    }, () => {
      this.resize(slide);
    });
    player.on('enterfullscreen', handleMediaFullScreen);
    player.on('exitfullscreen', handleMediaFullScreen);
  });
}
/**
 * Get youtube ID
 *
 * @param {string} url
 * @returns {string} video id
 */


function getYoutubeID(url) {
  let videoID = '';
  url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

  if (url[2] !== undefined) {
    videoID = url[2].split(/[^0-9a-z_\-]/i);
    videoID = videoID[0];
  } else {
    videoID = url;
  }

  return videoID;
}
/**
 * Handle fullscreen
 *
 * @param {object} event
 */


function handleMediaFullScreen(event) {
  const media = (0, _helpers.closest)(event.target, '.gslide-media');

  if (event.type == 'enterfullscreen') {
    (0, _helpers.addClass)(media, 'fullscreen');
  }

  if (event.type == 'exitfullscreen') {
    (0, _helpers.removeClass)(media, 'fullscreen');
  }
}
},{"../utils/helpers.js":"node_modules/glightbox/src/js/utils/helpers.js"}],"node_modules/glightbox/src/js/slides/inline.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = slideInline;

var _helpers = require("../utils/helpers.js");

/**
 * Set slide inline content
 * we'll extend this to make http
 * requests using the fetch api
 * but for now we keep it simple
 *
 * @param {node} slide
 * @param {object} data
 * @param {int} index
 * @param {function} callback
 */
function slideInline(slide, data, index, callback) {
  const slideMedia = slide.querySelector('.gslide-media');
  const hash = (0, _helpers.has)(data, 'href') && data.href ? data.href.split('#').pop().trim() : false;
  const content = (0, _helpers.has)(data, 'content') && data.content ? data.content : false;
  let innerContent;

  if (content) {
    if ((0, _helpers.isString)(content)) {
      innerContent = (0, _helpers.createHTML)(`<div class="ginlined-content">${content}</div>`);
    }

    if ((0, _helpers.isNode)(content)) {
      if (content.style.display == 'none') {
        content.style.display = 'block';
      }

      const container = document.createElement('div');
      container.className = 'ginlined-content';
      container.appendChild(content);
      innerContent = container;
    }
  }

  if (hash) {
    let div = document.getElementById(hash);

    if (!div) {
      return false;
    }

    const cloned = div.cloneNode(true);
    cloned.style.height = data.height;
    cloned.style.maxWidth = data.width;
    (0, _helpers.addClass)(cloned, 'ginlined-content');
    innerContent = cloned;
  }

  if (!innerContent) {
    console.error('Unable to append inline slide content', data);
    return false;
  }

  slideMedia.style.height = data.height;
  slideMedia.style.width = data.width;
  slideMedia.appendChild(innerContent);
  this.events['inlineclose' + hash] = (0, _helpers.addEvent)('click', {
    onElement: slideMedia.querySelectorAll('.gtrigger-close'),
    withCallback: e => {
      e.preventDefault();
      this.close();
    }
  });

  if ((0, _helpers.isFunction)(callback)) {
    callback();
  }

  return;
}
},{"../utils/helpers.js":"node_modules/glightbox/src/js/utils/helpers.js"}],"node_modules/glightbox/src/js/slides/iframe.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = slideIframe;

var _helpers = require("../utils/helpers.js");

/**
 * Set slide iframe content
 *
 * @param {node} slide
 * @param {object} data
 * @param {int} index
 * @param {function} callback
 */
function slideIframe(slide, data, index, callback) {
  const slideMedia = slide.querySelector('.gslide-media');
  const iframe = (0, _helpers.createIframe)({
    url: data.href,
    callback: callback
  });
  slideMedia.parentNode.style.maxWidth = data.width;
  slideMedia.parentNode.style.height = data.height;
  slideMedia.appendChild(iframe);
  return;
}
},{"../utils/helpers.js":"node_modules/glightbox/src/js/utils/helpers.js"}],"node_modules/glightbox/src/js/core/slide-parser.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helpers = require("../utils/helpers.js");

class SlideConfigParser {
  constructor(slideParamas = {}) {
    this.defaults = {
      href: '',
      title: '',
      type: '',
      description: '',
      descPosition: 'bottom',
      effect: '',
      width: '',
      height: '',
      content: false,
      zoomable: true,
      draggable: true
    };

    if ((0, _helpers.isObject)(slideParamas)) {
      this.defaults = (0, _helpers.extend)(this.defaults, slideParamas);
    }
  }
  /**
   * Get source type
   * gte the source type of a url
   *
   * @param {string} url
   */


  sourceType(url) {
    let origin = url;
    url = url.toLowerCase();

    if (url.match(/\.(jpeg|jpg|jpe|gif|png|apn|webp|svg)$/) !== null) {
      return 'image';
    }

    if (url.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || url.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/) || url.match(/(youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9\-_]+)/)) {
      return 'video';
    }

    if (url.match(/vimeo\.com\/([0-9]*)/)) {
      return 'video';
    }

    if (url.match(/\.(mp4|ogg|webm|mov)$/) !== null) {
      return 'video';
    }

    if (url.match(/\.(mp3|wav|wma|aac|ogg)$/) !== null) {
      return 'audio';
    } // Check if inline content


    if (url.indexOf('#') > -1) {
      let hash = origin.split('#').pop();

      if (hash.trim() !== '') {
        return 'inline';
      }
    } // Ajax


    if (url.indexOf('goajax=true') > -1) {
      return 'ajax';
    }

    return 'external';
  }

  parseConfig(element, settings) {
    let data = (0, _helpers.extend)({
      descPosition: settings.descPosition
    }, this.defaults);

    if ((0, _helpers.isObject)(element) && !(0, _helpers.isNode)(element)) {
      if (!(0, _helpers.has)(element, 'type')) {
        if ((0, _helpers.has)(element, 'content') && element.content) {
          element.type = 'inline';
        } else if ((0, _helpers.has)(element, 'href')) {
          element.type = this.sourceType(element.href);
        }
      }

      let objectData = (0, _helpers.extend)(data, element);
      this.setSize(objectData, settings);
      return objectData;
    }

    let url = '';
    let config = element.getAttribute('data-glightbox');
    let nodeType = element.nodeName.toLowerCase();

    if (nodeType === 'a') {
      url = element.href;
    }

    if (nodeType === 'img') {
      url = element.src;
    }

    data.href = url;
    (0, _helpers.each)(data, (val, key) => {
      if ((0, _helpers.has)(settings, key) && key !== 'width') {
        data[key] = settings[key];
      }

      const nodeData = element.dataset[key];

      if (!(0, _helpers.isNil)(nodeData)) {
        data[key] = this.sanitizeValue(nodeData);
      }
    });

    if (data.content) {
      data.type = 'inline';
    }

    if (!data.type && url) {
      data.type = this.sourceType(url);
    }

    if (!(0, _helpers.isNil)(config)) {
      let cleanKeys = [];
      (0, _helpers.each)(data, (v, k) => {
        cleanKeys.push(';\\s?' + k);
      });
      cleanKeys = cleanKeys.join('\\s?:|');

      if (config.trim() !== '') {
        (0, _helpers.each)(data, (val, key) => {
          const str = config;
          const match = 's?' + key + 's?:s?(.*?)(' + cleanKeys + 's?:|$)';
          const regex = new RegExp(match);
          const matches = str.match(regex);

          if (matches && matches.length && matches[1]) {
            const value = matches[1].trim().replace(/;\s*$/, '');
            data[key] = this.sanitizeValue(value);
          }
        });
      }
    } else {
      if (!data.title && nodeType == 'a') {
        let title = element.title;

        if (!(0, _helpers.isNil)(title) && title !== '') {
          data.title = title;
        }
      }

      if (!data.title && nodeType == 'img') {
        let alt = element.alt;

        if (!(0, _helpers.isNil)(alt) && alt !== '') {
          data.title = alt;
        }
      }
    } // Try to get the description from a referenced element


    if (data.description && data.description.substring(0, 1) === '.') {
      let description;

      try {
        description = document.querySelector(data.description).innerHTML;
      } catch (error) {
        if (!(error instanceof DOMException)) {
          throw error;
        }
      }

      if (description) {
        data.description = description;
      }
    } // Try to get the description from a .glightbox-desc element


    if (!data.description) {
      let nodeDesc = element.querySelector('.glightbox-desc');

      if (nodeDesc) {
        data.description = nodeDesc.innerHTML;
      }
    }

    this.setSize(data, settings, element);
    this.slideConfig = data;
    return data;
  }
  /**
   * Set slide data size
   * set the correct size dependin
   * on the slide type
   *
   * @param { object } data
   * @param { object } settings
   * @return { object }
   */


  setSize(data, settings, element = null) {
    const defaultWith = data.type == 'video' ? this.checkSize(settings.videosWidth) : this.checkSize(settings.width);
    const defaultHeight = this.checkSize(settings.height);
    data.width = (0, _helpers.has)(data, 'width') && data.width !== '' ? this.checkSize(data.width) : defaultWith;
    data.height = (0, _helpers.has)(data, 'height') && data.height !== '' ? this.checkSize(data.height) : defaultHeight;

    if (element && data.type == 'image') {
      data._hasCustomWidth = element.dataset.width ? true : false;
      data._hasCustomHeight = element.dataset.height ? true : false;
    }

    return data;
  }
  /**
   * [checkSize size
   * check if the passed size has a correct unit
   *
   * @param {string} size
   * @return {string}
   */


  checkSize(size) {
    return (0, _helpers.isNumber)(size) ? `${size}px` : size;
  }
  /**
   * Sanitize data attributes value
   *
   * @param string val
   * @return mixed
   */


  sanitizeValue(val) {
    if (val !== 'true' && val !== 'false') {
      return val;
    }

    return val === 'true';
  }

}

exports.default = SlideConfigParser;
},{"../utils/helpers.js":"node_modules/glightbox/src/js/utils/helpers.js"}],"node_modules/glightbox/src/js/core/slide.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _zoom = _interopRequireDefault(require("./zoom.js"));

var _drag = _interopRequireDefault(require("./drag.js"));

var _image = _interopRequireDefault(require("../slides/image.js"));

var _video = _interopRequireDefault(require("../slides/video.js"));

var _inline = _interopRequireDefault(require("../slides/inline.js"));

var _iframe = _interopRequireDefault(require("../slides/iframe.js"));

var _slideParser = _interopRequireDefault(require("./slide-parser.js"));

var _helpers = require("../utils/helpers.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Slide
 * class to hablde slide creation
 * and config parser
 */
class Slide {
  constructor(el, instance, index) {
    this.element = el;
    this.instance = instance;
    this.index = index;
  }
  /**
   * Set slide content
   *
   * @param {node} slide
   * @param {object} data
   * @param {function} callback
   */


  setContent(slide = null, callback = false) {
    if ((0, _helpers.hasClass)(slide, 'loaded')) {
      return false;
    }

    const settings = this.instance.settings;
    const slideConfig = this.slideConfig;
    const isMobileDevice = (0, _helpers.isMobile)();

    if ((0, _helpers.isFunction)(settings.beforeSlideLoad)) {
      settings.beforeSlideLoad({
        index: this.index,
        slide: slide,
        player: false
      });
    }

    let type = slideConfig.type;
    let position = slideConfig.descPosition;
    let slideMedia = slide.querySelector('.gslide-media');
    let slideTitle = slide.querySelector('.gslide-title');
    let slideText = slide.querySelector('.gslide-desc');
    let slideDesc = slide.querySelector('.gdesc-inner');
    let finalCallback = callback; // used for image accessiblity

    let titleID = 'gSlideTitle_' + this.index;
    let textID = 'gSlideDesc_' + this.index;

    if ((0, _helpers.isFunction)(settings.afterSlideLoad)) {
      finalCallback = () => {
        if ((0, _helpers.isFunction)(callback)) {
          callback();
        }

        settings.afterSlideLoad({
          index: this.index,
          slide: slide,
          player: this.instance.getSlidePlayerInstance(this.index)
        });
      };
    }

    if (slideConfig.title == '' && slideConfig.description == '') {
      if (slideDesc) {
        slideDesc.parentNode.parentNode.removeChild(slideDesc.parentNode);
      }
    } else {
      if (slideTitle && slideConfig.title !== '') {
        slideTitle.id = titleID;
        slideTitle.innerHTML = slideConfig.title;
      } else {
        slideTitle.parentNode.removeChild(slideTitle);
      }

      if (slideText && slideConfig.description !== '') {
        slideText.id = textID;

        if (isMobileDevice && settings.moreLength > 0) {
          slideConfig.smallDescription = this.slideShortDesc(slideConfig.description, settings.moreLength, settings.moreText);
          slideText.innerHTML = slideConfig.smallDescription;
          this.descriptionEvents(slideText, slideConfig);
        } else {
          slideText.innerHTML = slideConfig.description;
        }
      } else {
        slideText.parentNode.removeChild(slideText);
      }

      (0, _helpers.addClass)(slideMedia.parentNode, `desc-${position}`);
      (0, _helpers.addClass)(slideDesc.parentNode, `description-${position}`);
    }

    (0, _helpers.addClass)(slideMedia, `gslide-${type}`);
    (0, _helpers.addClass)(slide, 'loaded');

    if (type === 'video') {
      _video.default.apply(this.instance, [slide, slideConfig, this.index, finalCallback]);

      return;
    }

    if (type === 'external') {
      _iframe.default.apply(this, [slide, slideConfig, this.index, finalCallback]);

      return;
    }

    if (type === 'inline') {
      _inline.default.apply(this.instance, [slide, slideConfig, this.index, finalCallback]);

      if (settings.draggable) {
        new _drag.default({
          dragEl: slide.querySelector('.gslide-inline'),
          toleranceX: settings.dragToleranceX,
          toleranceY: settings.dragToleranceY,
          slide: slide,
          instance: this.instance
        });
      }

      return;
    }

    if (type === 'image') {
      (0, _image.default)(slide, slideConfig, this.index, () => {
        const img = slide.querySelector('img');

        if (settings.draggable) {
          new _drag.default({
            dragEl: img,
            toleranceX: settings.dragToleranceX,
            toleranceY: settings.dragToleranceY,
            slide: slide,
            instance: this.instance
          });
        }

        if (slideConfig.zoomable && img.naturalWidth > img.offsetWidth) {
          (0, _helpers.addClass)(img, 'zoomable');
          new _zoom.default(img, slide, () => {
            this.instance.resize();
          });
        }

        if ((0, _helpers.isFunction)(finalCallback)) {
          finalCallback();
        }
      });
      return;
    }

    if ((0, _helpers.isFunction)(finalCallback)) {
      finalCallback();
    }
  }

  slideShortDesc(string, n = 50, wordBoundary = false) {
    let div = document.createElement('div');
    div.innerHTML = string;
    let cleanedString = div.innerText;
    let useWordBoundary = wordBoundary;
    string = cleanedString.trim();

    if (string.length <= n) {
      return string;
    }

    let subString = string.substr(0, n - 1);

    if (!useWordBoundary) {
      return subString;
    }

    div = null;
    return subString + '... <a href="#" class="desc-more">' + wordBoundary + '</a>';
  }

  descriptionEvents(desc, data) {
    let moreLink = desc.querySelector('.desc-more');

    if (!moreLink) {
      return false;
    }

    (0, _helpers.addEvent)('click', {
      onElement: moreLink,
      withCallback: (event, target) => {
        event.preventDefault();
        const body = document.body;
        let desc = (0, _helpers.closest)(target, '.gslide-desc');

        if (!desc) {
          return false;
        }

        desc.innerHTML = data.description;
        (0, _helpers.addClass)(body, 'gdesc-open');
        let shortEvent = (0, _helpers.addEvent)('click', {
          onElement: [body, (0, _helpers.closest)(desc, '.gslide-description')],
          withCallback: (event, target) => {
            if (event.target.nodeName.toLowerCase() !== 'a') {
              (0, _helpers.removeClass)(body, 'gdesc-open');
              (0, _helpers.addClass)(body, 'gdesc-closed');
              desc.innerHTML = data.smallDescription;
              this.descriptionEvents(desc, data);
              setTimeout(() => {
                (0, _helpers.removeClass)(body, 'gdesc-closed');
              }, 400);
              shortEvent.destroy();
            }
          }
        });
      }
    });
  }
  /**
   * Create Slide Node
   *
   * @return { node }
   */


  create() {
    return (0, _helpers.createHTML)(this.instance.settings.slideHTML);
  }
  /**
   * Get slide config
   * returns each individual slide config
   * it uses SlideConfigParser
   * each slide can overwrite a global setting
   * read more in the SlideConfigParser class
   *
   * @return { object }
   */


  getConfig() {
    const parser = new _slideParser.default(this.instance.settings.slideExtraAttributes);
    this.slideConfig = parser.parseConfig(this.element, this.instance.settings);
    return this.slideConfig;
  }

}

exports.default = Slide;
},{"./zoom.js":"node_modules/glightbox/src/js/core/zoom.js","./drag.js":"node_modules/glightbox/src/js/core/drag.js","../slides/image.js":"node_modules/glightbox/src/js/slides/image.js","../slides/video.js":"node_modules/glightbox/src/js/slides/video.js","../slides/inline.js":"node_modules/glightbox/src/js/slides/inline.js","../slides/iframe.js":"node_modules/glightbox/src/js/slides/iframe.js","./slide-parser.js":"node_modules/glightbox/src/js/core/slide-parser.js","../utils/helpers.js":"node_modules/glightbox/src/js/utils/helpers.js"}],"node_modules/glightbox/src/js/glightbox.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _keyboardNavigation = _interopRequireDefault(require("./core/keyboard-navigation.js"));

var _touchNavigation = _interopRequireDefault(require("./core/touch-navigation.js"));

var _slide = _interopRequireDefault(require("./core/slide.js"));

var _ = _interopRequireWildcard(require("./utils/helpers.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * GLightbox
 * Awesome pure javascript lightbox
 * made by https://www.biati.digital
 * Github: https://github.com/biati-digital/glightbox
 */
const version = '3.0.9';

const isMobile = _.isMobile();

const isTouch = _.isTouch();

const html = document.getElementsByTagName('html')[0];
const defaults = {
  selector: '.glightbox',
  elements: null,
  skin: 'clean',
  theme: 'clean',
  closeButton: true,
  startAt: null,
  autoplayVideos: true,
  autofocusVideos: true,
  descPosition: 'bottom',
  width: '900px',
  height: '506px',
  videosWidth: '960px',
  beforeSlideChange: null,
  afterSlideChange: null,
  beforeSlideLoad: null,
  afterSlideLoad: null,
  slideInserted: null,
  slideRemoved: null,
  slideExtraAttributes: null,
  onOpen: null,
  onClose: null,
  loop: false,
  zoomable: true,
  draggable: true,
  dragAutoSnap: false,
  dragToleranceX: 40,
  dragToleranceY: 65,
  preload: true,
  oneSlidePerOpen: false,
  touchNavigation: true,
  touchFollowAxis: true,
  keyboardNavigation: true,
  closeOnOutsideClick: true,
  plugins: false,
  plyr: {
    css: 'https://cdn.plyr.io/3.6.8/plyr.css',
    js: 'https://cdn.plyr.io/3.6.8/plyr.js',
    config: {
      ratio: '16:9',
      // or '4:3'
      fullscreen: {
        enabled: true,
        iosNative: true
      },
      youtube: {
        noCookie: true,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3 // eslint-disable-line camelcase

      },
      vimeo: {
        byline: false,
        portrait: false,
        title: false,
        transparent: false
      }
    }
  },
  openEffect: 'zoom',
  // fade, zoom, none
  closeEffect: 'zoom',
  // fade, zoom, none
  slideEffect: 'slide',
  // fade, slide, zoom, none
  moreText: 'See more',
  moreLength: 60,
  cssEfects: {
    fade: {
      in: 'fadeIn',
      out: 'fadeOut'
    },
    zoom: {
      in: 'zoomIn',
      out: 'zoomOut'
    },
    slide: {
      in: 'slideInRight',
      out: 'slideOutLeft'
    },
    slideBack: {
      in: 'slideInLeft',
      out: 'slideOutRight'
    },
    none: {
      in: 'none',
      out: 'none'
    }
  },
  svg: {
    close: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306C514.019,27.23,514.019,14.135,505.943,6.058z"/></g></g><g><g><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"/></g></g></svg>',
    next: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"> <g><path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"/></g></svg>',
    prev: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 477.175 477.175" xml:space="preserve"><g><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"/></g></svg>'
  }
}; // You can pass your own slide structure
// just make sure that add the same classes so they are populated
// title class = gslide-title
// desc class = gslide-desc
// prev arrow class = gnext
// next arrow id = gprev
// close id = gclose

defaults.slideHTML = `<div class="gslide">
    <div class="gslide-inner-content">
        <div class="ginner-container">
            <div class="gslide-media">
            </div>
            <div class="gslide-description">
                <div class="gdesc-inner">
                    <h4 class="gslide-title"></h4>
                    <div class="gslide-desc"></div>
                </div>
            </div>
        </div>
    </div>
</div>`;
defaults.lightboxHTML = `<div id="glightbox-body" class="glightbox-container" tabindex="-1" role="dialog" aria-hidden="false">
    <div class="gloader visible"></div>
    <div class="goverlay"></div>
    <div class="gcontainer">
    <div id="glightbox-slider" class="gslider"></div>
    <button class="gclose gbtn" aria-label="Close" data-taborder="3">{closeSVG}</button>
    <button class="gprev gbtn" aria-label="Previous" data-taborder="2">{prevSVG}</button>
    <button class="gnext gbtn" aria-label="Next" data-taborder="1">{nextSVG}</button>
</div>
</div>`;
/**
 * GLightbox Class
 * Class and public methods
 */

class GlightboxInit {
  constructor(options = {}) {
    this.customOptions = options;
    this.settings = _.extend(defaults, options);
    this.effectsClasses = this.getAnimationClasses();
    this.videoPlayers = {};
    this.apiEvents = [];
    this.fullElementsList = false;
  }

  init() {
    const selector = this.getSelector();

    if (selector) {
      this.baseEvents = _.addEvent('click', {
        onElement: selector,
        withCallback: (e, target) => {
          e.preventDefault();
          this.open(target);
        }
      });
    }

    this.elements = this.getElements();
  }

  open(element = null, startAt = null) {
    if (this.elements.length == 0) {
      return false;
    }

    this.activeSlide = null;
    this.prevActiveSlideIndex = null;
    this.prevActiveSlide = null;
    let index = _.isNumber(startAt) ? startAt : this.settings.startAt;

    if (_.isNode(element)) {
      const gallery = element.getAttribute('data-gallery');

      if (gallery) {
        this.fullElementsList = this.elements;
        this.elements = this.getGalleryElements(this.elements, gallery);
      }

      if (_.isNil(index)) {
        // get the index of the element
        index = this.getElementIndex(element);

        if (index < 0) {
          index = 0;
        }
      }
    }

    if (!_.isNumber(index)) {
      index = 0;
    }

    this.build();

    _.animateElement(this.overlay, this.settings.openEffect == 'none' ? 'none' : this.settings.cssEfects.fade.in);

    const body = document.body;
    const scrollBar = window.innerWidth - document.documentElement.clientWidth;

    if (scrollBar > 0) {
      var styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';
      styleSheet.className = 'gcss-styles';
      styleSheet.innerText = `.gscrollbar-fixer {margin-right: ${scrollBar}px}`;
      document.head.appendChild(styleSheet);

      _.addClass(body, 'gscrollbar-fixer');
    }

    _.addClass(body, 'glightbox-open');

    _.addClass(html, 'glightbox-open');

    if (isMobile) {
      _.addClass(document.body, 'glightbox-mobile');

      this.settings.slideEffect = 'slide';
    }

    this.showSlide(index, true);

    if (this.elements.length == 1) {
      _.addClass(this.prevButton, 'glightbox-button-hidden');

      _.addClass(this.nextButton, 'glightbox-button-hidden');
    } else {
      _.removeClass(this.prevButton, 'glightbox-button-hidden');

      _.removeClass(this.nextButton, 'glightbox-button-hidden');
    }

    this.lightboxOpen = true;
    this.trigger('open'); // settings.onOpen is deprecated and will be removed in a future update

    if (_.isFunction(this.settings.onOpen)) {
      this.settings.onOpen();
    }

    if (isTouch && this.settings.touchNavigation) {
      (0, _touchNavigation.default)(this);
    }

    if (this.settings.keyboardNavigation) {
      (0, _keyboardNavigation.default)(this);
    }
  }
  /**
   * Open at specific index
   * @param {int} index
   */


  openAt(index = 0) {
    this.open(null, index);
  }
  /**
   * Set Slide
   */


  showSlide(index = 0, first = false) {
    _.show(this.loader);

    this.index = parseInt(index);
    let current = this.slidesContainer.querySelector('.current');

    if (current) {
      _.removeClass(current, 'current');
    } // hide prev slide


    this.slideAnimateOut();
    let slideNode = this.slidesContainer.querySelectorAll('.gslide')[index]; // Check if slide's content is alreay loaded

    if (_.hasClass(slideNode, 'loaded')) {
      this.slideAnimateIn(slideNode, first);

      _.hide(this.loader);
    } else {
      // If not loaded add the slide content
      _.show(this.loader);

      const slide = this.elements[index];
      const slideData = {
        index: this.index,
        slide: slideNode,
        //this will be removed in the future
        slideNode: slideNode,
        slideConfig: slide.slideConfig,
        slideIndex: this.index,
        trigger: slide.node,
        player: null
      };
      this.trigger('slide_before_load', slideData);
      slide.instance.setContent(slideNode, () => {
        _.hide(this.loader);

        this.resize();
        this.slideAnimateIn(slideNode, first);
        this.trigger('slide_after_load', slideData);
      });
    }

    this.slideDescription = slideNode.querySelector('.gslide-description');
    this.slideDescriptionContained = this.slideDescription && _.hasClass(this.slideDescription.parentNode, 'gslide-media'); // Preload subsequent slides

    if (this.settings.preload) {
      this.preloadSlide(index + 1);
      this.preloadSlide(index - 1);
    } // Handle navigation arrows


    this.updateNavigationClasses();
    this.activeSlide = slideNode;
  }
  /**
   * Preload slides
   * @param  {Int}  index slide index
   * @return {null}
   */


  preloadSlide(index) {
    // Verify slide index, it can not be lower than 0
    // and it can not be greater than the total elements
    if (index < 0 || index > this.elements.length - 1) {
      return false;
    }

    if (_.isNil(this.elements[index])) {
      return false;
    }

    let slideNode = this.slidesContainer.querySelectorAll('.gslide')[index];

    if (_.hasClass(slideNode, 'loaded')) {
      return false;
    }

    const slide = this.elements[index];
    const type = slide.type;
    const slideData = {
      index: index,
      slide: slideNode,
      //this will be removed in the future
      slideNode: slideNode,
      slideConfig: slide.slideConfig,
      slideIndex: index,
      trigger: slide.node,
      player: null
    };
    this.trigger('slide_before_load', slideData);

    if (type == 'video' || type == 'external') {
      setTimeout(() => {
        slide.instance.setContent(slideNode, () => {
          this.trigger('slide_after_load', slideData);
        });
      }, 200);
    } else {
      slide.instance.setContent(slideNode, () => {
        this.trigger('slide_after_load', slideData);
      });
    }
  }
  /**
   * Load previous slide
   * calls goToslide
   */


  prevSlide() {
    this.goToSlide(this.index - 1);
  }
  /**
   * Load next slide
   * calls goToslide
   */


  nextSlide() {
    this.goToSlide(this.index + 1);
  }
  /**
   * Go to sldei
   * calls set slide
   * @param {Int} - index
   */


  goToSlide(index = false) {
    this.prevActiveSlide = this.activeSlide;
    this.prevActiveSlideIndex = this.index;

    if (!this.loop() && (index < 0 || index > this.elements.length - 1)) {
      return false;
    }

    if (index < 0) {
      index = this.elements.length - 1;
    } else if (index >= this.elements.length) {
      index = 0;
    }

    this.showSlide(index);
  }
  /**
   * Insert slide
   *
   * @param { object } data
   * @param { numeric } position
   */


  insertSlide(config = {}, index = -1) {
    // Append at the end
    if (index < 0) {
      index = this.elements.length;
    }

    const slide = new _slide.default(config, this, index);
    const data = slide.getConfig();

    const slideInfo = _.extend({}, data);

    const newSlide = slide.create();
    const totalSlides = this.elements.length - 1;
    slideInfo.index = index;
    slideInfo.node = false;
    slideInfo.instance = slide;
    slideInfo.slideConfig = data;
    this.elements.splice(index, 0, slideInfo);
    let addedSlideNode = null;
    let addedSlidePlayer = null;

    if (this.slidesContainer) {
      // Append at the end
      if (index > totalSlides) {
        this.slidesContainer.appendChild(newSlide);
      } else {
        // A current slide must exist in the position specified
        // we need tp get that slide and insder the new slide before
        let existingSlide = this.slidesContainer.querySelectorAll('.gslide')[index];
        this.slidesContainer.insertBefore(newSlide, existingSlide);
      }

      if (this.settings.preload && this.index == 0 && index == 0 || this.index - 1 == index || this.index + 1 == index) {
        this.preloadSlide(index);
      }

      if (this.index == 0 && index == 0) {
        this.index = 1;
      }

      this.updateNavigationClasses();
      addedSlideNode = this.slidesContainer.querySelectorAll('.gslide')[index];
      addedSlidePlayer = this.getSlidePlayerInstance(index);
      slideInfo.slideNode = addedSlideNode;
    }

    this.trigger('slide_inserted', {
      index: index,
      slide: addedSlideNode,
      slideNode: addedSlideNode,
      slideConfig: data,
      slideIndex: index,
      trigger: null,
      player: addedSlidePlayer
    }); // Deprecated and will be removed in a future update

    if (_.isFunction(this.settings.slideInserted)) {
      this.settings.slideInserted({
        index: index,
        slide: addedSlideNode,
        player: addedSlidePlayer
      });
    }
  }
  /**
   * Remove slide
   *
   * @param { numeric } position
   */


  removeSlide(index = -1) {
    if (index < 0 || index > this.elements.length - 1) {
      return false;
    }

    const slide = this.slidesContainer && this.slidesContainer.querySelectorAll('.gslide')[index];

    if (slide) {
      if (this.getActiveSlideIndex() == index) {
        if (index == this.elements.length - 1) {
          this.prevSlide();
        } else {
          this.nextSlide();
        }
      }

      slide.parentNode.removeChild(slide);
    }

    this.elements.splice(index, 1);
    this.trigger('slide_removed', index); // Deprecated and will be removed in a future update

    if (_.isFunction(this.settings.slideRemoved)) {
      this.settings.slideRemoved(index);
    }
  }
  /**
   * Slide In
   * @return {null}
   */


  slideAnimateIn(slide, first) {
    let slideMedia = slide.querySelector('.gslide-media');
    let slideDesc = slide.querySelector('.gslide-description');
    let prevData = {
      index: this.prevActiveSlideIndex,
      slide: this.prevActiveSlide,
      //this will be removed in the future
      slideNode: this.prevActiveSlide,
      slideIndex: this.prevActiveSlide,
      slideConfig: _.isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].slideConfig,
      trigger: _.isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].node,
      player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
    };
    let nextData = {
      index: this.index,
      slide: this.activeSlide,
      //this will be removed in the future
      slideNode: this.activeSlide,
      slideConfig: this.elements[this.index].slideConfig,
      slideIndex: this.index,
      trigger: this.elements[this.index].node,
      player: this.getSlidePlayerInstance(this.index)
    };

    if (slideMedia.offsetWidth > 0 && slideDesc) {
      _.hide(slideDesc);

      slideDesc.style.display = '';
    }

    _.removeClass(slide, this.effectsClasses);

    if (first) {
      _.animateElement(slide, this.settings.cssEfects[this.settings.openEffect].in, () => {
        if (this.settings.autoplayVideos) {
          this.slidePlayerPlay(slide);
        }

        this.trigger('slide_changed', {
          prev: prevData,
          current: nextData
        }); // settings.afterSlideChange is deprecated and will be removed in a future update

        if (_.isFunction(this.settings.afterSlideChange)) {
          this.settings.afterSlideChange.apply(this, [prevData, nextData]);
        }
      });
    } else {
      let effectName = this.settings.slideEffect;
      let animIn = effectName !== 'none' ? this.settings.cssEfects[effectName].in : effectName;

      if (this.prevActiveSlideIndex > this.index) {
        if (this.settings.slideEffect == 'slide') {
          animIn = this.settings.cssEfects.slideBack.in;
        }
      }

      _.animateElement(slide, animIn, () => {
        if (this.settings.autoplayVideos) {
          this.slidePlayerPlay(slide);
        }

        this.trigger('slide_changed', {
          prev: prevData,
          current: nextData
        }); // settings.afterSlideChange is deprecated and will be removed in a future update

        if (_.isFunction(this.settings.afterSlideChange)) {
          this.settings.afterSlideChange.apply(this, [prevData, nextData]);
        }
      });
    }

    setTimeout(() => {
      this.resize(slide);
    }, 100);

    _.addClass(slide, 'current');
  }
  /**
   * Slide out
   */


  slideAnimateOut() {
    if (!this.prevActiveSlide) {
      return false;
    }

    let prevSlide = this.prevActiveSlide;

    _.removeClass(prevSlide, this.effectsClasses);

    _.addClass(prevSlide, 'prev');

    let animation = this.settings.slideEffect;
    let animOut = animation !== 'none' ? this.settings.cssEfects[animation].out : animation;
    this.slidePlayerPause(prevSlide);
    this.trigger('slide_before_change', {
      prev: {
        index: this.prevActiveSlideIndex,
        //this will be removed in the future
        slide: this.prevActiveSlide,
        //this will be removed in the future
        slideNode: this.prevActiveSlide,
        slideIndex: this.prevActiveSlideIndex,
        slideConfig: _.isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].slideConfig,
        trigger: _.isNil(this.prevActiveSlideIndex) ? null : this.elements[this.prevActiveSlideIndex].node,
        player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
      },
      current: {
        index: this.index,
        //this will be removed in the future
        slide: this.activeSlide,
        //this will be removed in the future
        slideNode: this.activeSlide,
        slideIndex: this.index,
        slideConfig: this.elements[this.index].slideConfig,
        trigger: this.elements[this.index].node,
        player: this.getSlidePlayerInstance(this.index)
      }
    }); // settings.beforeSlideChange is deprecated and will be removed in a future update

    if (_.isFunction(this.settings.beforeSlideChange)) {
      this.settings.beforeSlideChange.apply(this, [{
        index: this.prevActiveSlideIndex,
        slide: this.prevActiveSlide,
        player: this.getSlidePlayerInstance(this.prevActiveSlideIndex)
      }, {
        index: this.index,
        slide: this.activeSlide,
        player: this.getSlidePlayerInstance(this.index)
      }]);
    }

    if (this.prevActiveSlideIndex > this.index && this.settings.slideEffect == 'slide') {
      // going back
      animOut = this.settings.cssEfects.slideBack.out;
    }

    _.animateElement(prevSlide, animOut, () => {
      let container = prevSlide.querySelector('.ginner-container');
      let media = prevSlide.querySelector('.gslide-media');
      let desc = prevSlide.querySelector('.gslide-description');
      container.style.transform = '';
      media.style.transform = '';

      _.removeClass(media, 'greset');

      media.style.opacity = '';

      if (desc) {
        desc.style.opacity = '';
      }

      _.removeClass(prevSlide, 'prev');
    });
  }
  /**
   * Get all defined players
   */


  getAllPlayers() {
    return this.videoPlayers;
  }
  /**
   * Get player at index
   *
   * @param index
   * @return bool|object
   */


  getSlidePlayerInstance(index) {
    const id = 'gvideo' + index;
    const videoPlayers = this.getAllPlayers();

    if (_.has(videoPlayers, id) && videoPlayers[id]) {
      return videoPlayers[id];
    }

    return false;
  }
  /**
   * Stop video at specified
   * node or index
   *
   * @param slide node or index
   * @return void
   */


  stopSlideVideo(slide) {
    if (_.isNode(slide)) {
      let node = slide.querySelector('.gvideo-wrapper');

      if (node) {
        slide = node.getAttribute('data-index');
      }
    }

    console.log('stopSlideVideo is deprecated, use slidePlayerPause');
    const player = this.getSlidePlayerInstance(slide);

    if (player && player.playing) {
      player.pause();
    }
  }
  /**
   * Stop player at specified index
   *
   * @param slide node or index
   * @return void
   */


  slidePlayerPause(slide) {
    if (_.isNode(slide)) {
      let node = slide.querySelector('.gvideo-wrapper');

      if (node) {
        slide = node.getAttribute('data-index');
      }
    }

    const player = this.getSlidePlayerInstance(slide);

    if (player && player.playing) {
      player.pause();
    }
  }
  /**
   * Play video at specified
   * node or index
   *
   * @param slide node or index
   * @return void
   */


  playSlideVideo(slide) {
    if (_.isNode(slide)) {
      let node = slide.querySelector('.gvideo-wrapper');

      if (node) {
        slide = node.getAttribute('data-index');
      }
    }

    console.log('playSlideVideo is deprecated, use slidePlayerPlay');
    const player = this.getSlidePlayerInstance(slide);

    if (player && !player.playing) {
      player.play();
    }
  }
  /**
   * Play media player at specified
   * node or index
   *
   * @param slide node or index
   * @return void
   */


  slidePlayerPlay(slide) {
    if (_.isNode(slide)) {
      let node = slide.querySelector('.gvideo-wrapper');

      if (node) {
        slide = node.getAttribute('data-index');
      }
    }

    const player = this.getSlidePlayerInstance(slide);

    if (player && !player.playing) {
      player.play();

      if (this.settings.autofocusVideos) {
        player.elements.container.focus();
      }
    }
  }
  /**
   * Set the entire elements
   * in the gallery, it replaces all
   * the existing elements
   * with the specified list
   *
   * @param {array}  elements
   */


  setElements(elements) {
    this.settings.elements = false;
    const newElements = [];

    if (elements && elements.length) {
      _.each(elements, (el, i) => {
        const slide = new _slide.default(el, this, i);
        const data = slide.getConfig();

        const slideInfo = _.extend({}, data);

        slideInfo.slideConfig = data;
        slideInfo.instance = slide;
        slideInfo.index = i;
        newElements.push(slideInfo);
      });
    }

    this.elements = newElements;

    if (this.lightboxOpen) {
      this.slidesContainer.innerHTML = '';

      if (this.elements.length) {
        _.each(this.elements, () => {
          let slide = _.createHTML(this.settings.slideHTML);

          this.slidesContainer.appendChild(slide);
        });

        this.showSlide(0, true);
      }
    }
  }
  /**
   * Return the index
   * of the specified node,
   * this node is for example an image, link, etc.
   * that when clicked it opens the lightbox
   * its position in the elements array can change
   * when using insertSlide or removeSlide so we
   * need to find it in the elements list
   *
   * @param {node} node
   * @return bool|int
   */


  getElementIndex(node) {
    let index = false;

    _.each(this.elements, (el, i) => {
      if (_.has(el, 'node') && el.node == node) {
        index = i;
        return true; // exit loop
      }
    });

    return index;
  }
  /**
   * Get elements
   * returns an array containing all
   * the elements that must be displayed in the
   * lightbox
   *
   * @return { array }
   */


  getElements() {
    let list = [];
    this.elements = this.elements ? this.elements : [];

    if (!_.isNil(this.settings.elements) && _.isArray(this.settings.elements) && this.settings.elements.length) {
      _.each(this.settings.elements, (el, i) => {
        const slide = new _slide.default(el, this, i);
        const elData = slide.getConfig();

        const slideInfo = _.extend({}, elData);

        slideInfo.node = false;
        slideInfo.index = i;
        slideInfo.instance = slide;
        slideInfo.slideConfig = elData;
        list.push(slideInfo);
      });
    }

    let nodes = false;
    let selector = this.getSelector();

    if (selector) {
      nodes = document.querySelectorAll(this.getSelector());
    }

    if (!nodes) {
      return list;
    }

    _.each(nodes, (el, i) => {
      const slide = new _slide.default(el, this, i);
      const elData = slide.getConfig();

      const slideInfo = _.extend({}, elData);

      slideInfo.node = el;
      slideInfo.index = i;
      slideInfo.instance = slide;
      slideInfo.slideConfig = elData;
      slideInfo.gallery = el.getAttribute('data-gallery');
      list.push(slideInfo);
    });

    return list;
  }
  /**
   * Return only the elements
   * from a specific gallery
   *
   * @return array
   */


  getGalleryElements(list, gallery) {
    return list.filter(el => {
      return el.gallery == gallery;
    });
  }
  /**
   * Get selector
   */


  getSelector() {
    if (this.settings.elements) {
      return false;
    }

    if (this.settings.selector && this.settings.selector.substring(0, 5) == 'data-') {
      return `*[${this.settings.selector}]`;
    }

    return this.settings.selector;
  }
  /**
   * Get the active slide
   */


  getActiveSlide() {
    return this.slidesContainer.querySelectorAll('.gslide')[this.index];
  }
  /**
   * Get the active index
   */


  getActiveSlideIndex() {
    return this.index;
  }
  /**
   * Get the defined
   * effects as string
   */


  getAnimationClasses() {
    let effects = [];

    for (let key in this.settings.cssEfects) {
      if (this.settings.cssEfects.hasOwnProperty(key)) {
        let effect = this.settings.cssEfects[key];
        effects.push(`g${effect.in}`);
        effects.push(`g${effect.out}`);
      }
    }

    return effects.join(' ');
  }
  /**
   * Build the structure
   * @return {null}
   */


  build() {
    if (this.built) {
      return false;
    } // TODO: :scope is not supported on IE or first Edge. so we'll
    // update this when IE support is removed to use newer code
    //const children = document.body.querySelectorAll(':scope > *');


    const children = document.body.childNodes;
    const bodyChildElms = [];

    _.each(children, el => {
      if (el.parentNode == document.body && el.nodeName.charAt(0) !== '#' && el.hasAttribute && !el.hasAttribute('aria-hidden')) {
        bodyChildElms.push(el);
        el.setAttribute('aria-hidden', 'true');
      }
    });

    const nextSVG = _.has(this.settings.svg, 'next') ? this.settings.svg.next : '';
    const prevSVG = _.has(this.settings.svg, 'prev') ? this.settings.svg.prev : '';
    const closeSVG = _.has(this.settings.svg, 'close') ? this.settings.svg.close : '';
    let lightboxHTML = this.settings.lightboxHTML;
    lightboxHTML = lightboxHTML.replace(/{nextSVG}/g, nextSVG);
    lightboxHTML = lightboxHTML.replace(/{prevSVG}/g, prevSVG);
    lightboxHTML = lightboxHTML.replace(/{closeSVG}/g, closeSVG);
    lightboxHTML = _.createHTML(lightboxHTML);
    document.body.appendChild(lightboxHTML);
    const modal = document.getElementById('glightbox-body');
    this.modal = modal;
    let closeButton = modal.querySelector('.gclose');
    this.prevButton = modal.querySelector('.gprev');
    this.nextButton = modal.querySelector('.gnext');
    this.overlay = modal.querySelector('.goverlay');
    this.loader = modal.querySelector('.gloader');
    this.slidesContainer = document.getElementById('glightbox-slider');
    this.bodyHiddenChildElms = bodyChildElms;
    this.events = {};

    _.addClass(this.modal, 'glightbox-' + this.settings.skin);

    if (this.settings.closeButton && closeButton) {
      this.events['close'] = _.addEvent('click', {
        onElement: closeButton,
        withCallback: (e, target) => {
          e.preventDefault();
          this.close();
        }
      });
    }

    if (closeButton && !this.settings.closeButton) {
      closeButton.parentNode.removeChild(closeButton);
    }

    if (this.nextButton) {
      this.events['next'] = _.addEvent('click', {
        onElement: this.nextButton,
        withCallback: (e, target) => {
          e.preventDefault();
          this.nextSlide();
        }
      });
    }

    if (this.prevButton) {
      this.events['prev'] = _.addEvent('click', {
        onElement: this.prevButton,
        withCallback: (e, target) => {
          e.preventDefault();
          this.prevSlide();
        }
      });
    }

    if (this.settings.closeOnOutsideClick) {
      this.events['outClose'] = _.addEvent('click', {
        onElement: modal,
        withCallback: (e, target) => {
          if (!this.preventOutsideClick && !_.hasClass(document.body, 'glightbox-mobile') && !_.closest(e.target, '.ginner-container')) {
            if (!_.closest(e.target, '.gbtn') && !_.hasClass(e.target, 'gnext') && !_.hasClass(e.target, 'gprev')) {
              this.close();
            }
          }
        }
      });
    }

    _.each(this.elements, (slide, i) => {
      this.slidesContainer.appendChild(slide.instance.create());
      slide.slideNode = this.slidesContainer.querySelectorAll('.gslide')[i];
    });

    if (isTouch) {
      _.addClass(document.body, 'glightbox-touch');
    }

    this.events['resize'] = _.addEvent('resize', {
      onElement: window,
      withCallback: () => {
        this.resize();
      }
    });
    this.built = true;
  }
  /**
   * Handle resize
   * Create only to handle
   * when the height of the screen
   * is lower than the slide content
   * this helps to resize videos vertically
   * and images with description
   */


  resize(slide = null) {
    slide = !slide ? this.activeSlide : slide;

    if (!slide || _.hasClass(slide, 'zoomed')) {
      return;
    }

    const winSize = _.windowSize();

    const video = slide.querySelector('.gvideo-wrapper');
    const image = slide.querySelector('.gslide-image');
    const description = this.slideDescription;
    let winWidth = winSize.width;
    let winHeight = winSize.height;

    if (winWidth <= 768) {
      _.addClass(document.body, 'glightbox-mobile');
    } else {
      _.removeClass(document.body, 'glightbox-mobile');
    }

    if (!video && !image) {
      return;
    }

    let descriptionResize = false;

    if (description && (_.hasClass(description, 'description-bottom') || _.hasClass(description, 'description-top')) && !_.hasClass(description, 'gabsolute')) {
      descriptionResize = true;
    }

    if (image) {
      if (winWidth <= 768) {
        let imgNode = image.querySelector('img'); //imgNode.setAttribute('style', '');
      } else if (descriptionResize) {
        let descHeight = description.offsetHeight;
        let imgNode = image.querySelector('img');
        imgNode.setAttribute('style', `max-height: calc(100vh - ${descHeight}px)`);
        description.setAttribute('style', `max-width: ${imgNode.offsetWidth}px;`);
      }
    }

    if (video) {
      let ratio = _.has(this.settings.plyr.config, 'ratio') ? this.settings.plyr.config.ratio : '';

      if (!ratio) {
        // If no ratio passed, calculate it using the video width and height
        // generated by Plyr
        const containerWidth = video.clientWidth;
        const containerHeight = video.clientHeight;
        const divisor = containerWidth / containerHeight;
        ratio = `${containerWidth / divisor}:${containerHeight / divisor}`;
      }

      let videoRatio = ratio.split(':');
      let videoWidth = this.settings.videosWidth;
      let maxWidth = this.settings.videosWidth;

      if (_.isNumber(videoWidth) || videoWidth.indexOf('px') !== -1) {
        maxWidth = parseInt(videoWidth);
      } else {
        // If video size is vw, vh or % convert it to pixels,
        // fallback to the current video size
        if (videoWidth.indexOf('vw') !== -1) {
          maxWidth = winWidth * parseInt(videoWidth) / 100;
        } else if (videoWidth.indexOf('vh') !== -1) {
          maxWidth = winHeight * parseInt(videoWidth) / 100;
        } else if (videoWidth.indexOf('%') !== -1) {
          maxWidth = winWidth * parseInt(videoWidth) / 100;
        } else {
          maxWidth = parseInt(video.clientWidth);
        }
      }

      let maxHeight = maxWidth / (parseInt(videoRatio[0]) / parseInt(videoRatio[1]));
      maxHeight = Math.floor(maxHeight);

      if (descriptionResize) {
        winHeight = winHeight - description.offsetHeight;
      }

      if (maxWidth > winWidth || maxHeight > winHeight || winHeight < maxHeight && winWidth > maxWidth) {
        let vwidth = video.offsetWidth;
        let vheight = video.offsetHeight;
        let ratio = winHeight / vheight;
        let vsize = {
          width: vwidth * ratio,
          height: vheight * ratio
        };
        video.parentNode.setAttribute('style', `max-width: ${vsize.width}px`);

        if (descriptionResize) {
          description.setAttribute('style', `max-width: ${vsize.width}px;`);
        }
      } else {
        video.parentNode.style.maxWidth = `${videoWidth}`;

        if (descriptionResize) {
          description.setAttribute('style', `max-width: ${videoWidth};`);
        }
      }
    }
  }
  /**
   * Reload Lightbox
   * reload and apply events to nodes
   */


  reload() {
    this.init();
  }
  /**
   * Update navigation classes on slide change
   */


  updateNavigationClasses() {
    const loop = this.loop(); // Handle navigation arrows

    _.removeClass(this.nextButton, 'disabled');

    _.removeClass(this.prevButton, 'disabled');

    if (this.index == 0 && this.elements.length - 1 == 0) {
      _.addClass(this.prevButton, 'disabled');

      _.addClass(this.nextButton, 'disabled');
    } else if (this.index === 0 && !loop) {
      _.addClass(this.prevButton, 'disabled');
    } else if (this.index === this.elements.length - 1 && !loop) {
      _.addClass(this.nextButton, 'disabled');
    }
  }
  /**
   * Handle loop config
   */


  loop() {
    let loop = _.has(this.settings, 'loopAtEnd') ? this.settings.loopAtEnd : null;
    loop = _.has(this.settings, 'loop') ? this.settings.loop : loop;
    return loop;
  }
  /**
   * Close Lightbox
   * closes the lightbox and removes the slides
   * and some classes
   */


  close() {
    if (!this.lightboxOpen) {
      if (this.events) {
        for (let key in this.events) {
          if (this.events.hasOwnProperty(key)) {
            this.events[key].destroy();
          }
        }

        this.events = null;
      }

      return false;
    }

    if (this.closing) {
      return false;
    }

    this.closing = true;
    this.slidePlayerPause(this.activeSlide);

    if (this.fullElementsList) {
      this.elements = this.fullElementsList;
    }

    if (this.bodyHiddenChildElms.length) {
      _.each(this.bodyHiddenChildElms, el => {
        el.removeAttribute('aria-hidden');
      });
    }

    _.addClass(this.modal, 'glightbox-closing');

    _.animateElement(this.overlay, this.settings.openEffect == 'none' ? 'none' : this.settings.cssEfects.fade.out);

    _.animateElement(this.activeSlide, this.settings.cssEfects[this.settings.closeEffect].out, () => {
      this.activeSlide = null;
      this.prevActiveSlideIndex = null;
      this.prevActiveSlide = null;
      this.built = false;

      if (this.events) {
        for (let key in this.events) {
          if (this.events.hasOwnProperty(key)) {
            this.events[key].destroy();
          }
        }

        this.events = null;
      }

      const body = document.body;

      _.removeClass(html, 'glightbox-open');

      _.removeClass(body, 'glightbox-open touching gdesc-open glightbox-touch glightbox-mobile gscrollbar-fixer');

      this.modal.parentNode.removeChild(this.modal);
      this.trigger('close'); // settings.onClose is deprecated and will be removed in a future update

      if (_.isFunction(this.settings.onClose)) {
        this.settings.onClose();
      }

      const styles = document.querySelector('.gcss-styles');

      if (styles) {
        styles.parentNode.removeChild(styles);
      }

      this.lightboxOpen = false;
      this.closing = null;
    });
  }
  /**
   * Destroy lightbox
   * and all events
   */


  destroy() {
    this.close();
    this.clearAllEvents();

    if (this.baseEvents) {
      this.baseEvents.destroy();
    }
  }
  /**
   * Set event
   */


  on(evt, callback, once = false) {
    if (!evt || !_.isFunction(callback)) {
      throw new TypeError('Event name and callback must be defined');
    }

    this.apiEvents.push({
      evt,
      once,
      callback
    });
  }
  /**
   * Set event
   */


  once(evt, callback) {
    this.on(evt, callback, true);
  }
  /**
   * Triggers an specific event
   * with data
   *
   * @param string eventName
   */


  trigger(eventName, data = null) {
    const onceTriggered = [];

    _.each(this.apiEvents, (event, i) => {
      const {
        evt,
        once,
        callback
      } = event;

      if (evt == eventName) {
        callback(data);

        if (once) {
          onceTriggered.push(i);
        }
      }
    });

    if (onceTriggered.length) {
      _.each(onceTriggered, i => this.apiEvents.splice(i, 1));
    }
  }
  /**
   * Removes all events
   * set using the API
   */


  clearAllEvents() {
    this.apiEvents.splice(0, this.apiEvents.length);
  }
  /**
   * Get Version
   */


  version() {
    return version;
  }

}

function _default(options = {}) {
  const instance = new GlightboxInit(options);
  instance.init();
  return instance;
}
},{"./core/keyboard-navigation.js":"node_modules/glightbox/src/js/core/keyboard-navigation.js","./core/touch-navigation.js":"node_modules/glightbox/src/js/core/touch-navigation.js","./core/slide.js":"node_modules/glightbox/src/js/core/slide.js","./utils/helpers.js":"node_modules/glightbox/src/js/utils/helpers.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63353" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","node_modules/glightbox/src/js/glightbox.js"], null)
//# sourceMappingURL=/glightbox.0959511b.js.map