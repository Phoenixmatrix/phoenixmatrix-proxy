import gulp from 'gulp';
import babel from 'gulp-babel';
import runSequence from 'run-sequence';
import clean from 'gulp-clean';
import less from 'gulp-less';
import path from 'path';
import {exec} from 'child_process';

gulp.task('clean', () => {
  return gulp.src('./dist', {read: false})
    .pipe(clean());
});

gulp.task('build:styles', () => {
  return gulp.src('./stylesheets/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('rebuild', (cb) => {
  return runSequence('clean', 'build', cb);
});

gulp.task('build:js', () => {
  return gulp.src(['./src/**/*.js', './src/**/*.jsx'])
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['build:js', 'build:styles']);

gulp.task('run', () => {
  exec(path.normalize('./node_modules/.bin/electron') + ' .');
});

gulp.task('default', (cb) => {
  return runSequence('build', 'run', cb);
});
