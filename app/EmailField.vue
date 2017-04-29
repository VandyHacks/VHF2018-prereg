<template>
    <div class="email-container">
        <div class="input-wrapper">
            <input ref="emailInput" type="text" placeholder="Email Address" v-model="email">
            <span class="fa" :class="emailIndicatorClass"></span>
        </div>
    </div>
</template>

<script>
import * as EmailValidator from 'email-validator'

export default {
    data() {
        return {
            email: ''
        }
    },
    computed: {
        emailIndicatorClass() {
            if (this.email.trim() == '') {
                return 'icon-envelope';
            } else if (!EmailValidator.validate(this.email)) {
                return 'icon-exclamation-circle';
            } else {
                return 'icon-check-circle';
            }
        },
        isEmailInputValid() {
            return this.email.trim() != '' && EmailValidator.validate(this.email);
        }
    },
    mounted() {
        this.$refs.emailInput.focus();
    }
}
</script>