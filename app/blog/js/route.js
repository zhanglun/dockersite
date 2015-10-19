var VModel = require('./VModel');

(function () {

  // private api

  var cache = {};

  function get(url, cb) {
    if (cache[url]) return cb(cache[url]);
    $.ajax({
      url: url,
      success: function (data) {
        cache[url] = data;
        cb(data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
      },
      dataType: 'text'
    });
  }

  // public api

  window.init = {
    ctx: function (ctx, next) {
      ctx.data = {};
      ctx.partials = {};
      next();
    }
  };

  window.route = {
    post: function (ctx, next) {
      get('partials/post.html', function (html) {
        ctx.data.index = 'post';
        ctx.partials.content = html;
        next();
      });
    },
    article: function (ctx, next) {
      get('partials/article.html', function (html) {
        ctx.data.index = 'article';
        ctx.partials.content = html;
        ctx.partials.postid = ctx.params.id;
        next();
      });
    },
    write: function (ctx, next) {
      get('partials/editor.html', function (html) {
        ctx.data.index = 'editor';
        ctx.partials.content = html;
        next();
      });
    }
  };

  window.render = {
    content: function (ctx, next) {
      $('#content').attr('data-postid', ctx.partials.postid)
        .empty()
        .append(ctx.partials.content);
      //if (ctx.data.index) {
      //  VModel.mainNav(ctx.data);
      //}
      VModel[ctx.data.index]();
    }
  };

  window.done = null;
}());


page.base('/blog');
page('*', init.ctx);
page('/', '/post');
page('/post', route.post);
page('/post/:id', route.article);
page('/write', route.write);
page('*', render.content);
page();


