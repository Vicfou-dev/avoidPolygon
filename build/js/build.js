(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.module = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
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
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
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
    while(len) {
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
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
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

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
module.exports = {
    Point: require('./src/point.js'),
    Segment: require('./src/segment.js'),
    Polygon: require('./src/polygon.js'),
    Path: require('./src/path.js')
}
},{"./src/path.js":5,"./src/point.js":6,"./src/polygon.js":7,"./src/segment.js":8}],5:[function(require,module,exports){
const Segment = require('./segment.js');
const Point = require('./point.js');
const Polygon = require('./polygon.js');
const Svg = require('./svg');

class Path {
    constructor(start, end) {
        if (start instanceof Point) {
            this.start = start;
        } else if (start.x != undefined && start.y !== undefined) {
            this.start = new Point(start.x, start.y);
        } else throw new Error("Start point invalid");

        if (end instanceof Point) {
            this.end = end;
        } else if (start.x != undefined && end.y !== undefined) {
            this.end = new Point(end.x, end.y);
        } else throw new Error("End point invalid");

        this.obstacles = [];
    }


    createObstacle(polygon) {
        if (polygon instanceof Polygon) {
            this.obstacles.push(polygon);
            return;
        }
        var obstacle = new Polygon();
        for (var i = 0; i < polygon.length; i++) {
            obstacle.addVector(...polygon[i]);
        }

        this.obstacles.push(obstacle);
    }

    setOption(option) {
        if (option.optimize == undefined) {
            option.optimize = false;
        }

        if (option.draw == undefined) {
            option.draw = {};
        }

        if (option.draw.show == undefined) {
            option.draw.show = false;
        }

        if (option.draw.output == undefined) {
            option.draw.output = "index.html";
        }

        if (option.draw.step == undefined) {
            option.draw.step = false;
        }

        if (option.draw.step == undefined) {
            option.draw.output = false;
        }

        if (option.draw.width == undefined) {
            option.draw.width = 1000;
        }

        if (option.draw.height == undefined) {
            option.draw.height = 600;
        }

    }

    getDraw() {
        return (this.svg === null || this.svg === undefined) ? undefined : this.svg.getContent();
    }

    find(option = {}) {

        var inital = new Segment(this.start, this.end);

        this.setOption(option);

        var is_needed_to_draw = option.draw.show;

        if (is_needed_to_draw) {

            this.svg = new Svg();
            this.svg.setWidth(option.draw.width);
            this.svg.setHeight(option.draw.height);
            if (option.draw.step) {
                this.svg.addMultiplePolygons(this.obstacles);
                this.svg.addPoint(this.start);
                this.svg.addPoint(this.end);
                this.svg.draw();

                this.svg.addMultiplePolygons(this.obstacles);
                this.svg.addSegment(segment);
                this.svg.draw();
            }

        }

        var segments = [];
        var line_segments = [];
        var origin = this.end;
        /*
        for(var i = 0 ; i < this.obstacles.length; i++){ 
            for(var j = i +1 ; j < this.obstacles.length; j++){
                console.log(this.obstacles[i].centroid(),this.obstacles[j].centroid());
                if(origin.distance(this.obstacles[i].centroid()) < origin.distance(this.obstacles[j].centroid())){
                    var temp = this.obstacles[j];
                    this.obstacles[j] = this.obstacles[i];
                    this.obstacles[i] = temp;
                }
            }
        }*/

        var polygons = Array.from(this.obstacles);
        
        var tree = [];
        tree[tree.length] = [];
        tree[tree.length - 1][0] = [inital];
        var end = this.end;

        for (var i = 0; i < polygons.length; i++) {
            var lastrow = tree[tree.length - 1]; 
            tree[tree.length] = [];

            for(var j = 0; j < lastrow.length; j++) {
                var segment = lastrow[j][lastrow[j].length - 1];
                var segments = segment.avoidPolygon(polygons[i]);

                var new_row = [];
                for(var p = 0; p < lastrow[j].length - 1; p++) {
                    new_row[new_row.length] = lastrow[j][p];
                }
                
                for(var h = 0; h < segments.length; h++) {
                    new_row[new_row.length] = segments[h];
                }

                tree[tree.length - 1][j] = new_row;
            } 

        }

        const paths = tree[tree.length - 1];
        var min = Infinity;
        var path = [];

        for(var i = 0; i < paths.length; i++) {
            var distance = 0;
            for(var j = 0; j < paths[i].length; j++) {
                distance += paths[i][j].distance();
            }

            if(distance < min) {
                min = distance;
                path = paths[i];
            }

        }

        return path;

        var optimised_path_segments = [];

        var segments = path;

        for (var i = 0; i < segments.length - 1; i++) {

            var segment = segments[i].merge(segments[i + 1]);

            var crossed = false;
            for (var j = 0; j < polygons.length; j++) {
                if(polygons[j].isSegment()) {
                    if(segment.intersection(polygons[j].buildAsSegment()) ) {
                        crossed = true;
                        break;
                    }
                }
                if (segment.cross(polygons[j])) {
                    crossed = true;
                    break;
                }
            }


            if (!crossed) {
                i++;
            } 
            else {
                segment = segments[i];
            }

            if(inital.p1.equals(segment.p1) && inital.p2.equals(segment.p2)) {
                return [inital];
            }
            
            optimised_path_segments[optimised_path_segments.length] = segment;

        }

        var last = segments[segments.length - 1];
        if(optimised_path_segments.length == 0) {
            optimised_path_segments.push(last);
        }

        var p1 = last.p2 !== this.end;
        var p2 = last.p1 !== this.end; 

        if(p1) {
            optimised_path_segments.push(new Segment(last.p2, this.end));
        }

        if(p2 && !p1) {
            optimised_path_segments.push(new Segment(last.p1, this.end));
        }

        return optimised_path_segments;
        

        if (is_needed_to_draw && (!option.draw.optimize || option.draw.step)) {
            this.svg.addMultiplePolygons(this.obstacles);
            this.svg.addMultipleSegments(line_segments);
            this.svg.draw();
            this.svg.save();
        }

        if (!option.optimize) {
            return line_segments;
        }

        var ordered_segments = [];
        var index = 0;
        for(var i = 0; i < line_segments.length; i++) {
            var seg = line_segments[i];
            if(this.start == seg.p1 || this.start == seg.p2) {
                index = i;
                break;
            }
        }
        var current_segment = line_segments.splice(index, 1)[0];
        ordered_segments.push(current_segment);

        while (line_segments.length) {
            var middle = current_segment.middle();

            var points = [];

            for (var i = 0; i < line_segments.length; i++) {
                points.push(line_segments[i].middle());
            }

            var point = middle.nearest(points);

            for (var j = 0; j < points.length; j++) {
                if (point.equals(points[j])) {
                    current_segment = line_segments[j];
                    ordered_segments.push(line_segments.splice(j, 1)[0])
                    break;
                }
            }
        }

        segments = Array.from(ordered_segments);
        var optimised_path_segments = [];

        var inital = new Segment(this.start, this.end);
        
        for (var i = 0; i < segments.length - 1; i++) {

            var segment = segments[i].merge(segments[i + 1]);

            var crossed = false;
            for (var j = 0; j < polygons.length; j++) {
                if(polygons[j].size() <= 2) {
                    if(segment.intersection(new Segment(polygons[j].vectrices[0], polygons[j].vectrices[1])) ) {
                        crossed = true;
                        break;
                    }
                }
                if (segment.cross(polygons[j])) {
                    crossed = true;
                    break;
                }
            }


            if (!crossed) {
                i++;
            } 
            else {
                segment = segments[i];
            }

            if(inital.p1.equals(segment.p1) && inital.p2.equals(segment.p2)) {
                return [inital];
            }
            
            optimised_path_segments[optimised_path_segments.length] = segment;

        }

        var last = segments[segments.length - 1];
        if(optimised_path_segments.length == 0) {
            optimised_path_segments.push(last);
        }

        var p1 = last.p2 !== this.end;
        var p2 = last.p1 !== this.end; 

        if(p1) {
            optimised_path_segments.push(new Segment(last.p2, this.end));
        }

        if(p2 && !p1) {
            optimised_path_segments.push(new Segment(last.p1, this.end));
        }
        
        return optimised_path_segments;


    }
}

module.exports = Path;
},{"./point.js":6,"./polygon.js":7,"./segment.js":8,"./svg":9}],6:[function(require,module,exports){
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(point) {
        if(Math.abs(this.x - point.x) > 0.00001) {
            return false;
        }
        else if (Math.abs(this.y - point.y) > 0.00001) {
            return false;
        }
        else return true;
    }

    distance(point) {
        var dx = this.x - point.x;
        var dy = this.y - point.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    nearest(points) {

        var point = points[0];
        var index = 0;
        for(var i = 0; i < points.length; i++) {
            if(this.distance(point) >= this.distance(points[i])) {
                point = points[i];
                index = i;

            }
        }

        points.splice(index, 1);
        
        return point;

    }

}

module.exports = Point;
},{}],7:[function(require,module,exports){
const Point = require("./point.js");
const Segment = require("./segment.js");

class Polygon {
    constructor() {
        this.vectrices = [];
        this.crossable = [];
    }

    addVector(x, y) {
        this.vectrices.push(new Point(x, y));
        this.crossable = Array.from(this.vectrices);
    }

    size() {
        return this.vectrices.length;
    }
    
    isSegment() {
        return this.size() == 2;
    }

    buildAsSegment() {
        return new Segment(this.vectrices[0], this.vectrices[1]);
    }

    index(point) {
        for (var i = 0; i < this.size(); i++) {
            if (this.vectrices[i].equals(point)) {
                return i;
            }
        }

        return -1;
    }

    centroid() {
        var centroid = new Point(0, 0);
        for (var i = 0; i < this.size(); i++) {
            var point = this.vectrices[i];
            centroid.x += point.x;
            centroid.y += point.y;
        }

        centroid.x /= this.size();
        centroid.y /= this.size();
        return centroid;
    }

    inside(point) {
        var j = this.size() - 1;
        var inside = false;

        for (var i = 0; i < this.size(); i++) {

            if (this.vectrices[i].y < point.y && this.vectrices[j].y >= point.y || this.vectrices[j].y < point.y && this.vectrices[i].y >= point.y) {
                if (this.vectrices[i].x + (point.y - this.vectrices[i].y) / (this.vectrices[j].y - this.vectrices[i].y) * (this.vectrices[j].x - this.vectrices[i].x) < point.x) {
                    inside = !inside
                }
            }

            j = i;
        }

        return inside;
    }

    encounter(segment) {
        var result = this.size() <= 2 ? segment.cut(new Segment(this.vectrices[0], this.vectrices[this.vectrices.length - 1])) : segment.cross(this);
        return result ? true : false;
    }

    cover(segment) {

        var p1_position = this.index(segment.p1);
        var p2_position = this.index(segment.p2);

        if (p1_position != -1 && p2_position != -1) {
            var pos_distance = Math.abs(p1_position - p2_position);
            if (pos_distance == 1 || pos_distance == this.size() - 1) {
                return false;
            }

        }
        
        var middle = segment.middle();
        return this.inside(middle);
    }
}

module.exports = Polygon;
},{"./point.js":6,"./segment.js":8}],8:[function(require,module,exports){
const Point = require("./point.js");

class Segment {
    constructor(p1, p2) {

        if(p1.x > p2.x) {
            this.p1 = p2;
            this.p2 = p1;
            return;
        }

        this.p1 = p1;
        this.p2 = p2;
    }

    middle() {
        return new Point((this.p1.x + this.p2.x) / 2,(this.p1.y + this.p2.y ) / 2);
    }

    end(point) {
        return this.p1.equals(point) || this.p2.equals(point);
    }

    merge(segment) {
        if (this.p1.equals(segment.p1)) {
            return new Segment(this.p2, segment.p2);
        }

		if (this.p2.equals(segment.p2)) {
            return new Segment(this.p1, segment.p1);   
        }

		if (this.p2.equals(segment.p1)) {
            return new Segment(this.p1, segment.p2);
        }

		if (this.p1.equals(segment.p2)) {
            return new Segment(this.p2, segment.p1);
        }

        return null;
    }

    distance() {
        return this.p1.distance(this.p2);
    }

    contain(point) {
        if ((point.x == this.p1.x && point.y == this.p1.y) || (point.x == this.p2.x && point.y == this.p2.y))
		{
			return true;
		}

        return ( (point.x > this.p1.x && point.x < this.p2.x) || (point.y > this.p1.y && point.y < this.p2.y));
    }

    cut(segment) {
        if (this.p1.equals(segment.p1)) {
            return this.p2;
        }

		if (this.p2.equals(segment.p2)) {
            return this.p2 
        }

		if (this.p2.equals(segment.p1)) {
            return this.p2
        }

		if (this.p1.equals(segment.p2)) {
            return this.p1
        }

        var vx1 = this.p2.x - this.p1.x;
		var vy1 = this.p2.y - this.p1.y;
		var vx2 = segment.p2.x - segment.p1.x;
		var vy2 = segment.p2.y - segment.p1.y;

        var t =  ( vy1 * (segment.p1.x - this.p1.x) - vx1 * (segment.p1.y - this.p1.y)) / ((vx1 * vy2 - vx2 * vy1));
		var _x = Math.ceil(vx2 * t + segment.p1.x);
		var _y = Math.ceil(vy2 * t + segment.p1.y);

        var point = new Point(_x, _y);

        if (this.contain(point) && segment.contain(point)) {
            return point;
        }

        return null;
    }

    intersection(segment) {
        if (this.p1.equals(segment.p1) || this.p2.equals(segment.p2) || this.p2.equals(segment.p1) || this.p1.equals(segment.p2)) {
            return null;
        }

        var vx1 = this.p2.x - this.p1.x;
		var vy1 = this.p2.y - this.p1.y;
		var vx2 = segment.p2.x - segment.p1.x;
		var vy2 = segment.p2.y - segment.p1.y;

        var t =  ( vy1 * (segment.p1.x - this.p1.x) - vx1 * (segment.p1.y - this.p1.y)) / ((vx1 * vy2 - vx2 * vy1));
		var _x = vx2 * t + segment.p1.x;
		var _y = vy2 * t + segment.p1.y;

        var point = new Point(_x, _y);

        if(this.end(point) ) {
            return null;
        }

        if (this.contain(point) && (segment.contain(point) || segment.end(point))) {
            return point;
        }
			
        return null;
    }

    avoidPolygon(polygon, arr = []) {
        var result = polygon.encounter(this);

        if(result == true ) {
            var point = this.middle();
            
            var nearest = point.nearest(polygon.crossable, point);
            let first_part = new Segment(this.p1, nearest);
            if (first_part.cross(polygon) == false) {
                
                if(arr.length && polygon.isSegment() == false && arr[arr.length - 1].merge(first_part).cross(polygon) == false) {
                    arr[arr.length - 1] = arr[arr.length - 1].merge(first_part)
                }
                else {
                    arr[arr.length] = first_part;
                }

                console.log(first_part)
            }
            else {
                var data = first_part.avoidPolygon(polygon, []);
                var temp = [];
                for( var i = 0; i < data.length; i++) {
                    if(polygon.index(data[i].p1) != -1 && polygon.index(data[i].p2) != -1) {
                        if(temp.length) {
                            console.log('in')
                            if(temp[i - 1].merge(data[i]).cross(polygon) == false) {
                                temp[i - 1] = temp[i - 1].merge(data[i])
                            }
                            else {
                                temp[temp.length] = data[i];
                            }
                            
                        }
                        else {
                            if(arr.length && arr[arr.length - 1].merge(data[i]).cross(polygon) == false) {
                                arr[arr.length - 1] = arr[arr.length - 1].merge(data[i])
                            }
                            else {
                                temp[temp.length] = data[i];
                            }
                        }
                    }
                    else {
                        temp[temp.length] = data[i];
                    }
                }

                for(var i = 0; i < temp.length; i++) {
                    arr[arr.length] = temp[i];
                }
            }

            let second_part = new Segment(nearest, this.p2);
            if (second_part.cross(polygon) == false) {
                if(arr.length && polygon.isSegment() == false && arr[arr.length - 1].merge(second_part).cross(polygon) == false) {
                    arr[arr.length - 1] = arr[arr.length - 1].merge(second_part)
                }
                else {
                    arr[arr.length] = second_part;
                }

            }
            else {   
                var data = second_part.avoidPolygon(polygon, []);
                var temp = [];
                for( var i = 0; i < data.length; i++) {
                    if(polygon.isSegment() == false && polygon.index(data[i].p1) != -1 && polygon.index(data[i].p2) != -1) {
                        if(temp.length) {
                            if( temp[i - 1].merge(data[i]).cross(polygon) == false) {
                                temp[i - 1] = temp[i - 1].merge(data[i])
                            }
                            else {
                                temp[temp.length] = data[i];
                            }
                            
                        }
                        else {
                            if(arr.length && arr[arr.length - 1].merge(data[i]).cross(polygon) == false) {
                                arr[arr.length - 1] = arr[arr.length - 1].merge(data[i])
                            }
                            else {
                                temp[temp.length] = data[i];
                            }
                        }
                    }
                    else {
                        temp[temp.length] = data[i];
                    }
                }

                for(var i = 0; i < temp.length; i++) {
                    arr[arr.length] = temp[i];
                }
            }

            console.log(arr)
            
            return arr;
        }

        if(!arr.length) {
            arr[arr.length] = this;
        }
        
        return arr;
    }

    cross(polygon) {

        var split_point = null;
        for (var i = 0; i< polygon.size(); i++)
        {
            var p1 = polygon.vectrices[i];
			var p2 = polygon.vectrices[(i + 1) % polygon.size()];
            let edge = new Segment(p1,p2);
            split_point = this.intersection(edge);
            if (split_point != null) {
                break;
            }
        }

        if (split_point != null) 
        {
            let first_part = new Segment(this.p1,split_point).cross(polygon);
            if (first_part == true) {
                return first_part;
            }
            
            let second_part = new Segment(split_point,this.p2).cross(polygon);
            return second_part;
        } 
        else {
            return polygon.cover(this);
        }
        
    }

}

module.exports = Segment;
},{"./point.js":6}],9:[function(require,module,exports){
(function (__dirname){(function (){
const path = require('path');
const fs = require('fs');


class Svg {
    constructor(file = '') {
        this.figures = [];

        this.height = 600;
        this.width = 1000;

        this.colors = {
            polygon: "#FF0000",
            segment: "#0000FF",
            point: "#000000"
        }

        this.output = file ? file : 'index.html';
        this.content = [];

    }

    setWidth(width) {
        this.width = width;
    }

    setHeight(height) {
        this.height = height;
    }

    addMultiplePolygons(polygons) {
        for (var i = 0; i < polygons.length; i++) {
            this.addPolygon(polygons[i]);
        }
    }

    addMultipleSegments(segments) {
        for (var i = 0; i < segments.length; i++) {
            this.addSegment(segments[i]);
        }
    }

    getContent() {
        var result = '';
        for (var i = 0; i < this.content.length; i++) {
            result += this.content[i];
        }

        return result;
    }

    addPolygon(polygon) {
        this.figures.push({
            objet: polygon,
            type: 'polygon'
        })
    }

    addSegment(segment) {
        this.figures.push({
            objet: segment,
            type: 'segment'
        })
    }

    addPoint(segment) {
        this.figures.push({
            objet: segment,
            type: 'point'
        })
    }

    save() {
        var file = path.join(__dirname, '..', this.output);
        fs.writeFileSync(file, '');
        fs.appendFileSync(path.join(__dirname, '..', this.output), this.getContent());

    }

    draw() {
        var result = '';
        for (var figure of this.figures) {

            switch (figure.type) {
                case 'polygon':
                    var points = figure.objet.vectrices.map(point => `${point.x},${point.y}`).join(" ");
                    result += `\t<polygon fill="${this.colors[figure.type]}" stroke="${this.colors[figure.type]}" points="${points}" />\n`
                    break;
                case 'point':
                    result += `\t<circle fill="${this.colors[figure.type]}" cx="${figure.objet.x}" cy="${figure.objet.y}" r="3"/>\n`
                    break;
                case 'segment':
                    result += `\t<circle fill="${this.colors['point']}" cx="${figure.objet.p1.x}" cy="${figure.objet.p1.y}" r="3"/>\n`
                    result += `\t<path stroke="${this.colors[figure.type]}" d="M${figure.objet.p1.x} ${figure.objet.p1.y} L${figure.objet.p2.x} ${figure.objet.p2.y}" />\n`
                    result += `\t<circle fill="${this.colors['point']}" cx="${figure.objet.p2.x}" cy="${figure.objet.p2.y}" r="3"/>\n`
                    break;
            }
        }

        var header = `<svg widht="${this.width}" height="${this.height}">`;
        var bottom = '</svg>';
        var content = "\n" + header + "\n" + result + bottom + "\n";
        this.content.push(content);
        this.figures = [];

        return content;
    }
}

module.exports = Svg;
}).call(this)}).call(this,"/src")
},{"fs":1,"path":2}]},{},[4])(4)
});
