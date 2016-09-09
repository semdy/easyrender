var gulp        = require('gulp'),
    cssmin       = require('gulp-minify-css'),
    uglify      = require('gulp-uglify'),
    useref      = require('gulp-useref'),
    gulpif      = require('gulp-if'),
    stylish     = require('jshint-stylish'),
    jshint      = require('gulp-jshint'),
    clean       = require('gulp-clean'),
    runSequence = require('gulp-run-sequence');

gulp.task('useref', function() {
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cssmin()))
        .pipe(gulp.dest('dist'));
});

gulp.task('jshint', function(){
    return gulp.src(['src/scripts/*.js', '!src/scripts/jquery.min.js'])
        .pipe(jshint({
            "undef": false,
            "unused": false
        }))
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean({force: true}));
});

gulp.task('copyjs', function(){
    return gulp.src(['src/scripts/jquery.min.js', 'src/scripts/bulletManager.js', 'src/scripts/chat-bullet.js'])
        .pipe(gulp.dest('dist/scripts'));
});

gulp.task('copyimages', function(){
    return gulp.src('src/images/**/*.{png,jpg,jpeg,gif,json}')
        .pipe(gulp.dest('dist/images'));
});

gulp.task('default', function(done) {
    runSequence(/*'jshint',*/ 'clean', 'useref', ['copyjs', 'copyimages'], done);
});

