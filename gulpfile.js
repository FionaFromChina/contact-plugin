var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var rename = require("gulp-rename");
var size = require('gulp-size');
var uglify = require('gulp-uglify');


const SIZE_OPTS = {
    showFiles: true,
    gzip: true
};


gulp.task('sass',function() {
    return gulp.src('./src/css/jquery.terminalSelect.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(minifyCSS())
        .pipe(size(SIZE_OPTS))
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('js', function () {
   return gulp.src('./src/js/jquery.terminalSelect.js')
       .pipe(gulp.dest('./dist/js/'))
       .pipe(uglify())
       .pipe(size(SIZE_OPTS))
       .pipe(rename({suffix:".min"}))
       .pipe(gulp.dest('./dist/js/'));
});

gulp.task('watch',function() {
    gulp.watch('./src/css/*.scss',['sass']);
    gulp.watch('./src/js/*.js',['js']);
});

