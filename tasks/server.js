// server.js 服务器脚本
import gulp from 'gulp';          		   // 项目的构建都是基于gulp的
import gulpif from 'gulp-if';     		   // gulp-if是用gulp中的语句做判断的
import liveserver from 'gulp-live-server'; // 启动一个脚本做为服务器的包
import args from './util/args';  	       // 对命令行参数解析的包(自己写好的)

gulp.task('server', (cb)=>{
	if(!args.watch){
		return cb();
	}
	var server = liveserver.new(['--harmony', 'server/bin/www']);
	server.start(); // 启动服务器

	// 文件被改动后，浏览器自动更新
	gulp.watch(['server/public/**/*.js', 'server/views/**/*.ejs'], function(file){
		server.notify.apply(server,[file]) // 通知服务器文件改动了
	});

	// 监听都文件变化，重启服务
	gulp.watch(['server/routes/**/*.js', 'server/app.js'], function(){
		server.start.bind(server)();
	});
})
