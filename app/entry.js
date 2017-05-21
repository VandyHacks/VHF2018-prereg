import Vue from 'vue';
import EmailField from './EmailField.vue';
import Typeahead from './Typeahead.vue';
import EmailValidator from 'email-validator';

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
    setEmail(val) {
      this.email = val;
    },
    setUniversity(val) {
      this.university = val;
    },
    submitRegistration() {
      if (!this.areInputsValid) {
        return;
      }
      this.submitted = true;
      const params = { email: this.email, university: this.university };
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/signup', true);
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
    // Opacity and scale
    document.body.className = 'loaded';
  }
});
