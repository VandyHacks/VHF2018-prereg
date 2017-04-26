<template>
  <div class="typeahead-container">
    <input type="text" placeholder="Name of university" autocomplete="off" 
    v-bind:value="query" 
    v-model="query" 
    @keydown.down="down" 
    @keydown.up="up" 
    @keydown.enter="hit" 
    @input="update" 
    @keydown.esc="reset" 
    @blur="reset" />
  
    <div class="uni-list-container">
      <ul v-show="hasItems">
        <li v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
          <span v-text="item.name"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import VueTypeahead from 'vue-typeahead'

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
    }
  }
}
</script>