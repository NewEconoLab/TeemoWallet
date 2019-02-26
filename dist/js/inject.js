const BLOCKCHAIN = 'NEO';
const VERSION = 'v1';
var ArgumentDataType;
(function (ArgumentDataType) {
    ArgumentDataType["STRING"] = "String";
    ArgumentDataType["BOOLEAN"] = "Boolean";
    ArgumentDataType["HASH160"] = "Hash160";
    ArgumentDataType["HASH256"] = "Hash256";
    ArgumentDataType["INTEGER"] = "Integer";
    ArgumentDataType["BYTEARRAY"] = "ByteArray";
    ArgumentDataType["ARRAY"] = "Array";
    ArgumentDataType["ADDRESS"] = "Address";
})(ArgumentDataType || (ArgumentDataType = {}));
var Command;
(function (Command) {
    Command["isReady"] = "isReady";
    Command["getProvider"] = "getProvider";
    Command["getNetworks"] = "getNetworks";
    Command["getAccount"] = "getAccount";
    Command["getPublicKey"] = "getPublicKey";
    Command["getBalance"] = "getBalance";
    Command["getStorage"] = "getStorage";
    Command["invokeRead"] = "invokeRead";
    Command["send"] = "send";
    Command["invoke"] = "invoke";
    Command["event"] = "event";
    Command["disconnect"] = "disconnect";
})(Command || (Command = {}));
var EventName;
(function (EventName) {
    EventName["READY"] = "READY";
    EventName["ACCOUNT_CHANGED"] = "ACCOUNT_CHANGED";
    EventName["CONNECTED"] = "CONNECTED";
    EventName["DISCONNECTED"] = "DISCONNECTED";
    EventName["NETWORK_CHANGED"] = "NETWORK_CHANGED";
})(EventName || (EventName = {}));
var Teemmo;
(function (Teemmo) {
    class NEO {
        static getNetworks() {
            return new Promise((resolve, reject) => {
                window.postMessage({
                    key: "getNetworks",
                    msg: {}
                }, "*");
                window.addEventListener("message", function (e) {
                    var request = e.data;
                    if (request.key === "getProvider_R") {
                        resolve(request.msg);
                    }
                }, false);
            });
        }
        static getAccount() {
            return new Promise((resolve, reject) => {
                window.addEventListener("message", function (e) {
                    var request = e.data;
                    if (request.key === "getAccount_R") {
                        resolve(request.msg);
                    }
                }, false);
                window.postMessage({
                    key: "getAccount",
                    msg: {}
                }, "*");
            });
        }
        static getBalance(data) {
            return new Promise((resolve, reject) => {
                window.postMessage({
                    key: Command.getBalance,
                    msg: data
                }, "*");
                window.addEventListener("message", function (e) {
                    var request = e.data;
                    if (request.key === "getBalance_R") {
                        resolve(request.msg);
                    }
                }, false);
            });
        }
        static getStorage(params) {
            return new Promise((resolve, reject) => {
                window.postMessage({
                    key: "getStorage",
                    msg: {}
                }, "*");
                window.addEventListener("message", function (e) {
                    var request = e.data;
                    if (request.key === "getProvider_R") {
                        resolve(request.msg);
                    }
                }, false);
            });
        }
        static send(params) {
            return new Promise((resolve, reject) => {
                window.postMessage({
                    key: "send",
                    msg: params
                }, "*");
                window.addEventListener("message", function (e) {
                    var request = e.data;
                    if (request.key === "getProvider_R") {
                        resolve(request.msg);
                    }
                }, false);
            });
        }
        static invoke(params) {
            return new Promise((resolve, reject) => {
                window.addEventListener("message", function (e) {
                    var request = e.data;
                    if (request.key === "invoke_R") {
                        if (request.msg.txid) {
                            resolve(request.msg);
                        }
                        else {
                            reject(request.msg);
                        }
                    }
                }, false);
                window.postMessage({
                    key: "invoke",
                    msg: {
                        invokeParam: params
                    }
                }, "*");
            });
        }
    }
    NEO.getProvider = () => {
        return new Promise((resolve, reject) => {
            window.postMessage({
                key: "getProvider",
                msg: {}
            }, "*");
            window.addEventListener("message", function (e) {
                var request = e.data;
                if (request.key === "getProvider_R") {
                    resolve(request.msg);
                }
            }, false);
        });
    };
    Teemmo.NEO = NEO;
})(Teemmo || (Teemmo = {}));
//# sourceMappingURL=inject.js.map