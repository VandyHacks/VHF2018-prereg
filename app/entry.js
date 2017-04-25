import Vue from 'vue'
import Typeahead from './Typeahead.vue'
import VueResource from 'vue-resource'
import * as EmailValidator from 'email-validator'

Vue.use(VueResource);
var app = new Vue({
    el: "#app",
    components: { 'typeahead': Typeahead }
});

// This should be replaced with vue-validate
window.registerEmail = () => {
    var email = document.getElementById('user_email').value;

    // check email entered
    if (email.length === 0) {
        alert("Enter email");
        return;
    }

    if (!EmailValidator.validate(email)) {
        alert("Enter valid email");
        return;
    }

    // send to mailchimp and forward to confirmation page
}