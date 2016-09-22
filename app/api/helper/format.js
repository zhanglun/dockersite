exports.formatTasksQuery = function (query) {
  var param = {};
  param.find = {};
  param.find = Object.assign(query);
  delete param.find.sort;
  delete param.find.order;
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
