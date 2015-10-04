var TodoUtil = require('./todoUtil');
console.log(TodoUtil);
var app = app || {};

function VueInbox() {
  var inbox = new Vue({
    el: '#todoapp',
    ready: function () {
      var _this = this;
      console.log('Vue is ready!');
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
      todos: []
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


  return inbox;

}


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
  VueInbox();
}

function finished() {
  document.title = 'todo-finished';
  VueInbox();
}

function archive() {
  document.title = 'todo-archive';
  VueInbox();
}

module.exports = app;
