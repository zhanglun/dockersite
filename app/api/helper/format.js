exports.formatTasksQuery = function (query) {
  var param = {};
  param.find = {};
  if (query.list_id) {
    param.find.list_id = query.list_id;
  }
  if (query.order) {
    param.sort = {};
    if (query.sort && query.sort === 'asc') {
      param.sort[query.order] = 1;
    } else {
      param.sort[query.order] = -1;
    }
  }
  console.log(param);
  return param;
};
