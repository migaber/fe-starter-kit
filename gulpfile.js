// Required Modules
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer');

// Tasks Defination
gulp.task('html', function(){
    gulp.src('app/**/*.html')
    .pipe(reload({stream: true}));
});

gulp.task('scripts', function(){
    gulp.src(['app/js/**/*.js', '!app/js/**/*.min.js'])
    .pipe(rename({suffix:'.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(reload({stream: true}));
});

gulp.task('styles', function(){
    gulp.src('app/scss/styles.scss')
    .pipe(plumber())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('app/css/'))
    .pipe(reload({stream: true}));
});

gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: "./app/"
        }
    })
});

// Watch Task
gulp.task('watch', function() {
    gulp.watch('app/js/**/*.js', ['scripts']);
    gulp.watch('app/scss/**/*.scss', ['styles']);
    gulp.watch('app/**/*.html', ['html']);
});

// Build Task

gulp.task('build:clean', function(){
    del([
        'build/**'
    ]);
});

gulp.task('build:copy', ['build:clean'], function(){
    return gulp.src('app/**/*/')
            .pipe(gulp.dest('dist/'));
});

gulp.task('build:remove', ['build:copy'], function(){
    del([
        'dist/scss/',
        'dist/js/!(*.min.js)'
    ]);
});

gulp.task('build:serve', function(){
    browserSync({
        server: {
            baseDir: "./dist/"
        }
    })
});

gulp.task('build', ['build:copy', 'build:remove']);

// Default Task
gulp.task('default', ['scripts', 'styles', 'html', 'browser-sync', 'watch']);
