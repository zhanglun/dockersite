<template>
  <div class="container">
    <floatcontroller :article="article"></floatcontroller>
    <div class="article">
      <h1>{{article.title}}</h1>
      <div v-html="content | marked"></div>
    </div>
  </div>
</template>

<script>

  import marked from 'marked';
  import FloatController from './floatController.vue';

  export default {
    data(){
      return {
        article: {},
        content: '',
      }
    },

    filters: {
      marked: marked
    },

    ready(){
      let vm = this;
      vm.$http.get('articles/' + vm.$route.params.id)
        .then(function(res){
          vm.article = res.data;
          vm.content = res.data.content;
        })

    },
    components: {
      floatcontroller: FloatController,
    },
    methods: {

    }
  }
</script>
