<style style="less">
  @import "../css/marknote.less";
</style>
<template>
  <div class="container">
    <div class="marknote-controller">
      <button @click="updateArticle()" class="marknote-btn marknote-btn__default">确定</button>
    </div>
    <div class="marknote-metadata">
      <div class="marknote-metadata--catrgory">
        <i class="material-icons">book</i>
        Category
      </div>
      <div class="marknote-metadata--tags">
        <i class="material-icons">label</i>
        Tags
      </div>
    </div>
    <div class="marknote-title">
      <input type="text" v-model="title" class="marknote-title-input" placeholder="输入文章标题">
    </div>
    <div class="marknote marknote--editing">
      <div class="marknote-blackboard">
      </div>
      <!--<div class="marknote-preview" v-html="content | marked"></div>-->
    </div>
  </div>
</template>
<script>

  import '../vendor/codemirror/lib/codemirror.css';
  import '../vendor/codemirror/mode/markdown/markdown.js';
  import CodeMirror from '../vendor/codemirror/lib/codemirror.js';
  import marked from 'marked';


  function Editor(selector, metadata) {
    let container = document.querySelector(selector);
    let marknote = CodeMirror(container, {
      value: metadata,
      mode: {
        name: 'markdown',
        allowAtxHeaderWithoutSpace: true
      },
      tabSize: 2,
      lineWrapping: true,
      theme: 'tomorrow-night-eighties',
      autofocus: true
    });

    marknote.setOption("extraKeys", {
      Tab: function(cm) {
        var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces);
      }
    });

    return marknote;

  }

  export default {
    data(){
      return {
        editor: null,
        article: null,
        content: '',
        title: '',
        currentId: '',
      }
    },

    filters: {
      marked: marked
    },

    ready(){

      let vm = this;
      let editor = new Editor('.marknote-blackboard', 'Hi~');

      editor.on('change', function(){
        vm.content = editor.getDoc().getValue();
      });

      vm.editor = editor;

      if(vm.$route.params.id){
        vm.currentId = vm.$route.params.id;
        vm.$http.get('articles/' + vm.$route.params.id)
          .then(function(res){
            vm.$data.article = res.data;

            vm.$data.title = res.data.title;
            vm.$data.content = res.data.content;
            editor.setOption('value', res.data.content);
          });
      }

    },

    methods: {
      updateArticle(){
        let param = {};
        let vm = this;
        let value = vm.editor.getDoc().getValue();

        param.content = value;
        param.title = vm.title;

        if(vm.currentId){
          vm.$http.put('articles/' + vm.$route.params.id, param)
            .then(function(req){
              console.log(req);
            });
        } else {
          vm.$http.post('articles', param)
            .then(function(req){
              console.log(req);
            });
        }

      }
    },

  }

</script>

<style lang="less">
</style>
