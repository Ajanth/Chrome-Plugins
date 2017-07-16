// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text == 'send_email') {
		var arr = [];
		var trs = document.querySelectorAll("tr");
		for(var i=0;i<trs.length;i++){
			var tds = trs[i].querySelectorAll("td");
			var str = "";
			for(var j=0;j<tds.length;j++){
				str+=tds[j].innerText;
			}
			arr.push(str);
		}
        sendResponse(arr);
    }
});

console.log("started script");