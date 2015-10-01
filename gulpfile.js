var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var stylePath = '';
var filebase = '';
gulp.task('sass', function () {
  return gulp.src('./app/**/css/*.scss', {sourcemap: true})
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write(
      '/map/'
    ))
    .pipe(gulp.dest(function (file) {
      return file.base;
    }))
    .pipe(livereload());
});

gulp.task('watch', function () {
  gulp.watch('./app/**/css/*.scss', ['sass']);
});

gulp.task('develop', function () {
  livereload.listen(35730);
  nodemon({
    script: 'server.js',
    ext: 'js coffee handlebars scss'
  }).on('restart', function () {
    setTimeout(function () {
      livereload.changed(__dirname);
    }, 500);
  });
});

gulp.task('default', [
  'sass',
  'develop',
  'watch'
]);
