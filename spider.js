var request = require('request');
var cheerio = require('cheerio');
var BufferHelper = require('bufferhelper');

var db = require('./models');
var Controller = require('./controls');

var url = 'http://movie.douban.com/subject/10577869/';









function getPageData(url) {
    request(url, function(err, res, body) {
        console.log(res.statusCode);
        if (!err && res.statusCode == 200) {
            var bufferhelper = new BufferHelper();
            var html = body;
            $ = cheerio.load(html, {
                decodeEntities: false
            });
            var list = $('.recommendations-bd dd');
            // console.log(list.html());

            var current = {};
            current.name = $('span[property="v:itemreviewed"]').html();
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

            Controller.Movie.save(current, function(err) {
                if (err) {
                    console.log(err);
                }
                if (!err) {
                    console.log('success');
                    return;
                }
            });
        }

    });
}



function findExistData(name){
	Controller.Movie.find({
		name: name
	}, function(err, movie){
		if(err){
			callback(err);
		}
		if(movie){
			return false;
		}else{
			return true;
		}
	});
}




getPageData(url);
