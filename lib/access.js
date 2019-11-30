const marklogic = require('marklogic');
const config = require('../config');

const qb = marklogic.queryBuilder;

/**
 * Creates a BuiltQuery object for the MarkLogic Node.js Client API.
 * @see https://docs.marklogic.com/jsdoc/queryBuilder.BuiltQuery.html
 * @method buildQuery
 * @param {Object} opts Options for the query
 * @param {number} opts.qtext Query text by which to constrain the search
 * @param {string|array} opts.collection Collection(s) by which to constrain the search
 * @param {string|array} opts.facet Facet(s) to return with the search results
 * @param {number} opts.pageStart Zero-based position within the result set of the first document
 * @param {number} opts.pagelength Number of documents in the returned page of result documents
 * @param {string|array} opts.category Categories of information to retrieve for the result documents
 * @returns {BuiltQuery} Built query
 */
function buildQuery(opts) {
	let qbArr = [], query;

	// Query constraints
	if (opts.qtext) {
		qbArr.push(qb.term(opts.qtext));
	}
	if (opts.collection) {
		qbArr.push(qb.collection(opts.collection));
	}
	query = qb.where.apply(this, qbArr)

	// Facets
	if (opts.facet) {
		opts.facet = !Array.isArray(opts.facet) ? [opts.facet] : opts.facet;
		let facetArr = opts.facet.map(f => {
			return qb.facet(f, f);
		})
		query = query.calculate(facetArr);
	}

	// Page settings
	let pageStart = (opts.pageStart) ? parseInt(opts.pageStart) : config.search.pageStart;
	let pageLength = (opts.pageLength) ? parseInt(opts.pageLength) : config.search.pageLength;
	query = query.slice(pageStart, pageLength);

	// Categories
	if (opts.category) {
		query = query.withOptions({
			categories: opts.category
		});
	}

	return query;

}

module.exports = {
    buildQuery:  buildQuery
};