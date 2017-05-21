<template>
  <div class="typeahead-container">
    <div class="input-wrapper">
      <input type="text" placeholder="University Name" autocomplete="off" ref="uniName" v-bind:value="query" v-model="query" @keydown.down="down" @keydown.up="up" @keydown.tab="hit" @keydown.enter="hit" @input="update" @keydown.esc="reset" @blur="reset" @focus="update" />
      <span class="fa" v-bind:class="typeaheadIndicatorClass"></span>
    </div>
    <div class="uni-list-container">
      <div class="list-wrapper" v-show="shouldDisplayMenu()">
        <div class="caret"></div>
        <ul>
          <li v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
            <span v-text="item.name"></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import VueTypeahead from 'vue-typeahead';
import createTrie from 'autosuggest-trie';

const universities = require('./universities.json')
  .map(uni => ({ name: uni }));
// console.log('Universities loaded: ' + universities.length);
const splitByHyphen = /\s+|-/;
const trie = createTrie(universities, 'name', { splitRegex: splitByHyphen });

export default {
  extends: VueTypeahead,
  data() {
    return {
      src: '/findunis',
      selected: ''
    };
  },
  methods: {
    // The callback function which is triggered when the user hits on an item
    // (required)
    onHit(item) {
      this.reset();
      if (item) {
        this.query = item.name;
      }
    },
    reset() {
      this.items = [];
      this.loading = false;
    },
    isInputFocused() {
      return document.activeElement === this.$refs.uniName;
    },
    shouldDisplayMenu() {
      return this.hasItems && this.isInputFocused();
    },
    fetch() {
      let results;
      const trimmedQuery = this.query.trim();
      if (trimmedQuery === '') {
        results = [];
      } else {
        results = trie.getMatches(trimmedQuery, { limit: 15, splitRegex: splitByHyphen });
        const ranks = {};
        const normalizedQuery = trimmedQuery.split(splitByHyphen).join(' ').toLowerCase();
        for (const result of results) {
          const normalizedResult = result.name.split(splitByHyphen).join(' ').toLowerCase();
          if (normalizedResult.startsWith(normalizedQuery)) {
            ranks[result.name] = 2;
          } else if (normalizedResult.includes(normalizedQuery)) {
            ranks[result.name] = 1;
          } else {
            ranks[result.name] = 0;
          }
        }
        results = Object.keys(ranks)
        .sort((a, b) => ranks[b] - ranks[a]).slice(0, 5)
        .map(result => ({ name: result }));
        if (results.length == 1 && results[0].name === trimmedQuery) {
          results = [];
        }
      }
      return Promise.resolve({ data: results });
    }
  },
  computed: {
    typeaheadIndicatorClass() {
      if (this.query.trim() === '') {
        return ['icon-graduation-cap'];
      } else if (this.query.length < 8) {
        return ['icon-attention-circled'];
      } else {
        return ['icon-ok-circled'];
      }
    },
    isUniversityInputValid() {
      return this.query.trim() !== '' && this.query.length >= 8;
    }
  }
};
</script>
