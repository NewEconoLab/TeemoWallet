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
const testRpcUrl = "http://test.nel.group:20332";
const mainRpcUrl = "http://seed.nel.group:10332";
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
            const txid = utxo.txid.replace('0x', '');
            if (storage.oldUtxo[txid]) {
                storage.oldUtxo[txid].push(utxo.n);
            }
            else {
                storage.oldUtxo[txid] = new Array();
                storage.oldUtxo[txid].push(utxo.n);
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
                const marks = storage.oldUtxo; // 获得被标记的utxo
                const assets = {};
                // 对utxo进行归类，并且将count由string转换成 Neo.Fixed8
                for (const item of utxos) {
                    const utxo = new Utxo();
                    utxo.addr = item.addr;
                    utxo.asset = item.asset.replace('0x', '');
                    utxo.n = item.n;
                    utxo.txid = item.txid.replace('0x', '');
                    utxo.count = Neo.Fixed8.parse(item.value);
                    assets[utxo.asset] = assets[utxo.asset] ? assets[utxo.asset] : [];
                    const mark = marks ? marks[utxo.txid] : undefined;
                    if (!mark) {
                        assets[utxo.asset].push(utxo);
                    }
                    else if (mark.indexOf(item.n) < 0) // 排除已经标记的utxo返回给调用放
                     {
                        assets[utxo.asset].push(utxo);
                    }
                    else // 对被使用过的utxo进行排除
                     {
                        console.log("以下是被使用过的utxo被排除使用");
                        console.log(item);
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
        let index = -1;
        let newacc = new NepAccount(account.walletName, account.address, account.nep2key, account.scrypt);
        if (arr.length) {
            arr = arr.map((acc, n) => {
                if (acc.address === account.address) {
                    acc.walletName = newacc.walletName ? newacc.walletName : (acc.walletName ? acc.walletName : '我的钱包' + (n + 1));
                    newacc.index = index = n;
                    return newacc;
                }
                return acc;
            });
            if (index < 0) {
                newacc.walletName = newacc.walletName ? newacc.walletName : '我的钱包' + (arr.length + 1);
                arr.push(newacc);
            }
        }
        else {
            newacc.walletName = newacc.walletName ? newacc.walletName : '我的钱包1';
            arr.push(newacc);
        }
        localStorage.setItem("TeemoWALLET_ACCOUNT", JSON.stringify(arr));
        return newacc;
    }
    static getAccount() {
        const str = localStorage.getItem("TeemoWALLET_ACCOUNT");
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
            throw { type: 'INSUFFICIENT_FUNDS', description: 'The user does not have a sufficient balance to perform the requested action' };
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
        // 判断当前网络
        let network = opts.network ? opts.network : storage.network;
        let url = '';
        // 筛选节点
        if (opts.baseUrl === 'common') {
            url = [baseCommonUrl, network == "TestNet" ? "testnet" : "mainnet"].join('/');
        }
        else if (opts.baseUrl === 'rpc') {
            url = network == "TestNet" ? testRpcUrl : mainRpcUrl;
        }
        else {
            url = [baseUrl, network == "TestNet" ? "testnet" : "mainnet"].join('/');
        }
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
                    const result = opts.getNode ? { nodeUrl: url, data: json.result } : json.result;
                    return result;
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
    getAssetState: (assetID) => {
        return request({
            method: "getassetstate",
            params: [assetID],
            baseUrl: 'rpc'
        });
    },
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
    sendrawtransaction: (data, network) => {
        const opts = {
            method: 'sendrawtransaction',
            params: [data],
            baseUrl: 'rpc',
            getNode: true,
            network
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
    getrawtransaction: (txid, network) => {
        const opts = {
            method: "getrawtransaction",
            params: [txid, 1],
            baseUrl: 'rpc',
            network
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
    EmitInvokeArgs(data, hookTxid) {
        const invokes = Array.isArray(data) ? data : [data];
        const RANDOM_UINT8 = getWeakRandomValues(32);
        const RANDOM_INT = Neo.BigInteger.fromUint8Array(RANDOM_UINT8);
        // 塞入随机数
        this.EmitPushNumber(RANDOM_INT); // 将随机数推入栈顶
        this.Emit(ThinNeo.OpCode.DROP); // 打包
        for (let index = 0; index < invokes.length; index++) {
            const invoke = invokes[index];
            this.EmitArguments(invoke.arguments, hookTxid); // 调用EmitArguments方法编译并打包参数
            this.EmitPushString(invoke.operation); // 塞入方法名
            this.EmitAppCall(Neo.Uint160.parse(invoke.scriptHash)); // 塞入合约地址
        }
        return this.ToArray();
    }
}
/**
 * 构造合约调用交易
 * @param invoke invoke调用参数
 */
var contractBuilder = (invoke) => __awaiter(this, void 0, void 0, function* () {
    let tran = new Transaction();
    const script = new ScriptBuild();
    script.EmitInvokeArgs(invoke);
    tran.setScript(script.ToArray());
    try {
        const script = new ScriptBuild();
        script.EmitInvokeArgs(invoke);
        tran.setScript(script.ToArray());
        const utxos = yield MarkUtxo.getAllUtxo();
        const fee = invoke.fee ? Neo.Fixed8.parse(invoke.fee) : Neo.Fixed8.Zero;
        if (invoke.attachedAssets) {
            for (const asset in invoke.attachedAssets) {
                if (invoke.attachedAssets.hasOwnProperty(asset)) {
                    const toaddr = ThinNeo.Helper.GetAddressFromScriptHash(Neo.Uint160.parse(invoke.scriptHash));
                    const amount = Neo.Fixed8.parse(invoke.attachedAssets[asset]);
                    const utxo = utxos[asset];
                    if (asset.includes(HASH_CONFIG.ID_GAS))
                        tran.creatInuptAndOutup(utxo, amount, toaddr, fee);
                    else
                        tran.creatInuptAndOutup(utxo, amount, toaddr);
                }
            }
        }
        else if (fee.compareTo(Neo.Fixed8.Zero) > 0) {
            const utxo = utxos[HASH_CONFIG.ID_GAS];
            tran.creatInuptAndOutup(utxo, fee);
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
 * 打包合并交易
 * @param data 合并合约调用参数
 */
const invokeGroupBuild = (data) => __awaiter(this, void 0, void 0, function* () {
    let netfee = Neo.Fixed8.Zero;
    // 判断merge的值
    if (data.merge) {
        let tran = new Transaction();
        // let script = groupScriptBuild(data.group);
        const script = new ScriptBuild();
        script.EmitInvokeArgs(data.group);
        tran.setScript(script.ToArray());
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
                    txids.push(result);
                }
                catch (error) {
                    throw error;
                }
            }
            else {
                let tran = new Transaction();
                let script = new ScriptBuild();
                script.EmitInvokeArgs(invoke, txids[0].txid);
                tran.setScript(script.ToArray());
                const message = tran.GetMessage().clone();
                const signdata = ThinNeo.Helper.Sign(message, storage.account.prikey);
                tran.AddWitness(signdata, storage.account.pubkey, storage.account.address);
                const data = tran.GetRawData();
                const nextTran = new TransferGroup();
                nextTran.txhex = data.toHexString();
                nextTran.txid = tran.getTxid();
                txids.push({ txid: nextTran.txid, nodeUrl: storage.network == 'TestNet' ? testRpcUrl : mainRpcUrl });
                trans.push(nextTran);
                MarkUtxo.setMark(tran.marks);
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
/**
 * 发送
 * @param trans
 */
const sendGroupTranstion = (trans) => {
    return new Promise((resolve, reject) => {
        let outputs = [];
        for (let index = 0; index < trans.length; index++) {
            const tran = trans[index];
            const message = tran.GetMessage().clone();
            const signdata = ThinNeo.Helper.Sign(message, storage.account.prikey);
            tran.AddWitness(signdata, storage.account.pubkey, storage.account.address);
            // const data:Uint8Array = tran.GetRawData();
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
    // utxo.addr = storage.account.address;
    utxo.addr = ThinNeo.Helper.GetAddressFromScriptHash(HASH_CONFIG.ID_CGAS);
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
var exchangeGas = (transcount, netfee) => __awaiter(this, void 0, void 0, function* () {
    const invoke = {
        scriptHash: HASH_CONFIG.ID_CGAS.toString(),
        operation: "mintTokens",
        arguments: [],
        attachedAssets: { [HASH_CONFIG.ID_GAS]: transcount.toString() },
        network: storage.network,
        fee: netfee ? "0.001" : "0",
        description: 'gas换cgas'
    };
    try {
        const result = yield contractBuilder(invoke);
        TaskManager.addInvokeData(result.txid, 'TeemoWallet.exchangeCgas', invoke);
        return result;
    }
    catch (error) {
        throw error;
    }
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
        tran.creatInuptAndOutup(gass, Neo.Fixed8.fromNumber(netfee));
    }
    var scriptHash = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(storage.account.address);
    var script = new ScriptBuild();
    const refund = {
        scriptHash: HASH_CONFIG.ID_CGAS.toString(),
        operation: 'refund',
        arguments: [{ type: "ByteArray", value: scriptHash.toHexString() }],
        network: storage.network,
        fee: netfee.toString(),
        description: 'cgas换cgas'
    };
    script.EmitInvokeArgs(refund); // 这里的方法有推随机数进去不知道具体是否有影响
    tran.setScript(script.ToArray());
    let sb = new ThinNeo.ScriptBuilder();
    sb.EmitPushString("whatever");
    sb.EmitPushNumber(new Neo.BigInteger(250));
    // 这里多传一个参数 cgas 的scriptHash 
    tran.AddWitnessScript(new Uint8Array(0), sb.ToArray(), HASH_CONFIG.ID_CGAS.toArray());
    // let result = transactionSignAndSend(tran);
    const message = tran.GetMessage().clone();
    const signdata = ThinNeo.Helper.Sign(message, storage.account.prikey);
    tran.AddWitness(signdata, storage.account.pubkey, storage.account.address);
    const data = tran.GetRawData();
    const txid = tran.getTxid();
    const result = yield Api.sendrawtransaction(data.toHexString());
    if (result['data']) {
        MarkUtxo.setMark(tran.marks);
        const nodeUrl = result['nodeUrl'];
        let ouput = { txid, nodeUrl };
        // 为了popup显示对应的refund的数额
        // TaskManager.addInvokeData(txid,"TeemoWallet.exchangeCgas",refund);
        const message = {
            domain: "TeemoWallet.exchangeCgas",
            scriptHashs: [refund.scriptHash],
            descripts: [refund.description],
            expenses: [{ 'assetid': HASH_CONFIG.ID_CGAS.toString(), 'amount': transcount.toString(), 'symbol': 'CGAS' }],
            netfee: refund.fee ? refund.fee : '0',
        };
        TaskManager.invokeHistory[txid] = message;
        Storage_local.set('invoke-data', TaskManager.invokeHistory);
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
    }
    catch (error) {
        console.log(error);
    }
    //sign and broadcast
    //做智能合约的签名
    var sb = new ThinNeo.ScriptBuilder();
    sb.EmitPushNumber(new Neo.BigInteger(0));
    sb.EmitPushNumber(new Neo.BigInteger(0));
    // 多传一个参数
    tran.AddWitnessScript(new Uint8Array(0), sb.ToArray(), HASH_CONFIG.ID_CGAS.toArray());
    var trandata = new TransferGroup();
    trandata.txhex = tran.GetRawData().toHexString();
    trandata.txid = tran.getTxid();
    MarkUtxo.setMark(tran.marks);
    const senddata = {
        'fromAddress': utxo.addr,
        'toAddress': storage.account.address,
        'asset': HASH_CONFIG.ID_GAS,
        'amount': transcount.toString(),
        'fee': netfee.toString(),
        'remark': 'cgas换gas',
        network: storage.network
    };
    TaskManager.addSendData(trandata.txid, senddata);
    return trandata;
});
const transactionSignAndSend = (tran) => __awaiter(this, void 0, void 0, function* () {
    try {
        const message = tran.GetMessage().clone();
        const signdata = ThinNeo.Helper.Sign(message, storage.account.prikey);
        tran.AddWitness(signdata, storage.account.pubkey, storage.account.address);
        const data = tran.GetRawData();
        const txid = tran.getTxid();
        const result = yield Api.sendrawtransaction(data.toHexString());
        if (result['data']) {
            MarkUtxo.setMark(tran.marks);
            const nodeUrl = result.nodeUrl;
            let ouput = { txid, nodeUrl };
            return ouput;
        }
        else {
            throw { type: "RPC_ERROR", description: 'An RPC error occured when submitting the request', data: result[0].errorMessage };
        }
    }
    catch (error) {
        console.log(error);
    }
});
/**
 * 打开notify页面并传递信息，返回调用
 * @param call 回调方法
 * @param data 通知信息
 */
const openNotify = (notifyData) => {
    if (notifyData) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ notifyData }, () => {
                var notify = window.open('notify.html', 'notify', 'height=636px, width=391px, top=150, left=100, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no');
                //获得关闭事件
                var loop = setInterval(() => {
                    if (notify.closed) {
                        chrome.storage.local.get(["confirm"], res => {
                            if (res && res["confirm"] === "confirm") {
                                Storage_local.set('confirm', '');
                                resolve(true);
                            }
                            else {
                                reject({ type: 'CANCELED', description: 'The user cancels, or refuses the dapps request' });
                            }
                        });
                        clearInterval(loop);
                    }
                }, 1000);
            });
        });
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
        openNotify(data)
            .then(confrim => {
            Storage_local.get('checkNetFee')
                .then(check => {
                if (params.merge) {
                    const fee = Neo.Fixed8.Zero;
                    params.group.map((invoke, index) => {
                        fee.add(Neo.Fixed8.parse(invoke.fee ? invoke.fee : '0'));
                    });
                    if (fee.compareTo(Neo.Fixed8.Zero) < 0) {
                        params.group[0].fee = check ? '0.001' : '0';
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
            });
        })
            .catch(error => {
            reject(error);
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
        openNotify(data)
            .then(checkNetFee => {
            params.fee = (params.fee && params.fee != '0') ? params.fee : (checkNetFee ? '0.001' : '0');
            contractBuilder(params)
                .then(result => {
                resolve(result);
                TaskManager.addInvokeData(result.txid, header.domain, params);
            })
                .catch(error => {
                reject(error);
            });
        })
            .catch(error => {
            reject(error);
        });
    });
};
/**
 * 获得网络状态信息
 */
const getNetworks = () => {
    return new Promise((resolve, reject) => {
        const network = {
            networks: [storage.network ? storage.network : "TestNet"],
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
                var asset = arg.assets ? arg.assets : [HASH_CONFIG.ID_GAS, HASH_CONFIG.ID_NEO, HASH_CONFIG.ID_NNC.toString(), HASH_CONFIG.ID_CGAS.toString()];
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
                    if (res) {
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
                }
                if (utxoasset.length) {
                    let res = yield Api.getBalance(arg.address);
                    let assets = {};
                    if (res) {
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
                throw { type: 'MALFORMED_INPUT', description: "This scripthash information undefined" };
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
        catch (error) {
            throw error;
        }
    }
    else if (data.asset.hexToBytes().length == 32) {
        try {
            let tran = new Transaction();
            const utxos = yield MarkUtxo.getAllUtxo();
            if (data.fee && data.fee != '0') {
                const fee = Neo.Fixed8.parse(data.fee);
                const gass = utxos[HASH_CONFIG.ID_GAS];
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
                tran.creatInuptAndOutup(asset, amount, data.toAddress);
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
        if (params.fromAddress !== storage.account.address) {
            reject({ type: "MALFORMED_INPUT", description: 'The input address is not the current wallet address' });
        }
        else {
            const data = {
                lable: Command.send,
                data: params,
                header
            };
            openNotify(data)
                .then(confirm => {
                transfer(params)
                    .then(result => {
                    resolve(result);
                });
            })
                .catch(error => {
                reject(error);
            });
        }
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
var invokeReadTest = () => {
    const script = new ScriptBuild();
    script.EmitParamJson([['(str)test', '(str)qmz']]);
    script.EmitPushString('nameHashArray'); // 塞入需要调用的合约方法名
    script.EmitAppCall(Neo.Uint160.parse('348387116c4a75e420663277d9c02049907128c7')); // 塞入需要调用的合约hex
    Api.getInvokeRead(script.ToArray().toHexString())
        .then(result => {
        // console.log(result);        
    })
        .then(error => {
        console.log(error);
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
var invokeArgsAnalyse = (...invokes) => __awaiter(this, void 0, void 0, function* () {
    let descriptions = [];
    let scriptHashs = [];
    let fee = Neo.Fixed8.Zero;
    let operations = [];
    let argument = [];
    let expenses = [];
    let nep5assets = {};
    let utxoassets = {};
    for (let index = 0; index < invokes.length; index++) {
        const invoke = invokes[index];
        descriptions.push(invoke.description);
        scriptHashs.push(invoke.scriptHash);
        fee = invoke.fee ? fee.add(Neo.Fixed8.parse(invoke.fee)) : fee;
        operations.push(invoke.operation);
        argument.push(invoke.arguments);
        // 判断 nep5的转账花费
        if (invoke.operation == "transfer") {
            if (invoke.arguments[0].value == storage.account.address) {
                const amount = Neo.BigInteger.fromString(invoke.arguments[2].value.toString());
                if (!nep5assets[invoke.scriptHash])
                    nep5assets[invoke.scriptHash] = Neo.BigInteger.Zero;
                nep5assets[invoke.scriptHash] = nep5assets[invoke.scriptHash].add(amount);
            }
        }
        if (invoke.attachedAssets) {
            for (const asset in invoke.attachedAssets) {
                const amount = Neo.Fixed8.parse(invoke.attachedAssets[asset].toString());
                if (!utxoassets[asset])
                    utxoassets[asset] = Neo.Fixed8.Zero;
                utxoassets[asset] = utxoassets[asset].add(amount);
            }
        }
        if (HASH_CONFIG.ID_CGAS.compareTo(Neo.Uint160.parse(invoke.scriptHash)) === 0 && invoke.operation == "refund") {
        }
    }
    for (const key in utxoassets) {
        const amount = utxoassets[key];
        const assetstate = yield queryAssetSymbol(key, invokes[0].network);
        expenses.push({
            symbol: assetstate.symbol,
            amount: amount.toString(),
            assetid: key
        });
    }
    for (const key in nep5assets) {
        const amount = nep5assets[key];
        const assetstate = yield queryAssetSymbol(key, invokes[0].network);
        var v = 1;
        for (var i = 0; i < assetstate.decimals; i++) {
            v *= 10;
        }
        var intv = amount.divide(v).toInt32();
        var smallv = amount.mod(v).toInt32() / v;
        expenses.push({
            symbol: assetstate.symbol,
            amount: (intv + smallv).toString(),
            assetid: key
        });
    }
    return { scriptHashs, descriptions, operations, arguments: argument, expenses, fee: fee.toString() };
});
var queryAssetSymbol = (assetID, network) => __awaiter(this, void 0, void 0, function* () {
    assetID = assetID.replace('0x', '');
    if (assetID.hexToBytes().length == 20) {
        const group = {
            "group": [
                {
                    "scriptHash": assetID,
                    "operation": "symbol",
                    "arguments": [],
                    "network": network
                },
                {
                    "scriptHash": assetID,
                    "operation": "decimals",
                    "arguments": [],
                    "network": network
                }
            ]
        };
        const result = yield invokeReadGroup(group);
        const stack = result['stack'];
        if (stack) {
            const symbol = ThinNeo.Helper.Bytes2String(stack[0]['value'].hexToBytes());
            const decimals = parseInt(stack[1]['value']);
            return { symbol, decimals };
        }
    }
    if (assetID.hexToBytes().length == 32) {
        let asset = { symbol: '', decimals: 0 };
        if (assetID === HASH_CONFIG.ID_NEO)
            asset.symbol = 'NEO';
        else if (assetID === HASH_CONFIG.ID_GAS)
            asset.symbol = 'GAS';
        else {
            const result = yield Api.getAssetState(assetID);
            const names = result[name];
            for (var i in names) {
                asset.symbol = names[i].name;
            }
        }
        return asset;
    }
});
const getProvider = () => {
    return new Promise((resolve, reject) => {
        let provider = {
            "compatibility": [""],
            "extra": { theme: "", currency: "" },
            "name": "Teemo.NEO",
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
            if (result)
                resolve(result);
            else
                reject({ type: 'RPC_ERROR', description: "An RPC error occured when submitting the request" });
        })
            .catch(error => {
            reject({ type: 'RPC_ERROR', description: "An RPC error occured when submitting the request", data: error });
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
        if (storage.domains.indexOf(domain) < 0) {
            const notifyHeader = {
                header: { title, domain, icon: favIconUrl },
                lable: Command.getAccount
            };
            getBase64ByUrl(favIconUrl)
                .then(icon => {
                notifyHeader.header.icon = icon;
                openNotify(notifyHeader)
                    .then(result => {
                    storage.domains.push(domain);
                    Storage_local.get('white_list')
                        .then(result => {
                        let setData = result ? result : {};
                        TaskManager.dappsMessage[domain] = setData[domain] = { title, icon };
                        Storage_local.set('white_list', setData);
                        EventsOnChange(WalletEvents.CONNECTED, { address: storage.account.address, label: storage.account.walletName });
                    });
                    r();
                })
                    .catch(error => {
                    j(error);
                });
            });
        }
        else {
            r();
        }
    });
};
const showNotify = (title, msg) => {
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'icon128.png',
        title: title,
        message: msg
    });
};
/**
 * 通过正则获得url中的域名
 * @param Url url链接
 */
const getURLDomain = (Url) => {
    var durl = /http:\/\/([^\/]+)\//i;
    var durl2 = /https:\/\/([^\/]+)\//i;
    var durl3 = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
    var arr = Url.match(durl);
    if (arr && arr.length > 1)
        return arr[1].toString();
    arr = Url.match(durl2);
    if (arr && arr.length > 1)
        return arr[1].toString();
    arr = durl3.exec(Url);
    if (arr && arr.length > 0)
        return arr[0].toString();
    else
        return Url;
};
/**
 * 处理请求并返回
 * @param sender An object containing information about the script context that sent a message or request.
 * @param request 请求数据
 */
const responseMessage = (sender, request) => {
    const { ID, command, params } = request;
    const tab = sender.tab;
    const title = sender.tab.title;
    const domain = getURLDomain(tab.url);
    const header = { title, domain, icon: tab.favIconUrl };
    if (Storage_local.getAccount().length < 1) {
        showNotify('未检测到钱包', '请先创建或导入钱包');
        const error = { type: 'CONNECTION_DENIED', description: 'No account response to current dapp request ' };
        chrome.tabs.sendMessage(tab.id, {
            return: command, ID, error
        });
        return;
    }
    const network = params ? (params['group'] ? params['group'][0]['network'] : params['network']) : undefined;
    if (network && network != storage.network) {
        const error = { type: 'MALFORMED_INPUT', description: 'The network is not a valid network' };
        chrome.tabs.sendMessage(tab.id, {
            return: command, ID, error
        });
        return;
    }
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
            case Command.getAddressFromScriptHash:
                sendResponse(new Promise((r, j) => {
                    try {
                        r(ThinNeo.Helper.GetAddressFromScriptHash(Neo.Uint160.parse(params)));
                    }
                    catch (error) {
                        j({ type: "MALFORMED_INPUT", description: 'This scripthash is not correct.' });
                    }
                }));
                break;
            default:
                sendResponse(new Promise((r, j) => j({ type: "NO_PROVIDER", description: "Could not find an instance of the dAPI in the webpage" })));
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
        this.network = storage.network;
        this.currentAddr = storage.account.address;
        this.message = messgae;
        this.startTime = new Date().getTime();
    }
}
class TransferGroup {
    static update(tran, network) {
        Api.sendrawtransaction(tran.txhex, network)
            .then(result => {
            if (result['data']) {
                TaskManager.shed[tran.txid].state = TaskState.watting;
            }
            else {
                TaskManager.shed[tran.txid].state = TaskState.fail;
                TaskManager.shed[tran.txid].next.executeError = {
                    type: "RPC_ERROR",
                    description: result[0].errorMessage,
                    data: tran.txhex
                };
            }
            Storage_local.set(TaskManager.table, TaskManager.shed);
        })
            .catch(error => {
            TaskManager.shed[tran.txid].state = TaskState.fail;
            TaskManager.shed[tran.txid].next.executeError = {
                type: "RPC_ERROR",
                description: error,
                data: tran.txhex
            };
            Storage_local.set(TaskManager.table, TaskManager.shed);
            // if(error)
            // {
            //     tran.executeError={
            //         type:"RPC_ERROR",
            //         description:"An RPC error occured when submitting the request",
            //         data:error
            //     }
            // }
        });
    }
}
class TaskManager {
    static start() {
        chrome.storage.local.get([this.table, 'invoke-data', 'send-data', 'white_list'], item => {
            this.shed = item[this.table] ? item[this.table] : {};
            this.invokeHistory = item['invoke-data'] ? item['invoke-data'] : {};
            this.sendHistory = item['send-data'] ? item['send-data'] : {};
            this.dappsMessage = item['white_list'] ? item['white_list'] : {};
        });
        setInterval(() => {
            Api.getBlockCount()
                .then(result => {
                const count = (parseInt(result[0].blockcount) - 1);
                if (count - storage.height != 0) {
                    storage.height = count;
                    this.update();
                }
            })
                .catch(error => {
                console.log(error);
            });
        }, 15000);
    }
    static addSendData(txid, data) {
        queryAssetSymbol(data.asset, data.network)
            .then(assetState => {
            this.sendHistory[txid] = data;
            this.sendHistory[txid]['symbol'] = assetState.symbol;
            Storage_local.set('send-data', this.sendHistory);
        });
    }
    static addInvokeData(txid, domain, data) {
        const invokeArgs = Array.isArray(data) ? data : [data];
        invokeArgsAnalyse(...invokeArgs)
            .then(result => {
            const message = {
                domain: domain,
                scriptHashs: result.scriptHashs,
                descripts: result.descriptions,
                expenses: result.expenses,
                netfee: result.fee,
            };
            this.invokeHistory[txid] = message;
            Storage_local.set('invoke-data', this.invokeHistory);
        });
    }
    static InvokeDataUpdate() {
        Storage_local.set('invoke-data', this.invokeHistory);
    }
    static addTask(task) {
        this.shed[task.txid] = task;
        Storage_local.set(this.table, this.shed);
    }
    static initShed() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([this.table, 'invoke-data', 'send-data'], item => {
                this.shed = item[this.table] ? item[this.table] : {};
                this.invokeHistory = item['invoke-data'] ? item['invoke-data'] : {};
                this.sendHistory = item['send-data'] ? item['send-data'] : {};
                resolve();
            });
        });
    }
    static update() {
        for (const key in this.shed) {
            const task = this.shed[key];
            if (task.state == TaskState.watting) {
                if (task.type === ConfirmType.tranfer) {
                    Api.getrawtransaction(task.txid, task.network)
                        .then(result => {
                        if (result['blockhash']) {
                            task.state = TaskState.success;
                            this.shed[key] = task;
                            Storage_local.set(this.table, this.shed);
                            if (task.next) {
                                TransferGroup.update(task.next, task.network);
                            }
                        }
                    })
                        .catch(error => {
                        console.log(error);
                    });
                }
                else {
                    Api.getrawtransaction(task.txid, task.network)
                        .then(result => {
                        if (result['blockhash']) {
                            task.state = TaskState.success;
                            this.shed[key] = task;
                            Storage_local.set(this.table, this.shed);
                            if (task.next) {
                                TransferGroup.update(task.next, task.network);
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
TaskManager.invokeHistory = {};
TaskManager.sendHistory = {};
TaskManager.dappsMessage = {};
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
    Command["getAddressFromScriptHash"] = "getAddressFromScriptHash";
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
var getHistoryList = () => {
    const list = [];
    if (!storage.account) {
        return list;
    }
    for (const txid in TaskManager.shed) {
        if (TaskManager.shed.hasOwnProperty(txid)) {
            const task = TaskManager.shed[txid];
            if (task.network == storage.network && task.currentAddr == storage.account.address) {
                const sendHistory = TaskManager.sendHistory[txid];
                const invokeHistory = TaskManager.invokeHistory[txid];
                let dappMessage = undefined;
                if (task.type == ConfirmType.contract && invokeHistory) {
                    dappMessage = TaskManager.dappsMessage[invokeHistory.domain];
                    task['dappMessage'] = dappMessage;
                    task['invokeHistory'] = invokeHistory;
                    list.push(task);
                }
                else if (task.type == ConfirmType.tranfer && sendHistory) {
                    task['sendHistory'] = sendHistory;
                    list.push(task);
                }
            }
        }
    }
    return list;
};
//# sourceMappingURL=background.js.map