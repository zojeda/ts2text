var gulp = require('gulp');
var fs = require('fs')

var ts2text = require('../');



var template = fs.readFileSync('./template.tpl').toString()

gulp.task('generate', function () {
  return gulp.src('./*.d.ts')
    .pipe(ts2text({
            template: template,
            outputPath: 'services.ts'
        }))
    .pipe(gulp.dest('generated'));
});


