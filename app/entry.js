import Vue from 'vue'
import EmailField from './EmailField.vue'
import Typeahead from './Typeahead.vue'
// import VueResource from 'vue-resource'
// Vue.use(VueResource);

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

var app = new Vue({
    el: "#app",
    components: { 'typeahead': Typeahead, 'email': EmailField },
    data: {
        isMounted: false
    },
    mounted() {
        this.isMounted = true;
    },
    computed: {
        areInputsValid() {
            return this.isMounted &&
                this.$refs.emailField.isEmailInputValid && this.$refs.universityAutofill.isUniversityInputValid;
        }
    },
    methods: {
        registerEmail() {
            console.log('registerEmail called...');
        }
    }
});
