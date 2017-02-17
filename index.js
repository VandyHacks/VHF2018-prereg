const path = require('path');
const express = require('express');

const app = express();
app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const server = app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});