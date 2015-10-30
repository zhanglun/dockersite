/**
 * Created by zhanglun on 10/17/15.
 */
var marked = require('marked');
var contentMarked = function (val) {
  return marked(val);
};


var editor = function () {
  return new Vue({
    el: '#blog-editor',
    ready: function () {
      var _this = this;
      $.ajax({
        method: 'get',
        url: '/api/blog/category'
      })
        .done(function (res) {
          var _temp = res.map(function (item) {
            return item['category'];
          });
          _this.$set('categories', _temp);
        });


      // editor
      var editor = CodeMirror.fromTextArea(document.getElementById('writer-board'), {
        mode: 'markdown',
        indentUnit: 2,  // 缩进单位，默认2
        smartIndent: true,  // 是否智能缩进
        tabSize: 2,  // Tab缩进，默认4
        showCursorWhenSelecting: true,
        lineWrapping: 'wrap'
      });

      editor.setSize('100%', '100%');

      _this.editor = editor;

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
      },
      'loadMd': function (post) {
        var _this = this;
        $.ajax({
          method: 'get',
          url: '/api/blog/kuaipan/download_file?path=/%E8%A7%84%E8%8C%83%E4%B9%8B%E8%B7%AF-normal%20flow.md'
        })
          .done(function (res) {
            window.res = res;
            post.title = res.match(/^\btitle.+/)[0].slice(7);
            post.tags = JSON.parse(res.match(/tags.+/)[0].slice(6));
            var content = res.split('---');
            content.shift();
            post.content = content.join('\n');
            _this.editor.setValue(post.content);
          }).fail(function (xhr) {
            console.log(xhr);
          });
      },
      'saveToCloud': function (post) {
        // TODO: 保存到网盘
        var file = post.content;
        var path = '/test/' + post.title + '.md';
        var data = '';
        $.ajax({
          method: 'post',
          url: '/api/blog/kuaipan/upload_file',
          dataType: 'json',
          data: {
            file: file,
            path: path
          }
        })
          .done(function (res) {
            alert('上传成功！')
          }).fail(function (xhr) {
            console.log(xhr);
          });
      }
    }

  });
};

module.exports = editor;
