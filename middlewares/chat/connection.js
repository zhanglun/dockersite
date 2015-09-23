var SocketAccepter = require('./socketAccept');
var SocketEmitter = require('./socketEmitter');

module.exports = function (io) {
  io.on('connection', function (socket) {
    console.log('a user connected');
    socket.emit('online', {msg: '有人上线了!'});
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });

    var accepter = new SocketAccepter(socket);
    var emitter = new SocketEmitter(socket);

    socket.on('chat:send_message', function (roomid, msg, callback) {
      console.log("message: " + msg + 'roomid: ' + roomid);
      emitter.Chat_append_message(roomid, msg);
      if (callback) {
        callback();
      }
    });

    socket.on('user:join_room', function(data){
      socket.join(data.roomid, function(){
        console.log('!!!!!!!!!!!!!join!!!!->>>>>>>>>>>>>>-..' + data.roomid);
      });
    });

  });

};
