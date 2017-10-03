// build.js 关联所有的任务
import gulp from 'gulp';          		  // 项目的构建都是基于gulp的
import gulpSequence from 'gulp-sequence'; // 处理包的顺序问题

gulp.task('build', gulpSequence('clean','css','pages','scripts',['browser','server']));