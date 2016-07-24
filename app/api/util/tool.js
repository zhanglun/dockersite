var Moment = require('moment');

module.exports = {
  convertObjectIdToId: function convertObjectIdToId(target) {
    var isArray = true;
    if (!Array.isArray(target)) {
      isArray = false;
      target = [target];
    }
    target = target.map(function (item) {
      item = item.toObject();
      item.id = item._id;
      if (item.update_time) {
        item.update_time = Moment(item.update_time).format('YYYY-MM-DD HH:mm:ss');
      }
      if (item.create_time) {
        item.create_time = Moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
      }
      if (item.deadline) {
        item.deadline = Moment(item.deadline).format('YYYY-MM-DD HH:mm:ss');
      }
      delete item._id;
      delete item.__v;
      return item;
    });
    if (!isArray) {
      target = target[0];
    }
    console.log(target);
    return target;
  },
  htmlDecode: function (str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\n/g, "<br>");
    return s;
  },

  htmlEncode: function (str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    s = s.replace(/<br>/g, "\n");
    return s;
  }
};
