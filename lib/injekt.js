var InjektBase = function() {

  this._inject = function (file, mocks, context, incl_defaults_flag) {
    mocks = mocks || {};
    context = context || {};
    console.log((require('util')).inspect(this, true, 1));
    return this._isolate(file, mocks, context, incl_defaults_flag);
  },

  this._require = function (file, mocks, context) {
    return this._inject(file, mocks, context, false);
  },

  this._isolate = function (file, mocks, context, incl_defauls_flag) {
    context = this._extendContext(mocks, context, incl_defaults_flag);

    if (!this.cache[file]) this.cache[file] = this.fs.readFileSync(file, 'utf8');
    var script = this.vm.createScript(this.cache[file], file);

    script.runInNewContext(context);
    return context.module.exports;
  },

  this._extendContext = function (mocks, current_context, incl_defaults_flag) {
    current_context.require = function (x) {
      if (mocks[x]) return mocks[x];
      if (x.indexOf('.') === 0) {
        x = this.path.join(this.path.dirname(file), x);
      }
      return require(x);
    }

    current_context = incl_defaults_flag ? this._includeDefaults(current_context) : current_context;

    /* TODO: set Injekt and injekt in current_context */

    current_context.module = current_context.module || {}; 
    current_context.module.exports = {};

    return current_context;
  },

  this._includeDefaults = function (current_context) {
    for (var i in this.defaults) {
      current_context[i] = this.defaults[i];
    }
    return current_context;
  }

};

module.exports = function (defaults_hash) {
  var props_hash = {};
  for (var i in defaults_hash) {
    props_hash[i] = { writable: true, configurable: false, enumerable: true, value: defaults_hash[i] };
  }
  return Object.create(InjektBase, props_hash);
};