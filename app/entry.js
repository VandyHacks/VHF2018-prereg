import Vue from 'vue';
import App from './App.vue';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // Explanation: https://github.com/vuejs-templates/webpack-simple/issues/29
  render: h => h(App)
});

setTimeout(() => {
  // Workaround Chrome animated GIF bug
  const logoEl = document.getElementById('logo');
  const imageUrl = logoEl.src;
  logoEl.src = '#';
  logoEl.src = imageUrl;
  // Opacity and scale (workaround Safari initial load no animation)
  document.body.className = 'loaded';
}, 50);
