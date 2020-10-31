var storage = window.localStorage;
var JQ = jQuery.noConflict();
(function($) {
	$.init();
	OnLoadLoadingList();
	mui("#lblUser")[0].innerText = storage["NAME"];
	mui("#lblTime")[0].innerText = DateTime();
	var _selBARCODE = mui("#selBARCODE")[0];
	mui("#btnUD")[0].innerText = "装 车";
	mui("#txtSTA")[0].value = "1";
	JQ(document).on("click", "#tbList tr", function() {
		var trs = JQ(this).parent().find("tr");
		if(trs.hasClass("button_background")) {
			trs.removeClass("button_background");
		}
		JQ(this).addClass("button_background");
	});

	var _btnUD = mui("#btnUD")[0];
	JQ("#btnUD").click(
		function() {
			if(mui("#txtSTA")[0].value == "1") {
				JQ("#btnUD").attr("class", "mui-btn mui-btn-danger mui-btn-block");
				_btnUD.innerText = "卸 车";
				mui("#selBARCODE")[0].value = "";
				mui("#txtSTA")[0].value = "2";
				JQ("#selBARCODE").focus();
			} else {
				JQ("#btnUD").attr("class", "mui-btn mui-btn-success mui-btn-block");
				_btnUD.innerText = "装 车";
				mui("#txtSTA")[0].value = "1";
				JQ("#selBARCODE").focus();
				mui("#selBARCODE")[0].value = "";
			}
		});
	var _btnSel = mui("#btnSel")[0];
	_btnSel.addEventListener("tap", function() {
		OnSelClick();
	}, false);
	var _btnRef = mui("#btnRef")[0];
	_btnRef.addEventListener("tap", function() {
		OnLoadLoadingList();
	}, false);
	var _btnNew = mui("#btnNew")[0];
	_btnNew.addEventListener("tap", function() {
		mui.ajax(requestPath + "/ashx/LogLoad.ashx", {
			data: {
				action: "new",
				ENAM: storage["NAME"],
				Token: storage["Token"],
				lang: storage["Language"],
				LOGINNAM: storage["LOGINNAME"],
				FAC: storage["FAC"]
			},
			dataType: "json",
			type: "post",
			timeout: 100000,
			success: function(data) {
				if(data.ErrCode == "0") {
					OnLoadLoadingList();
					OnCleanText()
				} else {
					mui.alert(data.Error, "Message");
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				mui.alert(errorThrown, "SystemError");
			}
		});
	}, false);
	var _btnDel = mui("#btnDel")[0];
	_btnDel.addEventListener("tap", function() {
		if("" == mui("#txtWarehousereceipt")[0].value) {
			mui.alert("您还没有选中装车单?", "Message");
			return;
		}
		mui.confirm("您确定要删除[" + mui("#txtWarehousereceipt")[0].value + "]装车单?", "确认信息", ["是", "否"], function(e) {
			if(e.index == 0) {
				mui.ajax(requestPath + "/ashx/LogLoad.ashx", {
					data: {
						action: "del",
						ENAM: storage["NAME"],
						Token: storage["Token"],
						lang: storage["Language"],
						LOGINNAM: storage["LOGINNAME"],
						FAC: storage["FAC"],
						wh: mui("#txtWarehousereceipt")[0].value
					},
					dataType: "json",
					type: "post",
					timeout: 100000,
					success: function(data) {
						if(data.ErrCode == "0") {
							mui.toast(data.Error, {
								duration: tim,
								type: "div"
							});
							OnLoadLoadingList();
							OnCleanText();
						} else {
							mui.alert("<span style=\"font-size: 20px;\">" + data.Error + "</span>", "Message", '', '', 'div');
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						mui.alert(errorThrown, "SystemError");
					}
				});
			}
		});
	}, false);
	_selBARCODE.addEventListener("keyup", function() {
		if(13 == event.keyCode || 0 == event.keyCode) {
			OnSelClick();
		}
		_selBARCODE.focus();
	}, false);
	var _btnFix = mui("#btnFix")[0];
	JQ("#btnFix").click(function() {
		if("" != mui("#txtWarehousereceipt")[0].value) {
			JQ("#dSub").slideDown("slow");
			JQ("#dMain").hide();
			OnLoadSubList();
			mui("#selBARCODE")[0].value = "";
			JQ("#selBARCODE").focus();

		} else {
			mui.alert("请选择装车单!", "Message");
		}
	});
	var _btnRen = mui("#btnRen")[0];
	_btnRen.addEventListener("tap", function() {
		JQ("#dMain").slideDown("slow");
		JQ("#dSub").hide();
		OnLoadLoadingList();
	}, false);
	var btn = mui("#btnAdd")[0];
	btn.addEventListener("tap", function() {
		if(OnCheckText()) {
			mask.show();
			mui.ajax(requestPath + "/ashx/LogLoad.ashx", {
				data: {
					action: "ok",
					FAC: storage["FAC"],
					wh: mui("#txtWarehousereceipt")[0].value,
					ENAM: storage["NAME"],
					Token: storage["Token"],
					lang: storage["Language"],
					LOGINNAM: storage["LOGINNAME"]
				},
				dataType: "json",
				type: "post",
				timeout: 100000,
				success: function(data) {
					if(data.ErrCode == "0") {
						mui.toast(data.Error, {
							duration: tim,
							type: "div"
						});
						OnCleanText();
						JQ("#dMain").slideDown("slow");
						JQ("#dSub").hide();
					} else {
						mui.alert(data.Error, "Message");
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
					mui.alert(errorThrown, "SystemError");
				}
			});
		}
		mui('#selBARCODE')[0].value = '';
		mui('#selBARCODE')[0].focus();
	}, false);
})(mui);

function OnCheckText() {
	if("" == mui("#txtWarehousereceipt")[0].value || "undefined" == mui("#txtWarehousereceipt")[0].value) {
		mui.alert("装车单不能为空！");
		return false;
	}
	if("0" == mui("#txtDisknumber")[0].value) {
		mui.alert("货架总数不能为0！");
		return false;
	}
	if("0" == mui("#txttotal")[0].value) {
		mui.alert("轮胎总数不能为0！");
		return false;
	}
	return true;
};

function OnCleanText() {
	mui("#selBARCODE")[0].value = "";
	mui("#txtWarehousereceipt")[0].value = "";
	mui("#txtDisknumber")[0].value = "0";
	mui("#txttotal")[0].value = "0";
	mui("#lsWarehousereceipt")[0].innerText = "";
	mui("#lsWarehouse")[0].innerText = "";
	mui("#lsDisknumber")[0].innerText = "";
	mui("#lsConsignor")[0].innerText = "";
	mui("#lsDATECREATE")[0].innerText = "";
	mui("#lsForkliftDriver")[0].innerText = "";
	mui("#lsUPDATA")[0].innerText = "";
};

function OnLoadLoadingList() {
	mui.ajax(requestPath + "/ashx/LogLoad.ashx", {
		data: {
			FAC: storage["FAC"],
			action: "list",
			Token: storage["Token"],
			ENAM: storage["NAME"],
			LOGINNAM: storage["LOGINNAME"],
			lang: storage["Language"]
		},
		dataType: "json",
		type: "post",
		timeout: 100000,
		success: function(data) {
			if(data.ErrCode == "0") {
				JQ("#tbList tr:gt(0)").remove();
				mui("#lsWarehousereceipt")[0].innerText = "";
				mui("#txtWarehousereceipt")[0].value = "";
				mui("#txtDisknumber")[0].value = "";
				mui("#txttotal")[0].value = "";
				mui("#lsWarehouse")[0].innerText = "";
				mui("#lsDisknumber")[0].innerText = "";
				mui("#lsConsignor")[0].innerText = "";
				mui("#lsDATECREATE")[0].innerText = "";
				mui("#lsForkliftDriver")[0].innerText = "";
				mui("#lsUPDATA")[0].innerText = "";
				if(data.TL.length != 0) {
					var tr;
					var json = data.TL;
					for(var i = 0; i < json.length; i++) {
						tr += "<tr bgcolor=\"#FFFFFF\" onclick=\"OnColumnDataClick('" + json[i].Warehousereceipt + "');\"><td height=\"35\">" + json[i].Warehousereceipt + "</td></tr>";
					}
					JQ("#tbList").append(tr);
				}
			}
		}
	});
};

function OnColumnDataClick(p) {
	mui.ajax(requestPath + "/ashx/LogLoad.ashx", {
		data: {
			wh: p,
			ENAM: storage["NAME"],
			LOGINNAM: storage["LOGINNAME"],
			action: "by",
			FAC: storage["FAC"],
			Token: storage["Token"],
			lang: storage["Language"]
		},
		dataType: "json",
		type: "post",
		timeout: 100000,
		success: function(data) {
			if(data.ErrCode == "0") {
				if(data.TL.length != 0) {
					var tr;
					var json = data.TL;
					mui("#lsWarehousereceipt")[0].innerText = json[0].Warehousereceipt;
					mui("#txtWarehousereceipt")[0].value = json[0].Warehousereceipt;
					mui("#txtDisknumber")[0].value = json[0].Disknumber;
					mui("#txttotal")[0].value = json[0].total;
					mui("#lsWarehouse")[0].innerText = json[0].Warehouse;
					mui("#lsDisknumber")[0].innerText = json[0].Disknumber;
					mui("#lsConsignor")[0].innerText = json[0].Consignor;
					mui("#lsDATECREATE")[0].innerText = null == json[0].DATECREATE ? "" : json[0].DATECREATE.substring(0, 10);
					mui("#lsForkliftDriver")[0].innerText = json[0].ForkliftDriver;
					mui("#lsUPDATA")[0].innerText = null == json[0].UPDATA ? "" : json[0].UPDATA.substring(0, 10);
				}
			}
		}
	});
};

function OnLoadSubList() {
	mui.ajax(requestPath + "/ashx/LogLoad.ashx", {
		data: {
			wh: mui("#txtWarehousereceipt")[0].value,
			FAC: storage["FAC"],
			action: "subls",
			ENAM: storage["NAME"],
			LOGINNAM: storage["LOGINNAME"],
			Token: storage["Token"],
			lang: storage["Language"]
		},
		dataType: "json",
		type: "post",
		timeout: 100000,
		success: function(data) {
			if(data.ErrCode == "0") {
				JQ("#subList tr:gt(0)").remove();
				mui("#txttotal")[0].value = "0";
				mui("#txtDisknumber")[0].value = "0";
				if(data.TL.length != 0) {
					var tr;
					var json = data.TL;
					mui("#txtDisknumber")[0].value = parseInt(data.TL.length);
					for(var i = 0; i < json.length; i++) {
						tr += "<tr bgcolor=\"#FFFFFF\"><td height=\"35\">" + json[i].ShelfNumber + "</td><td>" + json[i].ITDSC + "</td><td align=\"center\">" + json[i].Number + "</td><td>" + json[i].LOCATOR + "</td></tr>";
						mui("#txttotal")[0].value = parseInt(json[i].Number) + parseInt(mui("#txttotal")[0].value);
					}
					JQ("#subList").append(tr);
				}
			}
		}
	});
};

function OnSelClick() {
	if("1" == mui("#txtSTA")[0].value) {
		if(mui("#selBARCODE")[0].value.length != 0 && mui("#selBARCODE")[0].value.trim().length == 9 || mui("#selBARCODE")[0].value.trim().length == 16) {
			if("" != mui("#txtWarehousereceipt")[0].value || "undefined" != mui("#txtWarehousereceipt")[0].value) {
				mui.ajax(requestPath + "/ashx/LogLoad.ashx", {
					data: {
						num: mui("#selBARCODE")[0].value.trim(),
						action: "acc",
						FAC: storage["FAC"],
						Token: storage["Token"],
						lang: storage["Language"],
						ENAM: storage["NAME"],
						LOGINNAM: storage["LOGINNAME"],
						wh: mui("#txtWarehousereceipt")[0].value
					},
					dataType: "json",
					type: "post",
					timeout: 100000,
					success: function(data) {
						if(data.ErrCode == "0") {
							mui.alert("<span style=\"font-size: 20px;\">" + data.Error + "</span>", "Message", '', '', 'div');
							OnLoadSubList();
						} else {
							mui.alert("<span style=\"font-size: 20px;\">" + data.Error + "</span>", "Message", '', '', 'div');
						}
						mui("#selBARCODE")[0].value = "";
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						mui.alert(errorThrown, "SystemError");
					}
				});
			} else {
				mui('#selBARCODE')[0].value = '';
				mui('#selBARCODE')[0].focus();
				mui.alert("请选择装车单！", "Message");
			}
		} else {
			mui('#selBARCODE')[0].value = '';
			mui('#selBARCODE')[0].focus();
		}
	} else if("2" == mui("#txtSTA")[0].value) {
		if(mui("#selBARCODE")[0].value.length != 0 && mui("#selBARCODE")[0].value.trim().length == 9 || mui("#selBARCODE")[0].value.trim().length == 16) {
			if("" != mui("#txtWarehousereceipt")[0].value || "undefined" != mui("#txtWarehousereceipt")[0].value) {
				mui.ajax(requestPath + "/ashx/LogLoad.ashx", {
					data: {
						num: mui("#selBARCODE")[0].value.trim(),
						action: "down",
						FAC: storage["FAC"],
						Token: storage["Token"],
						ENAM: storage["NAME"],
						LOGINNAM: storage["LOGINNAME"],
						lang: storage["Language"],
						wh: mui("#txtWarehousereceipt")[0].value
					},
					dataType: "json",
					type: "post",
					timeout: 100000,
					success: function(data) {
						if(data.ErrCode == "0") {
							mui.toast(data.Error, {
								duration: "long",
								type: "div"
							});
							OnLoadSubList();
						} else {
							mui.alert(data.Error, "Message");
						}
						mui("#selBARCODE")[0].value = "";
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						mui.alert(errorThrown, "SystemError");
					}
				});
			} else {
				mui('#selBARCODE')[0].value = '';
				mui('#selBARCODE')[0].focus();
				mui.alert("请选择装车单！", "Message");
			}
		} else {
			mui('#selBARCODE')[0].value = '';
			mui('#selBARCODE')[0].focus();
		}
	}
};
document.onkeypress = closeWin;
function closeWin(event) {
	var key = event.keyCode;
	if(13 == key) {
		mui.closePopups();
	}
};