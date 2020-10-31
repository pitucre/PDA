var storage = window.localStorage;
var JQ = jQuery.noConflict();

(function($) {
	$.init();
	mui("#lblUser")[0].innerText = storage["NAME"];
	mui("#lblTime")[0].innerText = DateTime();
	var _selBARCODE = mui("#selBARCODE")[0];
	var tr;
	_selBARCODE.focus();
	_selBARCODE.addEventListener("keyup", function() {
		if (13 == event.keyCode || 0 == event.keyCode) {

			OnCleanText();

			mui("#txtAssetBarcode")[0].value = _selBARCODE.value;

			if (_selBARCODE.value.length == 9) {

				// console.log("test");
				// mui.getJSON('FixedAssetInfo.txt', null, function(dt) {

				// 	console.log(dt);
				// });

				// $.ajax({
				// 	url: "_doc\FixedAssetInfo.txt",
				// 	success: function(data, status) {
				// 		// console.log(arguments)
				// 		console.log(data)
				// 	},
				// 	error: function(data, status) {
				// 		// console.log(arguments)
				// 	}
				// });

				// var temp=GetHeader('FixedAssetInfo.json');
				// console.log(temp);
				// plus.io.getFileInfo('_doc\FixedAssetInfo.txt',function(fs){})


				plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
					// fs.root是根目录操作对象DirectoryEntry
					fs.root.getFile('_doc\FixedAssetInfo.txt', {
						create: false
					}, function(fileEntry) {
						// console.log(myStorage.getLength());
						// console.log(myStorage.getLengthPlus());
						try {
							// myStorage=plus.storage;
							var barcodeJsonStr = myStorage.getItem(_selBARCODE.value);
							console.log(barcodeJsonStr);
							if (barcodeJsonStr.length == 0) {
								mui.alert("不存在此条形码！");
							} else {
								ScanBarcode = JSON.parse(barcodeJsonStr);
								// console.log(json);
								// for(key in json){
								// 	console.log(key+"："+json[key]);
								// }
								// var ScanBarcode=getItem(json, "BARCODE", _selBARCODE.value);
								// console.log(ScanBarcode);

								tr += '<tr height="30" bgcolor="#FFFFFF"><td>' + ScanBarcode.BARCODE + "</td><td>" + new Date().Format(
									"yyyyMMdd HH:mm:ss"); +
								"</td></tr>";
								JQ("#dList").append(tr);

								mui("#txtAssetBarcode")[0].value = ScanBarcode.BARCODE;
								_selBARCODE.value = "";
								mui("#txtAssetCode")[0].value = ScanBarcode.ASSETCODE;
								mui("#txtAssetName")[0].value = ScanBarcode.ASSETNAME
								mui("#txtAssetSpec")[0].value = ScanBarcode.GUIGEXINGHAO
								mui("#txtAssetStatus")[0].value = ScanBarcode.ZICHANZHUANGTAI
								mui("#txtAssetStatusName")[0].value = ScanBarcode.ZHUANGTAIMINGCHENG
								mui("#txtAssetDepartment")[0].value = ScanBarcode.SHIYONGBUMEN
								mui("#txtAssetDepartmentName")[0].value = ScanBarcode.SHIYONGBUMENNAME
								mui("#txtAssetEmployee")[0].value = ScanBarcode.GUYUANBIANHAO

								mui("#txtAssetEmployeeName")[0].value = ScanBarcode.GUYUANBIANHAONAME
								if (ScanBarcode.GUYUANBIANHAONAME == null) mui("#txtAssetEmployeeName")[0].value = "未找到"
								mui("#txtAssetEquipID")[0].value = ScanBarcode.ZICHANSHIBEIMA
								if (ScanBarcode.ZICHANSHIBEIMA == "") mui("#txtAssetEquipID")[0].value = "未找到"
								mui("#txtAssetNo")[0].value = ScanBarcode.XULIEHAO
								if (ScanBarcode.XULIEHAO == "") {
									mui("#txtAssetNo")[0].value = "未找到"
									// mui("#txtAssetNo")[0].color = RGBColor.red
									// mui("#txtAssetNo")[0].backgroundColor="#ffff00"
									JQ("#txtAssetNo").append('style="color:#6699ee;background-color:#F9FFED');
								}

							}
							// console.log(myStorage.getItem(_selBARCODE.value));
						} catch (e) {
							OnCleanText();
							mui.alert(e.message);
						}
						// var barcodeJsonStr=myStorage.getItem(_selBARCODE.value);
						// console.log(barcodeJsonStr);					
						/*
												fileEntry.file(function(file) {
													var fileReader = new plus.io.FileReader();

													fileReader.readAsText(file, "utf-8");
													fileReader.onloadend = function(evt) {
														var result = evt.target.result;

														console.log(result);

														if (result.search(_selBARCODE.value) == -1) {
															// 包含        
															mui.alert("不存在此条形码！");
														} else {

															// var json = JSON.parse(result);																
															// var json = JSON.parse(result);																
															// var ScanBarcode=getItem(json, "BARCODE", _selBARCODE.value);
															// console.log(ScanBarcode.ASSETCODE);
															// mui("#txtAssetCode")[0].value = ScanBarcode.ASSETCODE
															// mui("#txtAssetName")[0].value = ScanBarcode.ASSETNAME
															// mui("#txtAssetSpec")[0].value = ScanBarcode.GUIGEXINGHAO
															// mui("#txtAssetStatus")[0].value = ScanBarcode.ZICHANZHUANGTAI
															// mui("#txtAssetDepartment")[0].value = ScanBarcode.SHIYONGBUMEN
															// mui("#txtAssetEmployee")[0].value = ScanBarcode.GUYUANBIANHAO
															// mui("#txtAssetEquipID")[0].value = ScanBarcode.ZICHANSHIBEIMA
															// mui("#txtAssetNo")[0].value = ScanBarcode.XULIEHAO
														}

													}
												});
											*/
					}, function(e) {
						mui.alert(e.message + "," + "因为你没有下载相关文件,请下载资产列表!");
					});
				}, function(e) {
					mui.alert(e.message + " " + "文件不存在!");
				});
				// **/
			} else {
				// console.log(index);
				mui.alert("条码长度不对", "Message")
			}
		}
		_selBARCODE.focus();
	}, false);
	/*
	var _DOCCOD = mui("#txtAssetBarcode")[0];
	_DOCCOD.addEventListener("tap", function() {
		mui.ajax(requestPath + "/ashx/STA05.ashx", {
			data: {
				action: "sel",
				Token: storage["Token"],
				lang: storage["Language"]
			},
			dataType: "json",
			type: "post",
			timeout: 100000,
			success: function(data) {
				var json = data.TL;
				var picker = new mui.PopPicker();
				picker.setData(json);
				picker.show(function(items) {
					if (items[0].value != "" && items[0].value != null && items[0].text != undefined) {
						_DOCCOD.value = items[0].value;
						mui("#txtSTONO")[0].value = items[0].text;
						mui("#selBARCODE")[0].focus()
					}
				})
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				mui.alert(errorThrown, "SystemError")
			}
		})
	}, false);
	*/

	var btn = mui("#btnRight")[0];
	btn.addEventListener("tap", function() {

		plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
			console.log(fs.root.fullPath);
			// fs.root是根目录操作对象DirectoryEntry
			fs.root.getFile('FixedAssetScanResult.txt', {
				create: true
			}, function(fileEntry) {
				// fileEntry.remove();

				fileEntry.createWriter(function(writer) {

					writer.onwrite = function(e) {
						console.log("Write data success!");
					};
					try {
						writer.seek(writer.length);
						var myDate = new Date();
						//获取当前年
						var year = myDate.getFullYear();
						//获取当前月
						var month = myDate.getMonth() + 1;

						//获取当前日
						var day = myDate.getDate();
						var h = myDate.getHours(); //获取当前小时数(0-23)
						var m = myDate.getMinutes(); //获取当前分钟数(0-59)
						var s = myDate.getSeconds();

						//获取当前时间
						// var now = year.toString().concat(month, day, h, m, s);
						// var nowNew = new Date(now).format("yyyyMMdd");
						var now = new Date().Format("yyyyMMdd HH:mm:ss");
						console.log(now);
						var scanResult =
							mui("#txtAssetBarcode")[0].value + "|" + mui("#txtAssetCode")[0].value + "|" + "1" + "|" + "" + "|" +
							storage["LOGINNAME"] + "|" + now + "\r\n";
						writer.write(scanResult);
						mui("#txtAssetBarcode")[0].value = ""
						_selBARCODE.value = ""
						_selBARCODE.focus();
						// mui.alert("保存数据成功！");
					} catch (e) {
						console.log(e.message + "file doesn't exist!");
					}
				}, function(e) {
					mui.alert(e.message);
				});
			});
		}, function(e) {
			mui.alert(e.message);
		});
		/*
		
		//固定资产扫描结果文件
		            String exePathResult = Assembly.GetExecutingAssembly().GetName().CodeBase;
		            String oPathResult = Path.GetDirectoryName(exePathResult) + @"\FixedAssetScanResult.txt";
		            StreamWriter swResult = new StreamWriter(oPathResult, true);
		
		            DateTime nowTime = new DateTime();
		            nowTime = DateTime.Now;
		
		            //保存盘点结果
		            swResult.WriteLine(txtBarcode.Text + "|" + lalAssetCode2.Text + "|" + "1" + "|" + "" + "|" + Program.loginUser + "|" + nowTime);
		            if (!scanHt.Contains(txtBarcode.Text))
		            {
		                scanHt.Add(txtBarcode.Text, "");
		            }
		
		            txtBarcode.Text = "";
		            lalAssetCode2.Text = "";
		            lalAssetName2.Text = "";
		            lalGuiGe2.Text = "";
		            lalZhuangtai2.Text = "";
		            lalDept2.Text = "";
		            lalEmpl2.Text = "";
		            lalBianma2.Text = "";
		            lalXuliehao2.Text = "";
		            btnRight.Enabled = false;
		            btnWrong.Enabled = false;
		            btnCancel.Enabled = false;
		            txtBarcode.Focus();
		
		            swResult.Close();
		*/
		/*
		if (OnCheckText()) {
			mask.show();
			mui.ajax(requestPath + "/ashx/STA05.ashx", {
				data: {
					action: "add",
					DOCCOD: mui("#txtAssetBarcode")[0].value,
					BARCODE: mui("#txtBARCODE")[0].value,
					ENAM: storage["NAME"],
					Token: storage["Token"],
					lang: storage["Language"],
					LOGINNAME: storage["LOGINNAME"]
				},
				dataType: "json",
				type: "post",
				timeout: 100000,
				success: function(data) {
					if (data.ErrCode == "0") {
						mui.toast(data.Error, {
							duration: tim,
							type: "div"
						});
						OnCleanText()
					} else {
						mui.alert(data.Error, "Message")
					}
					mui('#selBARCODE')[0].value = '';
					mui('#selBARCODE')[0].focus();
					flag = true;
					mask.close();
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					mui('#selBARCODE')[0].value = '';
					mui('#selBARCODE')[0].focus();
					flag = true;
					mask.close();
					mui.alert(errorThrown, "SystemError")
				}
			})
		}
	*/
	}, false)


	var btnWrong = mui("#btnWrong")[0];
	btnWrong.addEventListener("tap", function() {

		plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
			console.log(fs.root.fullPath);
			// fs.root是根目录操作对象DirectoryEntry
			fs.root.getFile('FixedAssetScanResult.txt', {
				create: true
			}, function(fileEntry) {
				// fileEntry.remove();

				fileEntry.createWriter(function(writer) {

					writer.onwrite = function(e) {
						console.log("Write data success!");
					};
					try {
						writer.seek(writer.length);
						var now = new Date().Format("yyyyMMdd HH:mm:ss");
						console.log(now);
						var scanResult =
							mui("#txtAssetBarcode")[0].value + "|" + mui("#txtAssetCode")[0].value + "|" + "1" + "|" + "wrong" + "|" +
							storage["LOGINNAME"] + "|" + now + "\r\n";
						writer.write(scanResult);
						mui("#txtAssetBarcode")[0].value = ""
						_selBARCODE.value = ""
						_selBARCODE.focus();
						// mui.alert("保存数据成功！");
					} catch (e) {
						console.log(e.message + "file doesn't exist!");
					}
				}, function(e) {
					mui.alert(e.message);
				});
			});
		}, function(e) {
			mui.alert(e.message);
		});
	}, false)

})(mui);

function OnCheckText() {
	if ("" == mui("#txtAssetBarcode")[0].value || "undefined" == mui("#txtAssetBarcode")[0].value) {
		mui.alert("请扫描条码！");
		return false
	}
	// if ("" == mui("#txtAssetCode")[0].value || "undefined" == mui("#txtAssetCode")[0].value) {
	// 	mui.alert("请选择盘点库位！");
	// 	return false
	// }
	// if ("" == mui("#txtAssetEmployee")[0].value || "undefined" == mui("#txtAssetEmployee")[0].value) {
	// 	mui.alert("请扫描条码！");
	// 	return false
	// }
	// return true
}

function OnCleanText() {
	JQ("#dList tr:gt(0)").remove();
	mui("#txtAssetBarcode")[0].value = "";
	mui("#txtAssetCode")[0].value = "";
	mui("#txtAssetName")[0].value = "";
	mui("#txtAssetSpec")[0].value = "";
	mui("#txtAssetStatus")[0].value = "";
	mui("#txtAssetDepartment")[0].value = "";
	mui("#txtAssetEmployee")[0].value = "";
	mui("#txtAssetEquipID")[0].value = "";
	mui("#txtAssetNo")[0].value = "";
};

function getItem(arr, n, v) {
	try {
		for (var i = 0; i < arr.length; i++)
			if (arr[i][n] == v)
				return arr[i];
	} catch (e) {
		console.log(e.message);
	}
}

//格式化日期格式
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"H+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[
			k]).substr(("" + o[k]).length)));
	return fmt;
}
// function GetHeader(src) {
// var ForReading=1;
// var fso=new ActiveXObject("Scripting.FileSystemObject")；
// var f=fso.OpenTextFile(src,ForReading)；
// return(f.ReadAll())；
// }
// function ReadText(){
// var arr=GetHeader("a.txt")。split("\r\n")；
// for(var i=0;i<arr.length;i++){
// alert("第"+(i+1)+"行数据为："+arr[i])；
// }
// }
