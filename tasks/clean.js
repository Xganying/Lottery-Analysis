// clean.js 清空指定文件目录脚本
import gulp from 'gulp';           // 项目的构建都是基于gulp的
import del from 'del';     		   // 删除动作的包
import args from './util/args.js'; // 对命令行参数解析的包(自己写好的)

gulp.task('clean', ()=>{
	return del(['server/public', 'server/views']);
})