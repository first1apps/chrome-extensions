chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			document.body.addEventListener('keydown', function(event) {
				if(event.keyCode == 19) {
					debugger;
				}
			}, true);
		}
	}, 1000);
});