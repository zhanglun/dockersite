var marked = require('marked');
var CodeMirror = require('codemirror');
//require("codemirror/mode/markdown/markdown.js");
window.CodeMirror = CodeMirror;
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: false,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});


var VModel = {};

VModel.post = function () {
  return new Vue({
    el: '#post',
    ready: function () {
      var _this = this;
      $.ajax({
        method: 'get',
        url: '/api/blog/posts'
      })
        .done(function (res) {
          _this.$set('articles', res);
        });
    },
    data: {
      articles: []
    },
    methods: {}
  });
};

VModel.write = function () {
  return new Vue({
    el: '#blog-writer',
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
      var editor = CodeMirror.fromTextArea($('.writer-content').find('textarea')[0],{
        value: 'start blogging...',
        mode: 'markdown',
        indentUnit : 2,  // 缩进单位，默认2
        smartIndent : true,  // 是否智能缩进
        tabSize : 2,  // Tab缩进，默认4
        showCursorWhenSelecting : true
      });

      _this.editor = editor;

    },
    data: {
      categories: [1, 2, 3, 4],
      post: {
        title: '',
        content: '',
        abstract: '',
        category: '',
        tags: ''
      }

    },


    // directive
    //
    //directives: {
    //  'codemirror': function(value){
    //    console.log(this);
    //  }
    //},

    methods: {
      'selectCategory': function (val) {
        this.$data.post.category = val;
      },
      'publish': function (post) {
        post.content = this.editor.getValue();
        $.ajax({
          method: 'post',
          url: '/api/blog/posts',
          dataType: 'application/json',
          data: post
        });
      },
      'loadMd': function (post) {
        $.ajax({
          method: 'get',
          url: '/api/blog/kuaipan/download_file?path=/%E8%A7%84%E8%8C%83%E4%B9%8B%E8%B7%AF-normal%20flow.md'
        })
          .done(function (res) {
            window.res = res;
            post.title = res.match(/^\btitle.+/)[0].slice(7);
            post.tags = JSON.parse(res.match(/tags.+/)[0].slice(6)).join(',');
            var content = res.split('---');
            content.shift();
            post.content = content.join('\n');
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

VModel.article = function () {
  return new Vue({
    el: '#article-detail',
    ready: function () {
      var _this = this;
      $.ajax({
        method: 'get',
        url: '/api/blog/posts/' + $('#content').attr('data-postid')
      })
        .done(function (res) {
          res.content = marked(res.content.replace(/\s*<!--\s*more\s*-->\s+/, ''));
          res.abstract = marked(res.abstract);
          _this.$set('article', res);
        });
    },
    data: {
      article: {}
    }
  });

};


module.exports = VModel;
