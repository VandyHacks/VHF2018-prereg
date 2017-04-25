<template>
  <div>
    <!-- the input field -->
    <input type="text" placeholder="Name of university" autocomplete="off" v-model="query" @keydown.down="down" @keydown.up="up" @keydown.enter="hit" @keydown.esc="reset" @blur="reset" @input="update" />
  
    <!-- the list -->
    <ul v-show="hasItems">
      <!-- for vue@1.0 use: ($item, item) -->
      <li v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
        <span v-text="item.name"></span>
      </li>
    </ul>
  </div>
</template>

<script>
import VueTypeahead from 'vue-typeahead'

export default {
  extends: VueTypeahead, // vue@1.0.22+

  data: () => ({
      src: '/findunis'
  }),

  methods: {
    // The callback function which is triggered when the user hits on an item
    // (required)
    onHit(item) {
      alert("City " + item.addr)
    },
  }
}
</script>