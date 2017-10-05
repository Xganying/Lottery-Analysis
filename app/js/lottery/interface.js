// interface.js 接口模块 所有和服务端通讯相关的功能
import $ from 'jquery';

class Interface{     // 声明一个类
	getOmit(issue){  // 遗漏数据接口方法
		let self = this;
		return new Promise((resolve, reject)=>{  // 利用Promise解决回调问题
			$.ajax({              	// 使用jquery的ajax发起通信
				url: '/get/omit', 	// 接口的地址
				data:{            	// 前端和后端原定传递的参数
					issue: issue
				},
				dataType: 'json',           // 数据类型
				success: function(res){     // 通信成功
					self.setOmit(res.data); // 将当前的数据保存到当前的对象上
					resolve(self, res);     // 将服务器返回的数据都传给resolve的下一步，保证下一步执行的时候能取到服务端返回的数据
				},
				error: function(err){       //通信失败
					reject.call(err);       // 如果出错，就阻塞下一步执行
				}
			});
		});
	}
	getOpenCode(issue){ //获取开奖号码方法
		let self = this;
		return new Promise((resolve, reject)=>{
			$.ajax({
				url: '/get/opencode',
				data:{
					issue:issue
				},
				dataType: 'json',
				success: function(res){
					self.setOpenCode(res.data);  // 保存当前的开奖号码(其他文件中实现的setOpenCode方法)
					resolve.call(self,res);
				},
				error: function(err){
					reject.call(err);
				}
			});
		});
	}
	getState(issue){ //获取当前的期号方法
		let self = this;
		return new Promise((resolve, reject)=>{
			$.ajax({
				url: '/get/state',
				data:{
					issue:issue
				},
				dataType: 'json',
				success: function(res){
					reject.call(self, res);
				},
				error: function(err){
					reject.call(err);
				}
			});
		});
	}
}
export default Interface; //导出当前接口
