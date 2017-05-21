<template>
  <div class="email-container">
    <div class="input-wrapper">
      <input ref="emailInput" type="email" placeholder="Email Address" v-model="email">
      <span class="fa" :class="emailIndicatorClass"></span>
    </div>
  </div>
</template>

<script>
import EmailValidator from 'email-validator'

export default {
  data() {
    return {
      email: ''
    };
  },
  computed: {
    emailIndicatorClass() {
      if (this.email.trim() === '') {
        return 'icon-mail-alt';
      } else if (!EmailValidator.validate(this.email)) {
        return 'icon-attention-circled';
      } else {
        return 'icon-ok-circled';
      }
    }
  },
  watch: {
    email(val, oldVal) {
      this.$emit('update:email', val);
    }
  },
  mounted() {
    this.$refs.emailInput.focus();
  }
};
</script>
