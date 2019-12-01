const express = require('express');
const cors = require('cors');
const marklogic = require('marklogic');
const access = require('./lib/access');
const config = require('./config');

const app = express();
app.use(cors());
app.use(express.json())

const db = marklogic.createDatabaseClient(config.client);

app.get('/search', (req, res) => {
	let query = access.buildQuery({
	  qtext: req.query.qtext,
	  collection: req.query.collection,
	  facet: req.query.facet,
	  pageStart: req.query.pageStart,
	  pageLength: req.query.pageLength,
	  category: req.query.category
	});
	db.documents.query(query).result(response => {
	    res.send(response);
	  }, error => {
	    console.log(JSON.stringify(error, null, 2));
	  }
	);
})

app.post('/search', (req, res) => {
	let query = access.buildQuery({
	  qtext: req.body.qtext,
	  collection: req.body.collection,
	  facet: req.body.facet,
	  range: req.body.range,
	  pageStart: req.body.pageStart,
	  pageLength: req.body.pageLength,
	  category: req.body.category
	});
	db.documents.query(query).result(response => {
	    res.send(response);
	  }, error => {
	    console.log(JSON.stringify(error, null, 2));
	  }
	);
})

app.get('/entities', (req, res) => {
	let query = access.buildQuery({
	  collection: 'http://marklogic.com/entity-services/models'
	});
	db.documents.query(query).result(response => {
	    res.send(response);
	  }, error => {
	    console.log(JSON.stringify(error, null, 2));
	  }
	);
})

app.get('/facets', (req, res) => {
	let query = access.buildQuery({
	  qtext: req.query.qtext,
	  collection: req.query.collection,
	  facet: req.query.facet,
	  category: 'none'
	});
	db.documents.query(query).result(response => {
	    res.send(response);
	  }, error => {
	    console.log(JSON.stringify(error, null, 2));
	  }
	);
})


app.get('/documents', (req, res) => {
	db.documents.read(req.query.uri).result(response => {
	    res.send(response);
	  }, error => {
	    console.log(JSON.stringify(error, null, 2));
	  }
	);
})

app.listen(
	config.server.port, 
	() => console.log(`Server listening on port: ${config.server.port}`)
)