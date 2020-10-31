var storage = window.localStorage;
var JQ = jQuery.noConflict();
(function($) {
	$.init();
	mui.ajax(requestPath + "/ashx/FixedAssetInfo.ashx", {
		data: {
			ln: mui("#txtDepartment")[0].value,
			action: "download",
			Token: storage["Token"],
			lang: storage["Language"]
		},
		dataType: "json",
		type: "post",
		async: false,
		timeout: 100000,
		success: function(data) {
			var json = data.TL;
			JQ("#Menu").empty();
			var menu = "";
			if(0 == json.length) {
				mui.alert("该用户没有获得移动端权限！", "Message");
			}
			for(var i = 0; i < json.length; i++) {
				menu += '<li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
				<a href="' + json[i].NodeURL + '"><span class="' + json[i].FunImgNum + '"></span><div class="mui-media-body"><label id=\'lblLZZW' + i + "'>" + json[i].DisplayName + "</label></div></a></li>"
			}
			JQ("#Menu").append(menu);
		}
	}, false);	
	mui.plusReady(function() {
		mui("#exit")[0].addEventListener("tap", function() {
			var btnArray = [{
				title: "重新登录"
			}, {
				title: "关闭应用"
			}];
			plus.nativeUI.actionSheet({
				cancel: "取消",
				buttons: btnArray
			}, function(event) {
				var index = event.index;
				switch(index) {
					case 1:
						storage.clear();
						window.location.replace("login.html");
						break;
					case 2:
						storage.clear();
						plus.runtime.quit();
						break;
				}
			});
		}, false);
	});
})(mui);