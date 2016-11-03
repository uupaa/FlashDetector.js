(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("FlashDetector", function moduleClosure(global, WebModule /*, VERIFY, VERBOSE */) {
"use strict";

// --- technical terms / data structure --------------------
// --- dependency modules ----------------------------------
var UserAgent = WebModule["UserAgent"];
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
var ua = new UserAgent();
// --- class / interfaces ----------------------------------
function FlashDetector(options) { // @arg Object = { id, swf, timeout, width, height, callback, flashvars, container }
                                  // @options.id        String = "external" + Date.now
                                  // @options.swf       URLString = "./FlashDetector.swf"
                                  // @options.width     Number|String = 1 - stage width
                                  // @options.height    Number|String = 1 - stage height
                                  // @options.timeout   Number = 3000
                                  // @options.callback  Function = null - callback(ready:Boolean, elapsedTime:Number):void
                                  // @options.flashvars String = ""
                                  // @options.container Node = document.body
    options = options || {};

    this._id        = options["id"]        || ("external" + Date.now());

    var swf         = options["swf"]       || "./FlashDetector.swf";
    var width       = options["width"]     || 1;
    var height      = options["height"]    || 1;
    var timeout     = options["timeout"]   || 3000; // 3 sec
    var callback    = options["callback"]  || function() { };
    var container   = options["container"] || document.body;
    var flashvars   = options["flashvars"] || "";

    this._enabled = false;
    this._detected = false;
    this._beginTime = Date.now();
    this._flashObject = null;

    if (!ua["PC"]) {
        this._enabled = false;
        this._detected = true;
        callback(this, false, 0);
        return;
    }

    if (this._id.indexOf("external") < 0) {
        this._id = "external" + this._id;
    }

    var that = this;

    global["ExternalInterface"] = global["ExternalInterface"] || {};
    global["ExternalInterface"][this._id] = function(command) {
        if (command === "FLASH_READY") {
            that._enabled = true;
            that._detected = true;
            that._elapsedTime = Date.now() - that._beginTime;
            callback(that, true, that._elapsedTime);
        }
    };
    setTimeout(function() {
        if (!that._detected) {
            that._enabled = false;
            that._detected = true;
            callback(that, false, 0);
        }
    }, timeout);

    this._flashObject = _createFlashObject(this._id, swf, width, height, flashvars);
    container.appendChild(this._flashObject);
}

FlashDetector["repository"] = "https://github.com/uupaa/FlashDetector.js";
FlashDetector["prototype"] = Object.create(FlashDetector, {
    "constructor":    { "value": FlashDetector                          },  // new FlashDetector(...):FlashDetector
    "enabled":        { "get":   function() { return this._enabled;     }}, // #enabled:Boolean
    "detected":       { "get":   function() { return this._detected;    }}, // #detected:Boolean
    "elapsedTime":    { "get":   function() { return this._elapsedTime; }}, // #elapsedTime:Number
    "id":             { "get":   function() { return this._id;          }}, // #id:String
    "flashObject":    { "get":   function() { return this._flashObject; }}, // #flashObject:Node <object>
    "ping":           { "value": FlashDetector_ping                     },  // #ping():String
    "release":        { "value": FlashDetector_relase                   },  // #release():void
});

// --- implements ------------------------------------------
function FlashDetector_ping() { // @ret String - "pong"
    if (this._flashObject) {
        return this._flashObject["as_ping"]();
    }
    return "";
}

function FlashDetector_relase() {
    if (this._flashObject) {
        if (this._flashObject.parentNode) {
            this._flashObject.parentNode.removeChild(this._flashObject);
        }
        this._flashObject = null;
    }
    if (global["ExternalInterface"] &&
        global["ExternalInterface"][this._id]) {
        global["ExternalInterface"][this._id] = function() {}; // blank function
    }
}

function _createFlashObject(id, swf, stageWidth, stageHeight, flashvars) {
//  var ie = !!document["documentMode"];
    var placeHolder = document.createElement("div");
    var obj = {
            "id":           id,
            "width":        stageWidth,
            "height":       stageHeight,
            "swf":          swf,
            "flashvars":    flashvars,
            "codebase":     "http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0",
            "classid":      "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000",
            "pluginspage":  "http://www.macromedia.com/go/getflashplayer",
            "type":         "application/x-shockwave-flash",
        };
    var fragment = "";

    if (ua["IE"] || ua["Edge"] || ua["Chromium"]) {
        fragment = _format(
            // Chrome は <object classid=...> を指定すると動かなくなる
            '<object id="{id}" type="{type}" data="{swf}" codebase="{codebase}" width="{width}" height="{height}">' +
            '<param name="allowScriptAccess" value="always" />' +
            '<param name="wmode" value="transparent" />' +
            '<param name="movie" value="{swf}" />' +
            '<param name="flashvars" value="{flashvars}" />' +
            '</object>', obj);
    } else { // Firefox, Safari
        fragment = _format(
            // Firefox は id="..." を指定すると動かなくなので name="..." で代用
            '<embed name="{id}" type="{type}" src="{swf}" width="{width}" height="{height}" ' +
                'flashvars="{flashvars}" wmode="transparent" ' +
                'allowScriptAccess="always" pluginspage="{pluginspage}" />', obj);
    }

    placeHolder.innerHTML = fragment;
    return placeHolder.firstChild;
}

function _format(format, object) {
    // _format("x={x},y={y}", { x: 10, y: 20 }) -> "x=10,y=20"
    return format.replace(/\{([^\}]*)\}/g, function(_, v) {
        return object[v] || "";
    });
}

return FlashDetector; // return entity

});

