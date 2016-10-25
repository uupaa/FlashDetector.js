// FlashReady test

require("../../lib/WebModule.js");

WebModule.VERIFY  = true;
WebModule.VERBOSE = true;
WebModule.PUBLISH = true;


require("../wmtools.js");
require("../../lib/FlashReady.js");
require("../../release/FlashReady.n.min.js");
require("../testcase.js");

