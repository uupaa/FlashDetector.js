# FlashDetector.js [![Build Status](https://travis-ci.org/uupaa/FlashDetector.js.svg)](https://travis-ci.org/uupaa/FlashDetector.js)

[![npm](https://nodei.co/npm/uupaa.flashdetector.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.flashdetector.js/)

Flash will detect whether the available.

This module made of [WebModule](https://github.com/uupaa/WebModule).

## Documentation
- [Spec](https://github.com/uupaa/FlashDetector.js/wiki/)
- [API Spec](https://github.com/uupaa/FlashDetector.js/wiki/FlashDetector)

## Browser, NW.js and Electron

```js
<script src="lib/WebModule.js"></script>
<script src="lib/FlashDetector.js"></script>

window.onload = function() {
  var flash = new FlashDetector({
    swf: "swf/FlashDetector/bin/FlashDetector.swf",
    callback: function(flashEnabled) { // @arg Boolean
      console.log(flashEnabled === flash.enabled); // -> true
      alert(flash.enabled);
    }
  });
}
```

