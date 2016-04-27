<styll lang="less">

</style>
<template>
  <div class="app">
    <a v-link="{name: 'articles', params: {id: 123} }">123</a>
    <a v-link="{path: 'editor'}">editor</a>
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
