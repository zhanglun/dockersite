var TodoUtil = require('./todoUtil');
var filters = require('./todoFilter');

var app = new Vue({
  el: '#todoapp',
  ready: function () {
    var _this = this;
    var deffered = $.ajax({
      url: '/api/todo/tasks',
      method: 'get'
    });
    deffered.done(function (res) {
      _this.$set('todos', res);
    });
  },

  // 数据
  data: {
    newTodo: {
      title: '',
      isDone: false
    },
    todoEditing: null,
    currentCategory: '',
    todos: [],
    visibility: 'all'
  },

  // 计算属性
  computed: {
    filteredTodos: function () {
      return filters[this.visibility](this.todos);
    }
  },
  // 指令
  directives: {
    'todo-autofocus': function (value) {
      if (!value) {
        return;
      }
      var el = this.el;
      setTimeout(function () {
        el.focus();
      }, 0);
    }
  },

  // 方法
  methods: TodoUtil
});


page.base('/todovue');

page('/', index);
page('/inbox', inbox);
page('/finished', finished);
page('/archive', archive);
page();

function index() {
  console.log('welcome to todovue');
}

function inbox(ctx) {
  document.title = 'todo-inbox';
  app.$set('visibility', 'inbox');
}

function finished() {
  document.title = 'todo-finished';
  app.$set('visibility', 'finished');
}

function archive() {
  document.title = 'todo-archive';
}

module.exports = app;
