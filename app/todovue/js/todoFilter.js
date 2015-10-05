var filter = {};

filter.all = function (todos) {
  return todos;
};

filter.inbox = function (todos) {
  return todos.filter(function (todo) {
    return !todo.isDone;
  });
};

filter.finished = function (todos) {
  return todos.filter(function (todo) {
    return todo.isDone;
  });
};


module.exports = filter;
