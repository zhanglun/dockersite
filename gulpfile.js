var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function() {
    return gulp.src('./src/scss/todo.scss', {
            sourcemap: true
        })
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('./map'))
        .pipe(gulp.dest('./src/css'))
        .pipe(livereload());
});

gulp.task('watch', function() {
    gulp.watch(['./src/scss/todo.scss', './src/scss/**/*.scss']['sass']);
});

gulp.task('develop', function() {
    livereload.listen();
    nodemon({
        script: 'server.js',
        ext: 'js coffee handlebars scss'
    }).on('restart', function() {
        setTimeout(function() {
            livereload.changed(__dirname);
        }, 500);
    });
});

gulp.task('default', [
    'sass',
    'develop',
    'watch'
]);
