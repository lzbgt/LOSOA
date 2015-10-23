var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    jshint = require("gulp-jshint"),
    lzmajs = require("gulp-lzmajs"),
    del = require('del');

gulp.task('clear', function(){
    del(['dist/_app.js']);
});
gulp.task('clear2', function(){
    del(['dist/_res.js']);
});

gulp.task('compress2', ['clear2'], function() {
    return gulp.src(["js/oa-all-css.js","js/oa-html-res.js","js/oa-file-html.js"])
        .pipe(babel())
        //.pipe(jshint())
        //.pipe(jshint.reporter())
        //.pipe(concat('_res.js'))
        //.pipe(uglify())
        //.pipe(lzmajs())
        .pipe(gulp.dest('dist'));
});

gulp.task('compress1', ['clear'], function() {
    return gulp.src(["js/angular-sanitize.js","app.js","js/oa-all-js.js","app/task.js","app/fileApp.js","app/oa_sign_js.js"])
        .pipe(jshint())
        .pipe(jshint.reporter())
        //.pipe(concat('_app.js'))
        .pipe(babel())
        //.pipe(uglify())
        //.pipe(lzmajs())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['compress1', 'compress2'], function() {
    //return gulp.src(["js/jquery.min.js","js/angular.min.js","js/angular-ui-router.min.js","js/FileSaver.min.js","js/lodash.min.js","js/angularjs-dropdown-multiselect.js","js/marked.min.js","js/ui-bootstrap-tpls.js", 'dist/_res.js', 'dist/_app.js'])
    //    .pipe(concat('dist_app.js'))
    //    .pipe(gulp.dest('dist'));
});
