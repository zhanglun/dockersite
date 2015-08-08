


var API = {};

API.Todo = {};
API.Todo.getList = function(req, res, next){
    res.send('get all todo list!');
};



module.exports = API;
