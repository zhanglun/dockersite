var Controller = require('./controls');
var db = require('./models');


function Random(seed){
	if(!seed){
		seed = 100;
	}
	return Math.ceil(Math.random() * seed + 1);
}

var count = 40;


function saveData(){
	count--;
	var obj = {
		name: 'Movie name' + Random(100000000),
		director: '张伦' + Random(200000000),
		stars: [
			{
				name: '范柏舟' + Random(20900000),
				href: '/stars/' + Random(10997876) * 0x10000
			},{
				name: '蒲志远' + Random(2123450),
				href: '/stars/' +Random(132130) * 0x10000
			}
		],
		description: (((1 + Math.random()) * 0x100000000) | 0).toString(16)
	};
	Controller.Movie.save(obj, function(err, movie){
		if(err){
			console.log(err);
		}
		if(movie){
			console.log(movie);
			if(count){
				saveData();
			}else{
				console.log('Down!!!');
				process.exit();
				return false;
			}
		}
	});
}

saveData();

