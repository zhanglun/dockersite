<template>
  <div class="app">
    <a v-link="{path: '/articles' }">list</a>
    <a v-link="{path: '/editor'}">editor</a>
    <router-view></router-view>
  </div>

</template>
<script>
  export default {
    data(){
      return {

      }
    },

    ready(){

    },

    methods: {

    }

  }
</script>
