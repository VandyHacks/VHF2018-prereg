const path = require('path');
const express = require('express');
const fs = require('fs');
const compression = require('compression')
const compressible = require('compressible');

var request = require('superagent');
var bodyParser = require('body-parser');

var EmailValidator = require('email-validator');
var MailgunValidator = require('mailgun-validate');

require('dotenv').config();

const app = express();
app.use(compression({ filter: shouldCompress }));

app.use(bodyParser.json());

// api var initialize
var mailchimpInstance = process.env.MC_INSTANCE_ID,
  listUniqueId = process.env.MC_LIST_ID,
  mailchimpApiKey = process.env.MC_API_KEY;

var mailgunValidator = new MailgunValidator(process.env.MG_PUBLIC_KEY);

app.post('/signup', (req, res) => {
  if (!EmailValidator.validate(req.body.email) || req.body.university.length < 8) {
    res.json({ status: 'The submitted email or university was invalid.' });
    return;
  }

  mailgunValidator.validate(req.body.email, (err, result) => {
    if (err || !result.is_valid) {
      res.json({ status: 'The submitted email was invalid. Please refresh and try again.' });
    } else {
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
            res.json({ status: 'Thank you for pre-registering! We will announce more details shortly.' });
          } else if (response.status === 400 && response.body.title === 'Member Exists') {
            res.json({ status: 'You have already pre-registered!' });
          } else if (response.status === 400 && response.body.title === 'Invalid Resource') {
            res.json({ status: 'That email address doesn\'t look real. Please refresh and try again.' });
          } else {
            // console.log(response);
            res.json({ status: 'An unknown error occurred. Please refresh and try again.' });
          }
        });
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
