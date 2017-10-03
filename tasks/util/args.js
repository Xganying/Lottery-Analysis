// args.js  构建任务脚本的目录
import yargs from 'yargs';


const args = yargs

	// 区分开发环境和线上环境
	.option('production', {
		boolean: true,  // gulp -production
		default: false, // 默认值是开发环境
		describe: 'min all script'
	})

	// 是否监听开发环境中改动文件
	.option('watch', {
		boolean: true,
		default: false,
		describe:'watch all files'
	})

	// 是否输出命令行详细的日志
	.option('verbose', {
		boolean: true,
		default: false,
		describe:'log'
	})

	// 映射
	.option('sourcemaps', {
		describe:'force the creation of sourcemaps' // 强制生成sourcemaps
	})

	// 设置服务器端口
	.option('port', { // 表示对输入的命令行的内容以字符串作为解析
		string: true,
		default: 8001,
		describe: 'server port'
	})

	.argv 

	export default args;

