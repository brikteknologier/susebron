var read = require('fs').readFileSync;
var parse = JSON.parse;
var Lexer = require('stylus/lib/lexer')
var stylus = require('stylus');
var _ = require('underscore');

module.exports = function susebron(scheme) {
  // Have to do this synchronously because Stylus doesn't allow asynchronous
  // middleware, and it would be a pain in the ass to have to wait to get the
  // middleware.
  if ('string' == typeof scheme) scheme = parse(read(scheme));

  var defs = [];
  for (var key in scheme.defs) 
    defs.push({ key: key, val: scheme.defs[key] });
  
  // create a node from a string. if not understood, use a Literal
  defs = defs.map(function(def) {
    if ('string' != typeof def.val) return def;
    var lexer = new Lexer(def.val);
    var newVal = lexer.next();
    if (newVal.type != 'eos' && lexer.next().type == 'eos')
      def.val = newVal.val;
    else
      def.val = new stylus.nodes.Literal(def.val);
    return def;
  });
     
  function susebronWare(style) {
    if (scheme.light) {
      style.str = [ "_lighten = lighten",
                    "lighten = darken",
                    "darken = _lighten" ].join('\n') + '\n' + style.str;
    }
    if (scheme.prepend) style.str = scheme.prepend + style.str;

    defs.forEach(function(def) {
      style.define(def.key, def.val);
    });
  };

  _.extend(susebronWare, scheme);
  
  return susebronWare;
};
