(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("FlashDetector", function moduleClosure(global /*, WebModule, VERIFY, VERBOSE */) {
"use strict";

// --- technical terms / data structure --------------------
// --- dependency modules ----------------------------------
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
// --- class / interfaces ----------------------------------
function FlashDetector(options) { // @arg Object = { id, swf, timeout, width, height, callback, flashvars, container }
                                  // @options.id        String = "external" + Date.now
                                  // @options.swf       URLString = "./FlashDetector.swf"
                                  // @options.width     Number|String = "100%" - stage width
                                  // @options.height    Number|String = "100%" - stage height
                                  // @options.timeout   Number = 1000
                                  // @options.callback  Function = null
                                  // @options.flashvars String = ""
                                  // @options.container Node = document.body
    options = options || {};

    this._id        = options["id"]        || ("external" + Date.now());
    var swf         = options["swf"]       || "./FlashDetector.swf";
    var width       = options["width"]     || "100%";
    var height      = options["height"]    || "100%";
    this._timeout   = options["timeout"]   || 1000; // 1 sec
    var callback    = options["callback"]  || function() { };
    var container   = options["container"] || document.body;
    var flashvars   = options["flashvars"] || "";

    this._enabled = false;
    this._flashObject = null;

    if (this._id.indexOf("external") < 0) {
        this._id = "external" + this._id;
    }

    global["ExternalInterface"] = global["ExternalInterface"] || {};
    _setCallbackHandler(this, callback);
    _setWatchdog(this, callback);

    this._flashObject = _createFlashObject(this._id, swf, width, height, flashvars);
    container.appendChild(this._flashObject);
}

FlashDetector["repository"] = "https://github.com/uupaa/FlashDetector.js";
FlashDetector["prototype"] = Object.create(FlashDetector, {
    "constructor":    { "value": FlashDetector                          },  // new FlashDetector(...):FlashDetector
    "enabled":        { "get":   function() { return this._enabled;     }}, // #enabled:Boolean
    "id":             { "get":   function() { return this._id;          }},
    "flashObject":    { "get":   function() { return this._flashObject; }},
    "ping":           { "value": FlashDetector_ping                     },
    "attach":         { "value": FlashDetector_attach                   },
    "detach":         { "value": FlashDetector_detach                   },
    "release":        { "value": FlashDetector_relase                   },
});

// --- implements ------------------------------------------
function FlashDetector_ping() { // @ret String - "pong"
    if (this._flashObject) {
        return this._flashObject.as_ping();
    }
    return "";
}

function _setCallbackHandler(that, callback) {
    global["ExternalInterface"][that._id] = function(command) {
        if (command === "FLASH_READY") {
            that._enabled = true;
            callback(true);
        }
    };
}

function _setWatchdog(that, callback) {
    setTimeout(function() {
        if (!that._enabled) {
            callback(false);
            that["release"]();
        }
    }, that._timeout);
}

function FlashDetector_attach(container, callback) {
    callback = callback || function() {};
    if (this._flashObject && container) {
        _setCallbackHandler(this, callback);
        _setWatchdog(this, callback);
        container.appendChild(this._flashObject);
    }
}

function FlashDetector_detach() {
    if (this._flashObject) {
        this._flashObject.as_release();
        this._flashObject.parentNode.removeChild(this._flashObject);
      //this._flashObject = null;
    }
    if (global["ExternalInterface"][this._id]) {
        global["ExternalInterface"][this._id] = function() {}; // blank function
    }
    this._enabled = false;
}

function FlashDetector_relase() {
    this["detach"]();
    this._flashObject = null;
    this._enabled = false;
}

function _createFlashObject(id, swf, stageWidth, stageHeight, flashvars) {
//  var ie = !!document["documentMode"];
    var placeHolder = document.createElement("div");
    var fragment =
      '<object type="application/x-shockwave-flash" id="' + id + '" width="' + stageWidth + '" height="' + stageHeight + '">' +
      '<param name="allowScriptAccess" value="always" />' +
      '<param name="flashvars" value="" />' +
      '<param name="wmode" value="transparent" />' +
      '<param name="movie" value="' + swf + '" />' +
      '<param name="flashvars" value="' + flashvars + '" />' +
      '<param name="bgcolor" value="#000000" />' +
      '</object>';

    placeHolder.innerHTML = fragment;
    return placeHolder.firstChild;
}

return FlashDetector; // return entity

});

