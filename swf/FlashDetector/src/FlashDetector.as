package {
    import flash.display.Sprite;
    import flash.events.Event;
    import flash.external.ExternalInterface;

    public class FlashDetector extends Sprite {
        public function FlashDetector() {
            if (stage) {
                init();
            } else {
                addEventListener(Event.ADDED_TO_STAGE, init);
            }
        }
        private function init(event:Event = null):void {
            removeEventListener(Event.ADDED_TO_STAGE, init);

            if (ExternalInterface.available) {
                // call window.ExternalInterface[object-id]("FLASH_READY");
                ExternalInterface.call("ExternalInterface." + ExternalInterface.objectID, "FLASH_READY");
            }
        }
    }
}
