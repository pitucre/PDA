var storage = window.localStorage;
var request;
var db;

(function($, doc) {
	// <script src="js/mui.min.js"></script>
	$.init({
		statusBarBackground: "#f7f7f7",
	});
	// storage["Language"] = mui("#txtLanguage")[0].value;
	mui("#lblServe")[0].innerText = requestPath;
	$.plusReady(function() {
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
		}
		if ("020000000000" == mac) {
			mac = plus.device.imei.toUpperCase();
		}
		storage["MAC"] = mac;
		//
		var vers = "";
		mui("#lblEquipID")[0].innerText = storage["MAC"];
		mui.ajax(requestPath + "/ashx/Login.ashx", {
			data: {
				action: "update",
				lang: "CHN"
			},
			dataType: "json",
			type: "post",
			timeout: 100000,
			success: function(data) {
				mui.getJSON("manifest.json", null, function(dt) {
					vers = dt.version.name;
					mui("#lblVer")[0].innerText = dt.version.name;
					if (dt.developer.name == "lbj") {
						if (data.version != vers) {
							var wgtWaiting = plus.nativeUI.showWaiting("Download File...");
							var task = plus.downloader.createDownload(data.url, {
								filename: "_downloads/"
							}, function(d, status) {
								if (status == 200) {
									plus.runtime.install(d.filename, {}, function() {}, function(e) {
										plus.nativeUI.closeWaiting();
										plus.nativeUI.alert("安装apk文件失败[" + e.code + "]：" + e.message);
									});
								} else {
									mui.alert("下载失败！");
								}
								wgtWaiting.close();
							});
							task.addEventListener("statechanged", function(download, status) {
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
										break;
								}
							});
							task.start();
						}
					} else {
						mui.alert("开发者密匙错误！");
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
			var md5_pass=md5(pss);
			// md5()
			console.log(md5_pass);
			if (OnCheckUser()) {

				if (mui("#txtModel")[0].value != "Online") {
					// window.location.replace("Main.html");
					plus.io.requestFileSystem(plus.io.PRIVATE_WWW, function(fs) {
						// 可通过fs操作PRIVATE_WWW文件系统 
						// ......
						fs.root.getFile('_www/statics/UserPasswordInfo.txt', {
								create: false
							},
							function(entry) {
								var fileReader = new plus.io.FileReader();
								if (entry.isFile) {
									fileReader.readAsText(entry, "utf-8");
									fileReader.onloadend = function(evt) {
										var result = evt.target.result;					
										console.log(result);
										console.log(result.indexOf(mui("#account")[0].value));
									}
									
								}
					
							},
							function(e) {alert(e.message);}
						)
					}, function(e) {
						alert("Request file system failed: " + e.message);
					});
					
				} else {
					/*	
							mui.ajax(requestPath + "/ashx/Login.ashx", {
								data: {
									ln: logn,
									Ver: mui("#lblVer")[0].innerText,
									Server: mui("#lblServe")[0].innerText,
									EqNo: storage["MAC"],
									ps: pss,
									EqNm: plus.device.model,
									action: "login",
									lang: "CHN"
								},
								dataType: "json",
								type: "post",
								timeout: 100000,
								success: function(json) {
									if(json.ErrCode == "0") {
										if(json.Info.LOGINNAME != "" || json.Info.LOGINNAME != null) {
											storage["DEPNAM"] = json.Info.DEPNAM;
											storage["NAME"] = json.Info.NAME;
											storage["LOGINNAME"] = json.Info.LOGINNAME;
											storage["POSNAM"] = json.Info.POSNAM;
											storage["ID"] = json.Info.ID;
											storage["Token"] = json.Info.Token;
											mui("#account")[0].value = "";
											mui("#password")[0].value = "";
											// storage["Language"] = mui("#txtLanguage")[0].value;
											window.location.replace("Main.html");
										} else {
											mui.alert("用户登录失败，不存在此用户信息。");
										}
									} else {
										mui.alert(json.Error);
									}
								},
								error: function(XMLHttpRequest, textStatus, errorThrown) {
									mui.alert(errorThrown, "SystemError");
								}
							});
					*/
				
				}

			}
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
	// mui.alert(mui("#txtModel")[0].value);
	// if("" == mui("#txtfac")[0].value || "undefined" == mui("#txtfac")[0].value) {
	// 	mui.alert("请选择工厂！");
	// 	return true;
	// }
	// if("" == mui("#txtModel")[0].value || "undefined" == mui("#txtModel")[0].value) {
	// 	mui("#txtModel")[0].innerText = "联网";
	// 	return true;
	// }
	// storage.setItem("Network",mui("#txtModel")[0].value.toString());
	// mui("#txtModel")[0].Text = storage.getItem("Network");
	// mui.alert(storage.getItem("Network"));
	// mui.get('../../statics/UserPasswordInfo.txt', function(data) {
	//         mui.alert("获取数据为："+(data));
	//     }, 'txt');
	return true;
};
