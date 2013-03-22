// For some reason this works, but InjektBase does not.

// var BaseHash = {
//   foo : 'FOO!',
//   bar : function (fubar) {
//     console.log(require('util').inspect(this, true, 1));
//     console.log(this.foo + this.prop + fubar);
//   }
// }

// var base = Object.create(BaseHash, { prop: { value: ' testing '} });
// base.bar('BAR!');

// var base_extension = Object.create(base, { prop: { value: ' still is not missing ' } });
// base_extension.bar('BAR!');

(function () { 
  var InjektBase = {

    '_inject' : function (file, mocks, context, incl_defaults_flag) {
      var contents, script;

      // console.log('this = ' + require('util').inspect(this, true, 1));

      mocks = mocks || {};
      context = context || {};

      if (!cache[file]) cache[file] = fs.readFileSync(file, 'utf8');

      script = vm.createScript(cache[file], file);

      context = extend_context(mocks, context, incl_defaults_flag);    

      script.runInNewContext(context);
      return context.module.exports;
    },

    '_require' : function (file, mocks, context) {
      return _inject(file, mocks, context, false);
    },

    'return_require' : function (x) {
      if (mocks[x]) return mocks[x];
      if (x.indexOf('.') === 0) {
        x = path.join(path.dirname(file), x);
      }
      return require(x);
    },

    'extend_context' : function (mocks, current_context, incl_defaults_flag) {
      current_context.require = return_require;

      current_context = incl_defaults_flag ? include_defaults(current_context) : current_context;

      /* TODO: set Injekt and injekt in current_context */
      // current_context.Injekt = Object.create(this);

      current_context.module = current_context.module || {}; 
      current_context.module.exports = {};

      return current_context;
    },

    'include_defaults' : function (current_context) {
      for (var i in default_mocks) {
        current_context[i] = default_mocks[i];
      }
      return current_context;
    }

  };

  module.exports = function (defaults_hash) {
    var props_hash = {};
    for (var i in defaults_hash) props_hash[i] = { value: defaults_hash[i] };
    var o = Object.create(InjektBase, props_hash);
    console.log("\n\no = " + require('util').inspect(o, true, 1));
    return o;
  }
})();