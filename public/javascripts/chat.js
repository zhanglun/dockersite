// socket.io
var socket = io.connect('http://localhost:3000/demochat');
socket.on('server.updateMessageList', function(data) {
    $('#messages').append('<div class="' + data.type + '"><span class="name">' + data.username + ":</span>" + data.message + '</div>');
});


// DOM
$(document).ready(function() {

    // set name
    $('#setname').on('click', function() {
        socket.emit('user.setName', {
            username: $('#nickname').val()
        });
        $.ajax({
            url: '../api/login',
            dataType: 'json',
            type: 'POST',
            data: {
                username: $('#nickname').val()
            },
            success: function(data) {
                console.log(data);
            }
        });
    });


    socket.on('server.recordName', function(data) {

        $('#nameform').hide();
        // 发送系统消息
        $('#messages').append('<div class="systemMessage">' + 'Hello,' + data.username + '</div>');

        socket.on('userEntered', function(data) {
            console.log('userEntered', data);
            $('#messages').append('<div class="systemMessage">' + data.username + ' has joined the room.' + '</div>');
        });

        // send message
        $('#send').on('click', function() {
            var data = {
                message: $('#message').val(),
                type: 'userMessage'
            };
            socket.emit('user.sendMessage', data);
            $('#message').val('');

        });
    });

document.onmousemove = function(e){
    console.log('mouse move' + new Date());
}




});
