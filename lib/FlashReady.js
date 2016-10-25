(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("FlashReady", function moduleClosure(/* global, WebModule, VERIFY, VERBOSE */) {
"use strict";

// --- technical terms / data structure --------------------
// --- dependency modules ----------------------------------
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function FlashReady(options) { // @arg Object = { id, swf, timeout, callback, container }
                               // @options.id        String = "external" + Date.now
                               // @options.swf       URLString = "./FlashReady.swf"
                               // @options.timeout   Number = 1000
                               // @options.callback  Function = null
                               // @options.container Node = document.body
    options = options || {};

    var id          = options["id"]        || ("external" + Date.now());
    var swf         = options["swf"]       || "./FlashReady.swf";
    var container   = options["container"] || document.body;
    var callback    = options["callback"]  || function() { };
    var timeout     = options["timeout"]   || 1000; // 1 sec
    var flashObject = null;

    this._ready = false;

    if (id.indexOf("external") < 0) {
        id = "external" + id;
    }

    var that = this;

    window["ExternalInterface"] = window["ExternalInterface"] || {};
    window["ExternalInterface"][id] = function(command) {
        if (command === "FLASH_READY") {
            that._ready = true;
            callback(true);
            if (flashObject) {
                flashObject.parentNode.removeChild(flashObject);
                flashObject = null;
            }
        }
    };
    setTimeout(function() {
        if (!that._ready) {
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

FlashReady["repository"] = "https://github.com/uupaa/FlashReady.js";
FlashReady["prototype"] = Object.create(FlashReady, {
    "constructor":    { "value": FlashReady                         },  // new FlashReady(...):FlashReady
    "ready":          { "get":   function() { return this._ready;   }}, // #ready:Boolean
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

return FlashReady; // return entity

});

