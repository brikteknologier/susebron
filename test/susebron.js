var su = require('../');
var assert = require('assert');
var stylus = require('stylus');
describe('susebron', function() {
  it('should set a variable', function(done) {
    var stystr = 'body { font-family: $potato }';
    var res = stylus(stystr)
                .use(su({ defs: { '$potato': 'Amazing' } }))
                .render();
    assert(res.match(/Amazing/));
    assert(!res.match(/\$potato/));
    done();
  });
});
