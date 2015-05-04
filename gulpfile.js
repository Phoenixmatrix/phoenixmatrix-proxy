"use strict";

var gulp = require('gulp'),
  watch = require('gulp-watch'),
  to5 = require('gulp-6to5'),
  runSequence = require('run-sequence'),
  sourcemaps = require('gulp-sourcemaps'),
  clean = require('gulp-clean'),
  less = require('gulp-less'),
  path = require('path');

var exec = require('child_process').exec;

gulp.task('clean', function() {
  return gulp.src('./dist', {read: false})
    .pipe(clean());
});

gulp.task('build:styles', function() {
  return gulp.src('./stylesheets/style.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('rebuild', function(cb) {
  return runSequence('clean', 'build', cb);
});

gulp.task('build:js', function() {
  return gulp.src(['./js/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(to5())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['build:js', 'build:styles']);

gulp.task('run', function() {
  exec(path.normalize('./node_modules/.bin/electron') + ' .');
});

gulp.task('default', function(cb) {
  return runSequence('build', 'run', cb);
});
