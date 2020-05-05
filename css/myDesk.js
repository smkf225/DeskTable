function AddDeskli(Msg) {
	document.getElementById('ulchat').innerHTML += Msg;
};

function setliShow_hide(idli, istate) {
	var liid = document.querySelector('#' + idli);
	if (liid !== null) {
		try {
			switch (parseInt(istate)) {
				case 0: // hidden
					liid.removeAttribute("hidden");
					break;
				case 1: // show
					liid.setAttribute("hidden", "true");
					break;
			}
			return true;
		} catch (e) {
			return e;
		}
	} else
		return '该ID' + liid + '不存在';
};
//'[{"DeskID":"idx","state":0,"topleft":0,"footerleft":0,"footerright":0},{"DeskID":"idx","state":0,"topleft":0,"footerleft":0,"footerright":0}]'  单个可以"[{0}]",所有的 前两个是必须要的"DeskID":"idx","state":0
//更新餐桌状态等开始
function ChangeDeskdata(sjson) {
	try {
		var objjson = JSON.parse(sjson);
		for (var key in objjson) {
			console.log(objjson[key].state);
			var liid = document.getElementById(objjson[key].DeskID);
			if (liid !== null) {
				switch (parseInt(objjson[key].state)) {
					case 0:
						liid.style.backgroundColor = 'white';
						liid.querySelector('.topleft').innerHTML = '';
						liid.querySelector('.topright').innerHTML = '空台';
						liid.querySelector('.footerleft').innerHTML = '';
						liid.querySelector('.footerright').innerHTML = '';
						liid.dataset.state = '0';
						liid.dataset.myDeskid = "";
						break;
					case 1:
						liid.style.backgroundColor = 'pink';
						if (typeof objjson[key].topleft !== "undefined") {
							liid.querySelector('.topleft').innerHTML = objjson[key].topleft + '人';
						}
						liid.querySelector('.topright').innerHTML = '使用中';
						if (typeof objjson[key].footerleft !== "undefined") {
							liid.querySelector('.footerleft').innerHTML = objjson[key].footerleft;
						}
						if (typeof objjson[key].footerright !== "undefined") {
							liid.querySelector('.footerright').innerHTML = objjson[key].footerright;
						}
						liid.dataset.state = '1';
						break;
					case 2:
						liid.style.backgroundColor = 'red';
						if (typeof objjson[key].topleft !== "undefined") {
							liid.querySelector('.topleft').innerHTML = objjson[key].topleft + '人';
						}
						liid.querySelector('.topright').innerHTML = '结账中';
						if (typeof objjson[key].footerleft !== "undefined") {
							liid.querySelector('.footerleft').innerHTML = objjson[key].footerleft;
						}
						if (typeof objjson[key].footerright !== "undefined") {
							liid.querySelector('.footerright').innerHTML = objjson[key].footerright;
						}
						liid.dataset.state = '2';
						break;
					case 3:
						liid.style.backgroundColor = '#aa5500';
						if (typeof objjson[key].topleft !== "undefined") {
							liid.querySelector('.topleft').innerHTML = objjson[key].topleft + '人';
						}
						liid.querySelector('.topright').innerHTML = '清扫中';
						if (typeof objjson[key].footerleft !== "undefined") {
							liid.querySelector('.footerleft').innerHTML = objjson[key].footerleft;
						}
						if (typeof objjson[key].footerright !== "undefined") {
							liid.querySelector('.footerright').innerHTML = objjson[key].footerright;
						}
						liid.dataset.state = '3';
						break;
					default:
						;
				}
				return true; //处理完没有问题返回
			} else //餐桌为空返回
				return '该餐桌' + liid + '不存在。';
		}
	} catch (Errmsg) {
		return '错误：' + Errmsg;
	}
};
//更新餐桌状态等结束
//控制餐桌显示或隐藏开始
//点了区域如何添加 leftid:餐区parentid,-1表示所有餐区,topid:-1全部显示 ,0空台,1使用中，2结账中，3清招中 4:个人开台(只显示所有的),opID操作员ID
function ChangeDeskHidden(leftid, topID, opID) {
	var lis = document.querySelectorAll('li');
	for (var i = 0; i < lis.length; i++) {
		//	 console.log(lis[i].dataset.parentid);
		if (parseInt(leftid) == -1 && parseInt(topID) == -1) {
			lis[i].removeAttribute("hidden"); //都是-1 表示全部都显示 
			continue;
		} else if (parseInt(topID) == 4) { //显示个人开台
			if (lis[i].dataset.myDeskid == opID) lis[i].removeAttribute("hidden");
		} else if (parseInt(leftid) == -1) {
			if (lis[i].dataset.state == topID) lis[i].removeAttribute("hidden")
			else
				lis[i].setAttribute("hidden", "true");
			continue;
		}
		if (parseInt(topID) == -1) {
			if (lis[i].dataset.parentid == leftid) lis[i].removeAttribute("hidden")
			else
				lis[i].setAttribute("hidden", "true");
			continue;
		}
		if (lis[i].dataset.parentid == leftid && lis[i].dataset.state == topID) lis[i].removeAttribute("hidden")
		else
			lis[i].setAttribute("hidden", "true");
	}

};
//控制餐桌显示或隐藏结束
/*  
要实现从JS对象转换为JSON字符串，使用 JSON.stringify() 方法
var json = JSON.stringify({a: 'Hello', b: 'World'}); //结果是 '{"a": "Hello", "b": "World"}'
*/
//遍历所有li开始
setInterval(function() {
	var lis = document.querySelectorAll("li");
	for (var i = 0; i < lis.length; i++) {
		var state = lis[i].querySelector('.topright').innerText;
		if (lis[i].dataset.state == '1' || lis[i].dataset.state == '2') {
			//console.log(lis[i].dataset.state);	
			var stime = lis[i].querySelector('.footerright').innerText;
			if (typeof stime !== "undefined") {
				try { //如果找到了：号，才可以执行下面的代码						
					if (stime.indexOf(':') !== -1) {
						var iright = Number(stime.length) - Number(stime.indexOf(':'));
						iright -= 1; //-1 是因为indexof位数与length位数不一样
						if (stime.slice(-iright) >= 59) {
							var leftnum = Number(stime.substring(0, stime.indexOf(':')));
							leftnum += 1;
							var sText = leftnum + ":00";
						} else {
							var n = Number(stime.slice((-iright)));
							n += 1;
							var sText = stime.substring(0, stime.indexOf(':')) + ":" + n;
						}
						lis[i].querySelector('.footerright').innerText = sText;
					}
				} catch (err) {
					return err;
				}
			}
		}
	}
}, 60 * 1000);
//遍历所有li结束
// 所有li增加onclick事件开始
function AddlionClick() {
	var lis = document.querySelectorAll('li');
	for (var i = 0; i < lis.length; i++) 
		lis[i].onclick = function() {
			if (lastid !== '') { //上述内容相当于判断lastid=""、lastid=null、lastid = undefined、lastid=0					
				var ClickID = this.getAttribute('id');
				if (ClickID !== lastid) { //不全相等就执行						
					var li1 = document.getElementById(ClickID); //改变点击的颜色
					li1.style.borderColor = 'deeppink';

					var li1 = document.getElementById(lastid); //改变最一次点击的颜色
					li1.style.borderColor = "#ECF4FC";
					lastid = ClickID;
				};
			} else {
				var ClickID = this.getAttribute('id');
				var li1 = document.getElementById(ClickID);
				li1.style.borderColor = "deeppink";
				lastid = ClickID;
			}
			self.location = "https://www.baidu.com#" + ClickID;
		};
	
}; // 所有li增加onclick事件结束
