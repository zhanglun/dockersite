<template>
    <div class="article-item">
      <div class="article-metadata">
        <div class="article-metadata-createtime">
          {{article.create_time}}
        </div>
      </div>
      <h2 class="article-title">
        <a v-link="{name: 'articles', params: {id: article.id} }">
          {{article.title}}
        </a>
      </h2>
      <p class="article-digest">
        {{article.digest}}
      </p>
      <div class="article-metadata-tags">

      </div>
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
    let $vm = this;
  },
  components: {

  },
  methods: {

  }
}
</script>
<style lang="less">
  .article{
    &-item{
      padding: 20px;
      margin: 0 1% 2%;
      background: #fff;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      border-radius: 3px;
    }
    &-metadata{
      margin-bottom: 10px;
      &-tags{
        padding: 14px 0;
        border-border: 1px solid #f3f3f3;
      }
    }
    &-title{
      text-align: left;
      margin-top: 0;
      font-size: 30px;
      line-height: 44px;
      font-weight: 700;
      color: #444;
    }
    &-link{
      text-decoration: none;
    }
  }
</style>
