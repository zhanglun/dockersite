<template>
    <div class="article-item">
      <a v-link="{name: 'articles', params: {id: article.id} }">
        <h2>Article: {{article.title}}</h2>
      </a>
    </div>
</template>
<script>
export default{
  props: ['article'],
  data(){
    return {

    }
  },
  ready(){
    var $vm = this;
  },
  components: {

  },
  methods: {

  }
}
</script>
