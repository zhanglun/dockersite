<style style="less">
  @import "./css/marknote";
</style>
<template>
  <div id="blog-editor" class="marknote writing">
    <h2>Mole Eidtor</h2>
    <div id="writer-board" class="area-writing">
    </div>
    <!-- <div class="preview-content" v-html="post.content | marked"></div> -->
  </div>
</template>
<script>
  let marked = require('marked');
  let util = require('./util');
  let contentMarked = function(val) {
    return marked(val);
  };

  function Editor(container) {
    var marknote = CodeMirror(container, {
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

  exports default {
    data(){
      return {

      }
    },

    ready(){
      console.log('Mole inited!');
    },
    methods: {
      
    }
  }

</script>
