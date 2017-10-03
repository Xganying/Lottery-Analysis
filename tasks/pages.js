// pages.js 处理模板的构建脚本
import gulp from 'gulp';          		  // 项目的构建都是基于gulp的
import gulpif from 'gulp-if';     		  // gulp-if是用gulp中的语句做判断的
import livereload from 'gulp-livereload'; // 文件修改以后，浏览器自动刷新，热更新的包
import args from './util/args.js';  	  // 对命令行参数解析的包(自己写好的)

gulp.task('pages', ()=>{
	return gulp.src(['app/**/*.ejs'])
		.pipe(gulp.dest('server')) // 原封不动的拷贝文件到server
		.pipe(gulpif(args.watch, livereload())) // 监听是不是热更新
})