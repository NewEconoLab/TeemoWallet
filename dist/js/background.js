///<reference path="../../lib/neo-thinsdk.d.ts"/>
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var storage = {
    network: "TestNet",
    account: undefined,
    height: 0,
    domains: [],
    titles: [],
    oldUtxo: {}
};
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
const testRpcUrl = "http://47.99.223.87:20332";
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
        this._pubkey = this.pubkeyHex.hexToBytes();
        return this._pubkey;
    }
    get prikey() {
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
        for (let index = 0; index < utxos.length; index++) {
            const utxo = utxos[index];
            if (storage.oldUtxo[utxo.txid]) {
                storage.oldUtxo[utxo.txid].push(utxo.n);
            }
            else {
                storage.oldUtxo[utxo.txid] = new Array();
                storage.oldUtxo[utxo.txid].push(utxo.n);
            }
        }
    }
    static getAllUtxo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const utxos = yield Api.getUtxo(storage.account.address); // 获得为使用的utxo
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
                        const asset = item.asset.replace('0x', '');
                        if (assets[asset] === undefined || assets[asset] == null) {
                            assets[asset] = [];
                        }
                        const utxo = new Utxo();
                        utxo.addr = item.addr;
                        utxo.asset = asset;
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
class Storage_local {
    static setAccount(account) {
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
                newacc.walletName = newacc.walletName ? newacc.walletName : '我的钱包' + arr.length + 1;
                arr.push(newacc);
            }
        }
        else {
            newacc.walletName = newacc.walletName ? newacc.walletName : '我的钱包1';
            arr.push(newacc);
        }
        localStorage.setItem("TEEMMOWALLET_ACCOUNT", JSON.stringify(arr));
        return newacc;
    }
    static getAccount() {
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
    static set(key, value) {
        return new Promise((r, j) => {
            chrome.storage.local.set({ [key]: value }, () => { r(); });
        });
    }
    ;
    static get(key) {
        return new Promise((r, j) => {
            chrome.storage.local.get(key, item => {
                r(item ? item[key] : undefined);
            });
        });
    }
}
/**
 * 主要用于background的内存数据的存储和读取
 */
class Storage_internal {
    static set(key, value) {
        storage[key] = value;
    }
    ;
    static get(key) {
        return storage[key];
    }
}
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
        this.attributes[0].data = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(storage.account.address);
    }
    /**
     * 创建一个交易中的输入和输出 将使用过的utxo 放入 marks
     * @param utxos 资产的utxo
     * @param sendcount 输出总数
     * @param target 对方地址
     * @param netfee 有手续费的时候使用，并且使用的utxos是gas的时候
     */
    creatInuptAndOutup(utxos, sendcount, target, netfee) {
        let count = Neo.Fixed8.Zero;
        let scraddr = "";
        const assetId = utxos[0].asset.hexToBytes().reverse();
        const amount = netfee ? sendcount.add(netfee) : sendcount; // 判断是否有添加网络费用如果有，则转账金额加上网络费用
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
            if (count.compareTo(amount) > 0) // 塞入足够的input的时候跳出循环
             {
                break;
            }
        }
        if (count.compareTo(amount) >= 0) // 比较utxo是否足够转账
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
            const change = count.subtract(amount); // 应该找零的值
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
/**
 * api 请求方法
 * @param opts 请求参数
 */
function request(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        let network = storage.network == "TestNet" ? "testnet" : "mainnet";
        let url = [baseUrl, network].join('/');
        if (opts.baseUrl === 'common') {
            url = [baseCommonUrl, network].join('/');
        }
        else if (opts.baseUrl === 'rpc') {
            url = testRpcUrl;
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
                console.log(json.error);
                throw new Error(json.error);
            }
        }
        catch (error) {
            throw error;
        }
    });
}
var Api = {
    getStorage: (scriptHash, key) => {
        return request({
            method: "getstorage",
            params: [scriptHash, key],
            baseUrl: "rpc"
        });
    },
    getcontractstate: (scriptaddr) => {
        return request({
            method: "getcontractstate",
            params: [scriptaddr],
            baseUrl: "common"
        });
    },
    getavailableutxos: (address, count) => {
        return request({
            method: "getavailableutxos",
            params: [address, count],
        });
    },
    getInvokeRead: (scriptHash) => {
        const opts = {
            method: 'invokescript',
            params: [scriptHash],
            baseUrl: 'rpc'
        };
        return request(opts);
    },
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
        return request({
            method: 'getregisteraddressbalance',
            params: [
                address,
                register
            ]
        });
    },
    sendrawtransaction: (data) => {
        const opts = {
            method: 'sendrawtransaction',
            params: [data],
            baseUrl: 'common'
        };
        return request(opts);
    },
    getUtxo: (address) => {
        const opts = {
            method: "getutxo",
            params: [address],
            baseUrl: 'common'
        };
        return request(opts);
    },
    getDomainInfo: (domain) => {
        return request({
            method: "getdomaininfo",
            params: [domain],
            baseUrl: 'rpc'
        });
    },
    /**
     * 判断交易是否入链
     * @param txid 交易id
     */
    hasTx: (txid) => {
        const opts = {
            method: "hastx",
            params: [txid]
        };
        return request(opts);
    },
    getrawtransaction: (txid) => {
        const opts = {
            method: "getrawtransaction",
            params: [txid, 1],
            baseUrl: 'rpc'
        };
        return request(opts);
    },
    /**
     *
     */
    getrawtransaction_api: (txid) => {
        return request({
            method: "getrawtransaction",
            params: [txid],
            baseUrl: 'common'
        });
    },
    /**
     * 判断合约调用是否抛出 notify
     * @param txid 交易id
     */
    hasContract: (txid) => {
        const opts = {
            method: "hascontract",
            params: [txid]
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
            params: [txid]
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
            params: [asset]
        };
        return request(opts);
    }
};
const setContractMessage = (txid, domain, data) => {
    Storage_local.get("invoke-message")
        .then(result => {
        if (result) {
            result[txid] = { domain, data };
            Storage_local.set("invoke-message", { result });
        }
        else {
            let message = {};
            message[txid] = { domain, data };
            Storage_local.set("invoke-message", { message });
        }
    });
};
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
    /**
     *
     * @param argument
     */
    EmitArguments(argument, hookTxid) {
        for (let i = argument.length - 1; i >= 0; i--) {
            const param = argument[i];
            if (param.type === ArgumentDataType.ARRAY) {
                var list = param.value;
                for (let i = list.length - 1; i >= 0; i--) {
                    this.EmitParamJson(list[i]);
                }
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
                    var hex = param.value.hexToBytes();
                    if (hex.length != 20)
                        throw new Error("not a hex160");
                    this.EmitPushBytes(hex.reverse());
                    break;
                case ArgumentDataType.HASH256:
                    var hex = param.value.hexToBytes();
                    if (hex.length != 32)
                        throw new Error("not a hex256");
                    this.EmitPushBytes(hex.reverse());
                    break;
                case ArgumentDataType.BYTEARRAY:
                    var hex = param.value.hexToBytes();
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
                    if (hookTxid) {
                        var hex = hookTxid.hexToBytes();
                        this.EmitPushBytes(hex.reverse());
                    }
                    else {
                        this.EmitSysCall("System.ExecutionEngine.GetScriptContainer");
                        this.EmitSysCall("Neo.Transaction.GetHash");
                    }
                    break;
                case ArgumentDataType.ARRAY:
                    this.EmitArguments(param.value);
                    break;
                default:
                    throw new Error("No parameter of this type");
            }
        }
        this.EmitPushNumber(new Neo.BigInteger(argument.length));
        this.Emit(ThinNeo.OpCode.PACK);
        return this;
    }
    EmitInvokeArgs(...invokes) {
        const RANDOM_UINT8 = getWeakRandomValues(32);
        const RANDOM_INT = Neo.BigInteger.fromUint8Array(RANDOM_UINT8);
        // 塞入随机数
        this.EmitPushNumber(RANDOM_INT); // 将随机数推入栈顶
        this.Emit(ThinNeo.OpCode.DROP); // 打包
        for (let index = 0; index < invokes.length; index++) {
            const invoke = invokes[index];
            this.EmitArguments(invoke.arguments); // 调用EmitArguments方法编译并打包参数
            this.EmitPushString(invoke.operation); // 塞入方法名
            this.EmitAppCall(Neo.Uint160.parse(invoke.scriptHash)); // 塞入合约地址
        }
        return this.ToArray();
    }
}
/**
 * 编译 invoke参数列表
 * @param {InvokeArgs[]} group InvokeGroup参数
 */
function groupScriptBuild(group) {
    // invoke 组合 调用
    let sb = new ScriptBuild();
    // 生成随机数
    const RANDOM_UINT8 = getWeakRandomValues(32);
    const RANDOM_INT = Neo.BigInteger.fromUint8Array(RANDOM_UINT8);
    // 塞入随机数
    sb.EmitPushNumber(RANDOM_INT); // 将随机数推入栈顶
    sb.Emit(ThinNeo.OpCode.DROP); // 打包
    /**
     * 循环塞入script参数
     */
    for (let index = 0; index < group.length; index++) {
        const invoke = group[index];
        sb.EmitArguments(invoke.arguments); // 调用EmitArguments方法编译并打包参数
        sb.EmitPushString(invoke.operation); // 塞入方法名
        sb.EmitAppCall(Neo.Uint160.parse(invoke.scriptHash)); // 塞入合约地址
    }
    return sb.ToArray();
}
/**
 * 打包合并交易
 * @param data 合并合约调用参数
 */
const invokeGroupBuild = (data) => __awaiter(this, void 0, void 0, function* () {
    let netfee = Neo.Fixed8.Zero;
    // 判断merge的值
    if (data.merge) {
        let tran = new Transaction();
        let script = groupScriptBuild(data.group);
        tran.setScript(script);
        let transfer = {}; // 用来存放 将要转账的合约地址 资产id 数额
        let utxos = yield MarkUtxo.getAllUtxo();
        let assets;
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
            let result = yield transactionSignAndSend(tran);
            TaskManager.addTask(new Task(ConfirmType.contract, result.txid.replace('0x', '')));
            return [result];
        }
        catch (error) {
            throw error;
        }
    }
    else {
        let txids = [];
        let trans = [];
        for (let index = 0; index < data.group.length; index++) {
            const invoke = data.group[index];
            if (index == 0) {
                try {
                    let result = yield contractBuilder(invoke);
                    console.log(result);
                    txids.push(result);
                }
                catch (error) {
                    console.log(error);
                    throw error;
                }
            }
            else {
                let tran = new Transaction();
                let script = new ScriptBuild();
                // 生成随机数
                const RANDOM_UINT8 = getWeakRandomValues(32);
                const RANDOM_INT = Neo.BigInteger.fromUint8Array(RANDOM_UINT8);
                // 塞入随机数
                script.EmitPushNumber(RANDOM_INT); // 将随机数推入栈顶
                script.Emit(ThinNeo.OpCode.DROP); // 打包
                script.EmitArguments(invoke.arguments, txids[0].txid);
                script.EmitPushString(invoke.operation);
                script.EmitAppCall(Neo.Uint160.parse(invoke.scriptHash));
                tran.setScript(script.ToArray());
                const message = tran.GetMessage().clone();
                const signdata = ThinNeo.Helper.Sign(message, storage.account.prikey);
                tran.AddWitness(signdata, storage.account.pubkey, storage.account.address);
                const data = tran.GetRawData();
                const nextTran = new TransferGroup();
                nextTran.txhex = data.toHexString();
                nextTran.txid = tran.getTxid();
                txids.push({ txid: nextTran.txid, nodeUrl: "https://api.nel.group/api" });
                trans.push(nextTran);
            }
        }
        const task = new Task(ConfirmType.contract, txids[0].txid.replace('0x', ''), trans[0], TaskState.watting);
        TaskManager.addTask(task);
        for (let index = 0; index < trans.length; index++) {
            const tran = trans[index];
            if (index < (trans.length - 1)) {
                TaskManager.addTask(new Task(ConfirmType.contract, tran.txid, trans[index + 1], TaskState.watForLast));
            }
            else {
                TaskManager.addTask(new Task(ConfirmType.contract, tran.txid, undefined, TaskState.watForLast));
            }
        }
        return txids;
    }
});
const sendGroupTranstion = (trans) => {
    return new Promise((resolve, reject) => {
        let outputs = [];
        for (let index = 0; index < trans.length; index++) {
            const tran = trans[index];
            const message = tran.GetMessage().clone();
            const signdata = ThinNeo.Helper.Sign(message, storage.account.prikey);
            tran.AddWitness(signdata, storage.account.pubkey, storage.account.address);
            // const data:Uint8Array = tran.GetRawData();
            console.log(tran.getTxid());
            outputs.push({ "txid": tran.getTxid(), nodeUrl: "https://api.nel.group/api" });
        }
    });
};
/**
 *
 * @param transcount 转换金额
 * @param netfee 交易费用
 */
var exchangeCgas = (transcount, netfee) => __awaiter(this, void 0, void 0, function* () {
    const result = yield makeRefundTransaction(transcount, netfee);
    // 已经确认
    //tx的第一个utxo就是给自己的
    let utxo = new Utxo();
    utxo.addr = storage.account.address;
    utxo.txid = result.txid;
    utxo.asset = HASH_CONFIG.ID_GAS;
    utxo.count = Neo.Fixed8.fromNumber(transcount);
    utxo.n = 0;
    const data = yield makeRefundTransaction_tranGas(utxo, transcount, netfee);
    TaskManager.addTask(new Task(ConfirmType.contract, result.txid, data));
    TaskManager.addTask(new Task(ConfirmType.contract, data.txid, undefined, TaskState.watForLast));
    let txids = [result, { "txid": data.txid, "nodeUrl": "https://api.nel.group/api" }];
    return txids;
});
var makeRefundTransaction = (transcount, netfee) => __awaiter(this, void 0, void 0, function* () {
    //获取sgas合约地址的资产列表
    let utxos_current = yield MarkUtxo.getAllUtxo();
    let utxos_cgas = yield Api.getavailableutxos(storage.account.address, transcount);
    var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(HASH_CONFIG.ID_CGAS);
    let gass = utxos_current[HASH_CONFIG.ID_GAS];
    var cgass = [];
    for (var i in utxos_cgas) {
        var item = utxos_cgas[i];
        let utxo = new Utxo();
        utxo.addr = nepAddress;
        utxo.asset = HASH_CONFIG.ID_GAS;
        utxo.n = item.n;
        utxo.txid = item.txid;
        utxo.count = Neo.Fixed8.parse(item.value);
        cgass.push(utxo);
    }
    var tran = new Transaction();
    // CGAS合约地址 转账给 CGAS合约地址。用来生成一个utxo,合约会把这个utxo标记给发起的地址使用
    tran.creatInuptAndOutup(cgass, Neo.Fixed8.fromNumber(transcount), nepAddress);
    if (netfee > 0) // 判断是否有手续费
     { // 创建当前交易的手续费
        console.log('当前CGAS兑换添加手续费 ' + netfee + " GAS");
        tran.creatInuptAndOutup(gass, Neo.Fixed8.fromNumber(netfee));
    }
    // for (const i in tran.inputs)    // hash反序
    // {
    //     tran.inputs[i].hash = tran.inputs[i].hash.reverse();
    // }
    var scriptHash = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(storage.account.address);
    var script = new ScriptBuild();
    const refund = {
        scriptHash: HASH_CONFIG.ID_CGAS.toString(),
        operation: 'refund',
        arguments: [{ type: "ByteArray", value: scriptHash.toHexString() }],
        network: storage.network
    };
    script.EmitInvokeArgs(refund); // 这里的方法有推随机数进去不知道具体是否有影响
    // var script = new ThinNeo.ScriptBuilder();
    // script.EmitParamJson(["(bytes)" + scriptHash.toHexString()]);//第二个参数是个数组
    // script.EmitPushString("refund");
    // script.EmitAppCall(HASH_CONFIG.ID_CGAS);
    tran.setScript(script.ToArray());
    //构建一个script
    // let sb = new ScriptBuild();
    // sb.EmitArguments([{type:"String",value:"whatever"},{type:'Integer',value:250}])
    // var r = await Api.getcontractstate(HASH_CONFIG.ID_CGAS.toString())
    // var sgasScript = r[0]['script'].hexToBytes();
    // tran.AddWitnessScript(sgasScript, sb.ToArray());
    // tran.AddWitnessScript(new Uint8Array(0), sb.ToArray());
    let sb = new ThinNeo.ScriptBuilder();
    sb.EmitPushString("whatever");
    sb.EmitPushNumber(new Neo.BigInteger(250));
    tran.AddWitnessScript(new Uint8Array(0), sb.ToArray());
    // let result = transactionSignAndSend(tran);
    const message = tran.GetMessage().clone();
    const signdata = ThinNeo.Helper.Sign(message, storage.account.prikey);
    tran.AddWitness(signdata, storage.account.pubkey, storage.account.address);
    let index0 = tran.witnesses[0];
    let index1 = tran.witnesses[1];
    tran.witnesses[0] = index1;
    tran.witnesses[1] = index0;
    const data = tran.GetRawData();
    const result = yield Api.sendrawtransaction(data.toHexString());
    if (result[0].txid) {
        MarkUtxo.setMark(tran.marks);
        const txid = result[0].txid.replace('0x', '');
        const nodeUrl = "https://api.nel.group/api";
        let ouput = { txid, nodeUrl };
        TaskManager.addInvokeData(txid, "TeemmoWallet.exchangeCgas", refund);
        return ouput;
    }
    else {
        throw { type: "TransactionError", description: result[0].errorMessage, data: "" };
    }
    // return result;
});
/**
 *
 * @param utxo 兑换gas的utxo
 * @param transcount 兑换的数量
 */
var makeRefundTransaction_tranGas = (utxo, transcount, netfee) => __awaiter(this, void 0, void 0, function* () {
    var tran = new Transaction();
    try {
        let sendcount = Neo.Fixed8.fromNumber(transcount);
        if (netfee) {
            let fee = Neo.Fixed8.fromNumber(netfee); //网络费用
            sendcount = sendcount.subtract(fee); //由于转账使用的utxo和需要转换的金额一样大所以输入只需要塞入减去交易费的金额，utxo也足够使用交易费
        }
        tran.creatInuptAndOutup([utxo], sendcount, storage.account.address); //创建交易
        tran.outputs.length = 1; //去掉找零的部分，只保留一个转账位
        for (const n in tran.inputs) {
            tran.inputs[n].hash = tran.inputs[n].hash.reverse();
        }
    }
    catch (error) {
        console.log(error);
    }
    //sign and broadcast
    //做智能合约的签名
    var sb = new ThinNeo.ScriptBuilder();
    sb.EmitPushNumber(new Neo.BigInteger(0));
    sb.EmitPushNumber(new Neo.BigInteger(0));
    // var r = await Api.getcontractstate(HASH_CONFIG.ID_CGAS.toString())
    // var sgasScript = r[0]['script'].hexToBytes();
    // tran.AddWitnessScript(sgasScript, sb.ToArray());
    tran.AddWitnessScript(new Uint8Array(0), sb.ToArray());
    let index0 = tran.witnesses[0];
    let index1 = tran.witnesses[1];
    tran.witnesses[0] = index1;
    tran.witnesses[1] = index0;
    var trandata = new TransferGroup();
    trandata.txhex = tran.GetRawData().toHexString();
    trandata.txid = tran.getTxid();
    return trandata;
});
const transactionSignAndSend = (tran) => __awaiter(this, void 0, void 0, function* () {
    try {
        const message = tran.GetMessage().clone();
        const signdata = ThinNeo.Helper.Sign(message, storage.account.prikey);
        tran.AddWitness(signdata, storage.account.pubkey, storage.account.address);
        const data = tran.GetRawData();
        const result = yield Api.sendrawtransaction(data.toHexString());
        if (result[0].txid) {
            MarkUtxo.setMark(tran.marks);
            const txid = result[0].txid.replace('0x', '');
            const nodeUrl = "https://api.nel.group/api";
            let ouput = { txid, nodeUrl };
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
/**
 * 构造合约调用交易
 * @param invoke invoke调用参数
 */
var contractBuilder = (invoke) => __awaiter(this, void 0, void 0, function* () {
    let tran = new Transaction();
    const script = new ScriptBuild();
    script.EmitInvokeArgs(invoke);
    tran.setScript(script.ToArray());
    const toaddr = ThinNeo.Helper.GetAddressFromScriptHash(HASH_CONFIG.ID_CGAS);
    try {
        const script = new ScriptBuild();
        script.EmitInvokeArgs(invoke);
        tran.setScript(script.ToArray());
        const utxos = yield MarkUtxo.getAllUtxo();
        const fee = invoke.fee ? Neo.Fixed8.parse(invoke.fee) : Neo.Fixed8.Zero;
        for (const asset in invoke.attachedAssets) {
            if (invoke.attachedAssets.hasOwnProperty(asset)) {
                const amount = Neo.Fixed8.parse(invoke.attachedAssets[asset]);
                const utxo = utxos[asset];
                if (asset.includes(HASH_CONFIG.ID_GAS))
                    tran.creatInuptAndOutup(utxo, amount, toaddr, fee);
                else
                    tran.creatInuptAndOutup(utxo, amount, toaddr);
            }
        }
        let result = yield transactionSignAndSend(tran);
        TaskManager.addTask(new Task(ConfirmType.contract, result.txid));
        return result;
    }
    catch (error) {
        throw error;
    }
});
/**
 * 打开notify页面并传递信息，返回调用
 * @param call 回调方法
 * @param data 通知信息
 */
const openNotify = (notifyData, call) => {
    if (notifyData) {
        chrome.storage.local.set({ notifyData }, () => {
            var notify = window.open('notify.html', 'notify', 'height=636px, width=391px, top=150, left=100, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no');
            //获得关闭事件
            var loop = setInterval(() => {
                if (notify.closed) {
                    call();
                    clearInterval(loop);
                }
            }, 1000);
        });
    }
    else {
        var notify = window.open('notify.html', 'notify', 'height=636px, width=391px, top=150, left=100, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no');
        //获得关闭事件
        var loop = setInterval(() => {
            if (notify.closed) {
                call();
                clearInterval(loop);
            }
        }, 1000);
    }
};
/**
 * 请求账户信息
 */
const getAccount = () => {
    return new Promise((resolve, reject) => {
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
    });
};
/**
 * invokeGroup 合约调用
 * @param title 请求的网页信息
 * @param data 传递的数据
 */
const invokeGroup = (header, params) => {
    return new Promise((resolve, reject) => {
        const data = {
            lable: Command.invokeGroup,
            data: params,
            header
        };
        openNotify(data, () => {
            chrome.storage.local.get(["confirm", "checkNetFee"], res => {
                if (res["confirm"] === "confirm") {
                    if (params.merge) {
                        const fee = Neo.Fixed8.Zero;
                        params.group.map((invoke, index) => {
                            fee.add(Neo.Fixed8.parse(invoke.fee ? invoke.fee : '0'));
                        });
                        if (fee.compareTo(Neo.Fixed8.Zero) < 0) {
                            params.group[0].fee = res['checkNetFee'] ? '0.001' : '0';
                        }
                    }
                    invokeGroupBuild(params)
                        .then(result => {
                        if (params.merge) {
                            TaskManager.addInvokeData(result[0].txid, header.domain, params.group);
                        }
                        else {
                            result.forEach((output, index) => {
                                TaskManager.addInvokeData(output.txid, header.domain, params.group[index]);
                            });
                        }
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
};
/**
 * invoke 合约调用
 * @param title dapp请求方的信息
 * @param data 请求的参数
 */
const invoke = (header, params) => {
    return new Promise((resolve, reject) => {
        const data = {
            lable: Command.invokeGroup,
            data: params,
            header
        };
        openNotify(data, () => {
            chrome.storage.local.get(["confirm", "checkNetFee"], res => {
                if (res["confirm"] === "confirm") {
                    const checkNetFee = res['checkNetFee'];
                    params.fee = (params.fee && params.fee != '0') ? params.fee : (checkNetFee ? '0.001' : '0');
                    contractBuilder(params)
                        .then(result => {
                        resolve(result);
                        TaskManager.addInvokeData(result.txid, header.domain, params);
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
};
/**
 * 获得网络状态信息
 */
const getNetworks = () => {
    return new Promise((resolve, reject) => {
        const network = {
            networks: ["MainNet", "TesTnet"],
            defaultNetwork: storage.network ? storage.network : "TestNet"
        };
        resolve(network);
    });
};
/**
 * 余额获取
 * @param data 请求的参数
 */
var getBalance = (data) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((r, j) => __awaiter(this, void 0, void 0, function* () {
        try {
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
            r(balances);
        }
        catch (error) {
            j({ type: "NETWORK_ERROR", description: "余额查询失败", data: error });
        }
    }));
});
var transfer = (data) => __awaiter(this, void 0, void 0, function* () {
    if (data.asset.hexToBytes().length == 20) {
        let amount;
        try {
            const result = yield invokeRead({
                "scriptHash": "fc732edee1efdf968c23c20a9628eaa5a6ccb934",
                "operation": "decimals",
                "arguments": [],
                "network": "TestNet"
            });
            if (result['state'] == 'HALT, BREAK') {
                let stack = result['stack'];
                let dicelams = stack[0]['value'];
                amount = parseFloat(data.amount).toFixed(dicelams).replace('.', '');
            }
            else {
                throw { type: 'ASSET_ERROR', description: "This asset information undefined" };
            }
        }
        catch (error) {
            throw error;
        }
        // 此资产是 nep5资产
        const outupt = yield contractBuilder({
            "scriptHash": data.asset,
            "operation": "transfer",
            "arguments": [
                { "type": "Address", "value": data.fromAddress },
                { "type": "Address", "value": data.toAddress },
                { "type": "Integer", "value": amount }
            ],
            "fee": data.fee,
            "network": data.network
        });
        TaskManager.addTask(new Task(ConfirmType.tranfer, outupt.txid));
        TaskManager.addSendData(outupt.txid, data);
        return outupt;
    }
    else if (data.asset.hexToBytes().length == 32) {
        try {
            let tran = new Transaction();
            const utxos = yield MarkUtxo.getAllUtxo();
            if (data.fee) {
                const fee = Neo.Fixed8.parse(data.fee);
                const gass = utxos[data.asset];
                if (data.asset == HASH_CONFIG.ID_GAS) {
                    const sum = fee.add(Neo.Fixed8.parse(data.amount));
                    tran.creatInuptAndOutup(gass, sum, data.toAddress);
                    tran.outputs[0].value = tran.outputs[0].value.subtract(fee);
                }
                else {
                    const asset = utxos[data.asset];
                    tran.creatInuptAndOutup(asset, Neo.Fixed8.parse(data.amount), data.toAddress);
                    tran.creatInuptAndOutup(gass, fee);
                }
            }
            else {
                const asset = utxos[data.asset];
                const amount = Neo.Fixed8.parse(data.amount);
                tran.creatInuptAndOutup(asset, amount);
            }
            const outupt = yield transactionSignAndSend(tran);
            TaskManager.addTask(new Task(ConfirmType.tranfer, outupt.txid));
            TaskManager.addSendData(outupt.txid, data);
            return outupt;
        }
        catch (error) {
            throw error;
        }
    }
});
var send = (header, params) => {
    return new Promise((resolve, reject) => {
        const data = {
            lable: Command.send,
            data: params,
            header
        };
        openNotify(data, () => {
            transfer(params)
                .then(result => {
                resolve(result);
            })
                .catch(error => {
                reject(error);
            });
        });
    });
};
/**
 * invoke试运行方法
 * @param data invokeRead 的参数
 */
var invokeRead = (data) => {
    return new Promise((r, j) => {
        const script = new ScriptBuild();
        try {
            script.EmitArguments(data.arguments); // 参数转换与打包
            script.EmitPushString(data.operation); // 塞入需要调用的合约方法名
            script.EmitAppCall(Neo.Uint160.parse(data.scriptHash)); // 塞入需要调用的合约hex
            Api.getInvokeRead(script.ToArray().toHexString())
                .then(result => {
                r(result);
            })
                .then(error => {
                j(error);
            });
        }
        catch (error) {
            j(error);
        }
    });
};
var invokeReadGroup = (data) => {
    return new Promise((r, j) => {
        const script = new ScriptBuild();
        try {
            for (const invoke of data.group) {
                script.EmitArguments(invoke.arguments); // 参数转换与打包
                script.EmitPushString(invoke.operation); // 塞入需要调用的合约方法名
                script.EmitAppCall(Neo.Uint160.parse(invoke.scriptHash)); // 塞入需要调用的合约hex
            }
            Api.getInvokeRead(script.ToArray().toHexString())
                .then(result => {
                r(result);
            })
                .then(error => {
                j(error);
            });
        }
        catch (error) {
            j(error);
        }
    });
};
const getProvider = () => {
    return new Promise((resolve, reject) => {
        let provider = {
            "compatibility": [""],
            "extra": { theme: "", currency: "" },
            "name": "Teemmo.NEO",
            "version": VERSION,
            "website": ""
        };
        resolve(provider);
    });
};
const getStorage = (data) => {
    return new Promise((resolve, reject) => {
        Api.getStorage(data.scriptHash, data.key)
            .then(result => {
            console.log("返回getStorage");
            console.log(result);
            if (result)
                resolve(result);
            else
                reject({ type: 'GETSTORAGE_ERROR', description: "接口返回异常" });
        })
            .catch(error => {
            reject({ type: 'GETSTORAGE_ERROR', description: "接口返回异常", data: error });
        });
    });
};
const getPublicKey = () => {
    return new Promise((resolve, reject) => {
        let provider = { address: storage.account.address, publickey: storage.account.pubkey.toHexString() };
        resolve(provider);
    });
};
const notifyInit = (title, domain, favIconUrl) => {
    return new Promise((r, j) => {
        if (storage.domains.indexOf(domain)) {
            const notifyHeader = {
                header: { title, domain, icon: favIconUrl },
                lable: Command.getAccount
            };
            getBase64ByUrl(favIconUrl)
                .then(icon => {
                notifyHeader.header.icon = icon;
                openNotify(notifyHeader, () => {
                    chrome.storage.local.get("confirm", res => {
                        if (res["confirm"] === "confirm") {
                            storage.domains.push(domain);
                            Storage_local.get('white_list')
                                .then(result => {
                                let setData = result ? result : {};
                                setData[domain] = { title, icon };
                                Storage_local.set('white_list', setData);
                                EventsOnChange(WalletEvents.CONNECTED, { address: storage.account.address, label: storage.account.walletName });
                            });
                            r();
                        }
                        else if (res["confirm"] === "cancel") {
                            j({ type: "NOTIFY_ERROR", description: "User cancel Authorization " });
                        }
                    });
                });
            });
        }
        else {
            r();
        }
    });
};
const responseMessage = (sender, request) => {
    const { ID, command, params } = request;
    const tab = sender.tab;
    const title = sender.tab.title;
    const urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
    const url = urlReg.exec(tab.url);
    const domain = url ? url[0] : tab.url;
    const header = { title, domain, icon: tab.favIconUrl };
    notifyInit(title, domain, tab.favIconUrl)
        .then(() => {
        switch (command) {
            case Command.getAccount:
                sendResponse(getAccount());
                break;
            case Command.getProvider:
                sendResponse(getProvider());
                break;
            case Command.getNetworks:
                sendResponse(getNetworks());
                break;
            case Command.getPublicKey:
                sendResponse(getPublicKey());
                break;
            case Command.send:
                sendResponse(send(header, params));
                break;
            case Command.getBalance:
                sendResponse(getBalance(params));
                break;
            case Command.getStorage:
                sendResponse(getStorage(params));
                break;
            case Command.invokeRead:
                sendResponse(invokeRead(params));
                break;
            case Command.invoke:
                sendResponse(invoke(header, params));
                break;
            case Command.invokeReadGroup:
                sendResponse(invokeReadGroup(params));
                break;
            case Command.invokeGroup:
                sendResponse(invokeGroup(header, params));
                break;
            default:
                sendResponse(new Promise((r, j) => j({ type: "REQUEST_ERROR", description: "This method is not available" })));
                break;
        }
    });
    const sendResponse = (result) => {
        result
            .then(data => {
            chrome.tabs.sendMessage(tab.id, {
                return: command,
                ID, data
            });
        })
            .catch(error => {
            chrome.tabs.sendMessage(tab.id, {
                return: command,
                ID, error
            });
        });
    };
};
/**
 * 监听
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //初始化鼠标随机方法
    if (request.command)
        responseMessage(sender, request);
});
var ConfirmType;
(function (ConfirmType) {
    ConfirmType[ConfirmType["tranfer"] = 0] = "tranfer";
    ConfirmType[ConfirmType["contract"] = 1] = "contract";
})(ConfirmType || (ConfirmType = {}));
var TaskState;
(function (TaskState) {
    TaskState[TaskState["watting"] = 0] = "watting";
    TaskState[TaskState["success"] = 1] = "success";
    TaskState[TaskState["fail"] = 2] = "fail";
    TaskState[TaskState["watForLast"] = 3] = "watForLast";
    TaskState[TaskState["failForLast"] = 4] = "failForLast";
})(TaskState || (TaskState = {}));
class Task {
    constructor(type, txid, next, state, messgae) {
        this.height = storage.height;
        this.type = type;
        this.confirm = 0;
        this.txid = txid;
        this.next = next;
        this.state = state ? state : TaskState.watting;
        this.message = messgae;
        this.startTime = new Date().getTime();
    }
}
class TransferGroup {
    static update(tran) {
        Api.sendrawtransaction(tran.txhex)
            .then(result => {
            if (result) {
                TaskManager.shed[tran.txid].state = TaskState.watting;
            }
            else {
                TaskManager.shed[tran.txid].state = TaskState.fail;
                tran.executeError = {
                    type: "TransferError",
                    description: result[0].errorMessage,
                    data: tran.txhex
                };
            }
            Storage_local.set(TaskManager.table, TaskManager.shed);
        })
            .catch(error => {
            if (error) {
                tran.executeError = {
                    type: "TransferError",
                    description: "",
                    data: error
                };
            }
        });
    }
}
class TaskManager {
    static start() {
        setInterval(() => {
            Api.getBlockCount()
                .then(result => {
                const count = (parseInt(result[0].blockcount) - 1);
                if (count - storage.height > 0) {
                    storage.height = count;
                    this.initShed()
                        .then(shed => {
                        this.update();
                    });
                }
            })
                .catch(error => {
                console.log(error);
            });
        }, 15000);
    }
    static addSendData(txid, data) {
        Storage_local.get('send-data')
            .then(senddata => {
            let setdata = senddata ? senddata : {};
            setdata[txid] = data;
            Storage_local.set('send-data', setdata);
        });
    }
    static addInvokeData(txid, domain, data) {
        const hashs = [];
        const descripts = [];
        let fee = Neo.Fixed8.Zero;
        let spend = {};
        if (Array.isArray(data)) {
            for (const invoke of data) {
                hashs.push(invoke.scriptHash);
                if (invoke.description) {
                    descripts.push(invoke.description);
                }
                if (invoke.fee) {
                    fee.add(Neo.Fixed8.parse(invoke.fee));
                }
                if (invoke.attachedAssets) {
                    spend = invoke.attachedAssets;
                }
                if (invoke.operation == 'transfer') {
                    // assets[invoke.scriptHash] = invoke.operation[0]
                }
            }
        }
        else {
            hashs.push(data.scriptHash);
            if (data.description) {
                descripts.push(data.description);
            }
            if (data.fee) {
                fee.add(Neo.Fixed8.parse(data.fee));
            }
            if (data.attachedAssets) {
                spend = data.attachedAssets;
            }
            if (data.operation == 'transfer') {
                // assets[invoke.scriptHash] = invoke.operation[0]
            }
        }
        const message = { domain, hashs, descripts, spend, netfee: fee.toString() };
        Storage_local.get('invoke-data')
            .then(invokes => {
            let setdata = invokes ? invokes : {};
            setdata[txid] = message;
            Storage_local.set('invoke-data', setdata);
        })
            .catch(error => {
        });
    }
    static addTask(task) {
        console.log(task);
        Storage_local.get(this.table)
            .then(shed => {
            if (shed) {
                shed[task.txid] = task;
                this.shed = shed;
                Storage_local.set(this.table, shed);
            }
            else {
                shed = {};
                this.shed[task.txid] = shed[task.txid] = task;
                Storage_local.set(this.table, shed);
            }
        });
    }
    static initShed() {
        return new Promise((r, j) => {
            Storage_local.get(this.table)
                .then(shed => {
                if (shed) {
                    this.shed = shed;
                }
                else {
                    this.shed = {};
                }
                r(shed);
            });
        });
    }
    static update() {
        for (const key in this.shed) {
            const task = this.shed[key];
            if (task.state == TaskState.watting) {
                if (task.type === ConfirmType.tranfer) {
                    Api.getrawtransaction(task.txid)
                        .then(result => {
                        if (result['blockhash']) {
                            task.state = TaskState.success;
                            this.shed[key] = task;
                            Storage_local.set(this.table, this.shed);
                            if (task.next) {
                                TransferGroup.update(task.next);
                            }
                        }
                    })
                        .catch(error => {
                        console.log(error);
                    });
                }
                else {
                    // Api.hasContract(task.txid)
                    // .then(result=>{
                    //     console.log(result);                        
                    // })
                    // .catch(error=>{
                    //     console.log(error);                        
                    // })
                    Api.getrawtransaction(task.txid)
                        .then(result => {
                        if (result['blockhash']) {
                            task.state = TaskState.success;
                            this.shed[key] = task;
                            Storage_local.set(this.table, this.shed);
                            if (task.next) {
                                TransferGroup.update(task.next);
                            }
                        }
                    })
                        .catch(error => {
                        console.log(error);
                    });
                }
            }
        }
    }
}
TaskManager.shed = {};
TaskManager.table = "Task-Manager-shed";
TaskManager.start();
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
var DataType;
(function (DataType) {
    DataType["Array"] = "Array";
    DataType["ByteArray"] = "ByteArray";
    DataType["Integer"] = "Integer";
    DataType["Boolean"] = "Boolean";
    DataType["String"] = "String";
})(DataType || (DataType = {}));
class ResultItem {
    static FromJson(type, value) {
        let item = new ResultItem();
        if (type === DataType.Array) {
            item.subItem = []; //new ResultItem[(value as Array<any>).length];
            for (let i = 0; i < value.length; i++) {
                let subjson = value[i];
                let subtype = subjson["type"];
                item.subItem.push(ResultItem.FromJson(subtype, subjson["value"]));
            }
        }
        else if (type === DataType.ByteArray) {
            item.data = value.hexToBytes();
        }
        else if (type === DataType.Integer) {
            item.data = Neo.BigInteger.parse(value).toUint8Array();
        }
        else if (type === DataType.Boolean) {
            if (value != 0)
                item.data = new Uint8Array(0x01);
            else
                item.data = new Uint8Array(0x00);
        }
        else if (type === DataType.String) {
            item.data = ThinNeo.Helper.String2Bytes(value);
        }
        else {
            console.log("not support type:" + type);
        }
        return item;
    }
    AsHexString() {
        return (this.data).toHexString();
    }
    AsHashString() {
        return "0x" + this.data.reverse().toHexString();
    }
    AsString() {
        return ThinNeo.Helper.Bytes2String(this.data);
    }
    AsHash160() {
        if (this.data.length === 0)
            return null;
        return new Neo.Uint160(this.data.buffer);
    }
    AsHash256() {
        if (this.data.length === 0)
            return null;
        return new Neo.Uint256(this.data.buffer);
    }
    AsBoolean() {
        if (this.data.length === 0 || this.data[0] === 0)
            return false;
        return true;
    }
    AsInteger() {
        return new Neo.BigInteger(this.data);
    }
}
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    var dataURL = canvas.toDataURL("image/" + ext);
    return dataURL;
}
function getBase64ByUrl(url) {
    return new Promise((r, j) => {
        var image = new Image();
        image.src = url;
        image.onload = () => {
            let base64 = getBase64Image(image);
            r(base64);
        };
    });
}
//# sourceMappingURL=background.js.map