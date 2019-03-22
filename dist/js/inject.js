const BLOCKCHAIN = 'NEO';
const VERSION = 'v1';
var WalletEvents;
(function (WalletEvents) {
    WalletEvents["READY"] = "Teemo.NEO.READY";
    WalletEvents["CONNECTED"] = "Teemo.NEO.CONNECTED";
    WalletEvents["DISCONNECTED"] = "Teemo.NEO.DISCONNECTED";
    WalletEvents["NETWORK_CHANGED"] = "Teemo.NEO.NETWORK_CHANGED";
    WalletEvents["ACCOUNT_CHANGED"] = "Teemo.NEO.ACCOUNT_CHANGED";
})(WalletEvents || (WalletEvents = {}));
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
    ArgumentDataType["HOOKTXID"] = "Hook_Txid";
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
    Command["invokeReadGroup"] = "invokeReadGroup";
    Command["send"] = "send";
    Command["invoke"] = "invoke";
    Command["invokeGroup"] = "invokeGroup";
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
const ids = [];
/**
 *
 * @param array 随机数
 */
const getMessageID = () => {
    // 随机6位数
    var Atanisi = Math.floor(Math.random() * 999999);
    // 随机6位数
    //时间
    var myDate = new Date();
    var messageid = myDate.getTime() + "" + Atanisi;
    // console.log("id "+messageid+" 是否存在与数组："+ (ids.join(',').includes(messageid.toString())));
    // ids.push(messageid);
    return messageid;
};
/**
 * 发送请求
 * @param command 指令名称
 * @param data
 */
function sendMessage(command, params) {
    const ID = getMessageID();
    return new Promise((resolve, reject) => {
        const request = params ? { command, params, ID } : { command, ID };
        window.postMessage(request, "*");
        window.addEventListener("message", e => {
            const response = e.data;
            if (response.return == command && response.ID == ID) // 判断return参数是否有值 并且 判断返回名称是否对应如果是则抛出异常或数据
             {
                if (response.error) {
                    reject(response.error);
                }
                else {
                    resolve(response.data);
                }
            }
        });
    });
}
var Teemo;
(function (Teemo) {
    class NEO {
        /**
         * 获得当前网络信息
         * @returns {GetNetworksOutput} 网络信息
         */
        static getNetworks() {
            return sendMessage(Command.getNetworks);
        }
        /**
         * 获得当前账户信息
         * @returns {AccountOutput} 账户信息
         */
        static getAccount() {
            return sendMessage(Command.getAccount);
        }
        /**
         * 查询余额
         * @param {GetBalanceArgs} params 查询余额参数
         */
        static getBalance(params) {
            return sendMessage(Command.getBalance, params);
        }
        /**
         * 查询存储区数据
         * @param {GetStorageArgs} params 查询存储区参数
         */
        static getStorage(params) {
            return sendMessage(Command.getStorage, params);
        }
        /**
         * 转账方法
         * @param {SendArgs} params 转账参数
         */
        static send(params) {
            return sendMessage(Command.send, params);
        }
        /**
         * invoke交易发送
         * @param {InvokeArgs} params invoke 参数
         * @returns {InvokeOutput} invoke执行结果返回
         */
        static invoke(params) {
            return sendMessage(Command.invoke, params);
        }
        static invokeGroup(params) {
            return sendMessage(Command.invokeGroup, params);
        }
        static invokeRead(params) {
            return sendMessage(Command.invokeRead, params);
        }
        static invokeReadGroup(params) {
            return sendMessage(Command.invokeReadGroup, params);
        }
    }
    NEO.getProvider = () => {
        return sendMessage(Command.getProvider);
    };
    Teemo.NEO = NEO;
})(Teemo || (Teemo = {}));
const EventChange = () => {
    window.addEventListener("message", e => {
        const response = e.data;
        if (response.EventName) // 判断return参数是否有值 并且 判断返回名称是否对应如果是则抛出异常或数据
         {
            window.dispatchEvent(new CustomEvent(response.EventName, { "detail": response.data }));
        }
    });
};
const provider = {
    "name": "TeemoWallet",
    "version": "0.1",
    "website": "nel.group",
    "compatibility": ["typescript", "javascript"],
    "extra": {
        "theme": "",
        "currency": ""
    }
};
if (window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent(WalletEvents.READY, {
        detail: provider,
    }));
}
EventChange();
document.onload = () => {
    // chrome.tabs.query({currentWindow:true},tabs=>{
    // })
};
//# sourceMappingURL=inject.js.map