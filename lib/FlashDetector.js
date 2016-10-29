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
                                  // @options.timeout   Number = 3000
                                  // @options.callback  Function = null
                                  // @options.flashvars String = ""
                                  // @options.container Node = document.body
    options = options || {};

    this._id        = options["id"]        || ("external" + Date.now());

    var swf         = options["swf"]       || "./FlashDetector.swf";
    var width       = options["width"]     || "100%";
    var height      = options["height"]    || "100%";
    var timeout     = options["timeout"]   || 3000; // 3 sec
    var callback    = options["callback"]  || function() { };
    var container   = options["container"] || document.body;
    var flashvars   = options["flashvars"] || "";

    this._enabled = false;
    this._flashObject = null;

    if (this._id.indexOf("external") < 0) {
        this._id = "external" + this._id;
    }

    var that = this;

    global["ExternalInterface"] = global["ExternalInterface"] || {};
    global["ExternalInterface"][this._id] = function(command) {
        if (command === "FLASH_READY") {
            that._enabled = true;
            callback(true);
        }
    };
    setTimeout(function() {
        if (!that._enabled) {
            that["release"](); // auto release
            callback(false);
        }
    }, timeout);

    this._flashObject = _createFlashObject(this._id, swf, width, height, flashvars);
    container.appendChild(this._flashObject);
}

FlashDetector["repository"] = "https://github.com/uupaa/FlashDetector.js";
FlashDetector["prototype"] = Object.create(FlashDetector, {
    "constructor":    { "value": FlashDetector                          },  // new FlashDetector(...):FlashDetector
    "enabled":        { "get":   function() { return this._enabled;     }}, // #enabled:Boolean
    "id":             { "get":   function() { return this._id;          }}, // #id:String
    "flashObject":    { "get":   function() { return this._flashObject; }}, // #flashObject:Node <object>
    "ping":           { "value": FlashDetector_ping                     },  // #ping():String
    "attach":         { "value": FlashDetector_attach                   },  // #attach(container:Node, handler:Function):void
    "detach":         { "value": FlashDetector_detach                   },  // #detach():void
    "release":        { "value": FlashDetector_relase                   },  // #release():void
});

// --- implements ------------------------------------------
function FlashDetector_ping() { // @ret String - "pong"
    if (this._flashObject) {
        return this._flashObject["as_ping"]();
    }
    return "";
}

function FlashDetector_attach(container, // @arg Node
                              handler) { // @arg Function - handler(...):void
    if (this._flashObject && container) {
        global["ExternalInterface"][this._id] = handler;
        container.appendChild(this._flashObject);
    }
}

function FlashDetector_detach() {
    if (this._flashObject) {
        this._flashObject["as_release"]();
        this._flashObject.parentNode.removeChild(this._flashObject);
      //this._flashObject = null;
    }
    if (global["ExternalInterface"][this._id]) {
        global["ExternalInterface"][this._id] = function() {}; // blank function
    }
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

