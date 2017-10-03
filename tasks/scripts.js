// scripts.js  处理js的脚本
import gulp from 'gulp';          		  // 项目的构建都是基于gulp的
import gulpif from 'gulp-if';     		  // gulp-if是用gulp中的语句做判断的
import concat from 'gulp-concat'; 		  // 在gulp中处理文件拼接
import webpack from 'webpack';    		  // 项目打包工具用的是webpack
import gulpWebpack from 'webpack-stream'; // gulp处理的都是一些文件流，是基于stream的
import named from 'vinyl-named';  		  // 对文件重命名做标志
import livereload from 'gulp-livereload'; // 文件修改以后，浏览器自动刷新，热更新的包
import plumber from 'gulp-plumber';       // 处理文件信息流
import rename from 'gulp-rename';         // 对文件重命名
import uglify from 'gulp-uglify';         // 处理js压缩和css压缩
import {log,colors} from 'gulp-util';	  // 在命令行输出的包
import args from './util/args.js';  	  // 对命令行参数解析的包(自己写好的)

// 创建gulp脚本任务，task是gulp提供的API,名称是:script
gulp.task('scripts', ()=>{
	return gulp.src(['app/js/index.js']) // 处理的内容,src也是gulp提供的标准API
		.pipe(plumber({ // 处理错误逻辑
			errorHandle: function(){

			}
		}))
		.pipe(named()) // 重命名文件
		.pipe(gulpWebpack({ // 对js文件进行编译，利用webpack
			module:{
				loaders:[{
					test: /\.js$/,
					loader: 'babel-loader' 
				}]
			}
		}),null, (err,stats)=>{ // 处理出错情况
			log(`Finish '${colors.cyan('scripts')}'`, stats.toString({
				chunks:false
			}))
		})
		.pipe(gulp.dest('server/public/js')) // 指定文件编译完后的存放位置
		.pipe(rename({ // 重命名编译后的文件
			basename:'cp',
			extname: '.min.js'
		}))
		.pipe(uglify({compress:{properties:false}, output:{'quote_keys':true}})) // 压缩文件的配置
		.pipe(gulp.dest('server/public/js')) // 指定存储压缩后文件的位置
		.pipe(gulpif(args.watch, livereload())) // 监听文件，当文件变化后，自动会刷新
})