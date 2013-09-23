var read = require('fs').readFileSync;
var parse = JSON.parse;

module.exports = function susebron(scheme) {
  // Have to do this synchronously because Stylus doesn't allow asynchronous
  // middleware, and it would be a pain in the ass to have to wait to get the
  // middleware.
  if ('string' == typeof scheme) scheme = parse(read(scheme));
     
  return function susebronWare(style) {
    if (scheme.light) {
      style.str = [ "_lighten = lighten",
                    "lighten = darken",
                    "darken = _lighten" ].join('\n') + '\n' + style.str;
    }
    if (scheme.prepend) style.str = scheme.prepend + style.str;

    var defs = [];
    for (var key in scheme.defs) {
      var resolved = false;
      var val = scheme.defs[key];
      while (!resolved) {
        if (scheme.defs[val] != null) {
          val = scheme.defs[val];
        } else if (style.options.globals[val] != null) {
          val = style.options.globals[val];
        } else {
          resolved = true;
        }
      }
      defs.push({ key: key, val: val });
    }

    defs.forEach(function(def) {
      style.define(def.key, def.val);
    });
  };
};
