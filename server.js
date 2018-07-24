const express = require('express');
const compression = require('compression');
const compressible = require('compressible');
const request = require('superagent');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const Raven = require('raven');
const validator = require('validator')

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// api var initialize
const mailchimpInstance = process.env.MC_INSTANCE_ID;
const listUniqueId = process.env.MC_LIST_ID;
const mailchimpApiKey = process.env.MC_API_KEY;

if(!mailchimpApiKey || !mailchimpInstance || !listUniqueId){
  console.warn('Mailchimp not configured properly.');
}
const sentryURL = process.env.SENTRY_URL
if(!sentryURL){
  console.warn('Sentry not configured.')
}
else{
  Raven.config(sentryURL).install();
  Raven.captureMessage('Sentry started.')
  console.log('Sentry configured.')
}

function handleError(err){
  console.error(err);
  if(Raven){
    Raven.captureException(err);
  }
}

app.get('/ping', (req, res) => res.sendStatus(200));
app.use('/sponsorship', express.static(__dirname + '/sponsorship.pdf'));

app.post('/signup', (req, res) => {
  // sanitize all user input
  let email = validator.escape(String(req.body.email));
  const univ = validator.escape(String(req.body.university));
  if (!email 
    || !validator.isAscii(email)
    || !validator.isEmail(email)) {
    res.json({ status: 'Invalid email.' });
    return;
  }
  email = validator.normalizeEmail(email);
  if (!univ
    || !validator.isAscii(univ)
    || univ.length < 8){
    res.json({ status: 'Invalid university.' });
    return;
  }
  console.log('Registering ' + email + ' attending ' + univ);
  request
    .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
    .set('Content-Type', 'application/json;charset=utf-8')
    .set('Authorization', 'Basic ' + Buffer.from('any:' + mailchimpApiKey).toString('base64'))
    .send({
      'email_address': email,
      'status': 'pending',
      'merge_fields': {
        'UNIVERSITY': univ,
        'USERAGENT': req.headers['user-agent'].trim()
      }
    })
    .end((err, response) => {
      if (!response) {
        res.json({ status: 'An unknown error occurred. Please contact info@vandyhacks.org.' });
        if (err) handleError(err);
      } else if (response.status < 300) {
        res.json({ status: 'Thank you for pre-registering! Please check your inbox for a confirmation email.' });
      } else if (response.status === 400 && response.body.title === 'Member Exists') {
        res.json({ status: 'You have already pre-registered!' });
      } else if (response.status === 400 && response.body.title === 'Invalid Resource') {
        console.error('Error: ' + JSON.parse(response.res.text).errors)
        handleError(err)
        res.json({ status: 'Invalid user input. Please refresh and try again.' });
      } else {
        res.json({ status: 'An unknown error occurred. Please contact info@vandyhacks.org.' });
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
  console.log('Express app is running on port', app.get('port'));
});