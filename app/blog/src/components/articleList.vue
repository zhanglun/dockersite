<template>
  <div class="article-list">
    <articleview v-for="article in articles" :article="article"></articleview>
  </div>
</template>

<script>
  import ArticleItemView from './articleItem.vue';

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
      articleview: ArticleItemView
    },

    methods: {

    }

  }
</script>
