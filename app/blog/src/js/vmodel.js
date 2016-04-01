var marked = require('marked');

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

var editor = require('./marknote.js');

var VModel = {};
VModel.editor = editor;

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

VModel.article = function () {
  var page = arguments[0];
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
        })
        .fail(function (xhr) {
          if (xhr.status == 404) {
            var title = '404 Not Found!!! Redirecting...';
            _this.$set('article', {title: title});
            setInterval(function () {
              page.redirect('/post');
            }, 2000);
          }
        });
    },
    data: {
      article: {}
    }
  });

};


module.exports = VModel;
