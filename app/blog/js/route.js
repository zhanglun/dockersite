function index() {
  console.log('welcome to blog');
}

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
    write: function (ctx, next) {
      get('partials/writer.html', function (html) {
        ctx.data.index = 0;
        ctx.partials.content = html;
        next();
      });
    }
  };

  window.render = {
    content: function (ctx, next) {
      $('#content').empty().append(ctx.partials.content);
    }
  };

  window.done = null;
}());

page.base('/blog');
page('*', init.ctx);
page('/', '/index');
page('/index', index);
page('/write', route.write);
page('*', render.content);
page();
