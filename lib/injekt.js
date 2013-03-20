/* TODO: finish heavy refactoring of injectr base */
var cache = {}, fs = require('fs'), path = require('path'), vm = require('vm');

var _inject = function (file, mocks, context, incl_globals_flag) {
  var contents, script;

  mocks = mocks || {};
  context = context || {};

  if (!cache[file]) cache[file] = fs.readFileSync(file, 'utf8');

  script = vm.createScript(cache[file], file);

  context = extend_context(context, incl_globals_flag);

  script.runInNewContext(context);
  return context.module.exports;
};

var _require = function (file, mocks, context) {
  /* TODO: fix this awful anti-pattern */
  try {
    return _inject(file, mocks, context, false);
  } catch (e) {
    return require(file);
  }
};

var extend_context = function (current_context, incl_globals_flag) {
  current_context.require = function (a) {
    if (mocks[a]) {
      return mocks[a];
    }
    if (a.indexOf('.') === 0) {
      a = path.join(path.dirname(file), a);
    }
    return require(a);
  };

  current_context = incl_globals_flag ? include_globals(current_context) : current_context;
  current_context._inject = _inject;

  current_context.module = current_context.module || {}; 
  current_context.module.exports = {};

  return current_context;
};

/* TODO: replace stub - inject global properties; pending completion of objekt/clazz */
var include_globals = function (current_context) {
  return current_context;
};

module.exports = { injekt: _inject, require: _require };