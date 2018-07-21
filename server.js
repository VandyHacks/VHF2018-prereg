const express = require('express');
const compression = require('compression');
const compressible = require('compressible');

const request = require('superagent');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const EmailValidator = require('email-validator');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// api var initialize
const mailchimpInstance = process.env.MC_INSTANCE_ID;
const listUniqueId = process.env.MC_LIST_ID;
const mailchimpApiKey = process.env.MC_API_KEY;

if(!mailchimpApiKey || !mailchimpInstance || !listUniqueId){
  console.warn('Mailchimp is not configured properly.');
}

app.get('/ping', (req, res) => res.sendStatus(200));

app.use('/sponsorship', express.static(__dirname + '/sponsorship.pdf'));

app.post('/signup', (req, res) => {
  if (!req.body.email || !req.body.university || !EmailValidator.validate(req.body.email) || req.body.university.length < 8) {
    res.json({ status: 'The submitted email or university was invalid.' });
    return;
  }
  console.log('Registering ' + req.body.email + ' attending ' + req.body.university);
  request
    .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
    .set('Content-Type', 'application/json;charset=utf-8')
    .set('Authorization', 'Basic ' + Buffer.from('any:' + mailchimpApiKey).toString('base64'))
    .send({
      'email_address': req.body.email,
      'status': 'pending',
      'merge_fields': {
        'UNIVERSITY': req.body.university,
        'USERAGENT': req.headers['user-agent'].trim()
      }
    })
    .end((err, response) => {
      if (!response) {
        if (err) console.log(err);
        res.json({ status: 'An unknown error occurred. Please refresh and try again.' });
      } else if (response.status < 300) {
        res.json({ status: 'Thank you for pre-registering! Please check your inbox for a confirmation email.' });
      } else if (response.status === 400 && response.body.title === 'Member Exists') {
        res.json({ status: 'You have already pre-registered!' });
      } else if (response.status === 400 && response.body.title === 'Invalid Resource') {
        res.json({ status: 'That email address doesn\'t look real. Please refresh and try again.' });
      } else {
        if (err) console.log(err);
        res.json({ status: 'An unknown error occurred. Please refresh and try again.' });
      }
    });
});

const deployMode = process.argv[2];
if (!deployMode || deployMode !== 'prod') {
  app.use(compression({
    filter: (req, res) => {
      const type = res.getHeader('Content-Type');
      // compressible doesn't think GIF should be compressed, which is wrong
      if (type === undefined || (type !== 'image/gif' && !compressible(type))) {
        return false;
      }
      return true;
    }
  }));
  /* actually serves static files */
  app.use(express.static('dist'));
} else {
  app.get('/', (req, res) => {
    res.redirect('https://vandyhacks.org');
  });
}

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
