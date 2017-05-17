import Vue from 'vue'
import EmailField from './EmailField.vue'
import Typeahead from './Typeahead.vue'
// import VueResource from 'vue-resource'
// Vue.use(VueResource);

setTimeout(() => {
  // Workaround Chrome animated GIF bug
  var logoEl = document.getElementById('logo');
  var imageUrl = logoEl.src;
  logoEl.src = '#';
  logoEl.src = imageUrl;
  // Opacity and scale
  var appEl = document.getElementById('app');
  appEl.style.opacity = '1';
  appEl.style.transform = 'scale(1)';
  document.getElementById("date").className += " lines";
}, 5);

var app = new Vue({
  el: "#app",
  components: { 'typeahead': Typeahead, 'email': EmailField },
  data: {
    isMounted: false,
    submitted: false,
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
      this.submitted = true;
      var params = { email: this.$refs.emailField.email, university: this.$refs.universityAutofill.query };
      var xhr = new XMLHttpRequest();
      xhr.open("POST", '/signup', true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          this.statusMessage = JSON.parse(xhr.responseText).status;
        }
      }
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(params));
    }
  }
});
