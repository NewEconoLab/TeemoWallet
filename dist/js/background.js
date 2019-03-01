///<reference path="../../lib/neo-thinsdk.d.ts"/>
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var storage;
(function (storage) {
    var account = null;
    storage.account = account;
    var network = "testnet";
    storage.network = network;
})(storage || (storage = {}));
const HASH_CONFIG = {
    accountCGAS: Neo.Uint160.parse('4c7cca112a8c5666bce5da373010fc0920d0e0d2'),
    ID_CGAS: Neo.Uint160.parse('74f2dc36a68fdc4682034178eb2220729231db76'),
    DAPP_NNC: Neo.Uint160.parse("fc732edee1efdf968c23c20a9628eaa5a6ccb934"),
    baseContract: Neo.Uint160.parse("348387116c4a75e420663277d9c02049907128c7"),
    resolverHash: `6e2aea28af9c5febea0774759b1b76398e3167f1`,
    ID_GAS: "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7",
    ID_NEO: "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
    saleContract: Neo.Uint160.parse("1b0ca9a908e07b20469917aed8d503049b420eeb"),
    ID_NNC: Neo.Uint160.parse('fc732edee1efdf968c23c20a9628eaa5a6ccb934'),
    ID_NNK: Neo.Uint160.parse('c36aee199dbba6c3f439983657558cfb67629599'),
};
const baseCommonUrl = "https://api.nel.group/api";
const baseUrl = "https://apiwallet.nel.group/api";
class Result {
}
/**
 * -------------------------以下是账户所使用到的实体类
 */
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
});
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
class MarkUtxo {
    constructor(txid, n) {
        this.txid = txid;
        this.n = n;
    }
    /**
     * 塞入标记
     * @param utxos 标记
     */
    static setMark(utxos) {
        const session = Storage_internal.get("utxo_manager");
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
        Storage_internal.set("utxo_manager", session);
    }
    static getAllUtxo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const utxos = yield Api.getUtxo(common.account.address); // 获得为使用的utxo
                if (!utxos) {
                    return undefined;
                }
                const marks = Storage_internal.get("utxo_manager"); // 获得被标记的utxo
                const assets = {};
                // 对utxo进行归类，并且将count由string转换成 Neo.Fixed8
                // tslint:disable-next-line:forin        
                for (const item of utxos) {
                    const mark = marks ? marks[item["txid"]] : undefined;
                    if (!mark || !mark.join(",").includes(item.n)) // 排除已经标记的utxo返回给调用放
                     {
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
class Utxo {
}
const bg = chrome.extension.getBackgroundPage();
const Storage_local = {
    setAccount: (account) => {
        let arr = Storage_local.getAccount();
        let index = 0;
        let newacc = new NepAccount(account.walletName, account.address, account.nep2key, account.scrypt);
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
                let nep = new NepAccount(acc.walletName, acc.address, acc.nep2key, acc.scrypt, index);
                accounts.push(nep);
            }
        }
        return accounts;
    }
};
/**
 * 主要用于background的内存数据的存储和读取
 */
class Storage_internal {
    static get(key) {
        return bg['storage'][key];
    }
}
Storage_internal.set = (key, value) => {
    bg['storage'][key] = value;
};
class Transaction extends ThinNeo.Transaction {
    constructor(type) {
        super();
        this.marks = [];
        this.type = type ? type : ThinNeo.TransactionType.ContractTransaction;
        this.version = 0; // 0 or 1
        this.extdata = null;
        this.witnesses = [];
        this.attributes = [];
        this.inputs = [];
        this.outputs = [];
    }
    /**
     * setScript 往交易中塞入脚本 修改交易类型为 InvokeTransaction
     */
    setScript(script) {
        this.type = ThinNeo.TransactionType.InvocationTransaction;
        this.extdata = new ThinNeo.InvokeTransData();
        this.extdata.script = script;
        this.attributes = new Array(1);
        this.attributes[0] = new ThinNeo.Attribute();
        this.attributes[0].usage = ThinNeo.TransactionAttributeUsage.Script;
        this.attributes[0].data = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(common.account.address);
    }
    /**
     * 创建一个交易中的输入和输出 将使用过的utxo 放入 marks
     * @param utxos 资产的utxo
     * @param sendcount 输出总数
     * @param target 对方地址
     */
    creatInuptAndOutup(utxos, sendcount, target) {
        let count = Neo.Fixed8.Zero;
        let scraddr = "";
        const assetId = utxos[0].asset.hexToBytes().reverse();
        // 循环utxo 塞入 input
        for (const utxo of utxos) {
            const input = new ThinNeo.TransactionInput();
            input.hash = utxo.txid.hexToBytes().reverse();
            input.index = utxo.n;
            input.addr = utxo.addr;
            count = count.add(utxo.count);
            scraddr = utxo.addr;
            this.inputs.push(input);
            this.marks.push(new MarkUtxo(utxo.txid, utxo.n));
            if (count.compareTo(sendcount) > 0) // 塞入足够的input的时候跳出循环
             {
                break;
            }
        }
        if (count.compareTo(sendcount) >= 0) // 比较utxo是否足够转账
         {
            if (target) { // 如果有转账地址则塞入转账的金额
                if (sendcount.compareTo(Neo.Fixed8.Zero) > 0) {
                    const output = new ThinNeo.TransactionOutput();
                    output.assetId = assetId;
                    output.value = sendcount;
                    output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(target);
                    this.outputs.push(output);
                }
            }
            const change = count.subtract(sendcount); // 应该找零的值
            if (change.compareTo(Neo.Fixed8.Zero) > 0) { // 塞入找零
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
/**
 * 我的账户管理
 */
class Common {
    constructor() {
        this.tabname = "account";
    }
    set network(v) {
        Storage_internal.set("network", v);
        this._network = v;
    }
    get network() {
        return this._network = Storage_internal.get("network");
    }
    set accountList(v) {
        this.accountList = v;
    }
    get accountList() {
        if (this._accountList && this._accountList.length) {
            return this._accountList;
        }
        else {
            return Storage_local.getAccount();
        }
    }
    // set 方法往background的storage变量赋值
    set account(v) {
        this._account = v;
        Storage_internal.set(this.tabname, v);
    }
    // 从background storage 变量中取值
    get account() {
        const acc = Storage_internal.get(this.tabname);
        const newacc = new AccountInfo(new NepAccount(acc.walletName, acc.address, acc.nep2key, acc.scrypt, acc.index), acc.prikey, acc.pubkey);
        return newacc;
    }
}
const common = new Common();
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
        let url = [baseUrl, common.network].join('/');
        if (opts.baseUrl === 'common') {
            url = [baseCommonUrl, common.network].join('/');
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
const Api = {
    /**
     * 获取nep5的资产（CGAS）
     */
    getnep5balanceofaddress: (address, assetId) => {
        const opts = {
            method: 'getnep5balanceofaddress',
            params: [
                assetId,
                address
            ],
            baseUrl: 'common'
        };
        return request(opts);
    },
    /**
     * 获取nep5的资产（CGAS）
     */
    getallnep5assetofaddress: (address) => {
        const opts = {
            method: 'getallnep5assetofaddress',
            params: [
                address, 1
            ],
            baseUrl: 'common'
        };
        return request(opts);
    },
    /**
     * 获取nep5的资产（CGAS）
     */
    getUtxoBalance: (address, assetId) => {
        const opts = {
            method: 'getnep5balanceofaddress',
            params: [
                assetId,
                address
            ],
            baseUrl: 'common'
        };
        return request(opts);
    },
    getregisteraddressbalance: (address, register) => {
        // alert(DomainSelling.RootNeo.register.toString())
        const opts = {
            method: 'getregisteraddressbalance',
            params: [
                address,
                register
            ]
        };
        return request(opts);
    },
    sendrawtransaction: (data) => {
        const opts = {
            method: 'sendrawtransaction',
            params: [
                data
            ],
            baseUrl: 'common'
        };
        return request(opts);
    },
    getUtxo: (address) => {
        const opts = {
            method: "getutxo",
            params: [
                address
            ],
            baseUrl: 'common'
        };
        return request(opts);
    },
    getDomainInfo: (domain) => {
        const opts = {
            method: "getdomaininfo",
            params: [
                domain
            ]
        };
        return request(opts);
    },
    /**
     * 判断交易是否入链
     * @param txid 交易id
     */
    hasTx: (txid) => {
        const opts = {
            method: "hastx",
            params: [
                txid
            ]
        };
        return request(opts);
    },
    /**
     * 判断合约调用是否抛出 notify
     * @param txid 交易id
     */
    hasContract: (txid) => {
        const opts = {
            method: "hascontract",
            params: [
                txid
            ]
        };
        return request(opts);
    },
    /**
     * 判断双交易是否成功
     * @param txid 交易id
     */
    getRehargeAndTransfer: (txid) => {
        const opts = {
            method: "getrechargeandtransfer",
            params: [
                txid
            ]
        };
        return request(opts);
    },
    getBlockCount: () => {
        const opts = {
            method: "getblockcount",
            params: [],
            baseUrl: "common"
        };
        return request(opts);
    },
    getBalance: (addr) => {
        const opts = {
            method: "getbalance",
            params: [addr],
            baseUrl: "common"
        };
        return request(opts);
    },
    rechargeAndTransfer: (data1, data2) => {
        const opts = {
            method: "rechargeandtransfer",
            params: [
                data1,
                data2
            ]
        };
        return request(opts);
    },
    /**
     * @method 获得nep5资产信息
     * @param asset 资产id
     */
    getnep5asset: (asset) => {
        const opts = {
            method: "getnep5asset",
            params: [
                asset
            ]
        };
        return request(opts);
    }
};
function invokeScriptBuild(data) {
    let sb = new ThinNeo.ScriptBuilder();
    let arr = data.arguments.map(argument => {
        let str = "";
        switch (argument.type) {
            case ArgumentDataType.STRING:
                str = "(str)" + argument.value;
                break;
            case ArgumentDataType.INTEGER:
                str = "(int)" + argument.value;
                break;
            case ArgumentDataType.HASH160:
                str = "(hex160)" + argument.value;
                break;
            case ArgumentDataType.HASH256:
                str = "(hex256)" + argument.value;
                break;
            case ArgumentDataType.BYTEARRAY:
                str = "(bytes)" + argument.value;
                break;
            case ArgumentDataType.BOOLEAN:
                str = "(int)" + (argument.value ? 1 : 0);
                break;
            case ArgumentDataType.ADDRESS:
                str = "(addr)" + argument.value;
                break;
            case ArgumentDataType.ARRAY:
                // str="(str)"+argument.value 暂时不考虑
                break;
            default:
                throw new Error("No parameter of this type");
        }
        return str;
    });
    // 生成随机数
    const RANDOM_UINT8 = getWeakRandomValues(32);
    const RANDOM_INT = Neo.BigInteger.fromUint8Array(RANDOM_UINT8);
    console.log(RANDOM_INT.toString());
    // 塞入随机数
    sb.EmitPushNumber(RANDOM_INT);
    sb.Emit(ThinNeo.OpCode.DROP);
    sb.EmitParamJson(arr);
    sb.EmitPushString(data.operation);
    sb.EmitAppCall(Neo.Uint160.parse(data.scriptHash));
    return sb.ToArray();
}
const getWeakRandomValues = (array) => {
    let buffer = typeof array === "number" ? new Uint8Array(array) : array;
    for (let i = 0; i < buffer.length; i++)
        buffer[i] = Math.random() * 256;
    return buffer;
};
class ScriptBuild extends ThinNeo.ScriptBuilder {
    constructor() {
        super();
    }
    emitInvoke(argument) {
        for (let i = 0; i >= 0; i--) {
            const param = argument[i];
            if (param.type === ArgumentDataType.ARRAY) {
                var list = param.value;
                for (let i = list.length - 1; i >= 0; i--) {
                    this.EmitParamJson(list[i]);
                }
                this.EmitPushNumber(new Neo.BigInteger(list.length));
                this.Emit(ThinNeo.OpCode.PACK);
            }
            switch (param.type) {
                case ArgumentDataType.STRING:
                    this.EmitPushString(param.value);
                    break;
                case ArgumentDataType.INTEGER:
                    var num = new Neo.BigInteger(param.value);
                    this.EmitPushNumber(num);
                    break;
                case ArgumentDataType.HASH160:
                    var hex = param.value.replace('0x', '').hexToBytes();
                    if (hex.length != 20)
                        throw new Error("not a int160");
                    this.EmitPushBytes(hex.reverse());
                    break;
                case ArgumentDataType.BYTEARRAY:
                    var hex = param.value.replace('0x', '').hexToBytes();
                    this.EmitPushBytes(hex);
                    break;
                case ArgumentDataType.BOOLEAN:
                    var num = new Neo.BigInteger(param.value ? 1 : 0);
                    this.EmitPushNumber(num);
                    break;
                case ArgumentDataType.ADDRESS:
                    var hex = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(param.value);
                    this.EmitPushBytes(hex);
                    break;
                case ArgumentDataType.HOOKTXID:
                    this.EmitSysCall("System.ExecutionEngine.GetScriptContainer");
                    this.EmitSysCall("Neo.Transaction.GetHash");
                    break;
                case ArgumentDataType.ARRAY:
                    this.emitInvoke(param.value);
                    break;
                default:
                    throw new Error("No parameter of this type");
            }
        }
        return this;
    }
}
/**
 * 编译 invoke参数列表
 * @param {InvokeArgs[]} group InvokeGroup参数
 */
function groupScriptBuild(group) {
    let sb = new ScriptBuild();
    // 生成随机数
    const RANDOM_UINT8 = getWeakRandomValues(32);
    const RANDOM_INT = Neo.BigInteger.fromUint8Array(RANDOM_UINT8);
    console.log(RANDOM_INT.toString());
    // 塞入随机数
    sb.EmitPushNumber(RANDOM_INT);
    sb.Emit(ThinNeo.OpCode.DROP);
    /**
     * 循环塞入数据
     */
    for (let index = 0; index < group.length; index++) {
        const invoke = group[index];
        sb.emitInvoke(invoke.arguments);
    }
    return sb.ToArray();
}
/**
 * 打包合并交易
 * @param data 合并合约调用参数
 */
const invokeGroupBuild = (data) => __awaiter(this, void 0, void 0, function* () {
    if (data.merge) {
        let tran = new Transaction();
        let script = groupScriptBuild(data.group);
        tran.setScript(script);
        let netfee = Neo.Fixed8.Zero;
        let transfer = {}; // 用来存放 将要转账的合约地址 资产id 数额
        let utxos = yield MarkUtxo.getAllUtxo();
        for (let index = 0; index < data.group.length; index++) // 循环算utxo资产对应的累加和相对应每笔要转走的money
         {
            const invoke = data.group[index];
            if (invoke.fee) // 判断是否有手续费
                netfee.add(Neo.Fixed8.parse(invoke.fee)); // 计算总共耗费多少手续费;
            if (invoke.attachedAssets) // 判断是否有合约转账
             {
                const toaddr = ThinNeo.Helper.GetAddressFromScriptHash(Neo.Uint160.parse(invoke.scriptHash)); // 将scripthash 转地址    
                for (const id in invoke.attachedAssets) {
                    if (invoke.attachedAssets.hasOwnProperty(id)) {
                        const number = invoke.attachedAssets[id];
                        if (id === HASH_CONFIG.ID_GAS) {
                        }
                        else {
                        }
                    }
                }
                transfer[toaddr] = invoke.attachedAssets;
            }
        }
        try {
            let result = yield sendInvoke(tran);
            return [result];
        }
        catch (error) {
        }
    }
    else {
    }
});
const sendInvoke = (tran) => __awaiter(this, void 0, void 0, function* () {
    try {
        const message = tran.GetMessage().clone();
        const signdata = ThinNeo.Helper.Sign(message, common.account.prikey);
        tran.AddWitness(signdata, common.account.pubkey, common.account.address);
        const data = tran.GetRawData();
        console.log(data.toHexString());
        const result = yield Api.sendrawtransaction(data.toHexString());
        if (result[0].txid) {
            let ouput = {
                txid: result[0].txid,
                nodeUrl: "https://api.nel.group/api"
            };
            return ouput;
        }
        else {
            throw { type: "TransactionError", description: result[0].errorMessage, data: "" };
        }
    }
    catch (error) {
        console.log(error);
    }
});
const contractBuilder = (invoke) => __awaiter(this, void 0, void 0, function* () {
    let tran = new Transaction();
    try {
        const script = invokeScriptBuild(invoke);
        tran.setScript(script);
    }
    catch (error) {
        console.log(error);
    }
    if (!!invoke.fee && invoke.fee !== '' && invoke.fee != '0') {
        try {
            const utxos = yield MarkUtxo.getUtxoByAsset(HASH_CONFIG.ID_GAS);
            if (utxos)
                tran.creatInuptAndOutup(utxos, Neo.Fixed8.parse(invoke.fee));
        }
        catch (error) {
            console.log(error);
        }
    }
    try {
        const message = tran.GetMessage().clone();
        const signdata = ThinNeo.Helper.Sign(message, common.account.prikey);
        tran.AddWitness(signdata, common.account.pubkey, common.account.address);
        const data = tran.GetRawData();
        const result = yield Api.sendrawtransaction(data.toHexString());
        if (result[0].txid) {
            console.log(data.toHexString());
            let ouput = {
                txid: result[0].txid,
                nodeUrl: "https://api.nel.group/api"
            };
            return ouput;
        }
        else {
            throw { type: "TransactionError", description: result[0].errorMessage, data: data.toHexString() };
        }
    }
    catch (error) {
        throw error;
    }
});
function openNotify(call) {
    var notify = window.open('notify.html', 'notify', 'height=636px, width=391px, top=0, left=0, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no');
    //获得关闭事件
    var loop = setInterval(() => {
        if (notify.closed) {
            call();
            clearInterval(loop);
        }
    }, 1000);
}
const getAccount = (title) => {
    return new Promise((resolve, reject) => {
        if (!storage.account) {
            reject({ type: "ACCOUNT_ERROR", deciphering: "Account not logged in " });
        }
        chrome.storage.local.set({
            label: "getAccount",
            message: {
                account: storage.account ? { address: storage.account.address } : undefined,
                title: title.refTitle,
                domain: title.refDomain
            },
        }, () => {
            openNotify(() => {
                chrome.storage.local.get("confirm", res => {
                    if (res["confirm"] === "confirm") {
                        if (storage.account) {
                            resolve({
                                address: storage.account.address,
                                label: storage.account.walletName
                            });
                        }
                        else {
                            reject({
                                type: "AccountError",
                                description: "Account not logged in"
                            });
                        }
                    }
                    else if (res["confirm"] === "cancel") {
                        reject({
                            type: "AccountError",
                            description: "User cancel Authorization "
                        });
                    }
                });
            });
        });
    });
};
const invokeGroup = (title, data) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({
            label: "invokeGroup",
            message: {
                account: storage.account ? { address: storage.account.address } : undefined,
                title: title.refTitle,
                domain: title.refDomain,
                invoke: data.msg
            }
        }, () => {
            openNotify(() => {
                chrome.storage.local.get("confirm", res => {
                    if (res["confirm"] === "confirm") {
                        invokeGroupBuild(data)
                            .then(result => {
                            resolve(result);
                        })
                            .catch(error => {
                            reject(error);
                        });
                    }
                    else if (res["confirm"] === "cancel") {
                        reject({
                            type: "TransactionError",
                            description: "User cancel Authorization "
                        });
                    }
                });
            });
        });
    });
};
const invoke = (title, data) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({
            label: "invokeGroup",
            message: {
                account: storage.account ? { address: storage.account.address } : undefined,
                title: title.refTitle,
                domain: title.refDomain,
                invoke: data.msg
            }
        }, () => {
            openNotify(() => {
                chrome.storage.local.get("confirm", res => {
                    if (res["confirm"] === "confirm") {
                        contractBuilder(data)
                            .then(result => {
                            resolve(result);
                        })
                            .catch(error => {
                            reject(error);
                        });
                    }
                    else if (res["confirm"] === "cancel") {
                        reject({
                            type: "TransactionError",
                            description: "User cancel Authorization "
                        });
                    }
                });
            });
        });
    });
};
const getNetworks = () => {
    return new Promise((resolve, reject) => {
        const network = {
            networks: ["mainnet", "testnet"],
            defaultNetwork: storage.network ? storage.network : "testnet"
        };
        resolve(network);
    });
};
const getBalance = (data) => __awaiter(this, void 0, void 0, function* () {
    if (!Array.isArray(data.params)) {
        data.params = [data.params];
    }
    data.params.forEach(({ address, assets, fetchUTXO }, index) => {
        if (assets && !Array.isArray(assets)) {
            data.params[index] = {
                address,
                assets: [assets],
                fetchUTXO,
            };
        }
    });
    let balances = {};
    if (!Array.isArray(data.params)) {
        data.params = [data.params];
    }
    for (const arg of data.params) {
        var asset = arg.assets ? arg.assets : [HASH_CONFIG.ID_GAS, HASH_CONFIG.ID_NEO, HASH_CONFIG.ID_NNC.toString(), HASH_CONFIG.ID_NNK.toString()];
        var nep5asset = [];
        var utxoasset = [];
        const assetArray = [];
        for (const id of asset) {
            if (id.length == 40) {
                nep5asset.push(id);
            }
            else {
                utxoasset.push(id);
            }
        }
        if (nep5asset.length) {
            try {
                let res = yield Api.getallnep5assetofaddress(arg.address);
                let assets = {};
                for (const iterator of res) {
                    const { assetid, symbol, balance } = iterator;
                    const assetID = assetid.replace("0x", "");
                    assets[assetID] = { assetID, symbol, amount: balance };
                }
                for (const id of nep5asset) {
                    if (assets[id]) {
                        assetArray.push(assets[id]);
                    }
                }
            }
            catch (error) {
                throw { type: "NETWORK_ERROR", description: "余额查询失败", data: error };
            }
        }
        if (utxoasset.length) {
            let res = yield Api.getBalance(arg.address);
            let assets = {};
            for (const iterator of res) {
                const { asset, balance, name } = iterator;
                let symbol = "";
                const assetID = asset.replace('0x', '');
                if (assetID == HASH_CONFIG.ID_GAS) {
                    symbol = "GAS";
                }
                else if (assetID == HASH_CONFIG.ID_NEO) {
                    symbol = "NEO";
                }
                else {
                    for (var i in name) {
                        symbol = name[i].name;
                        if (name[i].lang == "en")
                            break;
                    }
                }
                assets[assetID] = { assetID, symbol, amount: balance };
            }
            for (const id of utxoasset) {
                if (assets[id]) {
                    assetArray.push(assets[id]);
                }
            }
        }
        balances[arg.address] = assetArray;
    }
    return balances;
});
const send = (title, data) => {
    return new Promise((resolve, reject) => {
    });
};
const getProvider = () => {
    return new Promise((resolve, reject) => {
        let provider = {
            "compatibility": [""],
            "extra": { theme: "", currency: "" },
            "name": "",
            "version": "",
            "website": ""
        };
        resolve(provider);
    });
};
const responseMessage = (request) => {
    const { ID, command, message, params } = request;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const sendResponse = (data) => {
            data
                .then(data => {
                chrome.tabs.sendMessage(tabs[0].id, {
                    return: command,
                    ID, data
                });
            })
                .catch(error => {
                chrome.tabs.sendMessage(tabs[0].id, {
                    return: command,
                    ID, error
                });
            });
        };
        switch (request.command) {
            case Command.getProvider:
                sendResponse(getProvider());
                break;
            case Command.getNetworks:
                sendResponse(getNetworks());
                break;
            case Command.getAccount:
                sendResponse(getAccount(message));
                break;
            case Command.getBalance:
                sendResponse(getBalance(params));
                break;
            case Command.getStorage:
                break;
            case Command.getPublicKey:
                break;
            case Command.invoke:
                sendResponse(invoke(message, params));
                break;
            case Command.send:
                sendResponse(send(message, params));
                break;
            case Command.invokeRead:
                break;
            case Command.invokeGroup:
                sendResponse(invokeGroup(message, params));
            default:
                break;
        }
    });
};
/**
 * 监听
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //初始化鼠标随机方法
    // Neo.Cryptography.RandomNumberGenerator.startCollectors();
    responseMessage(request);
});
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
window.onload = () => {
    console.log("----------------------------------初始化 ");
    //初始化鼠标随机方法
    Neo.Cryptography.RandomNumberGenerator.startCollectors();
};
//# sourceMappingURL=background.js.map