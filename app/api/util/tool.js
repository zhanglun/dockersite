var Moment = require('moment');

module.exports = {
  convertObjectIdToId: function convertObjectIdToId(target) {
    if (Array.isArray(target)) {
      target = target.map(function(item) {
        item = item.toObject();
        item.id = item._id;
        if (item.update_time) {
          item.update_time = Moment(item.update_time).format('YYYY-MM-DD HH:mm:ss');
        }
        if (item.create_time) {
          item.create_time = Moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
        }
        delete item._id;
        delete item.__v;
        return item;
      });
    } else {
      target = target.toObject();
      target.id = target._id;
      if (target.update_time) {
        target.update_time = Moment(target.update_time).format('YYYY-MM-DD HH:mm:ss');
      }
      if (target.create_time) {
        target.create_time = Moment(target.create_time).format('YYYY-MM-DD HH:mm:ss');
      }
      delete target._id;
      delete target.__v;
    }
    return target;
  }
}
