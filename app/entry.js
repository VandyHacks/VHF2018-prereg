import Vue from 'vue';
import EmailField from './EmailField.vue';
import Typeahead from './Typeahead.vue';
import EmailValidator from 'email-validator';

const preregEndpoint = '';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { 'typeahead': Typeahead, 'email': EmailField },
  data: {
    email: '',
    university: '',
    submitted: false,
    statusMessage: null
  },
  computed: {
    areInputsValid() {
      return this.email.trim() !== '' && EmailValidator.validate(this.email) &&
        this.university.trim() !== '' && this.university.length >= 8;
    }
  },
  methods: {
    submitRegistration() {
      if (!this.areInputsValid || this.submitted) {
        return;
      }
      this.submitted = true;
      const params = { email: this.email, university: this.university };
      const xhr = new XMLHttpRequest();
      xhr.open('POST', preregEndpoint + '/signup', true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          this.statusMessage = JSON.parse(xhr.responseText).status;
        }
      };
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(params));
    }
  },
  mounted() {
    // Workaround Chrome animated GIF bug
    const logoEl = document.getElementById('logo');
    const imageUrl = logoEl.src;
    logoEl.src = '#';
    logoEl.src = imageUrl;
    // Opacity and scale (workaround Safari initial load no animation)
    setTimeout(() => { document.body.className = 'loaded'; }, 50);
    // Wake up dyno if applicable
    const xhr = new XMLHttpRequest();
    xhr.open('GET', preregEndpoint + '/ping', true);
    xhr.send();
  }
});
