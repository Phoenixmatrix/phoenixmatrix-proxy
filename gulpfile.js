"use strict";

var gulp = require('gulp'),
  watch = require('gulp-watch'),
  babel = require('gulp-babel'),
  runSequence = require('run-sequence'),
  sourcemaps = require('gulp-sourcemaps'),
  clean = require('gulp-clean'),
  less = require('gulp-less'),
  path = require('path');

var exec = require('child_process').exec;

var babelOptions = {
  blacklist: [
    'es6.constants',
    'es6.blockScoping',
    'es6.spec.blockScoping',
    'es6.spec.symbols',
    'es6.spec.templateLiterals',
    'regenerator'
  ]
};

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
    .pipe(babel(babelOptions))
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
