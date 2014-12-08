(function(){
	var keyCombo;

	function applyKeyCombo(newKeyCombo)
	{
		keyCombo.shift = newKeyCombo.shift == true;
		keyCombo.ctrl = newKeyCombo.ctrl == true;
		keyCombo.alt = newKeyCombo.alt == true;
		keyCombo.keyCode = parseInt(newKeyCombo.keyCode);
	}

	function loadFromStorage()
	{
		chrome.storage.local.get('keyCombo', function(value)
		{
			if (value.keyCombo != null && typeof(value.keyCombo) == 'object')
			{
				applyKeyCombo(value.keyCombo);
			}
		});
	}

	keyCombo = {
		ctrl: false,
		alt: false,
		shift: false,
		keyCode: 19
	};
	loadFromStorage();
	chrome.storage.onChanged.addListener(function(changes, namespace)
	{
		if (changes.keyCombo != null)
		{
			applyKeyCombo(changes.keyCombo.newValue);
		}
	});

	chrome.extension.sendMessage({}, function(response) {
		var readyStateCheckInterval = setInterval(function() {
			if (document.readyState === "complete") {
				clearInterval(readyStateCheckInterval);

				document.body.addEventListener('keydown', function (event) {
					if (
						event.ctrlKey == keyCombo.ctrl &&
						event.altKey == keyCombo.alt &&
						event.shiftKey == keyCombo.shift &&
						event.keyCode == keyCombo.keyCode
					)
					{
						debugger;
					}
				}, true);
			}
		}, 500);
	});

}());