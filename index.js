const path = require('path');
const express = require('express');
const fs = require('fs');
const compression = require('compression')
const compressible = require('compressible');

var request = require('superagent');
var bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
app.use(compression({ filter: shouldCompress }));

app.use(bodyParser.json());

// api var initialize
var mailchimpInstance = process.env.MC_INSTANCE_ID,
  listUniqueId = process.env.MC_LIST_ID,
  mailchimpApiKey = process.env.MC_API_KEY;

app.post('/signup', (req, res) => {
  console.log('Registering ' + req.body.email + ' attending ' + req.body.university);

  request
    .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
    .set('Content-Type', 'application/json;charset=utf-8')
    .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey).toString('base64'))
    .send({
      'email_address': req.body.email,
      'status': 'subscribed',
      'merge_fields': {
        'UNIVERSITY': req.body.university
      }
    })
    .end((err, response) => {
      if (response.status < 300) {
        res.json({ status: 'Thank you for pre-registering! Will send more information soon!' });
      } else if (response.status === 400 && response.body.title === 'Member Exists') {
        res.json({ status: 'You have already pre-registered!' });
      } else {
        res.json({ status: 'Error in your registration ): Please try again or contact the organizers!' });
      }
    });
});

function shouldCompress(req, res) {
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
