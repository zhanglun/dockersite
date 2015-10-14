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
          console.log(_temp);
        });
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

    methods: {
      'selectCategory': function (val) {
        console.log(val);
        this.$data.post.category = val;
      },
      'publish': function (post) {
        post.tags = post.tags.split(',');
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
          //processData: false,
          dataType: 'json',
          //contentType: 'multipart/form-data',
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
          res.content = marked(res.content.replace(/\<\!\-\-\s*more\s*\-\-\>/, ''));
          _this.$set('article', res);
        });
    },
    data: {
      article: {}
    }
  });

};


module.exports = VModel;
