/**
 * Created by zhanglun on 10/17/15.
 */
var marked = require('marked');
var util = require('./util');

var contentMarked = function (val) {
  return marked(val);
};

function Editor(container){
  var metadata = '++++' + '\n' +
    'title: ' + '\n' +
    'category: ' + '\n' +
    'tags: ' + '\n' +
    'date:' + '\n' +
    '++++' + '\n';

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
      // 添加标签
      'storeTag': function () {
        var tagStoring = this.$data.tag_adding;
        // 检查tag是否已经添加
        var isExist = this.$data.post.tags.some(function (item) {
          return item == tagStoring;
        });
        if (tagStoring && !isExist) {
          this.$data.post.tags.push(tagStoring.trim());
        }
        this.$data.tag_adding = '';
      },
      'selectCategory': function (val) {
        this.$data.post.category = val;
      },
      'publish': function (post) {

        var value = this.editor.getValue();
        var metadata = value.split('++++')[1];

        if (!post.title) {
          alert('!!!!');
          return false;
        }
        util.createPost(post);
      },
    }

  });
};

module.exports = editor;
