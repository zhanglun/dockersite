var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
var sass = require('gulp-ruby-sass');

gulp.task('sass', function () {
    return sass('./src/css/')
        .pipe(gulp.dest('./build/css'))
        .pipe(livereload());
});

gulp.task('watch', function () {
    gulp.watch('./src/css/*.scss', ['sass']);
});

gulp.task('develop', function () {
    livereload.listen();
    nodemon({
        "env": {
            "NODE_ENV": "development"
        },
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
