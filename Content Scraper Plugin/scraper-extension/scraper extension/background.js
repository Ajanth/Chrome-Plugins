

// A function to use as callback
function postMessageToPHP(arr) {
	console.log("HI "+JSON.stringify(arr));
	var obj = getSettingsObject();
	obj.message = JSON.stringify(arr);
	console.log("LOCAL DATA IS "+JSON.stringify(obj));
	$.ajax({
            type: "POST",
            url: obj.apiurl,
            data: obj,
            success: function(msg){
                message(msg);
				$("#mail").html("Send Mail").prop("disabled",false);
           },
           error: function(err){
                message(err.responseText);
				$("#mail").html("Send Mail").prop("disabled",false);
           }
         });
	
}

function message(msg) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar")
	x.innerHTML=msg;
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}


var selectedSecurity="ssl";
document.addEventListener('DOMContentLoaded', function() {
    console.log("Extension loaded");
	
	var saveBtn = document.getElementById('save');
	var cancelBtn = document.getElementById('cancel');
	var mailBtn = document.getElementById('mail');
    // onClick's logic below:
    cancelBtn.addEventListener('click', function() {
        window.close();
    });
	
	saveBtn.addEventListener('click', function() {
        saveSettings();
    });
	
	$("button.security").on("click",function(){
		$("button.security.btn-success").removeClass("btn-success").addClass("btn-default");
		$(this).addClass("btn-success");
		if($(this).hasClass("ssl")){
			selectedSecurity="ssl";
		} else{
			selectedSecurity="tls";
		}
	});
	
	$("#mail").on("click",function(){
		$(this).html("Sending Mail..").prop("disabled",true);
		doInCurrentTab( function(tab){ 
			chrome.runtime.lastError="";
			chrome.tabs.sendMessage(tab.id, {text: 'send_email'}, postMessageToPHP);
		});
	});
	
	loadSettings();
});

function doInCurrentTab(tabCallback) {
    chrome.tabs.query(
        { currentWindow: true, active: true },
        function (tabArray) { tabCallback(tabArray[0]); }
    );
}

function saveSettings() {
	// Save it using the Chrome extension storage API.
	chrome.storage.sync.set({'scrapesettings': getSettingsObject()}, function() {
		message('Settings saved');
	});
}

function getSettingsObject(){
	// Get a value saved in a form.
	var username = $("#username").val();
	var password = $("#password").val();
	var host = $("#host").val();
	var port = $("#port").val();
	var mailto = $("#mailto").val();
	var subject = $("#subject").val();
	
	var apiurl = $("#apiurl").val();
	var fromemail = $("#fromemail").val();
	
	var obj = {};
	obj.username = username;
	obj.password = password;
	obj.host = host;
	obj.port = port;
	obj.mailto = mailto;
	obj.subject = subject;
	obj.apiurl = apiurl;
	obj.fromemail = fromemail;
	obj.selectedSecurity = selectedSecurity;
	
	return obj;
}

function loadSettings(){
	chrome.storage.sync.get('scrapesettings', function(data) {
		data = data.scrapesettings;
		if(data.username) $("#username").val(data.username);
		if(data.password) $("#password").val(data.password);
		if(data.host) $("#host").val(data.host);
		if(data.port) $("#port").val(data.port);
		if(data.mailto) $("#mailto").val(data.mailto);
		if(data.subject) $("#subject").val(data.subject);
		if(data.apiurl) $("#apiurl").val(data.apiurl);
		if(data.fromemail) $("#fromemail").val(data.fromemail);
		if(data.selectedSecurity){
			$("button.security.btn-success").removeClass("btn-success").addClass("btn-default");
			$("button."+data.selectedSecurity).addClass("btn-success");
			selectedSecurity=data.selectedSecurity;
		}
		console.log("set complete "+JSON.stringify(data));
	});
}

