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

  it("collection", function() {
    let opts = { collection: 'foo' };
    let query = access.buildQuery(opts);
    assert.isOk(query.whereClause.query.queries[0]['collection-query']);
    assert.isNotOk(query.whereClause.query.queries[0]['term-query']);
  });

  it("query text", function() {
    let opts = { qtext: 'bar' };
    let query = access.buildQuery(opts);
    assert.isNotOk(query.whereClause.query.queries[0]['collection-query']);
    assert.isOk(query.whereClause.query.queries[0]['term-query']);
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

});
