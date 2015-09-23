module.exports = function(socket){
  this.init = function(){
    var _this = this;
    _this.Chat_append_message();
  };

  this.Chat_append_message = function(roomid, msg, callback){
      socket.emit('chat:append_message', msg, callback);
    console.log(roomid);
      socket.broadcast.to(roomid).emit('chat:append_message', msg, callback);
  };

};
