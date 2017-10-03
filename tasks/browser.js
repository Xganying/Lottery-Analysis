// browser.js 监听浏览器事件脚本
import gulp from 'gulp';          		  // 项目的构建都是基于gulp的
import gulpif from 'gulp-if';     		  // gulp-if是用gulp中的语句做判断的
import gutil from 'gulp-util';            // gulp常用的工具
import livereload from 'gulp-livereload'; // 文件修改以后，浏览器自动刷新，热更新的包
import args from './util/args';  	  // 对命令行参数解析的包(自己写好的)

gulp.task('browser', (cb)=>{
	if(!args.watch){
		return cb();
	}
	gulp.watch('app/**/*.js',['scripts']);
	gulp.watch('app/**/*.ejs',['pages']);
	gulp.watch('app/**/*.css',['css']);
});
