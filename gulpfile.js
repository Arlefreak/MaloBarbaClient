"use strict";

var gulp       = require('gulp');
var bower      = require('main-bower-files');
var gulpif     = require('gulp-if');
var jshint     = require('gulp-jshint');
var uglify     = require('gulp-uglify');
var concat     = require('gulp-concat');
var flatten    = require('gulp-flatten');
var rename     = require('gulp-rename');
var gulpFilter = require('gulp-filter');
var stylus     = require('gulp-stylus');
var nib        = require('nib');
var connect    = require('gulp-connect');
// var browserify = require('browserify');
// var source     = require('vinyl-source-stream');
// var buffer     = require('vinyl-buffer');
// var sourcemaps = require('gulp-sourcemaps');
// var gutil      = require('gulp-util');
var imagemin   = require('gulp-imagemin');
var pngquant   = require('imagemin-pngquant');
var gifsicle   = require('imagemin-gifsicle');
var jpegtran   = require('imagemin-jpegtran');
var svgo       = require('imagemin-svgo');

var DEBUG = process.env.NODE_ENV === 'production' ? false : true;

// Define paths variables
// grab libraries files from bower_components, minify and push in /docs
gulp.task('bower', function() {
    var jsFilter = gulpFilter('**/*.js', {restore: true});
    var cssFilter = gulpFilter('**/*.css', {restore: true});
    var fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf']);
    var dest_path =  'docs/lib';

    return gulp.src(bower({debugging: true, includeDev: true}))

    // grab vendor js files from bower_components, minify and push in /docs
    .pipe(jsFilter)
    .pipe(gulp.dest(dest_path + '/js/'))
    .pipe(gulpif(!DEBUG,uglify()))
    .pipe(concat('vendor.js'))
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest(dest_path + '/js/'))
    .pipe(jsFilter.restore)

    // grab vendor css files from bower_components, minify and push in /docs
    .pipe(cssFilter)
    .pipe(gulp.dest(dest_path + '/css/'))
    // .pipe(minifycss())
    // .pipe(rename({
    //     suffix: ".min"
    // }))
    .pipe(gulp.dest(dest_path + '/css/'))
    .pipe(cssFilter.restore)

    // grab vendor font files from bower_components and push in /docs
    .pipe(fontFilter)
    .pipe(flatten())
    .pipe(gulp.dest(dest_path + '/fonts'));
});

gulp.task('js', function() {
    return gulp.src(['src/js/**/*.js', '!src/js/templates/**/*.js'])
    .pipe(jshint({
        devel: DEBUG
    }))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(gulpif(!DEBUG,uglify()))
    .pipe(concat('script.js'))
    .pipe(gulp.dest('./docs/js/'));
});

gulp.task('css', function() {
    gulp.src('src/css/style.styl')
    .pipe(stylus({
        use:nib(),
        compress: !DEBUG,
        import:['nib']
    }))
    .pipe(gulp.dest('docs/css/'))
    .pipe(connect.reload());
});

gulp.task('img', function(){
    gulp.src('src/img/**/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant(), gifsicle(), jpegtran(), svgo()]
    }))
    .pipe(gulp.dest('docs/img'))
    .pipe(connect.reload());
});

gulp.task('html', function() {
    gulp.src('./src/*.html')
    .pipe(gulp.dest('./docs/'))
    .pipe(connect.reload());
});

gulp.task('files', function() {
    gulp.src(['./src/**.*', '!./src/**.*.html', '!./src/**.*js', '!./src/img/'])
    .pipe(gulp.dest('./docs/'));
});

gulp.task('connect', function() {
    connect.server({
        root: 'docs',
        livereload: true,
    });
});

gulp.task('init', ['css', 'bower', 'js', 'img', 'html', 'files']);

gulp.task('watch', ['css', 'js', 'img', 'html', 'connect'], function() {
    gulp.watch('src/css/**/*.styl', ['css']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/img/**/*', ['img']);
    gulp.watch('src/*.html', ['html']);
});

gulp.task('default', ['init']);
