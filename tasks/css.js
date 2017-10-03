// css.js
import gulp from 'gulp';          		  // 项目的构建都是基于gulp的
import gulpif from 'gulp-if';     		  // gulp-if是用gulp中的语句做判断的
import livereload from 'gulp-livereload'; // 文件修改以后，浏览器自动刷新，热更新的包
import args from './util/args';  	  // 对命令行参数解析的包(自己写好的)

gulp.task('css', ()=>{
	return gulp.src(['app/**/*.css'])
		.pipe(gulp.dest('server/public')) // 只拷贝，不监听
		//.pipe(gulpif(args.watch, livereload())) // 正常项目下会有这一句监听的
})