import { Notifiy } from "./notification.manager";

// Listen to messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener
(
    (request, sender, sendResponse) => 
    {
        // onMessage must return "true" if response is async.
        let isResponseAsync = false;

        if (request.key === "open") {
            Notifiy.openNotify({msg:request.msg});
        }
        return isResponseAsync;
    }
);
