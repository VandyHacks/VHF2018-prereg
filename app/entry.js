import Vue from 'vue';
import Signup from './Signup.vue';

setTimeout(() => {
  // Workaround Chrome animated GIF bug
  const logoEl = document.getElementById('logo');
  const imageUrl = logoEl.src;
  logoEl.src = '#';
  logoEl.src = imageUrl;
  // Opacity and scale (workaround Safari initial load no animation)
  document.body.className = 'loaded';
}, 50);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { signup: Signup }
});
