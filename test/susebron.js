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
  it('should read config from a file', function(done) {
    var stystr = 'body { font-family: $potato }';
    var res = stylus(stystr)
                .use(su('./test/test.json'))
                .render();
    assert(res.match(/Amazing/));
    assert(!res.match(/\$potato/));
    done();
  });
  it('should set a referential variable', function(done) {
    var stystr = 'body { font-family: $potato }';
    var res = stylus(stystr)
                .use(su({ defs: {
                  '$superthing': 'Amazing',
                  '$potato': '$superthing'
                } }))
                .render();
    assert(res.match(/Amazing/));
    assert(!res.match(/\$potato/));
    assert(!res.match(/\$superthing/));
    done();
  });
  it('variable order should not matter', function(done) {
    var stystr = 'body { font-family: $potato }';
    var res = stylus(stystr)
                .use(su({ defs: {
                  '$potato': '$superthing',
                  '$superthing': 'Amazing'
                } }))
                .render();
    assert(res.match(/Amazing/));
    assert(!res.match(/\$potato/));
    assert(!res.match(/\$superthing/));
    done();
  });
  it('should follow complex dependencies', function(done) {
    var stystr = 'body { font-family: $potato }';
    var res = stylus(stystr)
                .use(su({ defs: {
                  '$yep': 'Amazing',
                  '$omg': '$really',
                  '$potato': '$superthing',
                  '$really': '$surelynot',
                  '$superthing': '$omg',
                  '$surelynot': '$yep'
                } }))
                .render();
    assert(res.match(/Amazing/));
    assert(!res.match(/\$potato/));
    done();
  });
  it('should utilize existing globals', function(done) {
    var stystr = 'body { font-family: $potato }';
    var res = stylus(stystr)
                .use(su({
                  defs: { '$yep': 'Amazing' }
                }))
                .use(su({ defs: {
                  '$omg': '$really',
                  '$potato': '$superthing',
                  '$really': '$surelynot',
                  '$superthing': '$omg',
                  '$surelynot': '$yep'
                } }))
                .render();
    assert(res.match(/Amazing/));
    assert(!res.match(/\$potato/));
    done();
  });
  it('should switch lighten and darken for light templates', function() {
    var stystr = 'body { color: lighten(#fff, 100%) }';
    var res = stylus(stystr)
                .use(su({ light: true, defs: {  } }))
                .render();
    assert(!res.match(/#fff/));
    assert(res.match(/#000/));
  });
});
