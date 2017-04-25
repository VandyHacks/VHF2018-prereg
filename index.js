const path = require('path');
const express = require('express');
const fs = require('fs');
const createTrie = require('autosuggest-trie');
const expressStaticGzip = require("express-static-gzip");

const app = express();
app.set('port', (process.env.PORT || 5000));

app.use(expressStaticGzip(path.join(__dirname, 'public'), {
	useBrotli: true,
	indexFromEmptyFile: false
}));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const universities = JSON.parse(fs.readFileSync('universities.json'))
  .map(uni => {
    return { name: uni.name, addr: uni.city + ', ' + uni.state };
  });
// fs.writeFileSync('universities.addr.json', JSON.stringify(universities));

const trie = createTrie(universities, 'name');

app.get('/findunis', (req, res) => {
  var query = req.query.q;
  res.json(trie.getMatches(query, { limit: 5 }));
});

const server = app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});