var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var tsProject = ts.createProject('tsconfig.json');

var mocha = require('gulp-mocha');


gulp.task('scripts', function () {
	var tsResult = tsProject.src() // instead of gulp.src(...)
		.pipe(sourcemaps.init()) // This means sourcemaps will be generated 
		.pipe(ts(tsProject))
	return tsResult.js
				.pipe(concat('ts2text.js')) // You can use other plugins that also support gulp-sourcemaps 
				.pipe(sourcemaps.write({includeContent: false, sourceRoot: '/src'})) // Now the sourcemaps are added to the .js file 
				.pipe(gulp.dest('lib'));

});



gulp.task('build-tests', function() {
    return gulp.src('test/**/*.spec.ts')
		.pipe(ts({
			noImplicitAny: true
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('test', ['build-tests'], function() {
    return gulp.src('build/*.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'spec'}));
});