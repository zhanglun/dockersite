var marked = require('marked');
var CodeMirror = require('codemirror');
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

var editor = require('./editor.js');

var VModel = {};

VModel.mainNav = function (currentpage) {
  return new Vue({
    el: 'header',
    ready: function () {
      this.$set('currentpage', currentpage);
    },
    data: {
      currentpage: currentpage
    },
    directives: {
      'nav-highlight': function (val) {
        if (!val) {
          return false;
        }
        var el = this.el;
        console.log(el);
      }
    }
  });
};


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

VModel.editor = editor;

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
