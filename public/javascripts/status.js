var socket = io.connect('http://localhost:3000/userstatus');


function getCookie(cookieName) {
    var cookieObj = {},
        cookieSplit = [],
        // 以分号（;）分组
        cookieArr = document.cookie.split(";");
    for (var i = 0, len = cookieArr.length; i < len; i++)
        if (cookieArr[i]) {
            // 以等号（=）分组
            cookieSplit = cookieArr[i].split("=");
            // Trim() 是自定义的函数，用来删除字符串两边的空格
            cookieObj[cookieSplit[0].trim()] = cookieSplit[1].trim();
        }
    return cookieObj[cookieName];
}


// 当前页面长时间没有从操作，
socket.on('user:freeze', function() {
    console.log('This Client is freezed comfirmed!!!');
});


// 所有的页面都是长时间未操作状态 ，用户已经离开
socket.on('user:awayConfirmed', function(res) {
    console.log('User is away! Push message to Mobiles');
});





/**
 * ifvisible Libary
 */

ifvisible.setIdleDuration(10);

// ifvisible.on('statusChanged', function(e) {
//     console.log('statusChanged!!!!!!');
//     $("#result").html('current status: ' + e.status);
//     if (e.status == 'active') {}
// });


ifvisible.on('wakeup', function() {
    console.log('!!!!wakeup!!');
    console.log(ifvisible.getIdleInfo().timeLeft);
    var data = {
        status: getCookie('user_status'),
        roomId: window.location.search.slice(6)
    };
    document.cookie = 'roomId=+' + window.location.search.slice(6) + '';
    socket.emit('user:comeback', data, function(res) {

    });
});

// 浏览器失去焦点
ifvisible.on("blur", function() {
    // example code here..
    socket.emit('user:blur');
});

// 浏览器获得焦点
ifvisible.on("focus", function() {

});


// 页面长时间未操作
ifvisible.idle(function() {
    $("#result2").html("(-_-) Good bye. ZzzZZzz...");
    document.body.style.opacity = 0.5;
    var data = {
        status: 4,
        roomId: window.location.search.slice(6)
    };
    document.cookie = 'user_status=1';
    socket.emit('user:away', data, function(res) {
        console.log(res);
    });
});

// 页面重新唤醒
ifvisible.wakeup(function() {
    $("#result2").html("(O_o) Hey!, you woke me up.");
    document.body.style.opacity = 1;
});

ifvisible.onEvery(0.5, function() {
    // Clock, as simple as it gets
    var h = (new Date()).getHours();
    var m = (new Date()).getMinutes();
    var s = (new Date()).getSeconds();
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    // Update clock
    $("#result3").html(h + ':' + m + ':' + s);
});

function createDot(x, y){
    var dot = document.createElement('span');
    dot.className = 'dot-line';
    dot.style.left = x;
    dot.style.top = y;
    dot.style.width = '8px';
    dot.style.height = '8px';
    dot.style.display = ' block';
    dot.style.background = 'red';
    dot.style.position = 'absolute';
    document.body.appendChild(dot);
}


$(document).ready(function() {

    document.onmousemove = function(e){
        console.log(e.pageX + ':' + e.pageY);
        createDot(e.pageX, e.pageY);
        ifvisible.wakeup();

    }

    socket.emit('user:joinRoom', {
        status: getCookie('user_status'),
        roomId: window.location.search.slice(6)
    }, function() {
        callback(arguments);
    });


    // 辅助函数 绘制进度条
    setInterval(function() {
        var info = ifvisible.getIdleInfo();
        // Give 3% margin to stabilaze user output
        if (info.timeLeftPer < 2) {
            info.timeLeftPer = 0;
            info.timeLeft = ifvisible.getIdleDuration();
        }
        // console.log('info');
        $("#seconds").html(parseInt(info.timeLeft / 1000), 10);
        $("#idlebar").width(info.timeLeftPer + '%');
    }, 100);



});
