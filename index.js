const path = require('path');
const express = require('express');
const fs = require('fs');
const compression = require('compression')
const compressible = require('compressible');

// maybe delete
var request = require('superagent');
var bodyParser = require('body-parser');

const app = express();
app.use(compression({ filter: shouldCompress }));

// added later
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


var mailchimpInstance   = 'us9',
    listUniqueId        = '5a2fc7077d',
    mailchimpApiKey     = '2c364b1b877fda458de3b00f5410b3a3-us9';

app.post('/signup', function (req, res) {
    request
        .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
        .send({
          'email_address': "anotheremail@gmail.com",
          'status': 'subscribed',
          'merge_fields': {
            'FNAME': "first_name",
            'LNAME': "last_name"
          }
        })
            .end(function(err, response) {
              if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
                res.send('Signed Up!');
              } else if(response.status === 400) {
                res.send("400");
              } else if(response.status === 401) {
                res.send("401");
              } else if(response.status == 404){
                res.send("404");
              } else {
                res.send(response.status);
              }
            });
});

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
