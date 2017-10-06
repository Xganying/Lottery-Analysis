// base.js  基本模块
import $ from 'jquery';

class Base{
	// 初始化奖金和玩法及说明内容
	initPlayList(){
		this.play_list
		.set('r2',{
			bonus: 6, //中奖的奖金
			tip: '从01～11中任选2个号码，所选号码与开奖号码任意两个号码相同，即中奖<em class="red">6</em>元',
			name: '任二'
		})
		.set('r3',{
			bonus: 19, //中奖的奖金
			tip: '从01～11中任选3个号码，所选号码与开奖号码任意三个号码相同，即中奖<em class="red">19</em>元',
			name: '任三'
		})
		.set('r4',{
			bonus: 78, //中奖的奖金
			tip: '从01～11中任选4个号码，所选号码与开奖号码任意四个号码相同，即中奖<em class="red">78</em>元',
			name: '任四'
		})
		.set('r5',{
			bonus: 540, //中奖的奖金
			tip: '从01～11中任选5个号码，所选号码与开奖号码五个号相同，即中奖<em class="red">540</em>元',
			name: '任五'
		})
		.set('r6',{
			bonus: 90, //中奖的奖金
			tip: '从01～11中任选6个号码，所选号码与开奖号码五个号相同，即中奖<em class="red">90</em>元',
			name: '任六'
		})
		.set('r7',{
			bonus: 26, //中奖的奖金
			tip: '从01～11中任选7个号码，所选号码与开奖号码五个号相同，即中奖<em class="red">28</em>元',
			name: '任七'
		})
		.set('r8',{
			bonus: 9, //中奖的奖金
			tip: '从01～11中任选8个号码，所选号码与开奖号码五个号相同，即中奖<em class="red">9</em>元',
			name: '任八'
		})
	}
	// 初始化号码
	initNumber(){
		for(let i=1; i<12; i++){ // 号码是从01-11
			this.number.add((''+i).padStart(2,'0')); // 数字不是两位时，在前面补0
		}
	}
	// 设置遗漏数据(选择号码下面的那一行数据)
	setOmit(omit){
		let self = this;
		self.omit.clear(); //清空数据(因为每10分钟更新一次)
		for(let [index,item] of omit.entries()){    // map方法遍历接口，将数据保存到数据结构中
			self.omit.set(index,item); 				// 使用的是map中的entries方法获取值
		}
		$(self.omit_el).each(function(index,item){  // omit_el选择器，将数据保存到页面中
			$(item).text(self.omit.get(index));
		});
	}
	// 设置开奖
	setOpenCode(code){
		let self = this; 				//保存当前对象的引用
		self.open_code.clear(); 		// 清除当前奖号
		for(let item of code.values()){
			self.open_code.add(item);   // 使用的是set集合，因为开奖号码不重复
		}
		//调用更新获奖的接口(如果接口存在，就调用)
		self.updateOpenCode && self.updateOpenCode.call(self,code);
	}
	// 号码选中和取消
	toggleCodeActive(e){
		let self = this;
		let $cur = $(e.currentTarget); 		 // 获取当前被选中的DOM节点
		$cur.toggleClass('btn-boll-active'); // jquery方法，切换类
		self.getCount();					 //计算选中的金额(注释中说明的金额的变化)
	}
	// 切换玩法
	changePlayNav(e){
		let self = this;
		let $cur = $(e.currentTarget); //currentTarget在事件委托时，事件绑定在父元素上，但是点击的是子元素，currentTarget返回子元素
		$cur.addClass('active').siblings().removeClass('active');
		self.cur_play = $cur.attr('desc').toLocalLowerCase();
		$('#zx_sm span').html(self.play_list.get(self.cur_play).tip);
		$('.boll-list .btn-boll').removeClass('btn-boll-active'); // 将所有选中的号码都清空掉
		self.getCount(); //重新计算(注数、金额)
	}
	// 全 大 小 奇 偶 清除
	assistHandle(e){
		e.preventDefault();
		let self = this;
		let $cur = $(e.currentTarget);
		let index = $cur.index();// 返回当前选中的集合的索引
		$('.boll-list .btn-boll').removeClass('btn-boll-active'); // 清空之前，把之前的选项都清除
		if(index === 0){  // 全选
			$('.boll-list .btn-boll').addClass('btn-boll-active'); 
		} 
		if(index === 2){ // 选中大(最后一个数11)
			$('.boll-list .btn-boll').each(function(i, t){
				if(t.textContent - 6 < 0){
					$(t).addClass('btn-boll-active');
				}
			}); 
		}
		if(index === 1){ // 选中小(第一个数1)
			$('.boll-list .btn-boll').each(function(i, t){
				if(t.textContent - 5 > 0){ // 例如：05 - 5 实现数据转换
					$(t).addClass('btn-boll-active');
				}
			}); 
		} 
		if(index === 3){ //选中奇数
			$('.boll-list .btn-boll').each(function(i, t){
				if(t.textContent%2 == 1){
					$(t).addClass('btn-boll-active');
				}
			}); 
		}
		if(index === 4){ // 选中偶数
			$('.boll-list .btn-boll').each(function(i, t){
				if(t.textContent%2 == 0){
					$(t).addClass('btn-boll-active');
				}
			}); 
		}
		self.getCount(); // 重新计算(注数、金额)
	}

	// 获取当前彩票名称
	getName(){
		return this.name;
	}

	//添加号码(选中号码后，确认选中，显示已选中的号码)
	addCode(){
		let self = this;
		let $active = $('.boll-list .btn-boll-active').text().match(/\d{2}/g); //获取当前选中号码的文本的值
		let active = $active ? $active.length : 0; // 如果active存在,就直接获取长度,不是就设置为0
		let count = self.computeCount(active, self.cur_play); // 调用方法(注数，玩法)，获取注数
		if(count){ // 如果注数大于0,,就添加条目
			self.addClass($active.join(' '), self.cur_play, self.play_list.get(self.cur_play).name, count); // 添加条目
		}
	}
	// 添加单次号码
	addCodeItem(code, type, typeName, count){
		let self = this;
		// 字符串模板
		const tpl = `
			<li codes="${type}|${code}" bonus="${count*2}" count="${count}">
				<div class="code">
					<b>${typeName}${count>1 ? '复式' : '单式'}</b>
					<b class="em">${code}</b>
					[${count}注,<em class="code-list-money">${count*2}</em>元]
				</div>
			</li>
		`;
		$(self.cart_el).append(tpl);
		self.getTotal(); // 计算购物车里面的总金额
	}
	// 计算注数，金额
	getCount(){
		let self = this;
		let active = $('.boll-list .btn-boll-active').length; // 获取选中的长度
		let count = self.computeCount(active, self.cur_play); // 计算注数
		let range = self.computeBonus(active, self.cur_play); // 获取奖金范围
		let money = count * 2; 		 // 要付出的钱
		let win1 = range[0] - money; // 最小盈利额
		let win2 = range[1] - money; // 最大盈利额
		let tpl;
		let c1 =(win1<0 && win2<0) ? Math.abs(win1): win1; // 判断数亏了还是赚了,如果都亏了,保存亏损的钱
		let c2 =(win1<0 && win2<0) ? Math.abs(win2): win2; // 如果都赚了，就保存赚的钱
		if( count === 0){ // 如果注数是0,,没有盈利标准
			tpl=`您选了 <b class="red">${count}</b>注，共<b class="red">${count*2}</b>元`;
		}else if(range[0] === range[1]){ // 最大盈利和最小盈利都相等
			tpl=`您选了 <b>${count}</b>注，共<b>${count*2}</b>元 
			<em>
				若中奖，奖金：<strong class="red">${range[0]}</strong>元
				您将${win1>=0?'盈利':'亏损'}<strong class="${win1>=0?'red':'green'}">${Math.abs(win1)}</strong>元
			</em>
			`;
		}else{
			tpl=`您选了 <b>${count}</b>注，共<b>${count*2}</b>元 
			<em>
				若中奖，奖金：<strong class="red">${range[0]}</strong>至<strong class="red">${range[1]}</strong>元
				您将${(win1<0&&win2<0)?'盈利':'亏损'}
				<strong class="${win1>=0?'red':'green'}">${c1}</strong>至<strong class="${win2>=0?'red':'green'}">${c1}</strong>元
			</em>`;
		}
		$('.sel_info').html(tpl); // 将结果输出到页面上
	}
	// 计算购物车里面的总金额
	getTotal(){
		let count = 0;
		$('.codelist li').each(function(index, item){ //遍历购物车
			count += $(item).attr('count')*1; 		  // 累加每个条目
		});
		$('#count').text(count);   // 更改注数
		$('#money').text(count*2); //更改金额
	}
	// 在购物里面,随机生成号码
	getRandom(num){
		let arr = [],index; 
		let number = Array.from(this.number) // from将set集合转成数组，定义生成随机数的范围
		while(num--){
			index = Number.parseInt(Math.random()*number.length);
			arr.push(number[index]); // 保存结果
			number.splice(index,1);  // 通过删除功能，将数字移除掉，保证每次的随机数不重复
		}
		return arr.join(''); 		 // 返回随机数
	}
	// 在购物车模块，添加生成的随机号码
	getRandomCode(e){
		e.preventDefault();  							 // 阻止默认事件
		let num = e.currentTarget.getAttribute('count'); // 更加玩法确定数组的长度
		let play = ths.cur_play.match(/\d+/g)[0]; 		 // 获取当前玩法
		let self = this;
		if( num === '0'){
			$(self.cart_el).html(''); 					 // 清空购物车
		}else{
			for(let i=0; i<num; i++){ 					 // 生成随机数
				self.addCodeItem(self.getRandom(play), self.cur_play, self.play_list.get(self.cur_play).name, 1);
			}
		}
	}
}
export default Base; // 导出模块