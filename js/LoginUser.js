var storage = window.localStorage;
var request;
var db;

(function($, doc) {
	// <script src="js/mui.min.js"></script>
	$.init({
		statusBarBackground: "#f7f7f7"

	});
	// storage["Language"] = mui("#txtLanguage")[0].value;
	mui("#lblServe")[0].innerText = requestPath;
	$.plusReady(function() {
		plus.screen.lockOrientation("portrait-secondary");//锁定竖屏翻转 默认不会还原
		storage.clear();
		if (plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
			mui.alert("请检查网络是否正常连接！", "NetWorkError");
		}
		var mac = "000000000000";
		if (plus.os.name == "Android") {
			var Context = plus.android.importClass("android.content.Context");
			var WifiManager = plus.android.importClass("android.net.wifi.WifiManager");
			var wifiManager = plus.android.runtimeMainActivity().getSystemService(Context.WIFI_SERVICE);
			var WifiInfo = plus.android.importClass("android.net.wifi.WifiInfo");
			var wifiInfo = wifiManager.getConnectionInfo();
			mac = wifiInfo.getMacAddress();
			mac = mac.replace(/:/gi, "").toUpperCase();
			console.log(mac);
		}
		// if ("020000000000" == mac) {
		// 	mac = plus.device.imei.toUpperCase();
		// }
		storage["MAC"] = mac;
		//
		var vers = "";
		mui.getJSON("manifest.json", null, function(dt) {

			vers = dt.version.name;
			console.log(vers);
			mui("#lblVer")[0].innerText = dt.version.name;
			if (dt.developer.name == "lbj") {

			} else {
				mui.alert("开发者密匙错误！");
			}
		});
		mui("#lblEquipID")[0].innerText = storage["MAC"];
		// console.log(mac);
		console.log(requestPath);
		mui.ajax(requestPath + "/ashx/Login.ashx", {
			data: {
				action: "update"
				// ,
				// lang: "CHN"
			},
			dataType: "json",
			type: "post",
			timeout: 100000,
			success: function(data) {

				mui.getJSON("manifest.json", null, function(dt) {

					vers = dt.version.name;
					console.log(vers);
					mui("#lblVer")[0].innerText = dt.version.name;
					// var nowYear = new Date().getFullYear();
					// var nowMonth = new Date().getMonth()+1;
					// var nowDay = new Date().getDay();
					// var nowHour = new Date().getHours();					
					// console.log(nowYear+""+nowMonth+""+nowDay+""+nowHour);
					if (data.version != vers) {
						console.log(data.version);
						var wgtWaiting = plus.nativeUI.showWaiting("Download File...");
						var task = plus.downloader.createDownload(data.url, {
							filename: "_downloads/"
						}, function(d, status) {
							if (status == 200) {
								var fileSaveUrl = plus.io.convertLocalFileSystemURL(d.filename);
								// console.log(fileSaveUrl);
								// plus.runtime.openFile(d.filename);
								plus.runtime.install(d.filename, {}, function() {}, function(e) {
									plus.nativeUI.closeWaiting();
									plus.nativeUI.alert("安装apk文件失败[" + e.code + "]：" + e.message);
									// plus.nativeUI.alert("安装apk文件失败[" + d.filename + "]：");
								});
							} else {
								mui.alert("下载失败!!");
							}
							wgtWaiting.close();
						});
						task.addEventListener("statechanged", function(download, status) {
							// console.log(download.state);
							switch (download.state) {

								case 2:
									break;
								case 3:
									setTimeout(function() {
										var percent = download.downloadedSize / download.totalSize * 100;
										wgtWaiting.setTitle("已下载 " + parseInt(percent) + "%");
									}, 0);
									break;
								case 4:
									// mui.toast("下载完成！")                
									// console.log(task.totalSize)
									// plus.io.resolveLocalFileSystemURL(task.filename, function(entry) {
									// 	// alert(entry.toLocalURL()+"")  // 显示下载的文件存储绝对地址
									// 	// console.log(entry.toLocalURL())     //绝对地址                                      
									// });
									// alert(task.filename)  // 显示下载好的文件名称
									break;
							}
						});
						task.start();
					}

				});
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				mui.alert(errorThrown, "SystemError");
			}
		});
		window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		if (!window.indexedDB) {
			mui.alert("Your Browser does not support IndexedDB!")
		} else {
			request = window.indexedDB.open("Language", 1);
			request.onerror = function(event) {
				mui.alert("Error opening DB", "SystemError");
			};
			request.onupgradeneeded = function(event) {
				db = event.target.result;
				if (!db.objectStoreNames.contains("lang")) {
					var objectStore = db.createObjectStore("lang", {
						keyPath: "Key"
					});
				}
			};
			request.onsuccess = function(event) {
				db = event.target.result;
			}
		}
		var loginButton = mui("#login")[0];
		loginButton.addEventListener("tap", function(event) {
			// console.log("test");
			var logn = mui("#account")[0].value;
			var pss = mui("#password")[0].value;
			var md5_pass = (md5(pss)).toUpperCase();
			// md5()
			// console.log(md5_pass);
			window.location.replace("Main.html");
			/*
			if (OnCheckUser()) {
				// window.location.replace("Main.html");
			
				if (mui("#txtModel")[0].value != "Online") {
					// window.location.replace("Main.html");
					plus.io.requestFileSystem(plus.io.PRIVATE_WWW, function(fs) {
						// 可通过fs操作PRIVATE_WWW文件系统 
						// ......
						fs.root.getFile('_www/UserPasswordInfo.txt', {
								create: false
							},
							function(entry) {
								var fileReader = new plus.io.FileReader();
								// alert(entry.fullPath);
								// console.log(entry.fullPath);
								if (entry.isFile) {
									fileReader.readAsText(entry, "utf-8");
									fileReader.onloadend = function(evt) {
										var result = evt.target.result;
										// console.log(result);
										console.log(result.indexOf(mui("#account")[0].value));
										if (result.indexOf(logn) < 0) {
											alert("用户" + logn + "没有权限!");
										} else {
											if (result.indexOf(md5_pass) < 0) {
												alert("密码不正确！")
											} else {
												if (result.indexOf(logn) + logn.length + 1 == result.indexOf(md5_pass)) {
													window.location.replace("Main.html");

												} else {
													alert("用户不存在或者密码不正确!!");
												}
											}

										}
									}

								}

							},
							function(e) {
								alert(e.message + "Error 1");
							}
						)
					}, function(e) {
						alert("Request file system failed: " + e.message);
					});

				} else {
				}

			}
		*/
		});

	});
}(mui, document));

function OnCheckUser() {
	if ("" == mui("#account")[0].value || "undefined" == mui("#account")[0].value) {
		mui.alert("请录入账号信息！");
		return false;
	}
	if ("" == mui("#password")[0].value || "undefined" == mui("#password")[0].value) {
		mui.alert("请录入密码信息！");
		return false;
	}

	return true;
};
