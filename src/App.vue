<template>
  <transition
    name="fade"
    mode="out-in">
    <div
      class="signup"
      v-if="!statusMessage"
      key="inputs">
      <email
        :submitted="submitted"
        :email.sync="email"
        @pressed:enter="submitRegistration"/>
      <typeahead
        :submitted="submitted"
        :query.sync="university"
        @pressed:enter="submitRegistration"/>
      <input
        id="submit-btn"
        type="submit"
        :value="submitted ? 'Sending...' : 'Get Notified'"
        :class="{ submitted: submitted }"
        :disabled="!submitAllowed"
        @click="submitRegistration">
      <div class="status-message sponsor">Interested in being a sponsor? Check out our <a href="/sponsorship">sponsorship prospectus</a>!</div>
    </div>
    <div
      class="status-message"
      v-else
      key="message"
      v-html="statusMessage"
      v-cloak/>
  </transition>
</template>

<script>
import EmailField from './EmailField.vue';
import Typeahead from './Typeahead.vue';
import EmailValidator from 'email-validator';

const endpoint = '/';

export default {
  components: { typeahead: Typeahead, email: EmailField },
  data() {
    return {
      email: '',
      university: '',
      submitted: false,
      statusMessage: null
    };
  },
  computed: {
    submitAllowed() {
      return (
        this.email.trim() !== '' &&
        EmailValidator.validate(this.email) &&
        this.university.trim() !== '' &&
        this.university.length >= 8 &&
        !this.submitted
      );
    }
  },
  methods: {
    submitRegistration() {
      if (!this.submitAllowed) {
        return;
      }
      this.submitted = true;
      const params = { email: this.email, university: this.university };
      const xhr = new XMLHttpRequest();
      xhr.timeout = 3000; // 3 sec timeout
      xhr.open('POST', endpoint + 'signup', true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          try{
            this.statusMessage = JSON.parse(xhr.responseText).status;
          }
          catch(e){
            this.statusMessage = 'Oh no! An error occured. Please refresh and try again.'
          }
        }
      };
      xhr.ontimeout = function (e) {
        // XMLHttpRequest timed out. Do something here.
        this.statusMessage = 'Request timed out. Please try again.'
      };
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(params));
    }
  },
  mounted() {
    // Wake up dyno if applicable
    const xhr = new XMLHttpRequest();
    xhr.open('GET', endpoint + 'ping', true);
    xhr.send();
    // egg
    new Egg()
      .addCode(atob('dXAsdXAsZG93bixkb3duLGxlZnQscmlnaHQsbGVmdCxyaWdodCxiLGE='), () => {
        alert(atob('U3BlY2lhbCB0aGFua3MgdG8gUmF5IEJlcmdlcihnaXRodWIuY29tL1JheUJCKSBmcm9tIGhhY2tOWSE='));
      })
      .listen();
    // hint
    setTimeout(() => {
      console.log('konami...');
    }, 10000);
  }
};
</script>
<style lang="scss">
@import "css/main.scss";
</style>
