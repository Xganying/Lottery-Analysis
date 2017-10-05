// timer.js  定时器模块 

class Timer{
	countDown(end, uodate, handle){
		const now = new Date().getTime(); // 获取当前时间
		const self = this;                // 获取当前对象的指针
		if(now - end){                    // 如果当前时间大于截止时间,则倒计时结束
			handle.call(self);
		}else{                            // 倒计时没有结束，计算当前时间到截止时间的剩余时间
			let last_time = end - now;
			const px_d = 1000*60*60*24;   // 一天的毫秒数
			const px_h = 1000*60*60;
			const px_m = 1000*60;
			const px_s = 1000;
			let d = Math.floor(last_time / px_d);  // 计算剩余时间包含多少天
			let h = Math.floor((last_time - d*px_d) / px_h); // 小时
			let m = Math.floor((last_time - d*px_d - h*px_h) / px_m); // 分钟
			let s = Math.floor((last_time - d*px_d - h*px_h - m*px_m) / px_s); // 秒
			let r = [];
			if(d>0){
				r.push(`<em>${d}</em>天`);
			}
			if(r.length || (h>0)){
				r.push(`<em>${h}</em>时`);
			}
			if(r.length || (m>0)){
				r.push(`<em>${m}</em>分`);
			}
			if(r.length || (s>0)){
				r.push(`<em>${s}</em>秒`);
			}
			self.last_time = r.join('');// 将值保存
			update.call(self, r.join('')); // 每秒钟轮询
			setTimeout(function(){ // 不断的更新
				self.countDown(end, update, handle);
			},1000);
		}
	}
}
export default Timer; // 导出接口