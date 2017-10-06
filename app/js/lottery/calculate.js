// calculate.js 计算模块 包括： 注数 金额 奖金 盈利计算方式(数学组合计算)
class Calculate{
	// 计算注数 active 当前选中的号码  paly_name 当前的玩家标识
	computeCount(active, play_name){
		let count = 0; // 声明一个变量表明默认彩票注数是0
		const exist = this.play_list.has(play_name); // 判断玩法的列表中是否包含传入的play_name
		const arr = new Array(active).fill('0'); 	 // 生成一个长度为active的数组，保存选中的号码
		if(exist && (play_name.at(0) === 'r')){
			count = Calculate.oCombine(arr, play_name.split('')[1]).length; // 组合运算
		}	
		return count;	
	}
	// 计算中奖金额 active:当前选中的号码 play_name:当前的玩法标识
	computeBonus(active, play_name){
		const play = play_name.split('');// 拿到当前玩法的基数
		const self = this;
		let arr = new Array(play[1]*1).fill(0);
		let min,max;
		if(play[0] === 'r'){
			let min_active = 5-(11-active); //最小命中数
			if(min_active > 0){
				if(min_active-play[1] >= 0){
					arr = new Array(min_active).fill(0);
					min = Calculate.oCombine(arr,play[1]).length; 
				}else{
					if(play[1]-5 > 0 && active - play[1] >= 0){
						arr = new Array(active-5).fill(0);
						min = Calculate.oCombine(arr, play[1]-5).length;
					}else{
						min = active - play[1]> -1 ? 1 : 0;
					}
				}
			}else{
				min = active - play[1]> -1 ? 1 : 0;
			}
		}
		let max_active = Math.min(active, 5); // 最大命中注数
		if(play[1] - 5 > 0){ 				  // 大于任选5
			if(active - play[1] >= 0){
				arr = new Array(active - 5).fill(0); 			   // 初始化数组
				max = Calculate.oCombine(arr, play[1] - 5).length; // 计算最大值
			}else{ 
				max = 0;
			}
		}else if(play[1] - 5 < 0){ // 任选5及以下
			arr = new Array(Math.min(active, 5)).fill(0);
			max = Calculate.oCombine(arr, play[1]).length;
		}else{
			max = 1;
		}
		// 将注数转换成金额
		return [min,max].map(item=>item*self.play_list.get(play_name).bonus);
	}
	// 组合运算 arr 参与组合运算的数组 size 组合运算的基数
	static oCombine(arr, size){
		let allResult = [] ; // 保存最后的运行结果
		(function f(arr, size, result){
			let arrLen = arr.length;
			if(size > arrLen){
				return; // 递归运算截止
			}
			if(size === arrLen){
				allResult.push([].concat(result, arr));
			}else{
				for(let i=0; i<arrLen; i++){
					let newResult = [].concat(result);
					newResult.push(arr[i]);
					if(size === 1){
						allResult.push(newResult);
					}else{
						let newArr = [].concat(arr);
						newArr.splice(0, i+1);
						f(newArr, size-1, newResult); // 递归
					}
				}
			}
		})(arr, size, []);
		return allResult;
	}
}

export default Calculate; // 导出模块

