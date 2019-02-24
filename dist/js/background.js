var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
System.register("background", [], function (exports_1, context_1) {
    "use strict";
    var background;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            (function (background) {
                function start() {
                    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                        if (request.key === "getAccount") {
                            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                                chrome.storage.local.set({
                                    label: "getAccount",
                                    message: {
                                        account: storage.account ? { address: storage.account.address } : undefined,
                                        title: request.msg.refInfo.refTitle,
                                        domain: request.msg.refInfo.refDomain
                                    },
                                }, () => {
                                    var notify = window.open('notify.html', 'notify', 'height=602, width=377, top=0, left=0, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no');
                                    notify.onload = () => {
                                    };
                                    var loop = setInterval(function () {
                                        if (notify.closed) {
                                            chrome.storage.local.get("confirm", res => {
                                                if (res["confirm"] === "confirm") {
                                                    chrome.tabs.sendMessage(tabs[0].id, {
                                                        message: "getAccount_R",
                                                        data: {
                                                            addr: storage.account.address
                                                        }
                                                    });
                                                }
                                                else if (res["confirm"] === "cancel") {
                                                }
                                            });
                                            clearInterval(loop);
                                        }
                                    }, 1000);
                                });
                            });
                        }
                        if (request.key === 'invokeGroup') {
                            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                                var notify = window.open('notify.html', 'notify', 'height=600, width=350, top=150, left=100, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no');
                                notify.onload = () => {
                                    chrome.storage.local.set("invokeMessage", request.msg);
                                    neotools.invokeTest();
                                };
                                var loop = setInterval(function () {
                                    if (notify.closed) {
                                        clearInterval(loop);
                                        alert('notify Closed');
                                    }
                                }, 1000);
                            });
                        }
                        if (request.key === "sendTransferTx") {
                            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                                var notify = window.open('notify.html', 'notify', 'height=600, width=350, top=150, left=100, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no');
                                notify.onload = () => { };
                                var loop = setInterval(() => {
                                    if (notify.closed) {
                                        clearInterval(loop);
                                        alert('notify Closed');
                                    }
                                }, 1000);
                            });
                        }
                        if (request.key === 'getBalanceByAddr') {
                        }
                        if (request.key === "test") {
                            sendResponse({ result: "background get test request" + ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(request.message) });
                            console.info("background get test request");
                        }
                    });
                }
                const storage = {
                    account: null
                };
                start();
            })(background || (background = {}));
        }
    };
});
var background;
(function (background) {
    class Result {
    }
    background.Result = Result;
    class NepAccount {
        constructor(name, addr, nep2, scrypt, index) {
            this.walletName = name;
            this.address = addr;
            this.nep2key = nep2;
            this.scrypt = scrypt;
            if (index !== undefined)
                this.index = index;
        }
    }
    NepAccount.deciphering = (password, nepaccount) => __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            ThinNeo.Helper.GetPrivateKeyFromNep2(nepaccount.nep2key, password, nepaccount.scrypt.N, nepaccount.scrypt.r, nepaccount.scrypt.p, (info, result) => {
                if ("nep2 hash not match." == result)
                    reject(result);
                const prikey = result;
                if (prikey != null) {
                    const pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                    let account = new AccountInfo(nepaccount, prikey, pubkey);
                    resolve(account);
                }
                else {
                    reject("prikey is null");
                }
            });
        });
    });
    NepAccount.encryption = (password, prikey) => __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            var array = new Uint8Array(32);
            var key = Neo.Cryptography.RandomNumberGenerator.getRandomValues(array);
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
    });
    background.NepAccount = NepAccount;
    class AccountInfo extends NepAccount {
        constructor(nepaccount, prikey, pubkey) {
            super(nepaccount.walletName, nepaccount.address, nepaccount.nep2key, nepaccount.scrypt, nepaccount.index);
            this.prikeyHex = prikey.toHexString();
            this.pubkeyHex = pubkey.toHexString();
        }
        getPrikey() {
            return this.prikeyHex.hexToBytes();
        }
        ;
        set pubkey(v) {
            this._pubkey = v;
            this.pubkeyHex = v.toHexString();
        }
        set prikey(v) {
            this._prikey = v;
            this.prikeyHex = v.toHexString();
        }
        get pubkey() {
            console.log("调用了我 我是pubkey get");
            this._pubkey = this.pubkeyHex.hexToBytes();
            return this._pubkey;
        }
        get prikey() {
            console.log("调用了我 我是prikey get");
            this._prikey = this.prikeyHex.hexToBytes();
            return this._prikey;
        }
    }
    background.AccountInfo = AccountInfo;
    class MarkUtxo {
        constructor(txid, n) {
            this.txid = txid;
            this.n = n;
        }
        static setMark(utxos) {
            const session = background.Storage_internal.get("utxo_manager");
            for (let index = 0; index < utxos.length; index++) {
                const utxo = utxos[index];
                if (session[utxo.txid]) {
                    session[utxo.txid].push(utxo.n);
                }
                else {
                    session[utxo.txid] = new Array();
                    session[utxo.txid].push(utxo.n);
                }
            }
            background.Storage_internal.set("utxo_manager", session);
        }
        static getAllUtxo() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const utxos = yield background.Api.getUtxo(background.common.account.address);
                    if (!utxos) {
                        return undefined;
                    }
                    const marks = background.Storage_internal.get("utxo_manager");
                    const assets = {};
                    for (const item of utxos) {
                        const mark = marks ? marks[item["txid"]] : undefined;
                        if (!mark || !mark.join(",").includes(item.n)) {
                            const asset = item.asset;
                            if (assets[asset] === undefined || assets[asset] == null) {
                                assets[asset] = [];
                            }
                            const utxo = new Utxo();
                            utxo.addr = item.addr;
                            utxo.asset = item.asset;
                            utxo.n = item.n;
                            utxo.txid = item.txid;
                            utxo.count = Neo.Fixed8.parse(item.value);
                            assets[asset].push(utxo);
                        }
                    }
                    return assets;
                }
                catch (error) {
                    if (error["code"] === "-1") {
                        return {};
                    }
                    else {
                        throw error;
                    }
                }
            });
        }
        static getUtxoByAsset(assetId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const all = yield this.getAllUtxo();
                    if (!all)
                        return undefined;
                    return all[assetId];
                }
                catch (error) {
                }
            });
        }
    }
    background.MarkUtxo = MarkUtxo;
    class Utxo {
    }
    background.Utxo = Utxo;
})(background || (background = {}));
var background;
(function (background) {
    class neotools {
        static verifyAddress(addr) {
            var verify = /^[a-zA-Z0-9]{34,34}$/;
            var res = verify.test(addr) ? neotools.verifyPublicKey(addr) : verify.test(addr);
            return res;
        }
        static verifyPublicKey(publicKey) {
            var array = Neo.Cryptography.Base58.decode(publicKey);
            var check = array.subarray(21, 21 + 4);
            var checkdata = array.subarray(0, 21);
            var hashd = Neo.Cryptography.Sha256.computeHash(checkdata);
            hashd = Neo.Cryptography.Sha256.computeHash(hashd);
            var hashd = hashd.slice(0, 4);
            var checked = new Uint8Array(hashd);
            var error = false;
            for (var i = 0; i < 4; i++) {
                if (checked[i] != check[i]) {
                    error = true;
                    break;
                }
            }
            return !error;
        }
        static wifDecode(wif) {
            let result = new background.Result();
            let login = {};
            try {
                login.prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
            }
            catch (e) {
                result.err = true;
                result.info = e.message;
                return result;
            }
            try {
                login.pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(login.prikey);
            }
            catch (e) {
                result.err = true;
                result.info = e.message;
                return result;
            }
            try {
                login.address = ThinNeo.Helper.GetAddressFromPublicKey(login.pubkey);
            }
            catch (e) {
                result.err = true;
                result.info = e.message;
                return result;
            }
            result.info = login;
            return result;
        }
        static nep2FromWif(wif, password) {
            var prikey;
            var pubkey;
            var address;
            let res = new background.Result();
            try {
                prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
                var n = 16384;
                var r = 8;
                var p = 8;
                ThinNeo.Helper.GetNep2FromPrivateKey(prikey, password, n, r, p, (info, result) => {
                    res.err = false;
                    res.info.nep2 = result;
                    pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                    var hexstr = pubkey.toHexString();
                    address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                    res.info.address = address;
                    return res;
                });
            }
            catch (e) {
                res.err = true;
                res.info = e.message;
                return res;
            }
        }
        static nep2Load(nep2, password) {
            return __awaiter(this, void 0, void 0, function* () {
                let promise = new Promise((resolve, reject) => {
                    const scrypt = { N: 16384, r: 8, p: 8 };
                    ThinNeo.Helper.GetPrivateKeyFromNep2(nep2, password, scrypt.N, scrypt.r, scrypt.p, (info, result) => {
                        if ("nep2 hash not match." == result)
                            reject(result);
                        const prikey = result;
                        if (prikey != null) {
                            const pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                            const address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                            resolve(new background.AccountInfo(new background.NepAccount("", address, nep2, scrypt), prikey, pubkey));
                        }
                        else {
                            reject("");
                        }
                    });
                });
                return promise;
            });
        }
        static nep6Load(wallet, password) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let arr = [];
                    if (wallet.accounts) {
                        for (let keyindex = 0; keyindex < wallet.accounts.length; keyindex++) {
                            let account = wallet.accounts[keyindex];
                            if (account.nep2key == null) {
                                continue;
                            }
                            try {
                                const info = yield neotools.getPriKeyfromAccount(wallet.scrypt, password, account);
                                arr.push(new background.AccountInfo(new background.NepAccount("", account.address, account.nep2key, wallet.scrypt), info.prikey, info.pubkey));
                                return arr;
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
            });
        }
        static getPriKeyfromAccount(scrypt, password, account) {
            return __awaiter(this, void 0, void 0, function* () {
                let promise = new Promise((resolve, reject) => {
                    account.getPrivateKey(scrypt, password, (info, result) => {
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
            });
        }
        static invokeScriptBuild(data) {
            let sb = new ThinNeo.ScriptBuilder();
            let arr = data.arguments.map(argument => {
                let str = "";
                switch (argument.type) {
                    case "String":
                        str = "(str)" + argument.value;
                        break;
                    case "Integer":
                        str = "(int)" + argument.value;
                        break;
                    case "Hash160":
                        str = "(hex160)" + argument.value;
                        break;
                    case "ByteArray":
                        str = "(bytes)" + argument.value;
                        break;
                    case "Boolean":
                        str = "(int)" + (argument.value ? 1 : 0);
                        break;
                    case "Address":
                        str = "(addr)" + argument.value;
                        break;
                    case "Array":
                        break;
                    default:
                        throw new Error("No parameter of this type");
                }
                return str;
            });
            sb.EmitParamJson(arr);
            sb.EmitPushString(data.operation);
            sb.EmitAppCall(Neo.Uint160.parse(data.scriptHash));
            return sb.ToArray();
        }
        static contractBuilder(invoke) {
            return __awaiter(this, void 0, void 0, function* () {
                let tran = new background.Transaction();
                try {
                    const script = this.invokeScriptBuild(invoke);
                    tran.setScript(script);
                }
                catch (error) {
                    console.log(error);
                }
                if (!!invoke.fee && invoke.fee !== '' && invoke.fee != '0') {
                    try {
                        const utxos = yield background.MarkUtxo.getUtxoByAsset(background.HASH_CONFIG.ID_GAS);
                        if (utxos)
                            tran.creatInuptAndOutup(utxos, Neo.Fixed8.parse(invoke.fee));
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                try {
                    const message = tran.GetMessage().clone();
                    const signdata = ThinNeo.Helper.Sign(message, background.common.account.prikey);
                    tran.AddWitness(signdata, background.common.account.pubkey, background.common.account.address);
                    const data = tran.GetRawData();
                    return data;
                }
                catch (error) {
                    console.log(error);
                }
            });
        }
        static invokeTest() {
            var script = {
                scriptHash: "74f2dc36a68fdc4682034178eb2220729231db76",
                operation: "transfer",
                arguments: [
                    { type: "Address", value: "AHDV7M54NHukq8f76QQtBTbrCqKJrBH9UF" },
                    { type: "Address", value: "AbU7BUQHW9sa69pTac7pPR3cq4gQHYC1DH" },
                    { type: "Integer", value: "100000" }
                ],
                fee: '0.001',
                network: 'TestNet',
                assets: {}
            };
            console.log(background.common.account.prikey.toHexString());
            neotools.contractBuilder(script)
                .then(result => {
                console.log(result);
                console.log(result.toHexString());
            })
                .catch(reason => {
                console.log(reason);
            });
        }
    }
    background.neotools = neotools;
    background.HASH_CONFIG = {
        accountCGAS: Neo.Uint160.parse('4c7cca112a8c5666bce5da373010fc0920d0e0d2'),
        ID_CGAS: Neo.Uint160.parse('74f2dc36a68fdc4682034178eb2220729231db76'),
        DAPP_NNC: Neo.Uint160.parse("fc732edee1efdf968c23c20a9628eaa5a6ccb934"),
        baseContract: Neo.Uint160.parse("348387116c4a75e420663277d9c02049907128c7"),
        resolverHash: `6e2aea28af9c5febea0774759b1b76398e3167f1`,
        ID_GAS: "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7",
        ID_NEO: "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
        saleContract: Neo.Uint160.parse("1b0ca9a908e07b20469917aed8d503049b420eeb"),
        ID_NNC: Neo.Uint160.parse('fc732edee1efdf968c23c20a9628eaa5a6ccb934'),
    };
})(background || (background = {}));
var background;
(function (background) {
    background.bg = chrome.extension.getBackgroundPage();
    background.Storage_local = {
        setAccount: (account) => {
            let arr = background.Storage_local.getAccount();
            let index = 0;
            let newacc = new background.NepAccount(account.walletName, account.address, account.nep2key, account.scrypt);
            if (arr.length) {
                arr = arr.map((acc, n) => {
                    if (acc.address === account.address) {
                        acc.walletName = newacc.walletName ? newacc.walletName : acc.walletName;
                        newacc.index = index = n;
                        return newacc;
                    }
                    return acc;
                });
                if (index < 0) {
                    arr.push(newacc);
                }
            }
            else {
                arr.push(newacc);
            }
            localStorage.setItem("TEEMMOWALLET_ACCOUNT", JSON.stringify(arr));
            return index;
        },
        getAccount: () => {
            const str = localStorage.getItem("TEEMMOWALLET_ACCOUNT");
            let accounts = [];
            if (str) {
                let arr = accounts.concat(JSON.parse(str));
                for (let index = 0; index < arr.length; index++) {
                    const acc = arr[index];
                    let nep = new background.NepAccount(acc.walletName, acc.address, acc.nep2key, acc.scrypt, index);
                    accounts.push(nep);
                }
            }
            return accounts;
        }
    };
    class Storage_internal {
        static get(key) {
            return background.bg['storage'][key];
        }
    }
    Storage_internal.set = (key, value) => {
        background.bg['storage'][key] = value;
    };
    background.Storage_internal = Storage_internal;
})(background || (background = {}));
var background;
(function (background) {
    class Transaction extends ThinNeo.Transaction {
        constructor(type) {
            super();
            this.marks = [];
            this.type = type ? type : ThinNeo.TransactionType.ContractTransaction;
            this.version = 0;
            this.extdata = null;
            this.witnesses = [];
            this.attributes = [];
            this.inputs = [];
            this.outputs = [];
        }
        setScript(script) {
            this.type = ThinNeo.TransactionType.InvocationTransaction;
            this.extdata = new ThinNeo.InvokeTransData();
            this.extdata.script = script;
            this.attributes = new Array(1);
            this.attributes[0] = new ThinNeo.Attribute();
            this.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
            this.attributes[0].data = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(background.common.account.address);
        }
        creatInuptAndOutup(utxos, sendcount, target) {
            let count = Neo.Fixed8.Zero;
            let scraddr = "";
            const assetId = utxos[0].asset.hexToBytes().reverse();
            for (const utxo of utxos) {
                const input = new ThinNeo.TransactionInput();
                input.hash = utxo.txid.hexToBytes().reverse();
                input.index = utxo.n;
                input.addr = utxo.addr;
                count = count.add(utxo.count);
                scraddr = utxo.addr;
                this.inputs.push(input);
                this.marks.push(new background.MarkUtxo(utxo.txid, utxo.n));
                if (count.compareTo(sendcount) > 0) {
                    break;
                }
            }
            if (count.compareTo(sendcount) >= 0) {
                if (target) {
                    if (sendcount.compareTo(Neo.Fixed8.Zero) > 0) {
                        const output = new ThinNeo.TransactionOutput();
                        output.assetId = assetId;
                        output.value = sendcount;
                        output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(target);
                        this.outputs.push(output);
                    }
                }
                const change = count.subtract(sendcount);
                if (change.compareTo(Neo.Fixed8.Zero) > 0) {
                    const outputchange = new ThinNeo.TransactionOutput();
                    outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                    outputchange.value = change;
                    outputchange.assetId = assetId;
                    this.outputs.push(outputchange);
                }
            }
            else {
                throw new Error("You don't have enough utxo;");
            }
        }
        getTxid() {
            return this.GetHash().clone().reverse().toHexString();
        }
    }
    background.Transaction = Transaction;
})(background || (background = {}));
var background;
(function (background) {
    class Common {
        constructor() {
            this.tabname = "account";
        }
        set network(v) {
            background.Storage_internal.set("network", v);
            this._network = v;
        }
        get network() {
            return this._network = background.Storage_internal.get("network");
        }
        set accountList(v) {
            this.accountList = v;
        }
        get accountList() {
            if (this._accountList && this._accountList.length) {
                return this._accountList;
            }
            else {
                return background.Storage_local.getAccount();
            }
        }
        set account(v) {
            this._account = v;
            background.Storage_internal.set(this.tabname, v);
        }
        get account() {
            const acc = background.Storage_internal.get(this.tabname);
            const newacc = new background.AccountInfo(new background.NepAccount(acc.walletName, acc.address, acc.nep2key, acc.scrypt, acc.index), acc.prikey, acc.pubkey);
            return newacc;
        }
    }
    background.common = new Common();
})(background || (background = {}));
var background;
(function (background) {
    class Api {
    }
    Api.getnep5balanceofaddress = (address, assetId) => {
        const opts = {
            method: 'getnep5balanceofaddress',
            params: [
                assetId,
                address
            ],
            baseUrl: 'common'
        };
        return background.request(opts);
    };
    Api.getregisteraddressbalance = (address, register) => {
        const opts = {
            method: 'getregisteraddressbalance',
            params: [
                address,
                register
            ]
        };
        return background.request(opts);
    };
    Api.sendrawtransaction = (data) => {
        const opts = {
            method: 'sendrawtransaction',
            params: [
                data
            ],
            baseUrl: 'common'
        };
        return background.request(opts);
    };
    Api.getUtxo = (address) => {
        const opts = {
            method: "getutxo",
            params: [
                address
            ],
            baseUrl: 'common'
        };
        return background.request(opts);
    };
    Api.getDomainInfo = (domain) => {
        const opts = {
            method: "getdomaininfo",
            params: [
                domain
            ]
        };
        return background.request(opts);
    };
    Api.hasTx = (txid) => {
        const opts = {
            method: "hastx",
            params: [
                txid
            ]
        };
        return background.request(opts);
    };
    Api.hasContract = (txid) => {
        const opts = {
            method: "hascontract",
            params: [
                txid
            ]
        };
        return background.request(opts);
    };
    Api.getRehargeAndTransfer = (txid) => {
        const opts = {
            method: "getrechargeandtransfer",
            params: [
                txid
            ]
        };
        return background.request(opts);
    };
    Api.getBlockCount = () => {
        const opts = {
            method: "getblockcount",
            params: [],
            baseUrl: "common"
        };
        return background.request(opts);
    };
    Api.rechargeAndTransfer = (data1, data2) => {
        const opts = {
            method: "rechargeandtransfer",
            params: [
                data1,
                data2
            ]
        };
        return background.request(opts);
    };
    Api.getnep5asset = (asset) => {
        const opts = {
            method: "getnep5asset",
            params: [
                asset
            ]
        };
        return background.request(opts);
    };
    background.Api = Api;
})(background || (background = {}));
var background;
(function (background) {
    const baseCommonUrl = "https://api.nel.group/api";
    const baseUrl = "https://apiwallet.nel.group/api";
    console.log(baseCommonUrl);
    console.log(baseUrl);
    const makeRpcPostBody = (method, params) => {
        const body = {};
        body["jsonrpc"] = "2.0";
        body["id"] = 1;
        body["method"] = method;
        body["params"] = params;
        return JSON.stringify(body);
    };
    const makeRpcUrl = (url, method, params) => {
        if (url[url.length - 1] != '/')
            url = url + "/";
        var urlout = url + "?jsonrpc=2.0&id=1&method=" + method + "&params=" + JSON.stringify(params);
        return urlout;
    };
    function request(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = [baseUrl, background.common.network].join('/');
            if (opts.baseUrl === 'common') {
                url = [baseCommonUrl, background.common.network].join('/');
            }
            console.log(url);
            const input = opts.isGET ? makeRpcUrl(url, opts.method, opts.params) : url;
            const init = opts.isGET ? { method: 'GET' } : { method: 'POST', body: makeRpcPostBody(opts.method, opts.params) };
            try {
                const value = yield fetch(input, init);
                const json = yield value.json();
                if (json.result) {
                    if (opts.getAll) {
                        return json;
                    }
                    else {
                        return json.result;
                    }
                }
                else if (json.error["code"] === -1) {
                    return null;
                }
                else {
                    throw new Error(json.error);
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    background.request = request;
})(background || (background = {}));
//# sourceMappingURL=background.js.map