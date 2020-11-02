function DateTime() {
	var myDate = new Date();
	var year = myDate.getFullYear();
	var month = myDate.getMonth();
	var date = myDate.getDate();
	var hours = myDate.getHours();
	var minutes = myDate.getMinutes();
	var seconds = myDate.getSeconds();
	var milliseconds = myDate.getMilliseconds();
	month = month + 1;
	if (month < 10) month = "0" + month;
	if (date < 10) date = "0" + date;
	var time = "";
	time = year + "-" + month + "-" + date;
	return time;
};
Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) {
			return i;
		}
	}
	return -1;
};
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};
var flag = false;

function callback() {
	return flag;
};
var mask = mui.createMask(callback);
var tim = 5000;

function CheckBarcodeLengthClick(_Code) {
	if (_Code.trim().length == 8 || _Code.trim().length == 10 || _Code.trim().length == 11 || _Code.trim().length == 13) {
		return true;
	} else {
		return false;
	}
};

function CheckLotIdLengthClick(_Code) {
	if (_Code.trim().length == 17) {
		return true;
	} else {
		return false;
	}
};
var requestPath = "http://10.151.82.130:8020"; /*测试服务*/
var requestPath = "http://192.168.2.156"; /*测试服务*/
// var requestPath = "http://test.com:80"; /*测试服务*//*  */
//var requestPath = "http://10.168.66.30:8020";/*国内服务*/
//var requestPath = "http://10.169.12.11:8020";/*泰国服务*/
