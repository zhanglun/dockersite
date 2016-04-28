<template>
  <div class="container">
    <floatcontroller></floatcontroller>
    <div class="article-list">
      <articleview v-for="article in articles" :article="article"></articleview>
    </div>
  </div>
</template>

<script>
  import ArticleItemView from './articleItem.vue';
  import FloatController from './floatController.vue';

  export default {
    data(){
      return {
        articles: []
      }
    },

    ready(){
      var $vm = this;
      this.$http.get('articles').then(function(res){
        console.log(res);
        $vm.articles = res.data;
      });
      console.log('article');
    },

    components: {
      articleview: ArticleItemView,
      floatcontroller: FloatController,
    },

    methods: {

    }

  }
</script>

<style lang="less">
  .article{
    &-list{
      // column-count: 2;
    }
  }
</style>
