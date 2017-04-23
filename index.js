const path = require('path');
const express = require('express');
const fs = require('fs');
const TrieSearch = require('trie-search');
const fuzzysearch = require('fuzzysearch');
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
fs.writeFileSync('universities.addr.json', JSON.stringify(universities));
const maxResults = 5;


const ts = new TrieSearch('name', { 'min': 3, 'splitOnRegEx': false });
universities.forEach(ts.add.bind(ts));

/*
app.get('/findunis', (req, res) => res.json(ts.get(req.query.q).slice(0, 15)));
*/

app.get('/findunis', (req, res) => {
  console.time('findunis');
  var query = req.query.q.toLowerCase();
  if (query.length < 3) {
    res.json([]);
  } else {
    var results = ts.get(query).slice(0, maxResults);
    for (var i = 0; i < universities.length && results.length < maxResults; i++) { // Still the fastest after benchmarks
      var uni = universities[i];
      if (fuzzysearch(query, uni.name.toLowerCase())) {
        if (!results.includes(uni)) {
          results.push(uni);
        }
      }
    }
    res.json(results);
  }
  console.timeEnd('findunis');
});

const server = app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});