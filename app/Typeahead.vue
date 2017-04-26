<template>
  <div class="typeahead-container">
    <input type="text" placeholder="Name of university" autocomplete="off" ref="uniName" v-bind:value="query" v-model="query" @keydown.down="down" @keydown.up="up" @keydown.enter="hit" @input="update" @keydown.esc="reset" @blur="reset" @focus="update" />
  
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
  }
}
</script>