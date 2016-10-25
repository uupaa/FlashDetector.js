# FlashReady.js [![Build Status](https://travis-ci.org/uupaa/FlashReady.js.svg)](https://travis-ci.org/uupaa/FlashReady.js)

[![npm](https://nodei.co/npm/uupaa.flashready.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.flashready.js/)

Flash will detect whether the available.

This module made of [WebModule](https://github.com/uupaa/WebModule).

## Documentation
- [Spec](https://github.com/uupaa/FlashReady.js/wiki/)
- [API Spec](https://github.com/uupaa/FlashReady.js/wiki/FlashReady)

## Browser, NW.js and Electron

```js
<script src="lib/WebModule.js"></script>
<script src="lib/FlashReady.js"></script>

window.onload = function() {
  var flash = new FlashReady({
    swf: "as3/FlashReady/bin/FlashReady.swf",
    callback: function(ready) {
      console.log("flash.ready", flash.ready);
      alert(ready);

    }
  });
}
```

