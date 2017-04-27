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
                return 'fa-envelope';
            } else if (!EmailValidator.validate(this.email)) {
                return 'fa-exclamation-circle';
            } else {
                return 'fa-check-circle';
            }
        },
        isEmailInputValid() {
            return this.email.trim() != '' && EmailValidator.validate(this.email);
        }
    },
    mounted() {
        setTimeout(() => this.$refs.emailInput.focus(), 750);
    }
}
</script>