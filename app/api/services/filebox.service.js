var db = require('../models');
var fileBox = {};


var getFileName = function(name){
  return name.split('.').slice(0, -1);
};

var getFileExt = function(name){
  return name.split('.').slice(-1);
}



fileBox.save = function(file){
  return file.saveAsync()
    .then(function(file){
      return file;
    })
    .catch(function(err){
      return err;
    });
};

fileBox.get = function(query){
  return db.File.findAsync(query)
    .then(function(files){
      return files;
    })
    .catch(function(err){
      return  err;
    });
};

fileBox.getOne = function(query){
  return db.File.findOneAsync(query)
    .then(function(files){
      return files;
    })
    .catch(function(err){
      return  err;
    });
};


fileBox.add = function(param){
  var name = param.name;
  var parent_id = param.parent_id;  
  var isfile = param.isfile == 0 ? false: true;
  
  if(isfile){
    nameReg = new RegExp(getFileName(name) + '(\\(\\d+\\))*.'+ getFileExt(name) +'$', 'i');
  }else{
    nameReg = new RegExp(name + '(\\(\\d+\\))*$', 'i');
  }
  
  var newfile = new db.File(param);

  return fileBox.get({$and: [
    {name: nameReg}, 
    {parent_id: parent_id}, 
    {isfile: {$eq: isfile}}
  ]})
    .then(function(files){
      // 目录中存在同名文件或者文件夹
      if(files.length > 0){
        if(isfile){
          newfile.name = getFileName(files[0].name) + '(' + files.length +').' + getFileExt(files[0].name);      
        }else{

          newfile.name = files[0].name + '(' + files.length +')';

        }
      }  
      return fileBox.save(newfile);   
    });

};

module.exports = fileBox;
