var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var browserify = require('gulp-browserify');

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

gulp.task('browserify', function () {
  gulp.src('./app/todovue/js/*.js')
    .pipe(browserify({
      insertGlobals: true,
      debug: true
    }))
    .pipe(gulp.dest('./app/todovue/dist/'));
});
gulp.task('browserify1', function () {
  gulp.src('./app/blog/js/*.js')
    .pipe(browserify({
      insertGlobals: true,
      debug: true
    }))
    .pipe(gulp.dest('./app/blog/dist/'));
});

gulp.task('watch', function () {
  gulp.watch('./app/**/css/*.scss', ['sass']);
  gulp.watch('./app/**/js/*.js', ['browserify', 'browserify1']);
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
  'browserify',
  'browserify1',
  'develop',
  'watch'
]);
