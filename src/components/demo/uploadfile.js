window.onload = function () {
  var uploadBtn = document.getElementById('upload');
  var fileInput = document.getElementById('addfile');
  uploadBtn.addEventListener('click', function () {
    var file = fileInput.files;
    console.log(file);
  }, false);
};
