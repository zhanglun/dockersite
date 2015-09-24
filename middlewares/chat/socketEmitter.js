module.exports = function(socket){
  this.init = function(){
    var _this = this;
    _this.Chat_append_message();
  };

  this.Chat_append_message = function(data, callback){
      socket.emit('chat:append_message', data, callback);
      socket.broadcast.to(data.roomid).emit('chat:append_message', data.msg, callback);
  };

  return this;

};
