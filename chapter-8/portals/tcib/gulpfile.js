var gulp = require('gulp');
var nodemon = require('gulp-nodemon');


gulp.task('default', ['nodemon'], function() {});
gulp.task('nodemon', function(cb) {
  return nodemon({
      script: 'server.js',
      ext: 'js html css hbs json',
      ignore: ['./node_modules/**']
    })
    .on('restart', function() {
      console.log('Restarting');
    });
});