var util = require('util');

var Injekt = (require('./lib/injekt.js'))({
  'default_mocks' : {
    'Class' : require('./lib/clazz.js')
  },
  'cache' : { },
  'fs' : require('fs'),
  'path' : require('path'),
  'vm' : require('vm'),
  'util' : require('util')
});
var injekt = Injekt._inject;

// console.log("Global:\n" + util.inspect(global));

// console.log("Injekt:\n" + util.inspect(global.Injekt, true));

// console.log("Injekt.prototype:\n" + util.inspect(global.Injekt.prototype, true));

// console.log("Injekt.Class:\n" + util.inspect(global.Injekt.Class, true));

// console.log("Injekt.default_mocks:\n" + util.inspect(Injekt, true));

(injekt('./test.js'))('foo.bar', {});