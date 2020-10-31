var storage = window.localStorage;
var JQ = jQuery.noConflict();
(function($) {
	$.init();
	// mui.ajax(requestPath + "/ashx/Menu.ashx", {
	// 	data: {
	// 		ln: storage["LOGINNAME"],
	// 		action: "menu",
	// 		Token: storage["Token"],
	// 		lang: storage["Language"]
	// 	},
	// 	dataType: "json",
	// 	type: "post",
	// 	async: false,
	// 	timeout: 100000,
	// 	success: function(data) {
	// 		var json = data.TL;
	// 		JQ("#Menu").empty();
	// 		var menu = "";
	// 		if(0 == json.length) {
	// 			mui.alert("该用户没有获得移动端权限！", "Message");
	// 		}
	// 		for(var i = 0; i < json.length; i++) {
	// 			menu += '<li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3">
	// 			<a href="' + json[i].NodeURL + '"><span class="' + json[i].FunImgNum + '"></span><div class="mui-media-body"><label id=\'lblLZZW' + i + "'>" + json[i].DisplayName + "</label></div></a></li>"
	// 		}
	// 		JQ("#Menu").append(menu);
	// 	}
	// }, false);	
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
				switch (index) {
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
		mui("#liUpload")[0].addEventListener("tap", function() {
			var wt = plus.nativeUI.showWaiting();
			var task = plus.uploader.createUpload(requestPath+'/ashx/Upload.ashx?action=Upload', {
					method: "POST",
					blocksize: 204800,
					priority: 100
				},
				function(t, status) {
					// 上传完成
					console.log(t);
					if (status == 200) {
						alert("Upload success: " + t.url+" " + t.responseText);
						wt.close();
					} else {
						alert("Upload failed: " + status);
						wt.close();
					}
				}
			);
			task.addFile('_doc/FixedAssetScanResult.txt', {
				key: "file",
				name: "FixedAssetScanResult"
			});

			var addFileFlag = task.addData('name', 'FixedAssetScanResult');
			//一般我们会对添加文件/数据进行判断是否成功,若不成功则提示,成功后开始上传任务
			if (addFileFlag) {
				task.start();
			} else {
				plus.nativeUI.alert('添加上传文件失败！');
			}
		}, false);
		// mui("#btnUpLoad")[0].addEventListener("tap", function() {

		// 	var task = plus.uploader.createUpload(requestPath, {
		// 			method: "POST",
		// 			blocksize: 204800,
		// 			priority: 100
		// 		},
		// 		function(t, status) {
		// 			// 上传完成
		// 			console.log(t);
		// 			if (status == 200) {
		// 				alert("Upload success: " + t.url);
		// 			} else {
		// 				alert("Upload failed: " + status);
		// 			}
		// 		}
		// 	);
		// 	task.addFile('_doc\FixedAssetScanResult.txt', {
		// 		key: "file"
		// 	});
		// 	task.start();
		// }, false);
	});
})(mui);
