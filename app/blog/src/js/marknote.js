/**
 * Created by zhanglun on 10/17/15.
 */
var marked = require('marked');
var util = require('./util');

var contentMarked = function (val) {
  return marked(val);
};

function Editor(container){
  // var metadata = '++++' + '\n' +
  //   'title: ' + '\n' +
  //   'category: ' + '\n' +
  //   'tags: ' + '\n' +
  //   'date:' + '\n' +
  //   '++++' + '\n';
  var metadata = '# MarkNote for you' +
  
  '# MarkNote for you' + '\n' + 
  '## MarkNote for you' + '\n' + 
  '### MarkNote for you' + '\n' + 
  '#### MarkNote for you' + '\n' + 
  '##### MarkNote for you' + '\n' + 
  '###### MarkNote for you' + '\n' + 
  '![file-list](https://www.zybuluo.com/static/img/file-list.png)' +'\n' + 
  '- [ ] 支持以 PDF 格式导出文稿' + '\n' + 
  '- [ ] 改进 Cmd 渲染算法，使用局部渲染技术提高渲染效率' + '\n' + 
  '- [x] 新增 Todo 列表功能' + '\n' + 
  '- [x] 修复 LaTex 公式渲染问题' + '\n' + 
  '- [x] 新增 LaTex 公式编号功能' + '\n'; 
  
  return CodeMirror(container, {
    value: metadata,
    mode: "markdown",
    tabSize:2
  });
}


var editor = function () {
  return new Vue({
    el: '#blog-editor',
    ready: function () {
      var _this = this;
      var editorContainer = document.getElementById('writer-board');
      var editor = Editor(editorContainer);
      _this.editor = editor;
      util.getCategoryList()
        .then(function (res) {
          var _temp = res.map(function (item) {
            return item['category'];
          });
          _this.$set('categories', _temp);
        });
    },

    data: {
      categories: [],
      post: {
        title: '',
        content: '',
        abstract: '',
        category: '未分类',
        tags: []
      },
      tag_adding: ''

    },
    filters: {
      marked: contentMarked
    },


    methods: {
      
    }

  });
};

module.exports = editor;
