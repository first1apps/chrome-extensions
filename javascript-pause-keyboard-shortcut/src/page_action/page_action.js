(function() {
    "use strict";

    function Key(name, keyCode, isModifer)
    {
        this.name = name;
        this.keyCode = keyCode;
        this.isModifer = isModifer || false;
    }

    var keys = {
        byName: {
            shift: new Key("Shift", 16, true),
            ctrl: new Key("Ctrl", 17, true),
            at: new Key("Alt", 18, true),
            pause: new Key("Pause", 19, false),
            break: new Key("Break", 3, false),
            scrollLock: new Key("Scroll Lock", 145, false)
        },
        byKeyCode: {}
    };
    for (var i in keys.byName)
    {
        var k = keys.byName[i];
        keys.byKeyCode[k.keyCode] = k;
    }

    $(function() {

        var listenForKeyCombo,
            keyCombo;

        function updateElements(done)
        {
            $('#key-modifier-ctrl').removeClass('active inactive').addClass(keyCombo.ctrl ? 'active' : 'inactive');
            $('#key-modifier-alt').removeClass('active inactive').addClass(keyCombo.alt ? 'active' : 'inactive');
            $('#key-modifier-shift').removeClass('active inactive').addClass(keyCombo.shift ? 'active' : 'inactive');

            var keyCodeValue = "";
            if (keyCombo.keyCode != null && keyCombo.keyCode != 0)
            {
                var key = keys.byKeyCode[keyCombo.keyCode];
                if (key != null)
                {
                    keyCodeValue = key.name;
                }
                else
                {
                    keyCodeValue = String.fromCharCode(keyCombo.keyCode);
                }
            }
            $('#key-combo-input').val(keyCodeValue)

            if (done)
            {
                $('#key-combo-input').blur();
            }
        }

        function setKeyComboModifiers(ev)
        {
            if (listenForKeyCombo)
            {
                keyCombo.shift = ev.shiftKey;
                keyCombo.ctrl = ev.ctrlKey;
                keyCombo.alt = ev.altKey;
                updateElements();
            }
        }

        function setKeyCode(keyCode, allowNormal, allowSpecial)
        {
            if (listenForKeyCombo && keyCode != 0)
            {
                var key = keys.byKeyCode[keyCode];
                if (
                    (allowNormal && key == null) ||
                    (allowSpecial && key != null && !key.isModifer)
                )
                {
                    keyCombo.keyCode = keyCode;
                    updateElements(false);
                    saveToStorage();
                    //listenForKeyCombo = false;
                }
            }
        }

        function loadFromStorage()
        {
            keyCombo = {
                shift: false,
                ctrl: false,
                alt: false,
                keyCode: keys.byName.pause.keyCode
            };
            chrome.storage.local.get('keyCombo', function(value) {
                if (value.keyCombo != null && typeof(value.keyCombo) == 'object')
                {
                    keyCombo.shift = value.keyCombo.shift == true;
                    keyCombo.ctrl = value.keyCombo.ctrl == true;
                    keyCombo.alt = value.keyCombo.alt == true;
                    keyCombo.keyCode = parseInt(value.keyCombo.keyCode);
                }
                updateElements();
            });
        }
        function saveToStorage()
        {
            chrome.storage.local.set({'keyCombo': keyCombo}, function() {
            });
        }

        listenForKeyCombo = false;
        loadFromStorage();

        $('#key-combo-input')
            .on('focus click', function() {
                $(this).select();
                listenForKeyCombo = true;
                return false;
            })
            .on('keyup keydown', setKeyComboModifiers)
            .on('keydown', function(ev) {
                if (ev.ctrlKey)
                {
                    setKeyCode(ev.which, true, true);
                }
                else {
                    setKeyCode(ev.which, false, true);
                }
            })
            .on('keypress', function(ev) {
                setKeyCode(ev.which, true, false);
                return false;
            })
        ;
        $('#save').on('click', function() {
            saveToStorage();
        });

    });

}());