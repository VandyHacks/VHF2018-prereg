import Vue from 'vue';
import EmailField from './EmailField.vue';
import Typeahead from './Typeahead.vue';
// import VueResource from 'vue-resource'
// Vue.use(VueResource);

setTimeout(() => {
  // Workaround Chrome animated GIF bug
  const logoEl = document.getElementById('logo');
  const imageUrl = logoEl.src;
  logoEl.src = '#';
  logoEl.src = imageUrl;
  // Opacity and scale
  const appEl = document.getElementById('app');
  appEl.style.opacity = '1';
  appEl.style.transform = 'scale(1)';
  document.getElementById('date').className += ' lines';
  document.body.className = 'loaded';
}, 5);

const app = new Vue({
  el: '#app',
  components: { 'typeahead': Typeahead, 'email': EmailField },
  data: {
    isMounted: false,
    isSubmitted: false,
    statusMessage: null
  },
  mounted() {
    this.isMounted = true;
  },
  computed: {
    areInputsValid() {
      return this.isMounted &&
        this.$refs.emailField.isEmailInputValid && this.$refs.universityAutofill.isUniversityInputValid;
    }
  },
  methods: {
    registerEmail() {
      if (this.$refs.universityAutofill.shouldDisplayMenu()) {
        return;
      }
      this.isSubmitted = true;
      const params = { email: this.$refs.emailField.email, university: this.$refs.universityAutofill.query };
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
  }
});
