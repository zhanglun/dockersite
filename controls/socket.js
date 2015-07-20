var cookieParser = require('cookie-parser');
var Cookie = require('cookie');
var session = require('express-session');

// redis
var redis = require('redis');
var RedisStore = require('connect-redis')(session);
var redisClient = redis.createClient();

redisClient.on('error', function(err) {
    console.log('Error: ' + err);
});

var SocketUtil = function(io) {

    console.log('hello, SocketUtil!!');
    // socket 认证
    io.set('authorization', function(handshakedata, accept) {
        if (handshakedata.headers.cookie) {
            var cookie = handshakedata.headers.cookie;
            if (cookie) {
                handshakedata.cookie = Cookie.parse(cookie);
                handshakedata.session = cookieParser.signedCookie(handshakedata.cookie['mingdao.Id'], 'zhanglun');
                handshakedata.username = handshakedata.cookie['username'];
            }
            redisClient.get('mingdao:' + handshakedata.session, function(err, reply) {
                if (err) {
                    accept(err.message, false);
                } else {
                    handshakedata.session = reply;
                    accept(null, true);
                }

            });
        } else {
            return accept('No Cookie transmitted.', false);
        }
        accept(null, true);
    });

    chatIo = io.of('/demochat');
    chatIo.on('connection', function(socket) {
        var USERNAME = '';
        var session = JSON.parse(socket.request.session);
        if (session.username) {
            USERNAME = session.username;
            socket.emit('server.recordName', session);
            socket.broadcast.emit('userEntered', session);
        }

        socket.on('user.sendMessage', function(message) {
            if (message.type == 'userMessage') {
                message.username = USERNAME;
                message.type = 'myMessage';
                socket.emit('server.updateMessageList', message);
                message.type = 'notMyMessage';
                socket.broadcast.emit('server.updateMessageList', message);
            }
        });


        // 设置姓名
        socket.on('user.setName', function(data) {
            USERNAME = data.username;
            socket.emit('server.recordName', data);
            socket.broadcast.emit('userEntered', data);
        });
    });







    /**
     * 用户状态判断demo
     */

    statusIo = io.of('/userstatus');

    // 保存用户的状态相关信息(是否应该在redis中保存？)
    var arrayList = {};

    statusIo.on('connection', function(socket) {

        console.log('socket.session');
        var session = JSON.parse(socket.request.session);

        socket.on('user:joinRoom', function(data, callback) {

            console.log('room ID: ' + data.roomId);
            console.log('before join room: ' + socket.id);

            socket.join(data.roomId, function() {
                console.log('用户加入房间了啊！！！！！！' + new Date() + socket.id);
                console.log(arrayList[data.roomId]);

                // 覆盖之前保存的 socketid , 每个用户只保存最新的在线状态的 socketid
                arrayList[data.roomId] = {};
                arrayList[data.roomId][socket.id] = {
                    id: data.roomId,
                    ctime: (new Date()).getTime(),
                    status: session.user_status
                };
                changeUserStatus(data.roomId, data.status);
            });
        });

        console.log('roomlist');
        console.log(io.sockets.adapter.rooms);

        // 页面长时间没有操作(每个页面都会触发)
        socket.on('user:away', function(data, callback) {

            // 检查当前触发的socket是否与保存的id匹配
            if (arrayList[data.roomId][socket.id]) {
                console.log(arrayList)
                console.log('line: 108------' + socket.id);
                arrayList[data.roomId][socket.id]['status'] = 4;
                console.log(data.roomId + socket.id + '用户web在线，但是没有动作！！！！');

                // TODO: 发送反馈给浏览器 (是否需要！！)

                var res = '';
                console.log(socket.id);
                changeUserStatus(data.roomId, 4);
                socket.emit('user:awayConfirmed', res);
                socket.broadcast.to(data.roomId).emit('user:awayConfirmed', res);

                // TODO: Redis 操作

            }

            // socket.broadcast.to(data.roomId).emit('user:freeze');
        });

        // 页面被重新激活
        socket.on('user:comeback', function(data, callback) {
            console.log('user comeback');
            // 重新触发页面
            console.log('old user status: ' + data.status);
            console.log('roomId: ' + data.roomId + '-----socketId:' + socket.id);

            // 重新保存活动的socketid
            arrayList[data.roomId] = {};
            arrayList[data.roomId][socket.id] = {
                id: data.roomId,
                ctime: (new Date()).getTime(),
                status: session.user_status
            };
            console.log(data.roomId + '用户web在线，离开了一小会儿，现在又回来了！！！！status: ' + data.status);
            changeUserStatus(data.roomId, data.status);
        });

    });


    // Redis 相关
    function changeUserStatus(roomId, type) {
        // redisClient.
        redisClient.set('user_status:' + roomId, type, function(err, reply) {
            if (err) {
                console.log('Redis Error: ' + err);
                return false;
            }
            console.log('redis reply:');
            console.log(reply);
        });
    }

};


module.exports = SocketUtil;
