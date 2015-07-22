var request = require('request');
var cheerio = require('cheerio');
var BufferHelper = require('bufferhelper');
var async = require('async');

var db = require('./models');
var Controller = require('./controls');

var url = 'http://movie.douban.com/subject/25810966/';


function getPageData(url, callback) {
    var startTime = new Date();
    var timer = setTimeout(function() {

        var options = {
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36',
                'Referer': 'movie.douban.com',
                'Cookie': 'bid="NWiTkc3Xoc4"; ll="118183"; ap=1; _pk_id.100001.4cf6=6f9dc965b20110b6.1437370798.2.1437376975.1437372910.; _pk_ses.100001.4cf6=*; __utmt_douban=1; __utma=30149280.1774640765.1437370798.1437370798.1437375732.2; __utmb=30149280.2.10.1437375732; __utmc=30149280; __utmz=30149280.1437370798.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmt=1; __utma=223695111.821744665.1437370798.1437370798.1437375732.2; __utmb=223695111.2.10.1437375732; __utmc=223695111; __utmz=223695111.1437370798.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, sdch',
                'Accept-Language': 'zh-CN,zh;q=0.8',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Host': 'movie.douban.com'
            }
        };

        request(url, function(err, res, body) {

            console.log(res.statusCode);
            if (!err && res.statusCode == 200) {
                var bufferhelper = new BufferHelper();
                var html = body;
                $ = cheerio.load(html, {
                    decodeEntities: false
                });

                var current = {};

                current.douban_id = url.match(/\d+/)[0];
                console.log(current.douban_id);
                async.waterfall([
                    function(next) {
                        findExistData(current.douban_id, function(err, movie) {
                            if (err) {
                                console.log('findExistData:' + Err.message);
                            }
                            if (movie.length > 0) {
                                var isExist = true;
                                console.log('findExistData: True');
                            } else {
                                var isExist = false;
                                console.log('findExistData: False');
                            }
                            next(null, isExist);
                        });
                    },
                    function(isexist, next) {
                        if (isexist.length > 0) {
                            next(null);
                        } else {

                            current.name = $('span[property="v:itemreviewed"]').html();

                            var moreLinks = $('.recommendations-bd dd').find('a');
                            var links = [];
                            moreLinks.each(function(i, elem) {
                                links.push(elem.attribs.href.replace(/\?\S*/ig, ''));
                            });

                            if (links.length >= 0) {
                                for (var i = 0; i < links.length; i++) {
                                    getPageData(links[i]);
                                }
                            }

                            current.director = $('#info a[rel="v:directedBy"]').html();
                            current.writer = $('#info span.attrs').eq(1).find('a').html();

                            var starsList = $('#info span.attrs').eq(2).find('a[rel="v:starring"]');
                            var current_stars = [];
                            starsList.each(function(index, elem) {
                                var obj = {
                                    name: $(this).html(),
                                    href: $(this).attr('href')
                                };

                                current_stars.push(obj);
                            });
                            current.stars = current_stars;

                            var types = $('#info span[property="v:genre"]');
                            var current_type = [];
                            types.each(function(index, elem) {
                                current_type.push($(this).html());
                            });
                            current.type = current_type;

                            var txt = [];
                            $('#info').contents().each(function(index) {
                                if (this.nodeType === 3) {
                                    txt.push(this);
                                }
                            });

                            current.description = $('#link-report').find('span[property="v:summary"]').html();
                            saveMovieData(current, function() {
                                //
                                console.log('saveMovieData');
                                next();
                            });
                        }

                    }

                ], function(err) {
                    var endTime = new Date();
                    console.log('waiting seconds: ' + (endTime - startTime));
                    // clearTimeout(timer);
                });


            } else {
                console.log('请求失败@@@！！！！');
                getPageData(url);
            }

        });
    }, 1000 * Math.ceil(Math.random() * 20 + 10));

}



// 检查数据是否已存在
function findExistData(id, callback) {
    Controller.Movie.find({
        douban_id: id
    }, function(err, movie) {
        if (err) {
            console.log(err);
            callback(err);
            return false;
        }
        callback(null, movie);
    });
}


// 保存数据
function saveMovieData(json, callback) {
    Controller.Movie.save(json, function(err, movie) {
        if (err) {
            console.log(err);
        }
        if (!err) {
            console.log('success');
            callback(movie);
            return;
        }
    });
}

getPageData(url);
