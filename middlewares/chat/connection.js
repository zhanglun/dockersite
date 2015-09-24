var SocketAccepter = require('./socketAccept');
var SocketEmitter = require('./socketEmitter');

module.exports = function (io) {
  io.on('connection', function (socket) {
    console.log('a user connected');
    socket.emit('online', {msg: '有人上线了!'});
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });

    var emitter = new SocketEmitter(socket);

    socket.on('chat:send_message', function (data, callback) {
      console.log("message: " + data.msg + 'roomid: ' + data.roomid);
      emitter.Chat_append_message(data);
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
