var Clazz = {
  define : function (clazzname, def_hash) {
    /* TODO: replace stub */
    console.log(clazzname + ' defined by ' + def_hash);
  },
  new : function (props) {
    return Object.create(Clazz, props);
  }
};
module.exports = Clazz;