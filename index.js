const express = require('express');
const graphql = require('express-graph.ql');

const Schema = require('./schema');

const app = express();

app.post('/query', graphql(Schema));

app.listen(3000, () => {
  console.log('listening on port 3000');
});
