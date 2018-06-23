<template>
  <transition name="fade" mode="out-in">
    <div class="signup" v-if="!statusMessage" key="inputs">
      <email :submitted="submitted" :email.sync="email" @pressed:enter="submitRegistration"></email>
      <typeahead :submitted="submitted" :query.sync="university" @pressed:enter="submitRegistration"></typeahead>
      <input type="submit" :value="submitted ? 'Sending...' : 'Get Notified'" :class="{ submitted: submitted }" :disabled="!submitAllowed" @click="submitRegistration">
      <div class="status-message sponsor">Interested in being a sponsor? Email <a href="mailto:sponsor@vandyhacks.org">sponsor@vandyhacks.org</a></div>
    </div>
    <div class="status-message" v-else key="message" v-html="statusMessage" v-cloak></div>
  </transition>
</template>

<script>
import EmailField from './EmailField.vue';
import Typeahead from './Typeahead.vue';
import EmailValidator from 'email-validator';

const endpoint = 'https://prereg.vandyhacks.org/';

export default {
  components: { 'typeahead': Typeahead, 'email': EmailField },
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
      return this.email.trim() !== '' && EmailValidator.validate(this.email) &&
        this.university.trim() !== '' && this.university.length >= 8 &&
        !this.submitted;
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
      xhr.open('POST', endpoint + 'signup', true);
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
    // Wake up dyno if applicable
    const xhr = new XMLHttpRequest();
    xhr.open('GET', endpoint + 'ping', true);
    xhr.send();
  }
};
</script>
<style lang="scss">
   @import 'css/main.scss'
</style>

