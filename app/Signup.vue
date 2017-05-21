<template>
  <transition name="fade" mode="out-in">
    <div id="signup" class="signup" v-if="!statusMessage" key="inputs">
      <email :submitted="submitted" :email.sync="email" @pressed:enter="submitRegistration"></email>
      <typeahead :submitted="submitted" :query.sync="university" @pressed:enter="submitRegistration"></typeahead>
      <input type="submit" :value="submitted ? 'Sending...' : 'Get Notified'" :class="{ submitted: submitted }" :disabled="!areInputsValid || submitted" @click="submitRegistration">
    </div>
    <div class="status-message" v-else key="message" v-html="statusMessage" v-cloak></div>
  </transition>
</template>

<script>
import EmailField from './EmailField.vue';
import Typeahead from './Typeahead.vue';
import EmailValidator from 'email-validator';

export default {
  props: ['endpoint'],
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
      xhr.open('POST', this.endpoint + '/signup', true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          this.statusMessage = JSON.parse(xhr.responseText).status;
        }
      };
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(params));
    }
  }
};
</script>
