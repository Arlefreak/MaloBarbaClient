"use strict";

var gulp       = require('gulp');
var mbf        = require('main-bower-files');
var concat     = require('gulp-concat');
var jshint     = require('gulp-jshint');
var sass       = require('gulp-sass');
var livereload = require('gulp-livereload');
var connect    = require('gulp-connect');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil      = require('gulp-util');

gulp.task('bower', function () {  
  gulp.src(mbf({includeDev: true}).filter(function (f) { return f.substr(-2) === 'js'; }))
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('public/js/'));
});

gulp.task('browserify', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/js/app.js',
    debug: true
  });

  return b.bundle()
  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .on('error', gutil.log)
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./public/js/'));
});

gulp.task('jshint', function () {  
  return gulp.src(['src/js/**/*.js', '!src/js/templates/**/*.js'])
  .pipe(jshint(process.env.NODE_ENV === 'development' ? {devel: true} : {}))
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'));
});

gulp.task('sass', function () {
  gulp.src('src/sass/main.scss')
  .pipe(sass({outputStyle: process.env.NODE_ENV === 'development' ? 'expanded': 'compressed'}))
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('public/css/'))
  .pipe(connect.reload());
});

gulp.task('sass:watch', function () {
  gulp.watch('src/sass/**/*.scss', ['sass']);
});

gulp.task('connect', function() {
  connect.server({
    root: 'public',
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./public/*.html')
  .pipe(connect.reload());
});

gulp.task('watch', ['browserify', 'sass', 'connect'] ,function () {  
  gulp.watch('src/js/**/*.js', [ 'browserify' ]);
  gulp.watch('src/sass/**/*.scss', [ 'sass' ]);
  gulp.watch('public/*.html', ['html']);
  // livereload.listen();
  // gulp.watch('public/**').on('change', livereload.changed);
});
