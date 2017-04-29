const path = require('path');
const express = require('express');
const fs = require('fs');
const createTrie = require('autosuggest-trie');
const expressStaticGzip = require("express-static-gzip");

const app = express();
app.set('port', (process.env.PORT || 5000));

app.use(expressStaticGzip(path.join(__dirname, 'public'), {
	useBrotli: true
}));

const server = app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});