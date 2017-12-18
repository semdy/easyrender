var gulp        = require('gulp');
var htmlreplace = require('gulp-html-replace');
var plugins     = require('gulp-load-plugins')();

gulp.task('makefile', function() {
    return gulp.src([
      "src/scripts/Base.js",
      "src/scripts/RequestAnimationFrame.js",
      "src/scripts/Utils.js",
      "src/scripts/Event.js",
      "src/scripts/GroupManager.js",
      "src/scripts/Loader.js",
      "src/scripts/Ticker.js",
      "src/scripts/Timer.js",
      "src/scripts/Easing.js",
      "src/scripts/Tween.js",
      "src/scripts/TouchEvent.js",
      "src/scripts/TouchScroll.js",
      "src/scripts/Renderer.js",
      "src/scripts/MovieClip.js",
      "src/scripts/ScrollView.js",
      "src/scripts/Stats.js"
    ])
    .pipe(plugins.concat('easyrender.js'))
    .pipe(gulp.dest('dist/scripts/libs'));
});

gulp.task('makefile-min', function() {
  return gulp.src('dist/scripts/libs/easyrender.js')
    .pipe(plugins.uglify())
    .pipe(plugins.rename('easyrender.min.js'))
    .pipe(gulp.dest('dist/scripts/libs'));
});

gulp.task('jshint', function(){
    return gulp.src([
      'src/scripts/*.js',
      '!src/scripts/jquery.min.js',
      '!src/scripts/p2.js',
      '!src/scripts/p2.min.js',
      '!src/scripts/ES6-promise.pollyfill.js'
    ])
    .pipe(plugins.jshint({
        "undef": false,
        "unused": false
    }))
    .pipe(plugins.jshint.reporter(plugins.stylish))
    .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('htmlreplace', function() {
  gulp.src('src/*.html')
    .pipe(htmlreplace({
      'js': 'scripts/libs/easyrender.min.js'
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(plugins.clean({force: true}));
});

gulp.task('copyjs', function(){
    return gulp.src(['src/scripts/jquery.min.js', 'src/scripts/bulletManager.js', 'src/scripts/chat-bullet.js','src/scripts/p2.js'])
        .pipe(gulp.dest('dist/scripts'));
});

gulp.task('copycss', function(){
  return gulp.src('src/styles/**/*.css')
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('copysource', function(){
    return gulp.src('src/images/**/*.{png,jpg,jpeg,gif,json,fnt}')
        .pipe(gulp.dest('dist/images'));
});

gulp.task('default', function(done) {
  plugins.runSequence('clean', 'makefile', 'makefile-min', 'htmlreplace', ['copyjs', 'copycss', 'copysource'], done);
});

