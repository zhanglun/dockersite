<template>
  <div class="floatController">
    <div class="floatController-item floatController-item__edit material-icons" @click="goToEditor()">edit</div>
    <div v-if="article" class="floatController-item floatController-item__delete material-icons">delete</div>
  </div>
</template>
<script>
  export default {
    props: ['article'],
    data(){
      return {

      }
    },
    ready(){

    },
    methods: {
      goToEditor:function(){
        if(this.article){
          this.$router.go({
            name: 'editor',
            param: this.article.id
          });
        }else{
          this.$router.go('/editor');
        }
        console.log(this.article);
      }
    },
  }
</script>
<style lang="less">
  .floatController{
    display: flex;
    position: fixed;
    top:2px;
    right: 8px;
    &-item{
      padding: 2px;
      color: #fff;
      background: #737272;
      margin: 0 2px;
      cursor: pointer;
      font-size: 20px;
    }
  }
</style>
