<template>
  <div class="article">
    <h1>{{article.title}}</h1>
  </div>
</template>

<script>

  export default {
    data(){
      return {
        article: {}
      }
    },
    ready(){
      let vm = this;
      console.log(vm.$route.params);
      vm.$http.get('articles/' + vm.$route.params.id)
        .then(function(res){
          console.log(res);
          vm.article = res.data;
        })

    },
    methods: {}
  }
</script>
