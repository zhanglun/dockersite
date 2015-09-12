var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
    return sass('./src/scss/todo.scss')
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./map'))
        .pipe(gulp.dest('./src/css'))
        .pipe(livereload());
});

gulp.task('watch', function() {
    gulp.watch(['./src/scss/todo.scss','./src/scss/**/*.scss'] ['sass']);
});

gulp.task('develop', function () {
    livereload.listen();
    nodemon({
        script: 'server.js',
        ext: 'js coffee handlebars'
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
