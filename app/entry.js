import Vue from 'vue'
import Typeahead from './Typeahead.vue'
import VueResource from 'vue-resource'
import * as EmailValidator from 'email-validator'

// Chrome doesn't handle single-loop GIFS properly, 
// so opacity needs to be set on element
setTimeout(() => {
        var logoEl = document.getElementById('logo');
        logoEl.style.opacity = '1';
        var imageUrl = logoEl.src;
        logoEl.src = '#';
        logoEl.src = imageUrl;
        document.getElementById('signup').style.opacity = '1';
        document.getElementById('app').style.transform = 'scale(1)';
    }, 5);

Vue.use(VueResource);

var app = new Vue({
    el: "#app",
    components: { 'typeahead': Typeahead },
    data: {
        email: ''
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
        },
        areInputsValid() {
            return this.isEmailInputValid && this.$refs.universityAutofill.isUniversityInputValid;
        }
    }
});