var constant = require('./constant.js');
var util = {};

util.getJSON = function(url, param){
  return $.ajax({
    method: 'get',
    url: url,
    data: param
  });
};

util.postJSON = function(url, param){
  return $.ajax({
    method: 'post',
    url: url,
    dataType: 'json',
    data: param
  });
};


util.getCategoryList = function(){
  return new Promise(function(resolve, reject){
    util.getJSON(constant.API.CATEGORY)
      .done(function(res){
        resolve(res);
      })
      .fail(function(xhr){
        reject(xhr);
      });
  });
};

util.createPost = function(post){

  return new Promise(function(resolve, reject){
    util.postJSON(constant.API.POSTS, post)
      .done(function(res){
        resolve(res);
      })
      .fail(function(xhr){
        reject(xhr);
      });
  });
};

module.exports = util;
