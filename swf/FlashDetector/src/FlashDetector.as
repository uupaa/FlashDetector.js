package {
    import flash.display.*;
    import flash.events.*;
    import flash.external.ExternalInterface;
    import flash.system.*;
    import flash.text.*;

    public class FlashDetector extends Sprite {
        public  var debug:Boolean = false;  // debug settings
        public  var logs:Array = [];        // debug log buffer
        // --- js <-> as bridge ---
        private var jsfn:String = ""; // JavaScript <- ActionScript callback function name
        private var initialized:Boolean = false;

        public function FlashDetector() {
            stage.frameRate = 12;
            stage.scaleMode = StageScaleMode.NO_SCALE;
            stage.align     = StageAlign.TOP_LEFT;
            stage.addEventListener(Event.RESIZE, onStageResize);

            if (!ExternalInterface.available) {
                debug && logs.push("External interface is not available.");
            } else {
                var flashvars:Object = LoaderInfo(this.root.loaderInfo).parameters;
                if ("debug" in flashvars && Number(flashvars["debug"]) > 0) { // <object name="flashvars" value="debug=1" />
                    debug = true;
                }
                jsfn = "ExternalInterface." + ExternalInterface.objectID; // window.ExternalInterface[object-id]

                // call window.ExternalInterface[object-id]("FLASH_READY");
                ExternalInterface.addCallback("as_init", as_init);
                ExternalInterface.addCallback("as_release", as_release);
                ExternalInterface.addCallback("as_ping", as_ping);
                ExternalInterface.addCallback("as_get_initialized", as_get_initialized);
                ExternalInterface.call("ExternalInterface." + ExternalInterface.objectID, "FLASH_READY");

                setSecuritySetting();
                as_init();
                debug && addEventListener("enterFrame", onEnterFrame);
            }
        }

        private function onStageResize(event:Event):void {
            debug && logs.push("onStageResize");
        }

        private function as_init():void {
            debug && logs.push("as_init");
            initialized = true;
        }

        private function as_ping():String {
            debug && logs.push("as_ping");
            return "pong";
        }

        private function as_release():void {
            debug && logs.push("as_release");
            initialized = false;
        }

        private function as_get_initialized():Boolean {
            return initialized;
        }

        private var logOutput:TextField = null;
        private var logLines:Number = 0;
        private function onEnterFrame(event:Event):void {
            //removeEventListener("enterFrame", onEnterFrame);
            if (!logOutput) {
                logOutput = new TextField();
                logOutput.x = 0;
                logOutput.y = 0;
                logOutput.width = 400;
                logOutput.height = 400;
                logOutput.multiline = true;
                logOutput.wordWrap = true;
                logOutput.border = true;
                logOutput.text = "";
                addChild(logOutput);
            }
            if (debug && logs.length) {
                if (++logLines > 30) {
                    logLines = 0;
                    logOutput.text = "";
                }
                logOutput.appendText(logs.shift() + "\n");
            }
        }

        private function setSecuritySetting():void {
            Security.allowDomain("*");         // allow other domain content
            Security.allowInsecureDomain("*"); // allow HTTP content <-> HTTPS content access
          //debug && logs.push("setSecuritySetting", "Security.allowDomain(*), allowInsecureDomain(*)");
        }

    }
}

