import Vue from 'vue'
import Typeahead from './Typeahead.vue'
import VueResource from 'vue-resource'

Vue.use(VueResource);
var app = new Vue({
    el: "#app",
    components: {'typeahead': Typeahead}
});
