# Node Patterns

*Node.js Design Patterns - Copyright © 2014 Packt Publishing*

> **Node creator** Ryan Dahl
> **Npm creator** Isaac Z. Schlueter

1. small core; Keeping the core set of functionality to the bare minimum.
2. small modules
3. small surface area; modules usually also have the characteristic of exposing only a minimal set of functionality

---

## Reactor pattern

### Intro

It is the heart of the Node.js asynchronous nature.

> Synchronous event demultiplexer or event notification interface; The event loop.

The tasks are spread over time, instead of being spread across multiple threads.

### Explanation

We can now introduce the reactor pattern, which is a specialization of the algorithm presented in the previous section. The main idea behind it is to have a handler (which in Node.js is represented by a callback function) associated with each I/O operation, which will be invoked as soon as an event is produced and processed by the event loop. 

## The callback pattern

**The continuation-passing style**

```js
 function add(a, b, callback) {
     callback(a + b);
}

function addAsync(a, b, callback) {
     setTimeout(function() {
       callback(a + b);
     }, 100);
}
```

> It is imperative for an API to clearly define its nature, either synchronous or asynchronous.

```js
// sync
var fs = require('fs');
var cache = {};

function consistentReadSync(filename) {
  if(cache[filename]) {
    return cache[filename];
  } else {
    cache[filename] = fs.readFileSync(filename, 'utf8');
    return cache[filename];
  } 
}
```

```js
// async
var fs = require('fs');
var cache = {};

function consistentReadAsync(filename, callback) {
  if(cache[filename]) {
    process.nextTick(function() {
      callback(cache[filename]);
    });
  } else {
    //asynchronous function
    fs.readFile(filename, 'utf8', function(err, data) {
      cache[filename] = data;
      callback(data);
    });
  } 
}
```

## Conventions

1. callbacks come last
2. error comes first

```js
 fs.readFile('foo.txt', 'utf8', function(err, data) {
    // code ...
  });
```

## Propagating errors

In asynchronous CPS however, proper error propagation is done by simply passing the error to the next callback in the CPS chain.

> Throwing inside an asynchronous callback, in fact, will cause the exception to jump up to the event loop and never be propagated to the next callback.

```js
var fs = require('fs');
function readJSON(filename, callback) {
  fs.readFile(filename, 'utf8', function(err, data) {
    var parsed;
    if(err)
      //propagate the error and exit the current function
      return callback(err);
    try {
      //parse the file contents
      parsed = JSON.parse(data);
    } catch(err) {
      //catch parsing errors
      return callback(err);
    }
    //no errors, propagate just the data
    callback(null, parsed);
  });
};
```

---

## The Module System

### Revealing module pattern

This pattern leverages a self-invoking function to create a private scope, exporting only the parts that are meant to be public. 

> This pattern is used as a base for the Node.js module system.

```js
var module = (function() {
  var privateFoo = function() {...};
  var privateVar = [];
  var export = {
    publicFoo: function() {...},
    publicBar: function() {...}
  }
  return export;
})();
```

### How it behaves

> If the module was already loaded in the past, it should be available in the cache. In this case, we just return it immediately.

```js
module.exports.run = function() {
  log(); 
};
```

### Defining globals

In fact, the module system exposes a special variable called **global**, which can be used for this purpose. Everything that is assigned to this variable will end up automatically in the global scope.

## require is synchronous

As a consequence, any assignment to module.export must be synchronous as well.

This property has important repercussions in the way we define modules, as it limits us to mostly using synchronous code during the definition of a module.

> If we need some asynchronous initialization steps for a module, we can always
define and export an uninitialized module that is initialized asynchronously at
a later time. 

## Resolving algorithm

+ <moduleName>.js
+ <moduleName>/index.js
+ The directory/file specified in the *main* property of <moduleName>/package.json

## The module cache

Each module is loaded and evaluated only the first time it is required, since any subsequent call of require() will simply return the cached version. 

## Exports

### Named exports

```js
exports.info = function(name) {
  console.log('info:  ' + message)
}
```

### Exporting a function

```js
module.exports = function(message) {
  console.log('info:  ' + message)
}
```

### Exporting a constructor

```js
//file logger.js
   function Logger(name) {
     this.name = name;
   };
   Logger.prototype.log = function(message) {
     console.log('[' + this.name + '] ' + message);
   };
   Logger.prototype.info = function(message) {
     this.log('info: ' + message);
   };
   Logger.prototype.verbose = function(message) {
     this.log('verbose: ' + message);
   };
   module.exports = Logger;
```

```js
//file logger.js
var Logger = require('./logger');
var dbLogger = new Logger('DB');
dbLogger.info('This is an informational message');
var accessLogger = new Logger('ACCESS');
accessLogger.verbose('This is a verbose message');
```

### Exporting an instance

```js
//file logger.js
function Logger(name) {
  this.count = 0;
  this.name = name;
};
Logger.prototype.log = function(message) {
  this.count++;
  console.log('[' + this.name + '] ' + message);
};
module.exports = new Logger('DEFAULT');
```

## Monkey patching

This is called monkey patching, which generally refers to the practice of modifying the existing objects at runtime to change or extend their behavior or to apply temporary fixes.
