const chai = require('chai'),
      access = require('../lib/access'),
      config = require('../config');

const assert = chai.assert;

describe("built query", function() {

  let num = 999;

  it("no options", function() {
    let opts = {};
    let query = access.buildQuery(opts);
    assert.equal(query.queryType, 'structured');
    assert.equal(query.queryFormat, 'json');
  });

  it("query text", function() {
    let opts = { qtext: 'foo' };
    let query = access.buildQuery(opts);
    assert.isOk(query.whereClause.query.queries[0]['term-query']);
  });

  it("collection", function() {
    let opts = { collection: 'bar' };
    let query = access.buildQuery(opts);
    assert.isOk(query.whereClause.query.queries[0]['collection-query']);
  });

  it("facet", function() {
    let opts = { facet: 'baz' };
    let query = access.buildQuery(opts);
    assert.isOk(query.calculateClause.constraint);
  });

  it("page start", function() {
    let opts = { pageStart: num };
    let query = access.buildQuery(opts);
    assert.equal(query.sliceClause['page-start'], num+1);
  });

  it("page length", function() {
    let opts = { pageLength: num };
    let query = access.buildQuery(opts);
    assert.equal(query.sliceClause['page-length'], num);
  });

  it("category", function() {
    let opts = { category: 'boo' };
    let query = access.buildQuery(opts);
    assert.isOk(query.withOptionsClause.categories);
  });

});
