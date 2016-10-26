(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("FlashDetector", function moduleClosure(/* global, WebModule, VERIFY, VERBOSE */) {
"use strict";

// --- technical terms / data structure --------------------
// --- dependency modules ----------------------------------
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function FlashDetector(options) { // @arg Object = { id, swf, timeout, callback, container }
                                  // @options.id        String = "external" + Date.now
                                  // @options.swf       URLString = "./FlashDetector.swf"
                                  // @options.timeout   Number = 1000
                                  // @options.callback  Function = null
                                  // @options.container Node = document.body
    options = options || {};

    var id          = options["id"]        || ("external" + Date.now());
    var swf         = options["swf"]       || "./FlashDetector.swf";
    var container   = options["container"] || document.body;
    var callback    = options["callback"]  || function() { };
    var timeout     = options["timeout"]   || 1000; // 1 sec
    var flashObject = null;

    this._enabled = false;

    if (id.indexOf("external") < 0) {
        id = "external" + id;
    }

    var that = this;

    window["ExternalInterface"] = window["ExternalInterface"] || {};
    window["ExternalInterface"][id] = function(command) {
        if (command === "FLASH_READY") {
            that._enabled = true;
            callback(true);
            if (flashObject) {
                flashObject.parentNode.removeChild(flashObject);
                flashObject = null;
            }
        }
    };
    setTimeout(function() {
        if (!that._enabled) {
            callback(false);
            if (flashObject) {
                flashObject.parentNode.removeChild(flashObject);
                flashObject = null;
            }
        }
    }, timeout);

    flashObject = _createFlashObject(id, swf);
    container.appendChild(flashObject);
}

FlashDetector["repository"] = "https://github.com/uupaa/FlashDetector.js";
FlashDetector["prototype"] = Object.create(FlashDetector, {
    "constructor":    { "value": FlashDetector                         },  // new FlashDetector(...):FlashDetector
    "enabled":        { "get":   function() { return this._enabled;   }},  // #enabled:Boolean
});

// --- implements ------------------------------------------
function _createFlashObject(id, swf) {
//  var ie = !!document["documentMode"];
    var placeHolder = document.createElement("div");
    var fragment =
      '<object type="application/x-shockwave-flash" id="' + id + '" width="1" height="1">' +
      '<param name="allowScriptAccess" value="always" />' +
      '<param name="flashvars" value="" />' +
      '<param name="wmode" value="transparent" />' +
      '<param name="movie" value="' + swf + '" />' +
      '<param name="bgcolor" value="#000000" />' +
      '</object>';

    placeHolder.innerHTML = fragment;
    return placeHolder.firstChild;
}

return FlashDetector; // return entity

});

