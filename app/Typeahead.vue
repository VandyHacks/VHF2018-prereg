<template>
  <div class="typeahead-container">
    <div class="input-wrapper">
      <input type="text" placeholder="University Name" autocomplete="off" ref="uniName" v-bind:value="query" v-model="query" @keydown.down="down" @keydown.up="up" @keydown.tab="hit" @keydown.enter="hit" @input="update" @keydown.esc="reset" @blur="reset" @focus="update" />
      <span class="fa" v-bind:class="typeaheadIndicatorClass"></span>
    </div>
    <div class="uni-list-container">
      <ul v-show="hasItems && isInputFocused()">
        <li v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
          <span v-text="item.name"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import VueTypeahead from 'vue-typeahead'
import createTrie from 'autosuggest-trie'

const replaceAll = require('replaceall');
const universities = require('./universities.json')
  .map(uni => {
    return { name: uni.name, nameIndex: replaceAll('-', ' ', uni.name), addr: uni.city + ', ' + uni.state };
  });
console.log('Universities loaded: ' + universities.length);
const trie = createTrie(universities, 'nameIndex');

export default {
  extends: VueTypeahead,
  data: () => ({
    src: '/findunis',
    selected: ''
  }),
  methods: {
    // The callback function which is triggered when the user hits on an item
    // (required)
    onHit(item) {
      this.reset();
      this.query = item.name;
    },
    reset() {
      this.items = [];
      this.loading = false;
    },
    isInputFocused() {
      return document.activeElement == this.$refs.uniName;
    },
    fetch() {
      var results;
      if (this.query.trim() == '') {
        results = [];
      } else {
        results = trie.getMatches(this.query, { limit: 5 });
      }
      return Promise.resolve({ data: results });
    }
  },
  computed: {
    typeaheadIndicatorClass() {
      if (this.query.trim() == '') {
        return ['fa-graduation-cap'];
      } /* else if (this.query.length < 10) {
        return ['fa-exclamation-circle'];
      } */ else {
        return ['fa-check-circle'];
      }
    },
    isUniversityInputValid() {
      return this.query.trim() != '';
    }
  }
}
</script>