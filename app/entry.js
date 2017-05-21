import Vue from 'vue';
import Signup from './Signup.vue';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { signup: Signup },
  data: {
    endpoint: ''
  },
  mounted() {
    // Workaround Chrome animated GIF bug
    const logoEl = document.getElementById('logo');
    const imageUrl = logoEl.src;
    logoEl.src = '#';
    logoEl.src = imageUrl;
    // Opacity and scale (workaround Safari initial load no animation)
    setTimeout(() => { document.body.className = 'loaded'; }, 50);
    // Wake up dyno if applicable
    const xhr = new XMLHttpRequest();
    xhr.open('GET', this.endpoint + '/ping', true);
    xhr.send();
  }
});
