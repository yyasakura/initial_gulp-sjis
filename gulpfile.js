var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var postcss = require('gulp-postcss');
var imagemin = require('gulp-imagemin');
var pngquant  = require('imagemin-pngquant');
var mozjpeg  = require('imagemin-mozjpeg');
var plumber = require('gulp-plumber');//エラーにより停止防止
var csscomb = require('gulp-csscomb');//css property
var extender = require('gulp-html-extend');
var replace = require('gulp-replace');
var convertEncoding = require('gulp-convert-encoding');
var browserSync = require('browser-sync').create();
var ssi = require('browsersync-ssi');
var rimraf = require('rimraf');


// Browser Version
var browsers = { browsers: ['last 2 versions', 'ie >= 9'] };


// Directory
var dir  = {
  app: 'app',
  dest: 'dist',
  scss: ['app' + baseurl + 'common/css/scss/**/*.scss'],
  css: 'dist' + baseurl + 'common/css',
  initFile: 'index.html'
};


// File Task
gulp.task('html', function(){
  return gulp.src([dir.app + '/**/*.html'], { base: dir.app })
    .pipe(gulp.dest( dir.dest ))
    .pipe(browserSync.stream());
});

gulp.task('sass', function() {
  var plugins = [
      require('autoprefixer')(browsers)
  ];
  return sass(dir.scss)
    .pipe(plumber())
    .pipe(postcss(plugins))
    .pipe(csscomb())
    .pipe(gulp.dest( dir.css ))
    .pipe(browserSync.stream());
});

gulp.task('js', function(){
  return gulp.src([dir.app + '/**/*.js'], { base: dir.app })
    .pipe(gulp.dest( dir.dest ))
    .pipe(browserSync.stream());
});

gulp.task('css', function(){
  return gulp.src([dir.app + '/**/*.css'], { base: dir.app })
    .pipe(gulp.dest( dir.dest ))
});

gulp.task('fonts', function(){
  return gulp.src([dir.app + '/**/*.+(eot|otf|woff|ttf)'], { base: dir.app })
    .pipe(gulp.dest( dir.dest ))
});

gulp.task('image', function(){
  return gulp.src([dir.app + '/**/*.+(jpg|jpeg|png|gif|svg)'], { base: dir.app })
    .pipe(gulp.dest( dir.dest ))
});

gulp.task('imagemin', function(){
  return gulp.src([dir.app + '/**/*.+(jpg|jpeg|png|gif|svg)'], { base: dir.app })
    .pipe(imagemin([
      pngquant({ quality: '65-80', speed: 1 }),
      mozjpeg({ quality: 80 }),
      imagemin.svgo(),
      imagemin.gifsicle()
    ]))
    .pipe(gulp.dest( dir.dest ))
});


// Watch
gulp.task('watch', function() {
  gulp.watch([dir.app + '/**/*.html'], ['html']);
  gulp.watch([dir.app + '/**/*.css'], ['css']);
  gulp.watch([dir.scss], ['sass']);
  gulp.watch([dir.app + '/**/*.js'], ['js']);
  gulp.watch([dir.app + '/**/*.+(eot|otf|woff|ttf)'], ['fonts']);
  gulp.watch([dir.app + '/**/*.+(jpg|jpeg|png|gif|svg)'], ['image']);
});


// Server
gulp.task('server', function() {
  browserSync.init({
    ghostMode: false,
    notify: false,
    startPath: dir.initFile,
    server: {
      baseDir: dir.dest,
      middleware: [
        ssi({ baseDir: dir.dest, ext: '.html' })
      ]
    }
  });
});


// Clean
gulp.task('clean', function (cb) {
  rimraf(dir.dest, cb);
});


gulp.task('default', ['server', 'watch', 'html', 'sass', 'css', 'js', 'fonts', 'image']);



// Build
gulp.task('build_html', function(){
  return gulp.src([dir.app + '/**/*.html'], { base: dir.app })
    .pipe(replace('charset="utf-8"', 'charset="shift_jis"'))
    .pipe(convertEncoding({to: 'Shift_JIS'}))
    .pipe(gulp.dest( dir.dest ))
});

gulp.task('build_sass', function(){
  var plugins = [
      require('autoprefixer')(browsers)
  ];
  return sass(dir.scss)
    .pipe(plumber())
    .pipe(postcss(plugins))
    .pipe(csscomb())
    .pipe(replace('@charset "utf-8";', '@charset "shift_jis";'))
    .pipe(convertEncoding({to: 'Shift_JIS'}))
    .pipe(gulp.dest( dir.css ))
});

gulp.task('build_js', function(){
  return gulp.src([dir.app + '/**/*.js'], { base: dir.app })
    .pipe(convertEncoding({to: 'Shift_JIS'}))
    .pipe(gulp.dest( dir.dest ))
});

gulp.task('build_css', function(){
  return gulp.src([dir.app + '/**/*.css'], { base: dir.app })
    .pipe(replace('@charset "utf-8";', '@charset "shift_jis";'))
    .pipe(convertEncoding({to: 'Shift_JIS'}))
    .pipe(gulp.dest( dir.dest ))
});

gulp.task('build', ['build_html', 'build_sass', 'build_css', 'build_js', 'fonts', 'imagemin']);