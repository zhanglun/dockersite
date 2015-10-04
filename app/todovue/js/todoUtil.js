/**
 * Created by zhanglun on 10/4/15.
 */

var TodoMethods = {};

TodoMethods.fetchData = function () {
  var _this = this;
  var deffered = $.ajax({
    url: '/api/todo/tasks',
    method: 'get'
  });
  deffered.done(function (res) {
    _this.$set('todos', res);
  });
};

TodoMethods.edit = function (todo) {
  var _this = this;
  _this.todoEditing = todo;
  console.log(todo);
};

TodoMethods.toggleCompleted = function (item) {
  item.isDone = !item.isDone;
  TodoMethods.save(item);
};

TodoMethods.addTodo = function () {
  var _this = this;
  var todo = this.$data.newTodo;
  TodoMethods.create(todo)
    .done(function (res) {
      _this.$data.todos.push(res);
      _this.$data.newTodo.title = '';
    });
};

TodoMethods.save = function (todo) {
  return $.ajax({
    url: '/api/todo/tasks/' + todo._id,
    method: 'put',
    data: todo
  });
};

TodoMethods.create = function (todo) {
  return $.ajax({
    url: '/api/todo/tasks',
    method: 'post',
    data: todo
  });
};

TodoMethods.delete = function (todo) {
  return $.ajax({
    url: '/api/todo/tasks/' + todo._id,
    method: 'delete',
    data: todo
  });
};

TodoMethods.updateTodo = function (todo) {
  var _this = this;
  TodoMethods.save(todo)
    .done(function () {
      _this.todoEditing = null;
    });
};

TodoMethods.deleteTodo = function (todo) {
  var _this = this;
  TodoMethods.delete(todo)
    .done(function () {
      console.log('delete todo from database');
      _this.$data.todos.$remove(todo);
    });
};

TodoMethods.archiveTodo = function (todo) {
  var _this = this;
  todo.category = 'archive';
  TodoMethods.save(todo)
    .done(function (res) {
      console.log(res);
      _this.$data.todos.$remove(todo);
    });
};


module.exports = TodoMethods;


