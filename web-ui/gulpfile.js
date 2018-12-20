let path = {
  src: 'src',
  src_scss: 'src/scss',
  dist: 'dist'
};

let gulp = require('gulp'),
  html = require('gulp-html');
scss = require('gulp-sass'),
lint = require('gulp-stylelint'),
postcss = require('gulp-postcss'),
sourcemaps = require('gulp-sourcemaps'),
prefix = require('autoprefixer'),
browserSync = require('browser-sync').create(),
babel = require('gulp-babel'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify');

/* scss */
gulp.task('scss', ['lint'], () => gulp.src(path.src_scss + '/index.scss').pipe(sourcemaps.init()).pipe(scss().on('error', scss.logError)).pipe(postcss([prefix({browsers: ['last 2 versions'], cascade: false})])).pipe(sourcemaps.write('.')).pipe(gulp.dest(path.dist + '/css')).pipe(browserSync.stream())
//.pipe(browserSync.reload({ stream: true }))
);

/* linter */
gulp.task('lint', () => gulp.src(path.src_scss + '/**/*.scss').pipe(lint({
  failAfterError: true,
  reporters: [
    {
      formatter: 'verbose',
      console: true
    }
  ],
  debug: true
})));

/* html */
gulp.task('html', function () {
  return gulp
    .src(path.src + '/index.html')
    .pipe(html())
    .pipe(gulp.dest(path.dist));
});

/* js-babel */
gulp.task('babel', () => gulp.src(path.src + '/**/*.js').pipe(sourcemaps.init()).pipe(babel({presets: ['@babel/env']})).pipe(uglify()).pipe(concat('scripts.js')).pipe(sourcemaps.write('.')).pipe(gulp.dest(path.dist)));

/* liveserver */
gulp.task('liveserver', () => browserSync.init({
  server: {
    baseDir: path.dist
  },
  notify: false
}));

gulp.task('watch', [
  'html', 'babel', 'scss', 'liveserver'
], function () {
  gulp.watch(path.src_scss + '/**/*.scss', ['scss']);
  gulp
    .watch(path.src + '/*.html')
    .on('change', browserSync.reload);
});

gulp.task('default', ['watch']);
