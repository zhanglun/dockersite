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

module.exports = util;
