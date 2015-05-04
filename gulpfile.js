var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    header  = require('gulp-header'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    package = require('./package.json');

gulp.task('css', function () {
    return gulp.src(['src/scss/style.scss'
        ])
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('js',function(){
  gulp.src([
      'src/js/jquery.easing.min.js',
      'src/js/_chart.js',
      'src/js/scripts.js'])
//TODO: JSHint ignore vendor files.
//    .pipe(jshint('.jshintignore'))
//    .pipe(jshint('.jshintrc'))
//    .pipe(jshint.reporter('default'))
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('fonts', function () {
    return gulp.src([
        'bower_components/fontawesome/fonts/fontawesome-webfont.ttf',
        'bower_components/fontawesome/fonts/fontawesome-webfont.woff2',
        'bower_components/fontawesome/fonts/fontawesome-webfont.woff'])
    .pipe(gulp.dest('app/assets/fonts'));
});

gulp.task('copy', ['copy-modernizr', 'copy-jquery', 'copy-jquery-map']);

gulp.task('copy-modernizr', function(){
return gulp.src('bower_components/modernizr/modernizr.js')      // Gets Modernizr
    .pipe(uglify())                                                 // Uglify(minify)
    .pipe(rename({suffix: '.min'}))                                 // Rename it
    .pipe(gulp.dest('app/assets/js/'));                                 // Set destination to assets/js
});

gulp.task('copy-jquery', function(){
return gulp.src('bower_components/jquery/dist/jquery.min.js')   // Gets Jquery
    .pipe(gulp.dest('app/assets/js/'));                                 // Set destination to assets/js
});

gulp.task('copy-jquery-map', function(){
return gulp.src('bower_components/jquery/dist/jquery.min.map')
    .pipe(gulp.dest('app/assets/map/'));                                 // Set destination to assets/js
});


gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "app"
        }
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['css', 'js', 'fonts', 'browser-sync', 'copy'], function () {
    gulp.watch("src/scss/*/*.scss", ['css']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("app/*.html", ['bs-reload']);
});
