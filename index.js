const path = require('path');
const express = require('express');
const fs = require('fs');
const compression = require('compression')
const compressible = require('compressible');

const app = express();
app.use(compression({ filter: shouldCompress }));

function shouldCompress (req, res) {
  var type = res.getHeader('Content-Type')
  // compressible doesn't think GIF should be compressed, which is wrong
  if (type === undefined || (type != 'image/gif' && !compressible(type))) {
    return false;
  }
  return true;
}

app.set('port', (process.env.PORT || 5000));

app.use(express.static('public'));

const server = app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});