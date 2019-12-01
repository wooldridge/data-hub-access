const marklogic = require('marklogic');
const config = require('../config');

const qb = marklogic.queryBuilder;

/**
 * Creates a bucketed facet object for a BuiltQuery.
 * @method buildBucketed
 * @param {Object} opts Options for the bucket facet
 * @param {string} opts.name Name of the bucketed facet
 * @param {array} opts.buckets Objects defining each bucket
 * @param {string} opts.buckets.name Name of the bucket
 * @param {number} opts.buckets.lower Lower bound of the bucket
 * @param {string} opts.buckets.comparison Comparison operator
 * @param {number} opts.buckets.upper Upper bound of the bucket
 * @returns {Facet} Bucketed facet
 */
function buildBucketed(opts) {
	let bucketArr = opts.buckets.map(b => {
		let args = [];
		if (b.name) {
			args.push(b.name);
		}
		if (b.lower) {
			args.push(b.lower);
		}
		if (b.comparison) {
			args.push(b.comparison);
		}
		if (b.upper) {
			args.push(b.upper);
		}
		return qb.bucket.apply(this, args);
	})
	bucketArr.unshift(opts.name);
	return qb.facet.apply(this, bucketArr);
}

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
		let facetArr = [];
		opts.facet = !Array.isArray(opts.facet) ? [opts.facet] : opts.facet;
		opts.facet.forEach(f => {
			if (typeof f === 'object') {
				let bucketedFacet = buildBucketed(f);
				facetArr.push(bucketedFacet)
			} else {
				facetArr.push(qb.facet(f))
			}
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
    buildBucketed: buildBucketed,
    buildQuery:  buildQuery
};