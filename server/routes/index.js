
/*
 * GET home page.
 */
var express = require('express');
var mockjs = require('mockjs');
// var router = express.Router();
var router = express();

router.get('/', function(req,res,next){
	res.render('index',{
		title:'Express'
	});
});

// 输出当前：状态 期号 截止时间
var makeIssue = function(){
	var date = new Date();  			// 记录当前时间
	var first_issue_date = new Date();  //设置第一期的截止销售时间
	first_issue_date.setHours(9);
	first_issue_date.setMinutes(10);
	first_issue_date.setSeconds(0);
	// 计算截止时间 共78期，每期10分钟
	var end_issue_date = new Date(first_issue_date.getTime() + 77*10*60*1000);
	var cur_issue, end_time, state;
	// 正常销售 当前时间大于第一期时间且小于截止时间
	if((date.getTime()-first_issue_date.getTime()>0) && (date.getTime()-end_issue_date.getTime()<0) ){
		var cur_issue_date = new Date(); // 当前的期号
		cur_issue_date.setHours(9);
		cur_issue_date.setMinutes(0);
		cur_issue_date.setSeconds(0);
		var minus_time = date.getTime() - cur_issue_date.getTime(); // 计算当前期数销售的剩余时间
		var h = Math.ceil(minus_time/1000/60/10); // 转换成小时数
		var end_date= new Date(cur_issue_date.getTime() + 1000*60*10*h); // 计算截止时间
		end_time = end_date.getTime();
		// 保存截止时间 年 月 天 时间(时 分 秒)
		cur_issue = [end_date.getFullYear(), ('0'+(end_date.getMonth()+1)).slice(-2), ('0'+end_date.getDate()).slice(-2), ('0'+h).slice(-2)].join('');
	}else{ // 今天销售已经截止
		end_time = first_issue_date.getTime();
		// 保存： 年 月 日 期数
		cur_issue = [first_issue_date.getFullYear(), ('0'+(first_issue_date.getMonth()+1)).slice(-2), ('0'+first_issue_date.getDate()).slice(-2), '01'].join('');
	}
	var cur_date = new Date();
	// 判断状态: 前8分钟销售，后2分钟开奖中
	if(end_time - cur_date.getTime() > 1000*60*2){
		state = '正在销售';
	}else{
		state = '开奖中';
	}
	return {
		issue: cur_issue,
		state: state,
		end_time:end_time
	}
}

// 获取遗漏接口
router.get('/get/omit', function(req,res){
	res.json(mockjs.mock({
		'data|11':[/[1-9]{1,3}|0/],
		'issue':/[1-9]{8}/
	}));
});

// 开奖接口
router.get('/get/opencode', function(req,res){
	var list = makeIssue().issue;
	var data = mockjs.mock({
		'data':[/[1-3]/, /[4-5]/, /[6-7]/, /[8-9]/, /1[0-1]/]
	}).data;
	res.json({
		issue:issue,
		data:data
	});
});

// 状态接口
router.get('/get/state', function(req,res){
	var state =makeIssue();
	res.join(state);
});

module.exports = router;

// exports.index = function(req, res){
//   res.render('index', { title: 'Express' });
// };