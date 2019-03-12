var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var AccountManager = {
    createWallet: (key) => {
        let wallet = new ThinNeo.nep6wallet();
    },
    // 解密方法，放在background避免popup直接访问
    deciphering: (password, nepaccount) => {
        return new Promise((resolve, reject) => {
            ThinNeo.Helper.GetPrivateKeyFromNep2(nepaccount.nep2key, password, nepaccount.scrypt.N, nepaccount.scrypt.r, nepaccount.scrypt.p, (info, result) => {
                if ("nep2 hash not match." == result)
                    reject(result);
                const prikey = result;
                if (prikey != null) {
                    const pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                    AccountManager.setAccount(new AccountInfo(nepaccount, prikey, pubkey));
                    resolve(nepaccount);
                }
                else {
                    reject("prikey is null");
                }
            });
        });
    },
    // 加密方法同样放在background
    encryption: (password, wif) => {
        let prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
        return new Promise((resolve, reject) => {
            var array = new Uint8Array(32);
            var key = Neo.Cryptography.RandomNumberGenerator.getRandomValues(array);
            // spanPri.textContent = key.toHexString();
            const pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(key);
            const address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
            const scrypt = new ThinNeo.nep6ScryptParameters();
            scrypt.N = 16384;
            scrypt.r = 8;
            scrypt.p = 8;
            ThinNeo.Helper.GetNep2FromPrivateKey(key, password, scrypt.N, scrypt.r, scrypt.p, (info, result) => {
                if (info == "finish") {
                    resolve(new AccountInfo(new NepAccount("", address, result, scrypt), prikey, pubkey));
                }
                else {
                    reject(result);
                }
            });
        });
    },
    nep2Load: (nep2, password) => {
        let promise = new Promise((resolve, reject) => {
            const scrypt = { N: 16384, r: 8, p: 8 };
            ThinNeo.Helper.GetPrivateKeyFromNep2(nep2, password, scrypt.N, scrypt.r, scrypt.p, (info, result) => {
                if ("nep2 hash not match." == result)
                    reject(result);
                const prikey = result;
                if (prikey != null) {
                    const pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                    const address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                    AccountManager.setAccount(new AccountInfo(new NepAccount("", address, nep2, scrypt), prikey, pubkey));
                    resolve(true);
                }
                else {
                    reject("Password error");
                }
            });
        });
        return promise;
    },
    nep6Load: (str, password) => __awaiter(this, void 0, void 0, function* () {
        try {
            let wallet = new ThinNeo.nep6wallet();
            wallet.fromJsonStr(str);
            //getPrivateKey 是异步方法，且同时只能执行一个
            let arr = [];
            if (wallet.accounts) {
                for (let keyindex = 0; keyindex < wallet.accounts.length; keyindex++) {
                    let account = wallet.accounts[keyindex];
                    if (account.nep2key == null) {
                        continue;
                    }
                    try {
                        const info = yield AccountManager.getPriKeyfromAccount(wallet.scrypt, password, account);
                        arr.push(new AccountInfo(new NepAccount("", account.address, account.nep2key, wallet.scrypt), info.prikey, info.pubkey));
                        for (let i = 0; i < arr.length; i++) {
                            const account = arr[i];
                            Storage_local.setAccount(account);
                        }
                        AccountManager.setAccount(arr[0]);
                        return { address: arr[0].address, lable: arr[0].walletName };
                    }
                    catch (error) {
                        throw error;
                    }
                }
            }
            else {
                throw console.error("The account cannot be empty");
            }
        }
        catch (e) {
            throw e.result;
        }
    }),
    getPriKeyfromAccount: (scrypt, password, account) => {
        const { N, r, p } = scrypt;
        let promise = new Promise((resolve, reject) => {
            ThinNeo.Helper.GetPrivateKeyFromNep2(account.nep2key, password, N, r, p, (info, result) => {
                if (info == "finish") {
                    var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(result);
                    var address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                    resolve({ pubkey, address: address, prikey: result });
                }
                else {
                    reject(result);
                }
            });
        });
        return promise;
    },
    setAccount: (account) => {
        storage.account = account;
        EventsOnChange(WalletEvents.CONNECTED, { address: account.address, label: account.walletName });
    },
    logout: () => {
        storage.account = null;
        EventsOnChange(WalletEvents.DISCONNECTED);
    },
    netWorkChange: (network) => {
        storage.network = network;
        EventsOnChange(WalletEvents.NETWORK_CHANGED, { networks: ["testnet", "mainnet"], defaultNetwork: network });
    }
};
/**
 * 事件出发返回方法
 * @param event 事件名称
 * @param data 传递参数
 */
const EventsOnChange = (event, data) => {
    chrome.tabs.query({}, tabs => {
        for (const tab of tabs) {
            for (const domain of storage.domains) {
                if (tab.url.includes(domain)) {
                    console.log("------------发送给 " + domain + "event事件：" + event);
                    chrome.tabs.sendMessage(tab.id, { EventName: event, data });
                }
            }
        }
    });
};
var WalletEvents;
(function (WalletEvents) {
    WalletEvents["READY"] = "Teemmo.NEO.READY";
    WalletEvents["CONNECTED"] = "Teemmo.NEO.CONNECTED";
    WalletEvents["DISCONNECTED"] = "Teemmo.NEO.DISCONNECTED";
    WalletEvents["NETWORK_CHANGED"] = "Teemmo.NEO.NETWORK_CHANGED";
    WalletEvents["ACCOUNT_CHANGED"] = "Teemmo.NEO.ACCOUNT_CHANGED";
})(WalletEvents || (WalletEvents = {}));
//# sourceMappingURL=account.js.map