/**
 * Created by zhanglun on 10/17/15.
 */
var marked = require('marked');
var util = require('./util');

var contentMarked = function (val) {
  return marked(val);
};
var loadStyleSheet = function (href) {
  $('head').append('<link rel="stylesheet" href="/bower_components/editor.md/css/editormd.min.css"/>');
};

var editor = function () {
  return new Vue({
    el: '#blog-editor',
    ready: function () {
      var _this = this;
      loadStyleSheet();
      util.getJSON('/api/blog/category')
        .done(function (res) {
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

        if (!post.title) {
          alert('!!!!');
          return false;
        }
        post.content = this.editor.getValue();
        $.ajax({
          method: 'post',
          url: '/api/blog/posts',
          dataType: 'application/json',
          data: post
        });
      }
    }

  });
};

module.exports = editor;
