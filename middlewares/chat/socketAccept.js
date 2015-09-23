module.exports = function (socket) {
  this.init = function () {
    var _this = this;
    _this.Chat_send_message();
  };
  this.Chat_send_message = function (msg, callback) {
    socket.on('chat:send_message', function (msg, callback) {
      console.log("message: " + msg);
      if (callback) {
        callback();
      }
    });
  };

};
