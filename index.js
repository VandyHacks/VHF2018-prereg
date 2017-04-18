const path = require('path');
const express = require('express');
const fs = require('fs');
const TrieSearch = require('trie-search');

const app = express();
app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

var universities = JSON.parse(fs.readFileSync('universities.json'));
var ts = new TrieSearch('name', {'min': 3, 'splitOnRegEx': false});
universities.forEach(ts.add.bind(ts));

app.get('/findunis', (req, res) => res.json(ts.get(req.query.q).slice(0, 15)));

const server = app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});