var storage = window.localStorage;
var language = storage["Language"];
if(language != "CHN") {
	var db;
	var request = window.indexedDB.open("Language", 1);
	request.onsuccess = function(event) {
		db = event.target.result;
		request = db.transaction(["lang"], "readwrite").objectStore("lang").get(1);
		request.onsuccess = function(event) {
			var json = request.result.Value;
			var labelList = mui("body label");
			for(var i = 0; i < labelList.length; i++) {
				var _label = labelList[i];
				var _id = _label.id;
				for(var j = 0; j < json.length; j++) {
					if(json[j].Chinese == _label.innerText) {
						if(language == "ENG") {
							if("" != json[j].English) {
								mui("#" + _id)[0].innerText = json[j].English;
							}
						} else {
							if("" != json[j].Other) {
								mui("#" + _id)[0].innerText = json[j].Other;
							}
						}
					}
				}
			}
		};
	}
}