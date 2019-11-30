const marklogic = require('marklogic');
const config = require('../config');

const qb = marklogic.queryBuilder;

/**
 * Creates a BuiltQuery object for the MarkLogic Node.js Client API.
 * @see https://docs.marklogic.com/jsdoc/queryBuilder.BuiltQuery.html
 * @method buildQuery
 * @param {Object} opts Options for the query
 * @param {string|array} opts.collection Collection(s) by which to constrain the search
 * @param {number} opts.qtext Query text by which to constrain the search
 * @param {number} opts.pageStart Zero-based position within the result set of the first document
 * @param {number} opts.pagelength Number of documents in the returned page of result documents
 */
function buildQuery(opts) {
	let qbArr = [];
	if (opts.collection) {
		qbArr.push(qb.collection(opts.collection));
	}
	if (opts.qtext) {
		qbArr.push(qb.term(opts.qtext));
	}
	let pageStart = (opts.pageStart) ? parseInt(opts.pageStart) : config.search.pageStart;
	let pageLength = (opts.pageLength) ? parseInt(opts.pageLength) : config.search.pageLength;
	let query = qb.where.apply(this, qbArr).slice(pageStart, pageLength);
	return query;
}

module.exports = {
    buildQuery:  buildQuery
};