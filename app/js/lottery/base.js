// base.js  基本模块
import $ from 'jquery';

class Base{
	// 初始化奖金和玩法及说明内容
	initPlayList(){
		this.play_list
		.set('r2',{
			bonus: 6, //中奖的奖金
			tip: '从01～11中任选2个或多个号码，所选号码与开奖号码任意两个号码相同，即中奖<em class="red">6</em>元',
			name: '任二'
		})
		.set('r3',{
			bonus: 19, //中奖的奖金
			tip: '从01～11中任选3个或多个号码，所选号码与开奖号码任意三个号码相同，即中奖<em class="red">19</em>元',
			name: '任三'
		})
		.set('r4',{
			bonus: 78, //中奖的奖金
			tip: '从01～11中任选4个或多个号码，所选号码与开奖号码任意四个号码相同，即中奖<em class="red">78</em>元',
			name: '任四'
		})
		.set('r5',{
			bonus: 540, //中奖的奖金
			tip: '从01～11中任选5个或多个号码，所选号码与开奖号码任意五个号码相同，即中奖<em class="red">540</em>元',
			name: '任五'
		})
		.set('r6',{
			bonus: 90, //中奖的奖金
			tip: '从01～11中任选6个或多个号码，所选号码与开奖号码任意六个号码相同，即中奖<em class="red">90</em>元',
			name: '任六'
		})
		.set('r7',{
			bonus: 26, //中奖的奖金
			tip: '从01～11中任选3个或多个号码，所选号码与开奖号码任意七个号码相同，即中奖<em class="red">28</em>元',
			name: '任七'
		})
		.set('r8',{
			bonus: 9, //中奖的奖金
			tip: '从01～11中任选3个或多个号码，所选号码与开奖号码八个号码相同，即中奖<em class="red">9</em>元',
			name: '任八'
		})
	}
	// 初始化号码
	initNumber(){
		for(let i=1; i<12; i++){
			this.number.add((''+i).padStart(2,'0'));
		}
	}
	// 设置遗漏数据
	setOmit(omit){
		let self = this;
		self.omit.clear(); //清空数据(因为每10分钟更新一次)
		for(let [index,item] of omit.entries()){ // map方法遍历接口，将数据保存到数据结构中
			self.omit.set(index,item); // 使用的是map中的entries方法获取值
		}
		$(self.omit_el).each(function(inex,item){ // 将数据保存到页面中
			$(item).text(self.omit.get(index));
		});
	}
	// 设置开奖
	setOpenCode(code){
		let self = this; //保存当前对象的引用
		self.open_code.clear();
		for(let item of code.values()){
			self.open_code.add(item); // 使用的是set集合，因为开奖号码不重复
		}
		//调用更新获奖的接口
		self.updateOpenCode && self.updateOpenCode.call(self,code);
	}
	// 号码选中和取消
	toggleCodeActive(e){
		let self = this;
		let $cur = $(e.currentTarget); // 获取当前被选中的DOM节点
		$cur.toggleClass('btn-boll-active'); // jquery方法，切换类
		self.getCount(); //计算选中的金额(注释中说明的金额的变化)
	}
	// 切换玩法
	changePlayNav(e){
		let self = this;
		let $cur = $(e.currentTarget); //事件委托时，事件绑定在父元素上，但是点击的是子元素，currentTarget返回子元素
		$cur.addClass('active').siblings().removeClass('active');
		self.cur_play = $cur.attr('desc').toLowerCase();
		$('#zx_sm span').html(self.play_list.get(self.cur_play).tip);
		$('.boll-list .btn-boll').removeClass('btn-boll-active'); // 将所有选中的号码都清空掉
		self.getCount(); //重新计算
	}
	// 全 大 小 奇 偶 清除
	assistHandle(e){
		e.preventDefault();
		let self = this;
		let $cur = $(e.currentTarget);
		let index = $cur.index();// 返回当前选中的集合的索引
		// 清空
		$('.boll-list .btn-boll').removeClass('btn-boll-active'); // 清空之前，把之前的选项都清除
		if(index === 0){  // 全选
			$('.boll-list .btn-boll').addClass('btn-boll-active'); 
		} 
		if(index === 2){ // 选中大
			$('.boll-list .btn-boll').each(function(i, t){
				if(t.textContent - 6 < 0){
					$(t).addClass('btn-boll-active');
				}
			}); 
		}
		if(index === 1){ // 选中小
			$('.boll-list .btn-boll').each(function(i, t){
				if(t.textContent - 5 > 0){
					$(t).addClass('btn-boll-active');
				}
			}); 
		} 
		
		if(index === 3){ //选中奇数
			$('.boll-list .btn-boll').each(function(i, t){
				if(t.textContent%2 === 1){
					$(t).addClass('btn-boll-active');
				}
			}); 
		}
		if(index === 4){ // 选中偶数
			$('.boll-list .btn-boll').each(function(i, t){
				if(t.textContent%2 === 0){
					$(t).addClass('btn-boll-active');
				}
			}); 
		}
		self.getCount(); // 重新计算
	}

	// 获取当前彩票名称
	getName(){
		return this.name;
	}

	//添加号码(选中号码后，确认选中，显示已选中的号码)
	addCode(){
		let self = this;
		let $active = $('.boll-list .btn-boll-active').text().match(/\d{2}/g); //获取当前选中号码的文本的值
		let active = $active ? $active.length : 0;
		let count = self.computeCount(active, self.cur_play);
		if(count){ // 
			self.addClass($active.join(''), self.cur_play, self.play_list.get(self.cur_play).name, count); // 添加条目
		}
	}
	// 添加单次号码
	addCodeItem(code, type, typeName, count){
		let self = this;
		// 字符串模板
		const tpl = `
			<li codes="${type} |${code}" bonus="${count*2}"
		`;

	}
}
export default Base; // 导出模块