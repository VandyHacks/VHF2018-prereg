import Vue from 'vue'
import Typeahead from './Typeahead.vue'
import VueResource from 'vue-resource'
import * as EmailValidator from 'email-validator'

setTimeout(() => {
        var logoEl = document.getElementById('logo');
        logoEl.style.opacity = '1';
        var imageUrl = logoEl.src;
        logoEl.src = '#';
        logoEl.src = imageUrl;
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
        }
    }
});