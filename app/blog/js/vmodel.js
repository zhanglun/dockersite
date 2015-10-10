var marked = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
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
          console.log(res);
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
    ready: function(){
      var _this = this;
      $.ajax({
        method: 'get',
        url: '/api/blog/category'
      })
        .done(function(res){
          _this.$set('categories', res);
        });
    },
    data: {
      categories:[],
      post: {
        title: '',
        content: '',
        category: '',
        tags: ''
      }

    },

    methods: {
      "publish": function (post) {
        post.tags = post.tags.split(',');
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

VModel.article = function () {
  return new Vue({
    el: '#article-detail',
    ready: function () {
      console.log($('#content').attr('data-postid'));
      var _this = this;
      $.ajax({
        method: 'get',
        url: '/api/blog/posts/' + $('#content').attr('data-postid')
      })
        .done(function (res) {
          res.content = marked(res.content);
          _this.$set('article', res);
        });
    },
    data: {
      article: {}
    }
  });

};



module.exports = VModel;
