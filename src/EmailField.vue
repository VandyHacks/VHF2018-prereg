<template>
  <div class="email-container">
    <div class="input-wrapper">
      <input
        ref="emailInput"
        type="email"
        placeholder="Email"
        v-model="email"
        @keydown.enter="processEnter"
        :readonly="submitted" >
      <span
        class="fa"
        :class="emailIndicatorClass"/>
    </div>
  </div>
</template>

<script>
import EmailValidator from "email-validator";

export default {
  props: ["submitted"],
  data() {
    return {
      email: ""
    };
  },
  methods: {
    processEnter() {
      this.$emit("pressed:enter");
    }
  },
  computed: {
    emailIndicatorClass() {
      if (this.email.trim() === "") {
        return "icon-mail-alt";
      } else if (!EmailValidator.validate(this.email)) {
        return "icon-attention-circled";
      } else {
        return "icon-ok-circled";
      }
    }
  },
  watch: {
    email(val) {
      this.$emit("update:email", val);
    }
  },
  mounted() {
    this.$refs.emailInput.focus();
  }
};
</script>
