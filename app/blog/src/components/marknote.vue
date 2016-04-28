<style style="less">
  @import "../css/marknote.less";
</style>
<template>
  <div class="container">
    <div class="marknote marknote--editing">
      <div class="marknote-blackboard">
      </div>
      <div class="marknote-preview" v-html="content | marked"></div>
    </div>
    <div class="note-controller">
      <button @click="updateArticle()">确定</button>
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
      autofocus: true,
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
        content: '',
      }
    },

    filters: {
      marked: marked
    },

    ready(){
      console.log('Editor inited!');
      let vm = this;
      let editor = new Editor('.marknote-blackboard', 'Hi~');

      editor.on('change', function(){
        vm.content = editor.getDoc().getValue();
      });

      vm.editor = editor;

      vm.$http.get('articles/' + vm.$route.params.id)
        .then(function(res){
          vm.article = res.data;
          editor.setOption('value', res.data.content);
        })
    },

    methods: {
      updateArticle(){
        let param = {};
        let vm = this;
        let value = vm.editor.getDoc().getValue();

        param.content = value;

        vm.$http.put('articles/' + vm.$route.params.id, param)
          .then(function(req){
            console.log(req);
          });

      }
    },

  }

</script>

<style lang="less">
  .marknote{
    display: flex;
    &-blackboard{
      width: 50%;
    }
    &-preview{
      width: 50%;
    }
  }
</style>
