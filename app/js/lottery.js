// lottery.js
import 'babel-polyfill';//引入兼容处理模块
import Timer from './lottery/timer.js'; 
import Base from './lottery/base.js';
import calculate from './lottery/calculate.js';
import Interface from './lottery/interface.js';
import $ from 'jquery';

// 多重继承

// 深拷贝
const copyProperties = function(target, source){
	for(let key of Reflect.ownKeys(source)){ // 获取源对象的所有属性
		if( key !== 'constructor' && key !== 'property' && key !== 'name'){ //选择性拷贝
			let desc = Object.getOwnPropertyDescriptor(source, key);
			Object.defineProperty(target, key, desc);
		}
	} 
}
// 多层继承方法
const mix = function(...mixins){
	class Mix{}
	for(let mixin of mixins){
		copyProperties(Mix,mixin);
		copyProperties(Mix.prototype,mixin.prototype); //拷贝原型
	}
	return Mix;
}

// 实现Lottery模块(多个类继承)
class Lottery extends mix(Base,Calculate,Interface,Timer){
	// 构造函数
	constructor(name='syy', cname='11选5', issue='**', state='**'){
		super();
		this.name = name; 				// 区别多个彩种的识别
		this.cname = cname; 			// 彩种中文名称
		this.issue = issue;				// 当前期号
		this.state = state;				// 状态
		this.el = '';					// 当前的选定
		this.omit = new Map();			// 遗漏
		this.open_code = new Set();		// 开奖号码
		this.open_code_list = new Set();// 开奖记录
		this.play_list = new Map();		// 玩法列表
		this.number = new Set();		// 选号
		this.issue_el = new Set();		// 当前选号的期号选择器
		this.countdown_el = '#curr_issue'; // 倒计时选择器
		this.state_el = '.state_el';	// 状态选择器
		this.cart_el = '.codelist';		// 购物车选择器
		this.omit_el = '';				// 遗漏选择器，初始为默认
		this.cur_play = 'r5';			// 默认玩法
		this.initPlayList();			// 玩法初始化
		this.initNumber();				// 初始化
		this.updateState();				// 更新状态
		this.initEvent();				// 事件初始化
	}
	// 状态更新
	updateState(){
		let self = this;
		this.getState().then(function(res){
			self.issue =res.issue; // 获取当前期号
			slef.state = res.state; // 最新销售的截止时间
			$(self.issue_el).text(res.issue); //更新当前期号
			// 更新倒计时
			self.countdown(res.end_time, function(time){
				$(self.countdown_el).html(time); //  更新时间
			},function(){ // 倒计时结束
				setTimeout(function(){
					self.updateState(); // 重新获取最新的销售状态
					self.getOmit(self.issue).then(function(res){ // 获取遗漏
						// 操作
					});
					self.getOpenCode(self.issue).then(function(res){ //更新奖号
						// 操作
					})
				},500);
			});
		});
	}
	// 事件初始化
	initEvent(){	
		let self = this;
		$('#plays').on('click', 'li', self.changePlayNav.bind(self)); 				// 完成切换
		$('.boll-list').on('click', '.btn-boll', self.toggleCodeActive.bind(self)); // 号码选中
		$('#confirm_sel_code').on('click', self.addCode.bind(self));				// 添加号码
		$('.dxjo').on('click', 'li', self.assistHandle.bind(self));						// 操作区：大小奇偶
		$('qkmethod').on('click', '.btn-middle', self.getRandomCode.bind(self));	// 随机号码选择
	}
}

export default Lottery;


