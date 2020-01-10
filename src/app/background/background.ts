///<reference path="../../lib/neo-thinsdk.d.ts"/>

interface BackStore {
    // [name:string]:any
    network: "TestNet" | "MainNet",
    height: number,
    account: AccountInfo,
    domains: string[],
    titles: string[],
    oldUtxo: { [ txid: string ]: number[] },
    allAssetInfo: AssetInfo[],
    accountWaitTaskCount: { [ addr: string ]: number }
}

const storage: BackStore =
{
    network: "TestNet",
    account: undefined,
    height: 0,
    domains: [],
    titles: [],
    oldUtxo: {},
    allAssetInfo: [],
    accountWaitTaskCount: {}
}

var getBlockHeight = () => {
    return storage.height;
}

const netstr = localStorage.getItem('Teemo-NetWork');
storage.network = netstr ? ((netstr == 'TestNet' || netstr == 'MainNet') ? netstr : "TestNet") : "TestNet";

const HASH_CONFIG = {
    ID_CGAS: Neo.Uint160.parse('74f2dc36a68fdc4682034178eb2220729231db76'),
    DAPP_NNC: Neo.Uint160.parse("fc732edee1efdf968c23c20a9628eaa5a6ccb934"),
    baseContract: Neo.Uint160.parse("348387116c4a75e420663277d9c02049907128c7"),
    resolverHash: `6e2aea28af9c5febea0774759b1b76398e3167f1`,
    ID_GAS: "a1760976db5fcdfab2a9930e8f6ce875b2d18225",
    ID_NEO: "43cf98eddbe047e198a3e5d57006311442a0ca15",
    saleContract: Neo.Uint160.parse("1b0ca9a908e07b20469917aed8d503049b420eeb"),
    ID_NNC: Neo.Uint160.parse('fc732edee1efdf968c23c20a9628eaa5a6ccb934'),
    ID_NNK: Neo.Uint160.parse('c36aee199dbba6c3f439983657558cfb67629599'),
}

const baseCommonUrl = "https://apiblockneo3.nel.group/api";
const baseUrl = "https://apiscanneo3.nel.group/api";
const testRpcUrl = "http://seed1t.neo.org:20332";
const mainRpcUrl = "http://seed.nel.group:10332";

const testRpcUrlList = [
    'http://test.nel.group:20332',
    'http://seed5.ngd.network:20332',
    'http://seed2.ngd.network:20332',
    'http://seed4.ngd.network:20332',
    'http://seed3.ngd.network:20332',
    'http://seed9.ngd.network:20332',
    'http://seed8.ngd.network:20332',
]

const mainRpcUrlList = [
    'http://seed.nel.group:10332',
    'http://seed5.ngd.network:10332',
    'http://seed10.ngd.network:10332',
    'http://seed8.ngd.network:10332',
    'http://seed9.ngd.network:10332',
    'http://seed4.neo.org:10332',
    'http://node2.sgp1.bridgeprotocol.io:10332',
]

let testNode: Array<{ node: string, height: number }> = [
    { node: 'http://test.nel.group:20332', height: 0 },
    { node: 'http://seed5.ngd.network:20332', height: 0 },
    { node: 'http://seed2.ngd.network:20332', height: 0 },
    { node: 'http://seed4.ngd.network:20332', height: 0 },
    { node: 'http://seed3.ngd.network:20332', height: 0 },
    { node: 'http://seed9.ngd.network:20332', height: 0 },
    { node: 'http://seed8.ngd.network:20332', height: 0 },
];

let mainNode: Array<{ node: string, height: number }> = [
    { node: 'http://seed.nel.group:10332', height: 0 },
    { node: 'http://seed5.ngd.network:10332', height: 0 },
    { node: 'http://seed10.ngd.network:10332', height: 0 },
    { node: 'http://seed8.ngd.network:10332', height: 0 },
    { node: 'http://seed9.ngd.network:10332', height: 0 },
    { node: 'http://seed4.neo.org:10332', height: 0 },
    { node: 'http://node2.sgp1.bridgeprotocol.io:10332', height: 0 },
];

//除法函数，用来得到精确的除法结果
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果

interface Number {
    add(...arg: number[]): number;
    sub(...arg: number[]): number;
    mul(...arg: number[]): number;
    div(...arg: number[]): number;
}

// 加
Number.prototype.add = function (...arg) {
    var r1, r2, m, result = this;
    arg.forEach(value => {
        try { r1 = result.toString().split(".")[ 1 ].length } catch (e) { r1 = 0 }
        try { r2 = value.toString().split(".")[ 1 ].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2));
        result = Math.round(result * m + value * m) / m;
    });
    return result;
};
// 减
Number.prototype.sub = function (...arg) {
    var r1, r2, m, result = this;
    arg.forEach(value => {
        try { r1 = result.toString().split(".")[ 1 ].length } catch (e) { r1 = 0 }
        try { r2 = value.toString().split(".")[ 1 ].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2));
        var n = (r1 >= r2) ? r1 : r2;
        result = (Math.round(result * m - value * m) / m).toFixed(n);
    });
    return result;
};
// 乘
Number.prototype.mul = function (...arg) {
    var result = this;
    arg.forEach(value => {
        var m = 0, s1 = result.toString(), s2 = value.toString();
        try { m += s1.split(".")[ 1 ].length } catch (e) { }
        try { m += s2.split(".")[ 1 ].length } catch (e) { }
        result = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    });
    return result;
};
// 除
Number.prototype.div = function (...arg) {
    var result = this;
    arg.forEach(value => {
        var t1 = 0, t2 = 0, r1, r2;
        try { t1 = result.toString().split(".")[ 1 ].length } catch (e) { }
        try { t2 = value.toString().split(".")[ 1 ].length } catch (e) { }
        r1 = Number(result.toString().replace(".", ""));
        r2 = Number(value.toString().replace(".", ""));
        result = (r1 / r2) * Math.pow(10, t2 - t1);
    });
    return result;
};

/**
 * 以下是账户所使用到的实体类
 */

class NepAccount {
    index?: number;
    walletName: string;
    address: string;
    nep2key: string;
    scrypt: ThinNeo.nep6ScryptParameters;
    constructor(name: string, addr: string, nep2: string, scrypt: ThinNeo.nep6ScryptParameters, index?: number) {
        this.walletName = name;
        this.address = addr;
        this.nep2key = nep2;
        this.scrypt = scrypt
        if (index !== undefined)
            this.index = index;
    }
}

class AccountInfo extends NepAccount {
    constructor(nepaccount: NepAccount, prikey: Uint8Array, pubkey: Uint8Array) {
        super(nepaccount.walletName, nepaccount.address, nepaccount.nep2key, nepaccount.scrypt, nepaccount.index);
        this.prikeyHex = prikey.toHexString();
        this.pubkeyHex = pubkey.toHexString();
    }
    private _prikey: Uint8Array;
    private _pubkey: Uint8Array;
    public pubkeyHex: string;
    public prikeyHex: string;
    public address: string;

    public getPrikey(): Uint8Array {
        return this.prikeyHex.hexToBytes();
    };

    public set pubkey(v: Uint8Array) {
        this._pubkey = v;
        this.pubkeyHex = v.toHexString();
    }

    public set prikey(v: Uint8Array) {
        this._prikey = v;
        this.prikeyHex = v.toHexString();
    }

    public get pubkey(): Uint8Array {
        this._pubkey = this.pubkeyHex.hexToBytes();
        return this._pubkey;
    }

    public get prikey(): Uint8Array {
        this._prikey = this.prikeyHex.hexToBytes();
        return this._prikey
    }

}

interface LoginInfo {
    pubkey: Uint8Array;
    prikey: Uint8Array;
    address: string;
}

class Storage_local {
    public static setAccount(account: NepAccount) {
        const lang = localStorage.getItem('language');
        const name = (!lang || lang == 'zh') ? '我的钱包' : 'Wallet';
        let arr = Storage_local.getAccount();
        let index: number = -1;
        let newacc = new NepAccount(
            account.walletName,
            account.address,
            account.nep2key,
            account.scrypt)

        if (arr.length) {
            arr = arr.map((acc, n) => {
                if (acc.address === account.address) {
                    newacc.walletName = newacc.walletName ? newacc.walletName : (acc.walletName ? acc.walletName : name + (n + 1));
                    newacc.index = index = n;
                    return newacc;
                }
                return acc;
            });
            if (index < 0) {
                newacc.walletName = newacc.walletName ? newacc.walletName : name + (arr.length + 1);
                arr.push(newacc);
            }
        } else {
            newacc.walletName = newacc.walletName ? newacc.walletName : name + 1;
            arr.push(newacc);
        }

        localStorage.setItem("TeemoWALLET_ACCOUNT", JSON.stringify(arr));
        return newacc;
    }
    public static getAccount() {
        const str = localStorage.getItem("TeemoWALLET_ACCOUNT");
        let accounts = [] as NepAccount[];
        if (str) {
            let arr = accounts.concat(JSON.parse(str));
            for (let index = 0; index < arr.length; index++) {
                const acc = arr[ index ];
                let nep = new NepAccount(acc.walletName, acc.address, acc.nep2key, acc.scrypt, index);
                accounts.push(nep);
            }
        }
        return accounts;
    }
    public static set(key: string, value: any) {
        return new Promise((r, j) => {
            chrome.storage.local.set({ [ key ]: value }, () => { r() })
        })
    };
    public static get<T>(key: string, ): Promise<T> {
        return new Promise<T>((r, j) => {
            chrome.storage.local.get(key, item => {
                r(item ? item[ key ] : undefined);
            })
        })
    }
}

class Transaction extends ThinNeo.Transaction {

    public scriptBuilder: ScriptBuild;

    public contract: ThinSdk.Contract;

    constructor(sender?: string, currentBlockIndex?: number) {
        super();
        this.scriptBuilder = new ScriptBuild();
        this.version = 0;
        const RANDOM_UINT8: Uint8Array = getWeakRandomValues(32);
        const RANDOM_INT: Neo.BigInteger = Neo.BigInteger.fromUint8Array(RANDOM_UINT8);
        this.nonce = RANDOM_INT.toInt32();
        //this.tran.nonce = 12121;
        this.sender = Neo.Uint160.parse(ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(sender).toHexString());
        this.validUntilBlock = currentBlockIndex + ThinNeo.Transaction.MaxValidUntilBlockIncrement;
        const cosigner = new Neo.Cosigner()
        cosigner.scopes = Neo.WitnessScope.CalledByEntry;
        cosigner.account = this.sender;
        this.cosigners = [ cosigner ];
        this.attributes = [];
        this.systemFee = Neo.Long.ZERO;
        this.networkFee = Neo.Long.ZERO;
    }

    // 记算网络费
    public calculateNetworkFee() {
        const count = ThinSdk.ApplicationEngine[ ThinNeo.OpCode.PUSHBYTES64 ] + ThinSdk.ApplicationEngine[ ThinNeo.OpCode.PUSHBYTES33 ] + 1000000;
        // 记算网络费
        const networkFee = Neo.Long.ZERO.add(this.GetMessage().length).add(107).mul(1000).add(count);
        return networkFee
    }

    // 获得系统费
    public async getSystemFee() {
        const hexdata = this.script.toHexString();
        const result = await Api.getInvokeRead(hexdata);
        const sysfee = result[ 'gas_consumed' ] ? parseFloat(result[ 'gas_consumed' ]) : 0;
        return Neo.Long.fromNumber(Math.ceil(sysfee / 100000000) * 100000000);
    }

    public pack(sysFee: number, netFee: number) {
        this.script = this.scriptBuilder.ToArray();
        var networkFee = ThinSdk.ApplicationEngine[ ThinNeo.OpCode.PUSHBYTES64 ] + ThinSdk.ApplicationEngine[ ThinNeo.OpCode.PUSHBYTES33 ] + 1000000;
        // 记算网络费
        this.networkFee = Neo.Long.ZERO.add(this.GetMessage().length).add(107).mul(1000).add(networkFee);

        // 计算系统费  目前系统费取整 0.1就是1  1.1就是2
        this.systemFee = Neo.Long.fromNumber(Math.ceil(sysFee / 100000000) * 100000000);

        // 判断网络费参数是否大于记算值，大于则用参数，小于则用记算值
        this.networkFee = this.networkFee.comp(netFee) > 0 ? this.networkFee : Neo.Long.fromValue(netFee.mul(100000000));

        return { networkFee: this.networkFee, systemFee: this.systemFee }
    }

    public signAndPack(prikey: Uint8Array) {
        this.script = this.scriptBuilder.ToArray();
        var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
        var address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
        // var witness_script = ThinNeo.Helper.GetAddressCheckScriptFromPublicKey(pubkey);
        // if (witness_script.isSignatureContract() || true)// 判断是否为合约签名 现在默认都是 这里要重整下的
        // {
        //     var networkFee = ThinSdk.ApplicationEngine[ ThinNeo.OpCode.PUSHBYTES64 ] + ThinSdk.ApplicationEngine[ ThinNeo.OpCode.PUSHBYTES33 ] + 1000000;
        // }
        // else {
        //     // 这里本是判断多签来记算 网络费的，暂且不考虑多签的情况
        // }

        // // 记算网络费
        // this.networkFee = Neo.Long.ZERO.add(this.GetMessage().length).add(107).mul(1000).add(networkFee);

        // // 计算系统费  目前系统费取整 0.1就是1  1.1就是2
        // this.systemFee = Neo.Long.fromNumber(Math.ceil(sysFee / 100000000) * 100000000);

        // this.networkFee = this.networkFee.comp(netFee) > 0 ? this.networkFee : Neo.Long.fromValue(netFee.mul(100000000));
        //var str = data.toHexString();
        //console.log("msg str",str)
        //var data2 = this.tran.GetMessage();
        //console.log("Transaction Message ", data2.toHexString())

        //console.log("GetMessage", this.tran.GetMessage().toHexString());
        var data = this.GetMessage()
        var signData = ThinNeo.Helper.Sign(data, prikey);
        var b = ThinNeo.Helper.VerifySignature(data, signData, pubkey);
        if (!b) throw new Error("sign error")
        this.AddWitness(signData, pubkey, address);
        var rawData = this.GetRawData();
        return rawData;
    }

    public getTxid() {
        return this.GetTxid();
    }

}

const makeRpcPostBody = (method, params) => {
    const body = {};
    body[ "jsonrpc" ] = "2.0";
    body[ "id" ] = 1;
    body[ "method" ] = method;
    body[ "params" ] = params;
    return JSON.stringify(body);
}

interface IOpts {
    method: string; // 接口名
    params: any[]; // 参数
    isGET?: boolean; // 是否是get 请求（默认请求是post）
    baseUrl?: 'common' | 'rpc'; // 如果是common 则 取 baseCommonUrl（默认 baseUrl）
    otherUrl?: string;
    getAll?: boolean; // 是否获取所有返回结果
    network?: "TestNet" | "MainNet";
    getNode?: boolean;

}

const makeRpcUrl = (url, method, params) => {
    if (url[ url.length - 1 ] != '/')
        url = url + "/";
    var urlout = url + "?jsonrpc=2.0&id=1&method=" + method + "&params=" + JSON.stringify(params);
    return urlout;
}

/**
 * api 请求方法
 * @param opts 请求参数
 */
async function request(opts: IOpts) {
    // 判断当前网络
    let network = opts.network ? opts.network : storage.network;
    let url = '';
    // 筛选节点
    if (opts.otherUrl) {
        url = opts.otherUrl;
    } else if (opts.baseUrl === 'common') {
        url = [ baseCommonUrl, network == "TestNet" ? "testnet" : "mainnet" ].join('/');
    } else if (opts.baseUrl === 'rpc') {
        url = network == "TestNet" ? testRpcUrl : mainRpcUrl;
    } else {
        url = [ baseUrl, network == "TestNet" ? "testnet" : "mainnet" ].join('/');
    }

    const input = opts.isGET ? makeRpcUrl(url, opts.method, opts.params) : url;
    const init: RequestInit = opts.isGET ? { method: 'GET' } : { method: 'POST', body: makeRpcPostBody(opts.method, opts.params) };
    try {
        const value = await fetch(input, init);
        const json = await value.json();
        if (json.result) {
            if (opts.getAll) {
                return json
            }
            else {
                const result = opts.getNode ? { nodeUrl: url, data: json.result } : json.result;
                return result;
            }
        }
        else if (json.error[ "code" ] === -1 || json.error[ 'code' ] === -100) {
            return null;
        }
        else {
            throw new Error(JSON.stringify(json.error));
        }
    }
    catch (error) {
        console.log("网络请求异常 请求参数：", opts);
        throw error;
    }
}

const Api = {
    getAssetState: (assetID: string) => {
        return request({
            method: "getassetstate",
            params: [ assetID ],
            baseUrl: 'rpc'
        })
    },

    getStorage: (scriptHash: string, key: string) => {
        return request({
            method: "getstorage",
            params: [ scriptHash, key ],
            baseUrl: "rpc"
        })
    },

    getcontractstate: (scriptaddr: string) => {
        return request({
            method: "getcontractstate",
            params: [ scriptaddr ],
            baseUrl: "common"
        })
    },

    getavailableutxos: (address: string, count: number) => {
        return request({
            method: "getavailableutxos",
            params: [ address, count ],
        })
    },

    getInvokeRead: (scriptHash: string, network?: 'TestNet' | 'MainNet') => {
        const opts: IOpts = {
            method: 'invokescript',
            params: [ scriptHash ],
            baseUrl: 'rpc',
            network
        }
        return request(opts)
    },

    /**
     * 获取nep5的资产（CGAS）
     */
    getnep5balanceofaddress: (address, assetId) => {
        const opts: IOpts = {
            method: 'getnep5balanceofaddress',
            params: [
                assetId,
                address
            ],
            baseUrl: 'common'
        }
        return request(opts);
    },

    /**
     * 获取nep5的资产（CGAS）
     */
    getallasset: () => {
        const opts: IOpts = {
            method: 'getallasset',
            params: [],
            baseUrl: 'common'
        }
        return request(opts);
    },

    /**
     * 获取nep5的资产（CGAS）
     */
    getallnep5asset: () => {
        const opts: IOpts = {
            method: 'getallnep5asset',
            params: [],
            baseUrl: 'common'
        }
        return request(opts);
    },

    /**
     * 获取nep5的资产（CGAS）
     */
    getallnep5assetofaddress: (address) => {
        const opts: IOpts = {
            method: 'getallnep5assetofaddress',
            params: [
                address, 1
            ],
            baseUrl: 'common'
        }
        return request(opts);
    },

    /**
     * 获取nep5的资产（CGAS）
     */
    getUtxoBalance: (address, assetId) => {
        const opts: IOpts = {
            method: 'getnep5balanceofaddress',
            params: [
                assetId,
                address
            ],
            baseUrl: 'common'
        }
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

    sendrawtransaction: (data, network?: 'TestNet' | 'MainNet') => {
        const opts: IOpts = {
            method: 'sendrawtransaction',
            params: [ data ],
            baseUrl: 'rpc',
            getNode: true,
            network
        }
        return request(opts);
    },

    getUtxo: (address) => {
        const opts: IOpts = {
            method: "getutxo",
            params: [ address ],
            baseUrl: 'common'
        }
        return request(opts);
    },

    getDomainInfo: (domain) => {
        return request({
            method: "getdomaininfo",
            params: [ domain ],
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
            params: [ txid ]
        }
        return request(opts);
    },

    getrawtransaction: (txid, network?: 'TestNet' | 'MainNet') => {
        const opts: IOpts = {
            method: "getrawtransaction",
            params: [ txid, 1 ],
            baseUrl: 'rpc',
            network
        }
        return request(opts);
    },

    /**
     * 
     */
    getrawtransaction_api: (txid) => {
        return request(
            {
                method: "getrawtransaction",
                params: [ txid ],
                baseUrl: 'common'
            }
        )
    },

    /**
     * 判断合约调用是否抛出 notify
     * @param txid 交易id
     */
    hasContract: (txid) => {
        const opts = {
            method: "hascontract",
            params: [ txid ]
        }
        return request(opts);
    },

    /**
     * 判断双交易是否成功
     * @param txid 交易id
     */
    getRehargeAndTransfer: (txid) => {
        const opts = {
            method: "getrechargeandtransfer",
            params: [ txid ]
        }
        return request(opts);
    },

    getBlockCount: (rpc?: string) => {
        const opts: IOpts = {
            method: "getblockcount",
            params: [],
            otherUrl: rpc,
            baseUrl: "rpc"
        }
        return request(opts);
    },

    getBalance: (addr) => {
        const opts: IOpts = {
            method: "getbalance",
            params: [ addr ],
            baseUrl: "common"
        }
        return request(opts);
    },

    rechargeAndTransfer: (data1, data2) => {
        const opts = {
            method: "rechargeandtransfer",
            params: [
                data1,
                data2
            ]
        }
        return request(opts);
    },

    /**
     * @method 获得nep5资产信息
     * @param asset 资产id
     */
    getnep5asset: (asset) => {
        const opts = {
            method: "getnep5asset",
            params: [ asset ]
        }
        return request(opts);
    },

    getBlock: (height: number) => {
        return request({
            method: 'getblock',
            params: [ height, 1 ],
            baseUrl: 'rpc'
        })
    },

    getApplicationLog: (txid: string) => {
        return request({
            // method:'getapplicationlog',
            // params:[txid],
            // baseUrl:'rpc'

            method: 'getnotify',
            params: [ txid ],
            baseUrl: 'common'
        })
    },

    /**
     * 获得claimgas的utxo
     * @param address 地址
     * @param type 类型 1:不可领取；其余：可领取
     * @param page 页数
     * @param size 每页条数
     */
    getClaimgasUtxoList: (address: string, type: number, page: number, size: number, network?: 'MainNet' | 'TestNet') => {
        return request({
            method: 'getclaimgasUtxoList',
            params: [ address, type, page, size ],
            baseUrl: 'common',
            network
        })
    },

    getclaimgas: (address: string, type: number, size: number, hide: number) => {
        return request({
            method: 'getclaimgas',
            params: [ address, type, size, hide ],
            baseUrl: 'common',
        })
    }

}

async function networkSort() {
    for (let index = 0; index < testNode.length; index++) {
        const node = testNode[ index ].node;
        try {
            const result = await Api.getBlockCount(node)
            const height = (parseInt(result) - 1);
            testNode[ index ] = { node, height };
        } catch (error) {
            console.log("异常测试节点", node);
        }
    }
    testNode = testNode.sort((b, a) => {
        return a.height - b.height;
    })

    for (let index = 0; index < mainNode.length; index++) {
        const node = mainNode[ index ].node;
        try {
            const result = await Api.getBlockCount(node)
            const height = (parseInt(result) - 1);
            mainNode[ index ] = { node, height };
        } catch (error) {
            console.log("异常主网节点", node);
        }
    }
    mainNode = mainNode.sort((b, a) => {
        return a.height - b.height;
    })
    // console.log('main rpc node',mainNode);

    // console.log('test rpc node',testNode);
}
// networkSort();

const setContractMessage = (txid: string, domain: string, data) => {
    Storage_local.get("invoke-message")
        .then(result => {
            if (result) {
                result[ txid ] = { domain, data }
                Storage_local.set("invoke-message", { result })
            }
            else {
                let message = {};
                message[ txid ] = { domain, data }
                Storage_local.set("invoke-message", { message })
            }
        })
}

const getWeakRandomValues = (array: number | Uint8Array) => {
    let buffer = typeof array === "number" ? new Uint8Array(array) : array;
    for (let i = 0; i < buffer.length; i++)
        buffer[ i ] = Math.random() * 256;
    return buffer;
}

class ScriptBuild extends ThinNeo.ScriptBuilder {
    constructor() {
        super();
    }

    EmitParam(param: Argument, hookTxid?: string) {
        let hex: Uint8Array;
        switch (param.type) {
            case ArgumentDataType.STRING:
                this.EmitPushString(param.value as string);
                break;
            case ArgumentDataType.INTEGER:
                const num = new Neo.BigInteger(param.value as string);
                this.EmitPushNumber(num);
                break;
            case ArgumentDataType.HASH160:
                hex = (param.value as string).hexToBytes();
                if (hex.length !== 20) {
                    throw new Error("not a hex160");
                }
                this.EmitPushBytes(hex.reverse());
                break;
            case ArgumentDataType.HASH256:
                hex = (param.value as string).hexToBytes();
                if (hex.length !== 32) {
                    throw new Error("not a hex256");
                }
                this.EmitPushBytes(hex.reverse());
                break;
            case ArgumentDataType.BYTEARRAY:
                hex = (param.value as string).hexToBytes();
                this.EmitPushBytes(hex);
                break;
            case ArgumentDataType.ADDRESS:
                hex = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(param.value as string);
                this.EmitPushBytes(hex);
                break;
            case ArgumentDataType.ARRAY:
                const argument = param.value as Argument[];
                for (let i = argument.length - 1; i >= 0; i--) {
                    this.EmitParam(argument[ i ]);
                }
                this.EmitPushNumber(new Neo.BigInteger(argument.length));
                this.Emit(ThinNeo.OpCode.PACK);
                break;
            default:
                throw new Error("No parameter of this type");
        }
        return this;
    }

    /**
     * 
     * @param argument 参数数组 
     * @param hookTxid 关联交易id
     */
    EmitArguments(argument: Argument[], hookTxid?: string): ThinNeo.ScriptBuilder {
        for (let i = argument.length - 1; i >= 0; i--) {
            const param = argument[ i ];
            switch (param.type) {
                case ArgumentDataType.STRING:
                    this.EmitPushString(param.value as string);
                    break;
                case ArgumentDataType.INTEGER:
                    var num = new Neo.BigInteger(param.value as string);
                    this.EmitPushNumber(num);
                    break;
                case ArgumentDataType.HASH160:
                    var hex = (param.value as string).hexToBytes();
                    if (hex.length != 20)
                        throw new Error("not a hex160");
                    this.EmitPushBytes(hex.reverse());
                    break;
                case ArgumentDataType.HASH256:
                    var hex = (param.value as string).hexToBytes();
                    if (hex.length != 32)
                        throw new Error("not a hex256");
                    this.EmitPushBytes(hex.reverse());
                    break;
                case ArgumentDataType.BYTEARRAY:
                    var hex = (param.value as string).hexToBytes();
                    this.EmitPushBytes(hex);
                    break;
                case ArgumentDataType.BOOLEAN:
                    var num = new Neo.BigInteger(param.value ? 1 : 0);
                    this.EmitPushNumber(num);
                    break;
                case ArgumentDataType.ADDRESS:
                    var hex = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(param.value as string);
                    this.EmitPushBytes(hex);
                    break;
                case ArgumentDataType.HOOKTXID:
                    if (hookTxid) {
                        var hex = hookTxid.hexToBytes();
                        this.EmitPushBytes(hex.reverse());
                    } else {
                        this.EmitSysCall("System.ExecutionEngine.GetScriptContainer");
                        this.EmitSysCall("Neo.Transaction.GetHash");
                    }
                    break;
                case ArgumentDataType.ARRAY:
                    this.EmitArguments(param.value as Argument[]);
                    break;
                default:
                    throw new Error("No parameter of this type");
            }
        }
        this.EmitPushNumber(new Neo.BigInteger(argument.length));
        this.Emit(ThinNeo.OpCode.PACK);
        return this;
    }

    EmitInvokeArgs(data: InvokeInput | InvokeInput[], hookTxid?: string) {
        const invokes = Array.isArray(data) ? data : [ data ];
        // const RANDOM_UINT8: Uint8Array = getWeakRandomValues(32);
        // const RANDOM_INT: Neo.BigInteger = Neo.BigInteger.fromUint8Array(RANDOM_UINT8);
        // // 塞入随机数
        // this.EmitPushNumber(RANDOM_INT);  // 将随机数推入栈顶
        // this.Emit(ThinNeo.OpCode.DROP);   // 打包

        for (let index = 0; index < invokes.length; index++) {
            const invoke = invokes[ index ];
            if (invoke.arguments && invoke.arguments.length > 0) {
                this.EmitArguments(invoke.arguments, hookTxid);    // 调用EmitArguments方法编译并打包参数
            } else {
                this.EmitPushNumber(Neo.BigInteger.Zero);
                this.Emit(ThinNeo.OpCode.NEWARRAY);
            }
            this.EmitPushString(invoke.operation) // 塞入方法名
            this.EmitPushBytes(new Uint8Array(Neo.Uint160.parse(invoke.scriptHash).bits.buffer));
            this.EmitSysCall("System.Contract.Call");
            // if (invokes.length > 1 && index < invokes.length - 1) {
            //     this.Emit(ThinNeo.OpCode.ADD);
            // }
        }
        return this.ToArray();
    }
}

/**
 * 构造合约调用交易
 * @param invoke invoke调用参数
 */
var contractBuilder = async (invokeArgs: InvokeArgs) => {
    try {
        let tran = new Transaction(storage.account.address, storage.height);
        tran.scriptBuilder.EmitInvokeArgs(invokeArgs);
        const sysfee = invokeArgs.systemFee ? parseFloat(invokeArgs.systemFee) : 0;
        const netfee = invokeArgs.networkFee ? parseFloat(invokeArgs.networkFee) : 0;
        tran.systemFee = Neo.Long.fromNumber(sysfee.mul(100000000));
        tran.networkFee = Neo.Long.fromNumber(netfee.mul(100000000));
        // tran.setScript(script.ToArray(), sysfee);    // 添加系统费
        if (invokeArgs.attachedAssets) {
            for (const asset in invokeArgs.attachedAssets) {
                const toaddr = ThinNeo.Helper.GetAddressFromScriptHash(Neo.Uint160.parse(invokeArgs.scriptHash));
                const amount = parseFloat(invokeArgs.attachedAssets[ asset ]);
                const token = new ThinSdk.Token.BaseToken(Neo.Uint160.parse(asset), tran.scriptBuilder);
                token.transfer(storage.account.address, toaddr, amount);
            }
        }
        const data = tran.signAndPack(storage.account.prikeyHex.hexToBytes());
        const txid = tran.getTxid();
        let result = await Api.sendrawtransaction(data.toHexString(), invokeArgs.network);
        TaskManager.addTask(new Task(ConfirmType.contract, txid));

        const output = { txid, nodeUrl: "" };
        if (result[ 'data' ]) {
            output[ "nodeUrl" ] = result.nodeUrl;
        } else {
            throw { type: "RPC_ERROR", description: 'An RPC error occured when submitting the request', data: result[ 0 ].errorMessage };
        }
        return output;
    }
    catch (error) {
        throw error;
    }
}

// const deploy = async (params: DeployContractArgs) => {
//     const amount = (params.call ? 500 : 0) + (params.storage ? 400 : 0) + 90;
//     const num = (params.storage ? 1 : 0) | (params.call ? 2 : 0) | (params.payment ? 4 : 0);
//     const sb = new ThinNeo.ScriptBuilder();
//     sb.EmitPushString(params.description);
//     sb.EmitPushString(params.email);
//     sb.EmitPushString(params.author);
//     sb.EmitPushString(params.version);
//     sb.EmitPushString(name);
//     sb.EmitPushNumber(new Neo.BigInteger(num));
//     sb.EmitPushBytes("05".hexToBytes());
//     sb.EmitPushBytes("0710".hexToBytes());
//     sb.EmitPushBytes(params.avmhex.hexToBytes());
//     sb.EmitSysCall("Neo.Contract.Create");

//     const utxos = await MarkUtxo.getAllUtxo();
//     const gass = utxos[ HASH_CONFIG.ID_GAS ];
//     const consume = Neo.Fixed8.fromNumber(amount);
//     const newFee = consume.add(Neo.Fixed8.fromNumber(11));  //在原有的基础上加11个gas

//     const tran = new Transaction()
//     tran.setScript(sb.ToArray(), consume);
//     try {
//         tran.creatInuptAndOutup(gass, newFee);
//     } catch (error) {
//         throw "You don't have enough utxo;";
//     }
//     tran.version = 1;
//     try {
//         let result = await transactionSignAndSend(tran);
//         TaskManager.addTask(new Task(ConfirmType.deploy, result.txid));
//         return result;
//     } catch (error) {
//         throw error;
//     }
//     // if (data.length > 102400)
//     // {
//     //     throw new Error("TRANSACTION_LARGE");
//     // }
//     // const result = await tools.wwwtool.api_postRawTransaction(data);
// }

/**
 * 打包合并交易
 * @param data 合并合约调用参数
 */
const invokeGroupBuild = async (data: InvokeGroup) => {
    // 判断merge的值
    if (data.merge) {
        const tran = new Transaction(storage.account.address, storage.height);
        for (let index = 0; index < data.group.length; index++) {
            const invoke = data.group[ index ];
            if (invoke.attachedAssets) {
                for (const asset in invoke.attachedAssets) {
                    const toaddr = ThinNeo.Helper.GetAddressFromScriptHash(Neo.Uint160.parse(invoke.scriptHash));
                    const amount = parseFloat(invoke.attachedAssets[ asset ]);
                    const token = new ThinSdk.Token.BaseToken(Neo.Uint160.parse(asset), tran.scriptBuilder);
                    token.transfer(storage.account.address, toaddr, amount);
                }
            }
        }
        tran.scriptBuilder.EmitInvokeArgs(data.group);
        tran.script = tran.scriptBuilder.ToArray();
        const systemFee = await tran.getSystemFee();
        const networkFee = tran.calculateNetworkFee();
        tran.systemFee = Neo.Long.fromValue(parseFloat(data.group[ 0 ].systemFee).mul(100000000));
        tran.networkFee = Neo.Long.fromValue(parseFloat(data.group[ 0 ].networkFee).mul(100000000));
        const trandata = tran.signAndPack(storage.account.prikeyHex.hexToBytes());
        try {
            const result = await Api.sendrawtransaction(trandata.toHexString());
            const txid = tran.getTxid();
            TaskManager.addTask(
                new Task(
                    ConfirmType.contract,
                    txid.replace('0x', ''),
                )
            )
            const output = { txid, nodeUrl: "" };
            if (result[ 'data' ]) {
                output[ "nodeUrl" ] = result.nodeUrl;
            } else {
                throw { type: "RPC_ERROR", description: 'An RPC error occured when submitting the request', data: result.errorMessage };
            }
            return [ output ];
        } catch (error) {
            throw error
        }

        // let netfee: Neo.Fixed8 = Neo.Fixed8.Zero;
        // let sysfee: Neo.Fixed8 = Neo.Fixed8.Zero;
        // let tran = new Transaction();
        // // let script = groupScriptBuild(data.group);
        // // let transfer:{[asset: string]:{}}=null // 用来存放 将要转账的合约地址 资产id 数额
        // // let utxos = await MarkUtxo.getUtxoByAsset(HASH_CONFIG.ID_GAS);
        // // let assets:{[asset:string]:string};
        // for (let index = 0; index < data.group.length; index++) // 循环算utxo资产对应的累加和相对应每笔要转走的money
        // {
        //     const invoke = data.group[ index ];
        //     if (invoke.fee)  // 判断是否有手续费
        //         netfee = netfee.add(Neo.Fixed8.parse(invoke.fee)) // 计算总共耗费多少手续费;
        //     if (invoke.sys_fee)
        //         sysfee = sysfee.add(Neo.Fixed8.parse(invoke.sys_fee))
        // }
        // tran.scriptBuilder.EmitInvokeArgs(data.group)
        // if (sysfee.compareTo(Neo.Fixed8.Zero) > 0) {
        //     // tran.setScript(script.ToArray(), sysfee);
        //     netfee = netfee.add(sysfee);
        // }
        // else {
        //     // tran.setScript(script.ToArray());
        // }
        // if (netfee.compareTo(Neo.Fixed8.Zero) > 0) {
        //     // tran.creatInuptAndOutup(utxos, netfee)
        // }
        // try {
        //     let result = await transactionSignAndSend(tran);
        //     TaskManager.addTask(
        //         new Task(
        //             ConfirmType.contract,
        //             result.txid.replace('0x', ''),
        //         )
        //     )
        //     return [ result ];
        // } catch (error) {
        //     throw error
        // }
    }
    else {
        let txids: InvokeOutput[] = []
        let trans: TransferGroup[] = [];
        for (let index = 0; index < data.group.length; index++) {
            const invoke = data.group[ index ];

            if (index == 0) {
                try {
                    let result = await contractBuilder(invoke);
                    txids.push(result);
                } catch (error) {
                    throw error;
                }
            }
            else {
                // let utxos = await MarkUtxo.getUtxoByAsset(HASH_CONFIG.ID_GAS);
                let tran = new Transaction();
                tran.scriptBuilder.EmitInvokeArgs(invoke, txids[ 0 ].txid);
                // if (invoke.fee && invoke.fee != '0')
                //     tran.creatInuptAndOutup(utxos, Neo.Fixed8.parse(invoke.fee));
                tran.script = tran.scriptBuilder.ToArray();
                const signdata = tran.signAndPack(storage.account.prikeyHex.hexToBytes());
                const nextTran = new TransferGroup()
                nextTran.txhex = signdata.toHexString();
                nextTran.txid = tran.getTxid();
                txids.push({ txid: nextTran.txid, nodeUrl: storage.network == 'TestNet' ? testRpcUrl : mainRpcUrl });
                trans.push(nextTran);
                // MarkUtxo.setMark(tran.marks);
            }
        }
        TaskManager.shed[ txids[ 0 ].txid ].next = trans[ 0 ];
        // const task = new Task(ConfirmType.contract,txids[0].txid.replace('0x',''),trans[0],TaskState.watting);
        // TaskManager.addTask(task);
        for (let index = 0; index < trans.length; index++) {
            const tran = trans[ index ];
            if (index < (trans.length - 1)) {
                TaskManager.addTask(new Task(
                    ConfirmType.contract, tran.txid, trans[ index + 1 ], TaskState.watForLast
                ))
            } else {
                TaskManager.addTask(new Task(
                    ConfirmType.contract, tran.txid, undefined, TaskState.watForLast
                ))
            }
        }
        return txids;
    }
}


/**
 * 发送
 * @param trans 
 */
const sendGroupTranstion = (trans: Transaction[]) => {
    return new Promise<InvokeOutput[]>((resolve, reject) => {
        let outputs: InvokeOutput[] = [];
        for (let index = 0; index < trans.length; index++) {
            const tran = trans[ index ];
            const message = tran.GetMessage().clone();
            const signdata = ThinNeo.Helper.Sign(message, storage.account.prikey);
            tran.AddWitness(signdata, storage.account.pubkey, storage.account.address);
            // const data:Uint8Array = tran.GetRawData();
            outputs.push({ "txid": tran.getTxid(), nodeUrl: "https://api.nel.group/api" });
        }
    })
}

interface AssetInfo {
    assetid: string;
    type: 'nep5' | 'utxo';
    symbol: string;
    name: string;
    decimals: number;
}

interface Nep5AssetInfo {
    assetid: string;
    totalsupply: string;
    name: string;
    symbol: string;
    decimals: number;
}

interface UtxoAssetInfo {
    version: number,
    id: string,
    type: string,
    name:
    {
        lang: string,
        name: string
    }[],
    amount: string,
    available: string,
    precision: number,
    owner: string,
    admin: string,
    issuer: string,
    expiration: number,
    frozen: boolean
}


const transactionSignAndSend = async (tran: Transaction, net?: 'TestNet' | 'MainNet') => {
    console.log(tran.GetMessage().length.div(100000).add(0.001));

    const message = tran.GetMessage().clone();
    console.log('签名前交易大小', message.length);

    const signdata = ThinNeo.Helper.Sign(message, storage.account.prikey);
    tran.AddWitness(signdata, storage.account.pubkey, storage.account.address);
    const data: Uint8Array = tran.GetRawData();
    const txid = tran.getTxid();
    console.log('签名后交易大小', data.length);
    // 签名的大小是103字节

    try {
        // console.log(`Time:${new Date().getTime()} Txid ${txid}`,data.toHexString());
        // console.log('交易体结构',tran);
        // if(data.length>=1024)
        // {
        //     throw {type:"TRANSACTION_ERROR",description:'TX size is over 1024byte'}            
        // }
        const result = await Api.sendrawtransaction(data.toHexString(), net);
        if (result[ 'data' ]) {
            // MarkUtxo.setMark(tran.marks);
            const nodeUrl: string = result.nodeUrl;
            let ouput: InvokeOutput = { txid, nodeUrl }
            return ouput;
        }
        else {
            throw { type: "RPC_ERROR", description: 'An RPC error occured when submitting the request', data: result[ 0 ].errorMessage };
        }

    } catch (error) {
        // console.log('异常claimed交易体Hex',data.toHexString());
        // console.log('异常交易体',tran);
        console.error(error);
        throw error;
    }
}

interface NotifyMessage {
    header: {
        title: string,
        domain: string,
        icon?: string
    },
    account?: {
        address: string,
        walletName: string,
    },
    lable: Command
    data?: any
}

/**
 * 打开notify页面并传递信息，返回调用
 * @param call 回调方法
 * @param data 通知信息 
 */
const openNotify = (notifyData: NotifyMessage, getData?: Promise<any>): Promise<any> => {
    if (notifyData) {
        return new Promise((resolve, reject) => {
            const mark = getMessageID();
            const { domain, title, icon } = notifyData.header;
            const urldata = `?mark=${mark}&label=${notifyData.lable}&domain=${domain}&title=${title}&icon=${icon}`;
            const notify = window.open(
                'notify.html' + urldata,
                '_blank',
                'height=636px, width=391px, top=150, left=100, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no'
            )
            let state = "";
            let args;
            if (getData) {
                getData.then(data => {
                    args = data;
                    window.postMessage({ notifyID: mark, notifyData: data }, "*");
                }).catch(err => {
                    clearInterval(loop)
                    // notify.removeEventListener("message", e => {}, false);
                    notify.opener = null;
                    notify.open('', '_self');
                    notify.close();
                    reject(err);
                })
            }

            // window.addEventListener("request", (data: CustomEvent) => {
            //     console.log(data.detail);
            // })

            window.addEventListener("message", e => {
                const response = e.data
                if (response.notifyID && response.notifyID === mark) {
                    if (response.state == "confirm") {
                        state = 'confirm';
                        clearInterval(loop)
                        // notify.removeEventListener("message", e => {}, false);
                        notify.opener = null;
                        notify.open('', '_self');
                        notify.close();
                        resolve(args ? args : true);
                    }
                    if (response.state == "cancel") {
                        state = 'cancel';
                        clearInterval(loop)
                        notify.opener = null;
                        notify.open('', '_self');
                        notify.close();
                        reject({ type: 'CANCELED', description: 'The user cancels, or refuses the dapps request' });
                    }
                    if (response.state == "getData" && args) {
                        window.postMessage({ notifyID: mark, notifyData: args }, "*");
                    }
                }
            })
            //获得关闭事件
            let loop = setInterval(() => {
                // 设置一个interval,每隔1s去执行一次,为子页面添加opener属性值,获取到子页面已经关闭,则清除interval
                if ("complete" == notify.document.readyState) {
                    notify.opener = window;
                }
                if (notify.closed && state === "") {
                    state = 'cancel';
                    clearInterval(loop);
                    reject({ type: 'CANCELED', description: 'The user cancels, or refuses the dapps request' });
                }
            }, 1000);
        })
    }
}
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
}

/**
 * 请求账户信息
 */
const getAccount = () => {
    return new Promise((resolve, reject) => {
        if (storage.account) {
            resolve({
                address: storage.account.address,
                label: storage.account.walletName
            })
        } else {
            reject({
                type: "AccountError",
                description: "Account not logged in"
            });
        }
    })
}

const calculateInvokeGroup = async (params: InvokeGroup) => {
    if (params.merge) {
        const tran = new Transaction(storage.account.address, storage.height);
        let sysfee = 0;
        let netfee = 0;
        for (let index = 0; index < params.group.length; index++) {
            const invoke = params.group[ index ];
            tran.scriptBuilder.EmitInvokeArgs(invoke);
            sysfee += parseFloat(invoke.systemFee);
            netfee += parseFloat(invoke.networkFee);
            params.group[ index ].systemFee = "0";
            params.group[ index ].networkFee = "0";
        }
        tran.script = tran.scriptBuilder.ToArray();
        const systemFee = await tran.getSystemFee();
        const networkFee = tran.calculateNetworkFee();
        params.group[ 0 ].systemFee = sysfee.mul(100000000) > systemFee.toNumber() ? sysfee.toString() : systemFee.toNumber().div(100000000).toString();
        params.group[ 0 ].networkFee = netfee.mul(100000000) > networkFee.toNumber() ? netfee.toString() : networkFee.toNumber().div(100000000).toString();
    }
    else {
        for (let index = 0; index < params.group.length; index++) {
            const tran = new Transaction(storage.account.address, storage.height);
            const invoke = params.group[ index ];
            tran.scriptBuilder.EmitInvokeArgs(invoke);
            tran.script = tran.scriptBuilder.ToArray();
            const systemFee = await tran.getSystemFee();
            const networkFee = tran.calculateNetworkFee();
            params.group[ index ].systemFee = parseFloat(invoke.systemFee).mul(100000000) > systemFee.toNumber() ? invoke.systemFee : systemFee.toNumber().div(100000000).toString();
            params.group[ index ].networkFee = parseFloat(invoke.networkFee).mul(100000000) > networkFee.toNumber() ? invoke.networkFee : networkFee.toNumber().div(100000000).toString();
        }
    }
    return params;
}

/**
 * invokeGroup 合约调用
 * @param title 请求的网页信息
 * @param data 传递的数据
 */
const invokeGroup = async (header, params: InvokeGroup) => {
    const data: NotifyMessage = {
        lable: Command.invokeGroup,
        data: params,
        header
    }
    try {
        const resultData = await openNotify(data, calculateInvokeGroup(params));
        if (resultData) {
            const result = await invokeGroupBuild(resultData);
            if (params.merge) {
                TaskManager.addInvokeData(result[ 0 ].txid, header.domain, params.group);
            }
            else {
                for (const key in result) {
                    const output = result[ key ];
                    TaskManager.addInvokeData(output.txid, header.domain, params.group[ key ]);
                }
                // result.forEach((output, index, ) => {
                //     TaskManager.addInvokeData(output.txid, header.domain, params.group[ index ]);
                // });
            }
            return result;
        }
    } catch (error) {
        throw error;
    }
    // return new Promise((resolve, reject) => {
    //     const data: NotifyMessage = {
    //         lable: Command.invokeGroup,
    //         data: params,
    //         header
    //     }
    //     openNotify(data)
    //         .then(confrim => {
    //             Storage_local.get('checkNetFee')
    //                 .then(check => {
    //                     Storage_local.set('checkNetFee', false);
    //                     if (params.merge) {
    //                         let fee = Neo.Fixed8.Zero;
    //                         for (const invoke of params.group) {
    //                             fee = fee.add(Neo.Fixed8.parse(invoke.fee ? invoke.fee : '0'))
    //                         }
    //                         if (fee.compareTo(Neo.Fixed8.Zero) === 0) {
    //                             params.group[ 0 ].fee = check ? '0.001' : '0';
    //                         }
    //                     }
    //                     else if (check) {
    //                         for (let index = 0; index < params.group.length; index++) {
    //                             const invoke = params.group[ index ];
    //                             const netfee = Neo.Fixed8.parse(invoke.fee ? invoke.fee : '0');
    //                             if (netfee.compareTo(Neo.Fixed8.Zero) === 0) {
    //                                 params.group[ index ].fee = '0.001';
    //                             }
    //                         }
    //                     }
    //                     invokeGroupBuild(params)
    //                         .then(result => {
    //                             if (params.merge) {
    //                                 TaskManager.addInvokeData(result[ 0 ].txid, header.domain, params.group);
    //                             } else {
    //                                 result.forEach((output, index, ) => {
    //                                     TaskManager.addInvokeData(output.txid, header.domain, params.group[ index ]);
    //                                 });
    //                             }
    //                             resolve(result);
    //                         })
    //                         .catch(error => {
    //                             reject(error);
    //                         })
    //                 })
    //         })
    //         .catch(error => {
    //             reject(error);
    //         })
    // })
}

const createInvokeTran = async (params: InvokeArgs) => {
    // const contract = new ThinSdk.Contract(Neo.Uint160.parse(params.scriptHash), script);
    // contract.Call(params.operation, params.arguments);
    const tran = new Transaction(storage.account.address, storage.height);
    tran.scriptBuilder.EmitInvokeArgs(params);
    tran.script = tran.scriptBuilder.ToArray();
    const sysfee = await tran.getSystemFee();
    const netfee = tran.calculateNetworkFee();
    params.systemFee = parseFloat(params.systemFee).mul(100000000) > sysfee.toNumber() ? params.systemFee : sysfee.toNumber().div(100000000).toString();
    params.networkFee = parseFloat(params.networkFee).mul(100000000) > netfee.toNumber() ? params.networkFee : netfee.toNumber().div(100000000).toString();
    return params
}

/**
 * invoke 合约调用
 * @param title dapp请求方的信息
 * @param data 请求的参数
 */
const invoke = async (header, params: InvokeArgs) => {
    const data: NotifyMessage = {
        lable: Command.invokeGroup,
        data: params,
        header
    }
    try {
        const resultData = await openNotify(data, createInvokeTran(params));
        if (resultData) {
            const result = await contractBuilder(resultData);
            if (result) {
                TaskManager.addInvokeData(result.txid, header.domain, params);
                return result;
            }
        }
    } catch (error) {
        throw error;
    }

    // return new Promise((resolve, reject) => {
    //     const data: NotifyMessage = {
    //         lable: Command.invokeGroup,
    //         data: params,
    //         header
    //     }
    //     openNotify(data)
    //         .then(() => {
    //             Storage_local.get('checkNetFee')
    //                 .then(checkNetFee => {
    //                     Storage_local.set('checkNetFee', false);
    //                     params.fee = (params.fee && params.fee != '0') ? params.fee : (checkNetFee ? '0.001' : '0');
    //                     contractBuilder(params)
    //                         .then(result => {
    //                             resolve(result);
    //                             TaskManager.addInvokeData(result.txid, header.domain, params);
    //                         })
    //                         .catch(error => {
    //                             reject(error);
    //                         })
    //                 })
    //         })
    //         .catch(error => {
    //             reject(error);
    //         })
    // })
}

// /**
//  * invoke 合约调用
//  * @param title dapp请求方的信息
//  * @param data 请求的参数
//  */
// const deployContract = (header, params: DeployContractArgs) => {
//     return new Promise((resolve, reject) => {
//         const data: NotifyMessage = {
//             lable: Command.deployContract,
//             data: params,
//             header
//         }
//         openNotify(data)
//             .then(() => {
//                 Storage_local.get('checkNetFee')
//                     .then(checkNetFee => {
//                         Storage_local.set('checkNetFee', false);
//                         deploy(params)
//                             .then(result => {
//                                 TaskManager.addDeployData(result.txid, header.domain, params);
//                                 resolve(result);
//                                 // TaskManager.addInvokeData(result.txid, header.domain, { scriptHash: params.contractHash, operation: "创建合约", network: params.network, arguments: [] });
//                             })
//                             .catch(error => {
//                                 reject(error);
//                             })
//                     })
//             })
//             .catch(error => {
//                 reject(error);
//             })
//     })
// }

// const sendScript = (header, params: SendScriptArgs) => {
//     return new Promise((resolve, reject) => {
//         const data: NotifyMessage = {
//             lable: Command.sendScript,
//             data: params,
//             header
//         }
//         openNotify(data)
//             .then(() => {
//                 Storage_local.get('checkNetFee')
//                     .then(checkNetFee => {
//                         Storage_local.set('checkNetFee', false);
//                         sendInvoke(header, params)
//                             .then(result => {
//                                 resolve(result);
//                                 // TaskManager.addInvokeData(result.txid, header.domain, { scriptHash: params.contractHash, operation: "创建合约", network: params.network, arguments: [] });
//                             })
//                             .catch(error => {
//                                 reject(error);
//                             })
//                     })
//             })
//             .catch(error => {
//                 reject(error);
//             })
//     })
// }

/**
 * 获得网络状态信息
 */
const getNetworks = (): Promise<GetNetworksOutput> => {
    return new Promise((resolve, reject) => {
        const network: GetNetworksOutput = {
            networks: [ storage.network ? storage.network : "TestNet" ],
            defaultNetwork: storage.network ? storage.network : "TestNet"
        }
        resolve(network);
    })
}

/**
 * 余额获取
 * @param data 请求的参数
 */
var getBalance = async (data: GetBalanceArgs) => {
    return new Promise(async (r, j) => {
        try {
            if (!Array.isArray(data.params)) {
                data.params = [ data.params ];
            }
            data.params.forEach(({ address, assets, fetchUTXO }, index) => {
                if (assets && !Array.isArray(assets)) {
                    data.params[ index ] = {
                        address,
                        assets: [ assets ],
                        fetchUTXO,
                    };
                }
            });
            let balances: BalanceResults = {};
            if (!Array.isArray(data.params)) {
                data.params = [ data.params ];
            }
            for (const arg of data.params) {

                var asset = arg.assets ? arg.assets : [ HASH_CONFIG.ID_GAS, HASH_CONFIG.ID_NEO ];
                const assetArray: Balance[] = [];
                if (asset.length) {
                    let res = undefined;
                    try {
                        res = await Api.getallnep5assetofaddress(arg.address);
                    } catch (error) {
                        throw error;
                    }
                    let assets = {};
                    if (res) {
                        for (const iterator of res) {
                            const { assetid, symbol, balance } = iterator as { assetid: string, symbol: string, balance: string };
                            const assetID = assetid.replace("0x", "")
                            assets[ assetID ] = { assetID, symbol: symbol.toLocaleUpperCase(), amount: balance }
                        }
                        for (const id of asset) {
                            if (assets[ id ]) {
                                assetArray.push(assets[ id ]);
                            }
                            else {
                                const info = assetManager.allAssetInfo.find(asset => asset.assetid == id);
                                assetArray.push({ assetID: info.assetid, symbol: info.symbol.toLocaleUpperCase(), amount: '0' })
                            }
                        }
                    }
                    else {
                        for (const id of asset) {
                            const info = assetManager.allAssetInfo.find(asset => asset.assetid == id);
                            assetArray.push({ assetID: info.assetid, symbol: info.symbol.toLocaleUpperCase(), amount: '0' })
                        }
                    }
                }
                balances[ arg.address ] = assetArray;
            }
            r(balances)
        } catch (error) {
            j({ type: "NETWORK_ERROR", description: "Balance inquiry failed", data: error });
        }
    })
}

var transfer = async (data: SendArgs): Promise<SendOutput> => {
    try {
        let amount = 0;

        const token = new ThinSdk.Token.BaseToken(Neo.Uint160.parse(data.asset), new ThinNeo.ScriptBuilder());
        token.decimals();

        const invokeresult = await Api.getInvokeRead(token.scriptBuilder.ToArray().toHexString());
        if (invokeresult[ 'state' ].includes('HALT')) {
            let stack = invokeresult[ 'stack' ]
            let dicelams = stack[ 0 ][ 'value' ];
            amount = parseFloat(parseFloat(data.amount).toFixed(dicelams).replace('.', ''))
        }
        else {
            throw { type: 'MALFORMED_INPUT', description: "This scripthash information undefined" }
        }
        const tran = new Transaction(storage.account.address, storage.height);

        const token1 = new ThinSdk.Token.BaseToken(Neo.Uint160.parse(data.asset), tran.scriptBuilder);
        token1.transfer(data.fromAddress, data.toAddress, amount)
        tran.script = tran.scriptBuilder.ToArray();
        const netfee = Neo.Long.fromNumber(parseFloat(data.networkFee).mul(100000000));
        const sysfee = Neo.Long.fromNumber(parseFloat(data.systemFee).mul(100000000));
        const calNetFee = tran.calculateNetworkFee();
        const calSysFee = await tran.getSystemFee();
        tran.networkFee = (netfee.comp(calNetFee) > 0) ? netfee : calNetFee;
        tran.systemFee = (sysfee.comp(calSysFee) > 0) ? sysfee : calSysFee;
        const tranHex = tran.signAndPack(storage.account.prikeyHex.hexToBytes()).toHexString();
        const txid = tran.GetTxid();
        let output: InvokeOutput;
        const result = await Api.sendrawtransaction(tranHex, data.network);
        if (result[ 'data' ]) {
            const nodeUrl: string = result.nodeUrl;
            output = { txid, nodeUrl }
        }
        else {
            throw { type: "RPC_ERROR", description: 'An RPC error occured when submitting the request', data: result[ 0 ].errorMessage };
        }
        data.fee = tran.networkFee.add(tran.systemFee).toNumber().div(100000000).toString();
        TaskManager.addTask(new Task(ConfirmType.tranfer, txid))
        TaskManager.addSendData(txid, data);
        return output;
    } catch (error) {
        throw error;
    }
}

const createTranData = async (data: SendArgs) => {
    try {
        let amount = 0;
        try {
            const bytes = data.asset.hexToBytes()
            if (bytes.length !== 20) {
                throw { type: 'MALFORMED_INPUT', description: "This assetID information undefined" }
            }
        } catch (error) {
            throw { type: 'MALFORMED_INPUT', description: "This assetID information undefined" }
        }
        const token = new ThinSdk.Token.BaseToken(Neo.Uint160.parse(data.asset), new ThinNeo.ScriptBuilder());
        token.decimals();
        const invokeresult = await Api.getInvokeRead(token.scriptBuilder.ToArray().toHexString());
        if (invokeresult[ 'state' ].includes('HALT')) {
            let stack = invokeresult[ 'stack' ]
            let dicelams = stack[ 0 ][ 'value' ];
            amount = parseFloat(parseFloat(data.amount).toFixed(dicelams).replace('.', ''))
        }
        else {
            throw { type: 'MALFORMED_INPUT', description: "This scripthash information undefined" }
        }
        const tran = new Transaction(storage.account.address, storage.height);
        const token1 = new ThinSdk.Token.BaseToken(Neo.Uint160.parse(data.asset), tran.scriptBuilder);
        token1.transfer(data.fromAddress, data.toAddress, amount)
        tran.script = tran.scriptBuilder.ToArray();
        const netfee = Neo.Long.fromNumber(parseFloat(data.networkFee).mul(100000000));
        const sysfee = Neo.Long.fromNumber(parseFloat(data.systemFee).mul(100000000));
        const calNetFee = tran.calculateNetworkFee();
        const calSysFee = await tran.getSystemFee();
        tran.networkFee = (netfee.comp(calNetFee) > 0) ? netfee : calNetFee;
        tran.systemFee = (sysfee.comp(calSysFee) > 0) ? sysfee : calSysFee;
        data.networkFee = tran.networkFee.toNumber().div(100000000).toString();
        data.systemFee = tran.systemFee.toNumber().div(100000000).toString();
    } catch (error) {
        throw { type: 'MALFORMED_INPUT', description: "This assetID information undefined" }
    }
    return data;
}

var send = async (header, params: SendArgs) => {
    if (params.fromAddress !== storage.account.address) {
        throw ({ type: "MALFORMED_INPUT", description: 'The input address is not the current wallet address' })
    }
    else {
        const data: NotifyMessage = {
            lable: Command.send,
            data: params,
            header
        }
        try {
            const result = await openNotify(data, createTranData(params));
            if (result) {
                return transfer(result);
            }
        } catch (error) {
            throw error;
        }
    }
}

// const sendInvoke = async (header, data: SendScriptArgs) => {
//     const tran = new Transaction(ThinNeo.TransactionType.ContractTransaction)
//     const sysfee = data.sysfee ? Neo.Fixed8.parse(data.sysfee) : Neo.Fixed8.Zero;
//     const netfee = data.fee ? Neo.Fixed8.parse(data.fee) : Neo.Fixed8.Zero;
//     const fee = sysfee.add(netfee); //计算出总消耗的费用 系统费加网络费
//     const sb = new ScriptBuild();
//     const RANDOM_UINT8: Uint8Array = getWeakRandomValues(32);
//     const RANDOM_INT: Neo.BigInteger = Neo.BigInteger.fromUint8Array(RANDOM_UINT8);
//     // 塞入随机数
//     sb.EmitPushNumber(RANDOM_INT);  // 将随机数推入栈顶
//     sb.Emit(ThinNeo.OpCode.DROP);   // 打包
//     for (let i = data.scriptArguments.length - 1; i >= 0; i--) {
//         sb.EmitParam(data.scriptArguments[ i ]);
//     }
//     const appcall = Neo.Uint160.parse(data.scriptHash);
//     // let appcall = this.currentContract.scripthash.hexToBytes();
//     sb.EmitAppCall(appcall);
//     tran.setScript(sb.ToArray(), sysfee)

//     const utxos = await MarkUtxo.getAllUtxo();
//     if (data.attachedAssets) {
//         for (const asset in data.attachedAssets) {
//             if (data.attachedAssets.hasOwnProperty(asset)) {
//                 const toaddr = ThinNeo.Helper.GetAddressFromScriptHash(Neo.Uint160.parse(data.scriptHash));
//                 const amount = Neo.Fixed8.parse(data.attachedAssets[ asset ]);
//                 const utxo = utxos[ asset ];
//                 if (asset.includes(HASH_CONFIG.ID_GAS))
//                     tran.creatInuptAndOutup(utxo, amount, toaddr, fee)
//                 else
//                     tran.creatInuptAndOutup(utxo, amount, toaddr)
//             }
//         }
//     }
//     else if (fee.compareTo(Neo.Fixed8.Zero) > 0) {
//         if (utxos && utxos[ HASH_CONFIG.ID_GAS ]) {
//             const utxo = utxos[ HASH_CONFIG.ID_GAS ]
//             tran.creatInuptAndOutup(utxo, fee);
//         }
//         else {
//             throw { type: 'INSUFFICIENT_FUNDS', description: 'The user does not have a sufficient balance to perform the requested action' };
//         }
//     }
//     // console.log((tran.GetMessage().length+103).div(100000).add(0.001));
//     const txsize = (tran.GetMessage().length + 103)
//     const calFee = Neo.Fixed8.fromNumber(txsize.div(100000).add(0.001));    // 足够的网络费用
//     if (txsize > 1024 && netfee.compareTo(calFee) < 0) {
//         const newInvoke = data;
//         newInvoke.fee = calFee.toString();
//         return await sendInvoke(header, newInvoke)
//     }
//     else {
//         let result = await transactionSignAndSend(tran);
//         TaskManager.addTask(new Task(ConfirmType.contract, result.txid));
//         // TaskManager.addSendData(outupt.txid, data);
//         const invokeargs: InvokeArgs = { operation: "", arguments: [], description: data.description, scriptHash: data.scriptHash, network: storage.network }
//         TaskManager.addInvokeData(result.txid, header.domain, invokeargs)
//         return result;
//     }
// }

/**
 * invoke试运行方法
 * @param data invokeRead 的参数
 */
var invokeRead = (data: InvokeInput) => {
    return new Promise<any>((r, j) => {
        const script = new ScriptBuild();
        try {
            // script.EmitArguments(data.arguments);        // 参数转换与打包
            // script.EmitPushString(data.operation);    // 塞入需要调用的合约方法名
            // script.EmitAppCall(Neo.Uint160.parse(data.scriptHash));   // 塞入需要调用的合约hex
            script.EmitInvokeArgs(data)
            Api.getInvokeRead(script.ToArray().toHexString())
                .then(result => {
                    r(result);
                })
                .then(error => {
                    j(error);
                })
        } catch (error) {
            j(error);
        }
    })
}

var invokeReadGroup = (data: InvokeReadGroup) => {
    return new Promise((r, j) => {
        const script = new ScriptBuild();
        try {
            script.EmitInvokeArgs(data.group)
            Api.getInvokeRead(script.ToArray().toHexString())
                .then(result => {
                    r(result);
                })
                .then(error => {
                    j(error);
                })
        } catch (error) {
            j(error);
        }
    })
}

var invokeArgsAnalyse = async (...invokes: InvokeArgs[]) => {
    let descriptions: string[] = [];
    let scriptHashs: string[] = [];
    let fee = Neo.Fixed8.Zero;
    let netfee = Neo.Fixed8.Zero;
    let sysfee = Neo.Fixed8.Zero;
    let operations: string[] = [];
    let argument = [];
    let expenses: { symbol: string, amount: string, assetid: string }[] = [];
    let nep5assets: { [ asset: string ]: Neo.BigInteger } = {};
    let utxoassets: { [ asset: string ]: Neo.Fixed8 } = {};
    for (let index = 0; index < invokes.length; index++) {
        const invoke = invokes[ index ];
        descriptions.push(invoke.description);
        scriptHashs.push(invoke.scriptHash);
        netfee = invoke.networkFee ? netfee.add(Neo.Fixed8.parse(invoke.networkFee)) : netfee;
        sysfee = invoke.systemFee ? sysfee.add(Neo.Fixed8.parse(invoke.systemFee)) : sysfee;
        fee = fee.add(netfee.add(sysfee));
        operations.push(invoke.operation);
        argument.push(invoke.arguments);
        // 判断 nep5的转账花费
        if (invoke.operation == "transfer") {
            if (invoke.arguments[ 0 ].value == storage.account.address) {
                const amount = Neo.BigInteger.fromString(invoke.arguments[ 2 ].value.toString());
                if (!nep5assets[ invoke.scriptHash ])
                    nep5assets[ invoke.scriptHash ] = Neo.BigInteger.Zero;
                nep5assets[ invoke.scriptHash ] = nep5assets[ invoke.scriptHash ].add(amount);
            }
        }
        if (invoke.attachedAssets) {
            for (const asset in invoke.attachedAssets) {
                const amount = Neo.Fixed8.parse(invoke.attachedAssets[ asset ].toString());
                if (!utxoassets[ asset ])
                    utxoassets[ asset ] = Neo.Fixed8.Zero;
                utxoassets[ asset ] = utxoassets[ asset ].add(amount);
            }
        }
        // if (HASH_CONFIG.ID_CGAS.compareTo(Neo.Uint160.parse(invoke.scriptHash)) === 0 && invoke.operation == "refund") {

        // }
    }
    for (const key in utxoassets) {
        const amount = utxoassets[ key ]
        const assetstate = await queryAssetSymbol(key, invokes[ 0 ].network);
        expenses.push({
            symbol: assetstate.symbol.toLocaleUpperCase(),
            amount: amount.toString(),
            assetid: key
        })
    }
    for (const key in nep5assets) {
        const amount = nep5assets[ key ]
        const assetstate = await queryAssetSymbol(key, invokes[ 0 ].network);
        var v = 1;
        for (var i = 0; i < assetstate.decimals; i++) {
            v *= 10;
        }
        var intv = parseInt(amount.divide(v).toString());
        var smallv = parseInt(amount.mod(v).toString()) / v;

        expenses.push({
            symbol: assetstate.symbol.toLocaleUpperCase(),
            amount: (intv + smallv).toString(),
            assetid: key
        })
    }
    return { scriptHashs, descriptions, operations, arguments: argument, expenses, fee: fee.toString(), networkFee: netfee.toString(), systemFee: sysfee.toString() }
}

var queryAssetSymbol = async (assetID: string, network: 'TestNet' | 'MainNet') => {
    if (assetID.hexToBytes().length == 20) {
        const sb = new ThinNeo.ScriptBuilder();
        const token = new ThinSdk.Token.BaseToken(Neo.Uint160.parse(assetID), sb);
        token.symbol();
        token.decimals();
        const hexstr = sb.ToArray().toHexString();
        const result = await Api.getInvokeRead(hexstr, network);
        const stack: string = result[ 'stack' ];
        if (stack) {
            const symbol: string = ThinNeo.Helper.Bytes2String((stack[ 0 ][ 'value' ] as string).hexToBytes());
            const decimals: number = parseInt(stack[ 1 ][ 'value' ]);
            return { symbol: symbol.toLocaleUpperCase(), decimals };
        }
    }
    if (assetID.hexToBytes().length == 32) {
        let asset = { symbol: '', decimals: 0 };
        if (assetID === HASH_CONFIG.ID_NEO)
            asset.symbol = 'NEO'
        else if (assetID === HASH_CONFIG.ID_GAS)
            asset.symbol = 'GAS'
        else {
            const result = await Api.getAssetState(assetID);
            const names = result[ name ];
            for (var i in names) {
                asset.symbol = names[ i ].name.toLocaleUpperCase();
            }
        }
        return asset;
    }
}

const getProvider = () => {
    return new Promise((resolve, reject) => {
        let provider: Provider =
        {
            "compatibility": [ "TypeScript", "JavaScript" ],
            "extra": null,
            "name": "Teemo.NEO",
            "version": VERSION,
            "website": "https://teemo.nel.group"
        }
        resolve(provider);
    })
}

const getStorage = (data: GetStorageArgs) => {
    return new Promise<GetStorageOutput>((resolve, reject) => {
        Api.getStorage(data.scriptHash, data.key)
            .then(result => {
                if (result)
                    resolve(result);
                else
                    reject({ type: 'RPC_ERROR', description: "An RPC error occured when submitting the request" })
            })
            .catch(error => {

                reject({ type: 'RPC_ERROR', description: "An RPC error occured when submitting the request", data: error })
            })
    })
}

const getPublicKey = () => {
    return new Promise<GetPublickeyOutput>((resolve, reject) => {
        let provider: GetPublickeyOutput =
            { address: storage.account.address, publickey: storage.account.pubkey.toHexString() }
        resolve(provider);
    })
}

const notifyInit = (title: string, domain: string, favIconUrl: string) => {
    return new Promise((r, j) => {
        if (storage.domains.indexOf(domain) < 0) {
            const notifyHeader: NotifyMessage = {
                header: { title, domain, icon: favIconUrl },
                lable: Command.getAccount
            }

            getBase64ByUrl(favIconUrl)
                .then(icon => {
                    notifyHeader.header.icon = icon;
                    openNotify(notifyHeader)
                        .then(result => {
                            storage.domains.push(domain);
                            Storage_local.get('white_list')
                                .then(result => {
                                    let setData = result ? result : {};
                                    TaskManager.dappsMessage[ domain ] = setData[ domain ] = { title, icon };
                                    Storage_local.set('white_list', setData);
                                    EventsOnChange(WalletEvents.CONNECTED, { address: storage.account.address, label: storage.account.walletName });
                                })
                            r()
                        })
                        .catch(error => {
                            j(error);
                        })
                })
        }
        else {
            r();
        }
    })
}

const showNotify = (title: string, msg: string, call?: (notificationIds: string) => void) => {
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'icon128.png',
        title: title,
        message: msg,
        isClickable: true,
    }, (notificationIds: string) => {
        call(notificationIds);
    });
}

/**
 * 通过正则获得url中的域名
 * @param Url url链接
 */
const getURLDomain = (Url: string) => {
    var durl = /http:\/\/([^\/]+)\//i;
    var durl2 = /https:\/\/([^\/]+)\//i;
    var durl3 = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;

    var arr = Url.match(durl);
    if (arr && arr.length > 1)
        return arr[ 1 ].toString();
    arr = Url.match(durl2);
    if (arr && arr.length > 1)
        return arr[ 1 ].toString();
    arr = durl3.exec(Url);
    if (arr && arr.length > 0)
        return arr[ 0 ].toString();
    else
        return Url;
}

/**
 * 查询区块高度
 * @param data 查询区块信息的参数，blockHeight,network
 */
const getBlock = (data: GetBlockArgs) => {
    return new Promise((resolve, reject) => {
        Api.getBlock(data.blockHeight)
            .then(result => {
                if (result)
                    resolve(result);
                else
                    reject({ type: 'RPC_ERROR', description: "An RPC error occured when submitting the request" })
            })
            .catch(error => {

                reject({ type: 'RPC_ERROR', description: "An RPC error occured when submitting the request", data: error })
            })
    })
}

/**
 * 查询Application Log
 * @param data 
 */
const getApplicationLog = (data: GetApplicationLogArgs) => {
    return new Promise((resolve, reject) => {
        Api.getApplicationLog(data.txid)
            .then(result => {
                if (result)
                    resolve(Array.isArray(result) ? result[ 0 ] : result);
                else
                    reject({ type: 'RPC_ERROR', description: "An RPC error occured when submitting the request" })
            })
            .catch(error => {

                reject({ type: 'RPC_ERROR', description: "An RPC error occured when submitting the request", data: error })
            })
    })
}

/**
 * 查询交易信息
 * @param data 
 */
const getTransaction = (data: GetTransactionArgs) => {
    return new Promise((resolve, reject) => {
        Api.getrawtransaction(data.txid)
            .then(result => {
                if (result)
                    resolve(result);
                else
                    reject({ type: 'RPC_ERROR', description: "An RPC error occured when submitting the request" })
            })
            .catch(error => {

                reject({ type: 'RPC_ERROR', description: "An RPC error occured when submitting the request", data: error })
            })
    })
}

/**
 * 验证地址是否正确
 * @param address 
 */
const validateAddress = (address: string) => {
    return new Promise((resolve, reject) => {
        try {
            var array: Uint8Array = Neo.Cryptography.Base58.decode(address);
            var check = array.subarray(21, 21 + 4); //

            var checkdata = array.subarray(0, 21);//
            var hashd = Neo.Cryptography.Sha256.computeHash(checkdata);//
            hashd = Neo.Cryptography.Sha256.computeHash(hashd);//
            var hashd = hashd.slice(0, 4);//    
            var checked = new Uint8Array(hashd);//

            var error = false;
            for (var i = 0; i < 4; i++) {
                if (checked[ i ] != check[ i ]) {
                    error = true;
                    break;
                }
            }
            resolve(!error)
        } catch (error) {
            resolve(false);
        }
    })
}

/**
 * 将ScriptHash转换成Address
 * @param scriptHash 
 */
const getAddressFromScriptHash = (scriptHash: string) => {
    return new Promise((resolve, reject) => {
        try {
            const addr = ThinNeo.Helper.GetAddressFromScriptHash(scriptHash.hexToBytes());
            resolve(addr);
        } catch (error) {
            reject({ type: "MALFORMED_INPUT", description: 'The input scriptHash is not right, scripthash' })
        }
    })
}

/**
 * 将hexstr转换成字符串
 * @param hexStr 
 */
const getStringFromHexstr = (hexStr: string) => {
    return new Promise((resolve, reject) => {
        try {
            const value = ThinNeo.Helper.Bytes2String(hexStr.hexToBytes())
            resolve(value);
        } catch (error) {
            reject({ type: "MALFORMED_INPUT", description: 'The input hexStr is not right, hexStr' })
        }
    })
}

/**
 * 将hex转换成BigIngteger
 * @param hexStr 
 */
const getBigIntegerFromHexstr = (hexStr: string) => {
    return new Promise((resolve, reject) => {
        try {
            if (!hexStr)
                resolve('0');
            const value = Neo.BigInteger.fromUint8Array(hexStr.hexToBytes())
            resolve(value.toString());
        } catch (error) {
            reject({ type: "MALFORMED_INPUT", description: 'The input hexStr is not right, hexStr' })
        }
    })
}

/**
 * 反转 HexStr
 * @param hexStr 
 */
const reverseHexstr = (hexStr: string) => {
    return new Promise((resolve, reject) => {
        try {
            const value = hexStr.hexToBytes().reverse().toHexString()
            resolve(value);
        } catch (error) {
            reject({ type: "MALFORMED_INPUT", description: 'The input hexStr is not right, hexStr' })
        }
    })
}

/**
 * 将资产精度转换到大整数
 * @param amount 
 * @param assetID 
 */
const getBigIntegerFromAssetAmount = async (params: GetBigIntegerFromAssetAmountArgs) => {
    try {
        const data = await queryAssetSymbol(params.assetID, params.network);
        return parseFloat(params.amount).toFixed(data.decimals).replace('.', '');
    } catch (error) {
        throw ({ type: "MALFORMED_INPUT", description: 'The input hexStr is not right, hexStr' })
    }
}

/**
 * 将资产精度转换到Decimals
 * @param amount 
 * @param assetID 
 */
const getDecimalsFromAssetAmount = async (params: GetDecimalsFromAssetAmountArgs) => {
    try {
        const data = await queryAssetSymbol(params.assetID, params.network);
        const bnum = new Neo.BigInteger(params.amount);
        var v = 1;
        for (var i = 0; i < data.decimals; i++) {
            v *= 10;
        }
        var intv = parseInt(bnum.divide(v).toString());
        var smallv = parseInt(bnum.mod(v).toString()) / v;
        return `${intv + smallv}`
    } catch (error) {
        throw ({ type: "MALFORMED_INPUT", description: 'The input hexStr is not right, hexStr' })
    }
}

const getNamehashFromDomain = async (params: string) => {
    try {
        return NNSTool.domainToHash(params).toArray().reverse().toHexString();
    } catch (error) {
        throw "";
    }
}

var getAddressFromDomain = (params: DomainArgs) => {
    return NNSTool.resolveData(params.domain)
}

var getDomainFromAddress = async (params: AddressArgs) => {
    const invoke_credit_revoke: InvokeInput = {
        "scriptHash": "960b41a05588d2f55acbc13a1e3aa464eec6fff5",
        "operation": "getCreditInfo",
        "arguments": [
            { "type": "Address", "value": params.address },
        ],
        "network": params.network
    }
    const result = await invokeRead(invoke_credit_revoke);

    if (result.stack[ 0 ] != null) {
        var stackarr = result[ "stack" ] as any[];
        let stack = ResultItem.FromJson(DataType.Array, stackarr).subItem[ 0 ].subItem
        var creditInfo = {
            namehash: stack[ 0 ].AsHexString(),
            fullDomainName: stack[ 1 ].AsString(),
            TTL: stack[ 2 ].AsInteger().toString(),
        }
        return creditInfo;
    }
    else {
        return { namehash: '', fullDomainName: '', TTL: '' }
    }
}

/**
 * 处理请求并返回
 * @param sender An object containing information about the script context that sent a message or request.
 * @param request 请求数据
 */
const responseMessage = (sender: chrome.runtime.MessageSender, request: any) => {
    const { ID, command, params } = request;
    const tab = sender.tab;
    const title = sender.tab.title;
    const domain = getURLDomain(tab.url)
    const header = { title, domain, icon: tab.favIconUrl };
    if (Storage_local.getAccount().length < 1) {
        const lang = localStorage.getItem('language');
        const titles: Array<string> = (!lang || lang == 'zh') ? [ '未检测到钱包', '请先创建或导入钱包' ] : [ 'Wallet not detected.', 'Please create or import a wallet first. ' ]
        showNotify(titles[ 0 ], titles[ 1 ]);
        const error = { type: 'CONNECTION_DENIED', description: 'No account response to current dapp request ' }
        chrome.tabs.sendMessage(tab.id, {
            return: command, ID, error
        });
        return;
    }
    const network = params ? (params[ 'group' ] ? params[ 'group' ][ 0 ][ 'network' ] : params[ 'network' ]) : undefined;
    if (network && network != storage.network) {
        const error = { type: 'MALFORMED_INPUT', description: 'The network is not a valid network' }
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
                    sendResponse(send(header, params))
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
                case Command.getBlock:
                    sendResponse(getBlock(params));
                    break;
                case Command.getTransaction:
                    sendResponse(getTransaction(params));
                    break;
                case Command.getApplicationLog:
                    sendResponse(getApplicationLog(params));
                    break;
                case Command.TOOLS_validateAddress:
                    sendResponse(validateAddress(params));
                    break;
                case Command.TOOLS_reverseHexstr:
                    sendResponse(reverseHexstr(params));
                    break;
                case Command.TOOLS_getStringFromHexstr:
                    sendResponse(getStringFromHexstr(params));
                    break;
                case Command.TOOLS_getDecimalsFromAssetAmount:
                    sendResponse(getDecimalsFromAssetAmount(params));
                    break;
                case Command.TOOLS_getBigIntegerFromHexstr:
                    sendResponse(getBigIntegerFromHexstr(params));
                    break;
                case Command.TOOLS_getBigIntegerFromAssetAmount:
                    sendResponse(getBigIntegerFromAssetAmount(params));
                    break;
                case Command.TOOLS_getAddressFromScriptHash:
                    sendResponse(getAddressFromScriptHash(params));
                    break;
                case Command.NNS_getAddressFromDomain:
                    sendResponse(getAddressFromDomain(params));
                    break;
                case Command.NNS_getDomainFromAddress:
                    sendResponse(getDomainFromAddress(params));
                    break;
                case Command.NNS_getNamehashFromDomain:
                    sendResponse(getNamehashFromDomain(params));
                    break;
                case Command.deployContract:
                    // sendResponse(deployContract(header, params));
                    break;
                case Command.sendScript:
                    // sendResponse(sendScript(header, params));
                    break;
                default:
                    sendResponse(new Promise((r, j) => j({ type: "NO_PROVIDER", description: "Could not find an instance of the dAPI in the webpage" })))
                    break;
            }
        })
    const sendResponse = (result: Promise<any>) => {
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
            })
    }
}

/**
 * 监听
 */
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        //初始化鼠标随机方法
        if (request.command)
            responseMessage(sender, request);
    }
);

enum ConfirmType {
    tranfer,    // 确认交易是否成功
    contract,   // 确认合约是否成功，等待notify
    toClaimgas, // Claim GAS前的自己转自己NEO的交易
    claimgas,   // 确认claimgas的交易
    deploy,     // 部署合约
}

enum TaskState {
    watting,
    success,
    fail,
    watForLast,
    failForLast,
}

class Task {
    height: number;
    confirm: number;
    type: ConfirmType;
    txid: string;
    message: any;
    state: TaskState;
    startTime: number;
    network: "TestNet" | "MainNet";
    currentAddr: string;
    next?: TransferGroup;
    constructor(
        type: ConfirmType,
        txid: string,
        next?: TransferGroup,
        state?: TaskState,
        messgae?
    ) {
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
    txid: string;
    txhex: string;
    executeError?: { type: string, data: string, description: string }
    static update(tran: TransferGroup, network?: 'TestNet' | 'MainNet') {
        Api.sendrawtransaction(tran.txhex, network)
            .then(result => {
                if (result[ 'data' ]) {
                    TaskManager.shed[ tran.txid ].state = TaskState.watting;
                }
                else {
                    TaskManager.shed[ tran.txid ].state = TaskState.fail;
                    TaskManager.shed[ tran.txid ].next.executeError = {
                        type: "RPC_ERROR",
                        description: result[ 0 ].errorMessage,
                        data: tran.txhex
                    }
                }
                Storage_local.set(TaskManager.table, TaskManager.shed);

            })
            .catch(error => {
                TaskManager.shed[ tran.txid ].state = TaskState.fail;
                TaskManager.shed[ tran.txid ].next.executeError = {
                    type: "RPC_ERROR",
                    description: error,
                    data: tran.txhex
                }
                Storage_local.set(TaskManager.table, TaskManager.shed);
            })
    }
}

interface InvokeHistory {
    domain: string;
    scriptHashs: string[];
    descripts: string[];
    expenses: { assetid: string, symbol: string, amount: string }[];
    netfee: string;
    systemFee?: string;
    networkFee?: string;
}

interface DeployHistory {
    domain: string;
    contractHash: string    // 合约hash
    description: string;    // 备注信息
    email: string;          // 邮件
    author: string;         // 作者
    version: string,        // 版本
    name: string;           // 名称
    call: boolean;          // 是否动态调用
    storage: boolean;       // 是否存储区
    payment: boolean;       // 是否支持付费
    sysfee: number;          // 系统费
}

class TaskManager {

    public static shed: { [ txid: string ]: Task } = {};

    public static invokeHistory: { [ txid: string ]: InvokeHistory } = {};

    public static deployHistory: { [ txid: string ]: DeployHistory } = {};

    public static sendHistory: { [ txid: string ]: SendArgs } = {};

    public static dappsMessage: { [ txid: string ]: { title: string, icon: string } } = {};

    public static table: string = "Task-Manager-shed";

    public static socket = new SocketManager();

    public static blockDatas = [ {
        blockHeight: -1,
        blockTime: 0,
        blockHash: '',
        timeDiff: 0
    } ]

    public static start() {
        chrome.storage.local.get([ this.table, 'invoke-data', 'send-data', 'white_list', 'deploy-data' ], item => {
            this.shed = item[ this.table ] ? item[ this.table ] : {};
            this.invokeHistory = item[ 'invoke-data' ] ? item[ 'invoke-data' ] : {};
            this.sendHistory = item[ 'send-data' ] ? item[ 'send-data' ] : {};
            this.dappsMessage = item[ 'white_list' ] ? item[ 'white_list' ] : {};
            this.deployHistory = item[ 'deploy-data' ] ? item[ 'deploy-data' ] : {};
        })
        // this.updateBlock();
        this.socket.socketInit();
        this.socket.updateLastWSmsgSec()
    }

    public static get webSocketURL() {
        if (storage.network == 'MainNet') return 'wss://testws.nel.group/ws/mainnet'
        else return 'wss://testws.nel.group/ws/testnet'
    }

    public static addSendData(txid: string, data: SendArgs) {
        queryAssetSymbol(data.asset, data.network)
            .then(assetState => {
                this.sendHistory[ txid ] = data;
                this.sendHistory[ txid ][ 'symbol' ] = assetState.symbol.toLocaleUpperCase();
                Storage_local.set('send-data', this.sendHistory);
            })
    }

    public static addInvokeData(txid: string, domain: string, data: InvokeArgs | InvokeArgs[]) {
        const invokeArgs = Array.isArray(data) ? data : [ data ];
        invokeArgsAnalyse(...invokeArgs)
            .then(result => {
                const message: InvokeHistory = {
                    domain: domain,
                    scriptHashs: result.scriptHashs,
                    descripts: result.descriptions,
                    expenses: result.expenses,
                    netfee: result.fee,
                    networkFee: result.networkFee,
                    systemFee: result.systemFee
                }
                this.invokeHistory[ txid ] = message;
                Storage_local.set('invoke-data', this.invokeHistory);
            })
    }

    public static addDeployData(txid: string, domain: string, info: DeployContractArgs) {
        const amount = (info.call ? 500 : 0) + (info.storage ? 400 : 0) + 90 + 11;
        const message: DeployHistory =
        {
            contractHash: info.contractHash,
            name: info.name,
            author: info.author,
            description: info.description,
            email: info.email,
            version: info.version,
            storage: info.storage,
            call: info.call,
            payment: info.payment,
            domain: domain,
            sysfee: amount
        };
        this.deployHistory[ txid ] = message;
        Storage_local.set('deploy-data', this.deployHistory);
    }

    public static InvokeDataUpdate() {
        Storage_local.set('invoke-data', this.invokeHistory);
    }

    public static addTask(task: Task) {
        this.shed[ task.txid ] = task;
        Storage_local.set(this.table, this.shed);
        const count = storage.accountWaitTaskCount[ task.currentAddr ] ? storage.accountWaitTaskCount[ task.currentAddr ] : 0;
        storage.accountWaitTaskCount[ task.currentAddr ] = count + 1;
    }

    public static initShed() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([ this.table, 'invoke-data', 'send-data' ], item => {
                this.shed = item[ this.table ] ? item[ this.table ] : {};
                this.invokeHistory = item[ 'invoke-data' ] ? item[ 'invoke-data' ] : {};
                this.sendHistory = item[ 'send-data' ] ? item[ 'send-data' ] : {};
                resolve();
            })
        })
    }

    public static update() {
        for (const key in this.shed) {
            const task = this.shed[ key ];
            if (task.state == TaskState.watting && task.network == storage.network) {
                if (task.type === ConfirmType.tranfer) {
                    Api.getrawtransaction(task.txid, task.network)
                        .then(result => {
                            if (result[ 'blockhash' ]) {
                                task.state = TaskState.success;
                                this.shed[ key ] = task;
                                Storage_local.set(this.table, this.shed);
                                TaskNotify(task);
                                const count = storage.accountWaitTaskCount[ task.currentAddr ] ? storage.accountWaitTaskCount[ task.currentAddr ] : 0;
                                storage.accountWaitTaskCount[ task.currentAddr ] = count - 1;
                                EventsOnChange(WalletEvents.TRANSACTION_CONFIRMED, { TXID: task.txid, blockHeight: storage.height, blockTime: result[ "blockTime" ] });
                                if (task.next) {
                                    TransferGroup.update(task.next, task.network);
                                }
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
                else if (task.type == ConfirmType.toClaimgas) {
                    Api.getrawtransaction(task.txid, task.network)
                        .then(result => {
                            if (result[ 'blockhash' ]) {
                                task.state = TaskState.success;
                                this.shed[ key ] = task;
                                Storage_local.set(this.table, this.shed);
                                const count = storage.accountWaitTaskCount[ task.currentAddr ] ? storage.accountWaitTaskCount[ task.currentAddr ] : 0;
                                storage.accountWaitTaskCount[ task.currentAddr ] = count - 1;
                                if (storage.account && storage.account.address == task.message) {
                                    try {
                                        // claimGas(task.network);
                                    } catch (error) {
                                        localStorage.setItem('Teemo-claimgasState-' + task.network, '');
                                    }
                                }
                                else {
                                    localStorage.setItem('Teemo-claimgasState-' + task.network, '');
                                }
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
                else if (task.type == ConfirmType.claimgas) {
                    Api.getrawtransaction(task.txid, task.network)
                        .then(result => {
                            if (result[ 'blockhash' ]) {
                                TaskNotify(task);
                                const count = storage.accountWaitTaskCount[ task.currentAddr ] ? storage.accountWaitTaskCount[ task.currentAddr ] : 0;
                                storage.accountWaitTaskCount[ task.currentAddr ] = count - 1;
                                task.state = TaskState.success;
                                this.shed[ key ] = task;
                                Storage_local.set(this.table, this.shed);
                                localStorage.setItem('Teemo-claimgasState-' + task.network, '');
                                EventsOnChange(WalletEvents.TRANSACTION_CONFIRMED, { TXID: task.txid, blockHeight: storage.height, blockTime: result[ "blockTime" ] });
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
                else if (task.type == ConfirmType.contract) {
                    Api.getrawtransaction(task.txid, task.network)
                        .then(result => {
                            if (result[ 'blockhash' ]) {
                                TaskNotify(task);
                                const count = storage.accountWaitTaskCount[ task.currentAddr ] ? storage.accountWaitTaskCount[ task.currentAddr ] : 0;
                                storage.accountWaitTaskCount[ task.currentAddr ] = count - 1;
                                task.state = TaskState.success;
                                this.shed[ key ] = task;
                                Storage_local.set(this.table, this.shed);
                                EventsOnChange(WalletEvents.TRANSACTION_CONFIRMED, { TXID: task.txid, blockHeight: storage.height, blockTime: result[ "blockTime" ] });
                                if (task.next) {
                                    TransferGroup.update(task.next, task.network);
                                }
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }
            }
        }
    }
}

TaskManager.start();

var cleanHistory = () => {
    const address: string = storage.account.address
    for (const txid in TaskManager.shed) {
        if (TaskManager.shed.hasOwnProperty(txid)) {
            const task: TaskHistory = TaskManager.shed[ txid ];
            if (task.currentAddr == address && task.state !== TaskState.watting && task.state !== TaskState.watForLast) {
                delete TaskManager.shed[ txid ];
            }
        }
    }
    Storage_local.set(TaskManager.table, this.shed);
}

var cleanTaskForAddr = (address: string) => {
    for (const txid in TaskManager.shed) {
        if (TaskManager.shed.hasOwnProperty(txid)) {
            const task: TaskHistory = TaskManager.shed[ txid ];
            if (task.currentAddr == address) {
                delete TaskManager.shed[ txid ];
            }
        }
    }
    Storage_local.set(TaskManager.table, this.shed);
}

interface Claim {
    addr: string;//"ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s"
    asset: string;//"0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b"
    claimed: boolean;//""
    createHeight: number;//1365554
    n: number;//0
    txid: string;//"0x90800a9dde3f00b61e16a387aa4a2ea15e4c7a4711a51aa9751da224d9178c64"
    useHeight: number;//1373557
    used: string;//"0x47bf58edae75796b1ba4fd5085e5012c3661109e2e82ad9b84666740e561c795"
    value: number;//"1"
    gas: number;
}

class AssetManager {
    testAssetInfo: AssetInfo[] = [];
    mainAssetInfo: AssetInfo[] = [];
    get allAssetInfo() {
        return storage.network == 'MainNet' ? this.mainAssetInfo : this.testAssetInfo;
    }
    set allAssetInfo(arr: AssetInfo[]) {
        if (storage.network == "MainNet") {
            this.mainAssetInfo = arr;
        }
        if (storage.network == "TestNet") {
            this.testAssetInfo = arr;
        }
    }

    async initAllAseetInfo() {
        const nep5Assets: Nep5AssetInfo[] = await Api.getallnep5asset();
        // const allassets: UtxoAssetInfo[] = await Api.getallasset();
        this.allAssetInfo = [];
        // for (const asset of allassets) {
        //     let assetInfo = {} as AssetInfo;
        //     assetInfo.assetid = asset.id.replace('0x', '');
        //     assetInfo.decimals = asset.precision;
        //     assetInfo.type = 'utxo';
        //     if (assetInfo.assetid == HASH_CONFIG.ID_GAS)
        //         assetInfo.symbol = 'GAS';
        //     else if (assetInfo.assetid == HASH_CONFIG.ID_NEO)
        //         assetInfo.symbol = 'NEO';
        //     else
        //         assetInfo.symbol = asset.name[ asset.name.length - 1 ].name;
        //     assetInfo.name = assetInfo.symbol;
        //     this.allAssetInfo.push(assetInfo);
        // }
        for (const nep5 of nep5Assets) {
            let assetInfo = {} as AssetInfo;
            assetInfo.assetid = nep5.assetid.replace('0x', '');
            assetInfo.decimals = nep5.decimals;
            assetInfo.type = 'nep5';
            assetInfo.symbol = nep5.symbol ? nep5.symbol.toLocaleUpperCase() : (nep5.name ? nep5.name : '');
            assetInfo.name = nep5.name;
            this.allAssetInfo.push(assetInfo);
        }
        return true;
    }

    /**
     * 模糊搜索资产
     * @param value 搜索值，资产名称或者id
     */
    queryAsset(value: string) {
        // 筛选名字或者id包含搜索值的结果(id 忽略 0x)
        return this.allAssetInfo.filter(
            asset => {
                // console.log(asset);
                try {
                    const result = asset.symbol.toUpperCase().indexOf(value.toUpperCase()) >= 0;
                    return result;
                } catch (error) {
                    console.log(error);

                    return false;
                }
            }
        )
            .sort((a, b) => { return a.symbol.toUpperCase().indexOf(value.toUpperCase()) - b.symbol.toUpperCase().indexOf(value.toUpperCase()) })
    }

    saveAsset(assets: string[]) {
        localStorage.setItem('Teemo-assetManager-' + storage.network + storage.account.address, assets.join('|'));
    }

    /**
     * 根据资产id添加资产
     * @param assetID 资产id
     */
    addAsset(assetID: string) {
        const assetids = localStorage.getItem('Teemo-assetManager-' + storage.network + storage.account.address);
        const list = assetids ? assetids.split('|') : [];
        list.push(assetID);
        const arr = list.filter((element, index, self) => self.indexOf(element) === index);
        localStorage.setItem('Teemo-assetManager-' + storage.network + storage.account.address, list.join('|'));
    }

    /**
     * 根据资产id删除资产
     * @param assetID 资产id
     */
    deleteAsset(assetID: string) {
        const assetids = localStorage.getItem('Teemo-assetManager-' + storage.network + storage.account.address);
        const list = assetids ? assetids.split('|') : [];
        const arr = list.filter((element) => element != assetID);
        localStorage.setItem('Teemo-assetManager-' + storage.network + storage.account.address, JSON.stringify(arr));
    }

    /**
     * 获得用户拥有的资产列表
     */
    getMyAsset() {
        const assetids = localStorage.getItem('Teemo-assetManager-' + storage.network + storage.account.address);
        return this.allAssetInfo.filter(asset => assetids.includes(asset.assetid));
    }

}

var assetManager = new AssetManager();
assetManager.initAllAseetInfo();


const BLOCKCHAIN = 'NEO';
const VERSION = 'V1.0.0';

enum ArgumentDataType {
    STRING = 'String',
    BOOLEAN = 'Boolean',
    HASH160 = 'Hash160',
    HASH256 = 'Hash256',
    INTEGER = 'Integer',
    BYTEARRAY = 'ByteArray',
    ARRAY = 'Array',
    ADDRESS = 'Address',
    HOOKTXID = 'Hook_Txid',
}

enum Command {
    isReady = 'isReady',
    getProvider = 'getProvider',
    getNetworks = 'getNetworks',
    getAccount = 'getAccount',
    getPublicKey = 'getPublicKey',
    getBalance = 'getBalance',
    getStorage = 'getStorage',
    invokeRead = 'invokeRead',
    invokeReadGroup = 'invokeReadGroup',
    send = 'send',
    invoke = 'invoke',
    invokeGroup = "invokeGroup",
    event = 'event',
    disconnect = 'disconnect',
    deployContract = "deployContract",
    sendScript = "sendScript",
    getAddressFromScriptHash = 'getAddressFromScriptHash',
    getBlock = 'getBlock',
    getTransaction = 'getTransaction',
    getApplicationLog = 'getApplicationLog',
    TOOLS_validateAddress = 'TOOLS.validateAddress',
    TOOLS_getAddressFromScriptHash = 'TOOLS.getAddressFromScriptHash',
    TOOLS_getStringFromHexstr = 'TOOLS.getStringFromHexstr',
    TOOLS_getBigIntegerFromHexstr = 'TOOLS.getBigIntegerFromHexstr',
    TOOLS_reverseHexstr = 'TOOLS.reverseHexstr',
    TOOLS_getBigIntegerFromAssetAmount = 'TOOLS.getBigIntegerFromAssetAmount',
    TOOLS_getDecimalsFromAssetAmount = 'TOOLS.getDecimalsFromAssetAmount',
    NNS_getNamehashFromDomain = 'NNS.getNamehashFromDomain',
    NNS_getAddressFromDomain = 'NNS.getAddressFromDomain',
    NNS_getDomainFromAddress = 'NNS.getDomainFromAddress'
}

enum EventName {
    READY = 'READY',
    ACCOUNT_CHANGED = 'ACCOUNT_CHANGED',
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED',
    NETWORK_CHANGED = 'NETWORK_CHANGED',
}

interface GetBigIntegerFromAssetAmountArgs {
    amount: string;
    assetID: string;
    network: 'MainNet' | 'TestNet';
}

interface GetDecimalsFromAssetAmountArgs {
    amount: string;
    assetID: string;
    network: 'MainNet' | 'TestNet';
}

/**
 * @param {number} blockHeight 区块高度
 * @param {string} network 网络
 */
interface GetBlockArgs {
    blockHeight: number;  // 区块高度
    network: string // 网络
}

interface GetTransactionArgs {
    txid: string;
    network: string;
}

interface GetApplicationLogArgs {
    txid: string;
    network: string;
}

interface GetStorageArgs {
    scriptHash: string;
    key: string;
    network: string;
}

interface GetStorageOutput {
    result: string;
}

/**
 * invoke 请求参数
 * @param {scriptHash} 合约hash
 * @param {operation} 调用合约的方法名
 * @param {stgring} 网络费
 * 
 */
interface InvokeArgs extends InvokeInput {
    scriptHash: string;
    operation: string;
    networkFee?: string;
    systemFee?: string;
    network: "TestNet" | "MainNet";
    arguments: Array<Argument>;
    attachedAssets?: AttachedAssets;
    assetIntentOverrides?: AssetIntentOverrides;
    triggerContractVerification?: boolean;
    description?: string;
}

interface SendScriptArgs {
    scriptHash: string;
    scriptArguments: Argument[];
    attachedAssets?: AttachedAssets;
    assetIntentOverrides?: AssetIntentOverrides;
    fee?: string;
    sysfee?: string;
    description?: string;
    network?: "TestNet" | "MainNet";
}

interface AttachedGas {
    [ addr: string ]: string;
}

interface AttachedAssets {
    [ asset: string ]: string;
}

interface AssetIntentOverrides {
    inputs: AssetInput[];
    outputs: AssetOutput[];
}

interface AssetInput {
    txid: string;
    index: number;
}

interface AssetOutput {
    asset: string;
    address: number;
    value: string;
}

interface InvokeOutput {
    txid: string;
    nodeUrl: string;
}

interface Argument {
    type: "String" | "Boolean" | "Hash160" | "Hash256" | "Integer" | "ByteArray" | "Array" | "Address" | "Hook_Txid";
    value: string | number | boolean | Array<Argument>
}

interface Asset {
    NEO: string;
    GAS: string;
}

interface InvokeGroup {
    merge: boolean;
    group: InvokeArgs[];
}

interface InvokeInput {
    scriptHash: string;
    operation: string;
    arguments?: Argument[];
    network: string;
}

interface InvokeReadGroup {
    group: InvokeInput[];
}

interface InvokeGroupOutup {

}

interface BalanceRequest {
    address: string; // Address to check balance(s)
    assets?: string[]; // Asset symbol or script hash to check balance
    fetchUTXO?: boolean;
}

interface GetBalanceArgs {
    params: BalanceRequest | BalanceRequest[];
    network: string;
}

interface BalanceResults {
    [ address: string ]: Balance[];
}

interface Balance {
    assetID: string;
    symbol: string;
    amount: string;
}

interface GetNetworksOutput {
    networks: string[];
    defaultNetwork: string;
}

interface AccountOutput {
    address: string;
    label: string;
}

interface SendArgs {
    fromAddress: string;
    toAddress: string;
    asset: string;
    amount: string;
    remark?: string;
    networkFee?: string;
    systemFee?: string;
    network: "TestNet" | "MainNet";
    fee?: string;
}

interface SendOutput {
    txid: string;
    nodeUrl: string;
}

interface DeployContractArgs {
    contractHash: string     // 合约hash
    description: string;     // 备注信息
    email: string;           // 邮件
    author: string;          // 作者
    version: string,        // 版本
    name: string;           // 名称
    avmhex: string;         // avm hex字符串
    call: boolean;           // 是否动态调用
    storage: boolean;        // 是否存储区
    payment: boolean;        // 是否支持付费
    fee?: string;
    network?: 'MainNet' | 'TestNet';
}

interface Provider {
    name: string;
    version: string;
    compatibility: string[];
    website: string;
    extra?: {
        theme: string,
        currency: string,
    };
}

interface GetPublickeyOutput {
    address: string,
    publickey: string
}

interface DomainArgs {
    domain: string;
    network: 'MainNet' | 'TestNet'
}

interface AddressArgs {
    address: string;
    network: 'MainNet' | 'TestNet'
}

enum DataType {
    Array = 'Array',
    ByteArray = 'ByteArray',
    Integer = 'Integer',
    Boolean = 'Boolean',
    String = 'String'
}

class ResultItem {
    public data: Uint8Array;
    public subItem: ResultItem[];

    public static FromJson(type: string, value: any): ResultItem {
        let item: ResultItem = new ResultItem();
        if (type === DataType.Array) {
            item.subItem = []//new ResultItem[(value as Array<any>).length];
            for (let i = 0; i < (value as any[]).length; i++) {
                let subjson = ((value as any)[ i ] as Map<string, any>);
                let subtype = (subjson[ "type" ] as string);
                item.subItem.push(ResultItem.FromJson(subtype, subjson[ "value" ]));
            }
        }
        else if (type === DataType.ByteArray) {
            item.data = ((value as string)).hexToBytes()
        }
        else if (type === DataType.Integer) {
            item.data = Neo.BigInteger.parse(value as string).toUint8Array();
        }
        else if (type === DataType.Boolean) {
            if ((value as number) != 0)
                item.data = new Uint8Array(0x01);
            else
                item.data = new Uint8Array(0x00);
        }
        else if (type === DataType.String) {
            item.data = ThinNeo.Helper.String2Bytes(value as string);
        }
        else {
            console.log("not support type:" + type);
        }
        return item;
    }


    public AsHexString(): string {
        return (this.data).toHexString();
    }
    public AsHashString(): string {
        return this.data.reverse().toHexString();
    }
    public AsString(): string {
        if (this.data.length === 1 && this.data[ 0 ] === 0)
            return "";
        return ThinNeo.Helper.Bytes2String(this.data);
    }
    public AsHash160(): Neo.Uint160 {
        if (this.data.length === 0)
            return null;
        return new Neo.Uint160(this.data.buffer);
    }

    public AsHash256(): Neo.Uint256 {
        if (this.data.length === 0)
            return null;
        return new Neo.Uint256(this.data.buffer)
    }
    public AsBoolean(): boolean {
        if (this.data.length === 0 || this.data[ 0 ] === 0)
            return false;
        return true;
    }

    public AsInteger(): Neo.BigInteger {
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

function getBase64ByUrl(url: string) {
    return new Promise<string>((r, j) => {
        var image = new Image();
        image.src = url;
        image.onload = () => {
            let base64 = getBase64Image(image);
            r(base64);
        }
    })
}

var getHistoryList = () => {
    const list: TaskHistory[] = [];
    if (!storage.account) {
        return list;
    }
    for (const txid in TaskManager.shed) {
        if (TaskManager.shed.hasOwnProperty(txid)) {
            const task: TaskHistory = TaskManager.shed[ txid ];
            if (task.network == storage.network && task.currentAddr == storage.account.address) {
                const sendHistory = TaskManager.sendHistory[ txid ];
                const invokeHistory = TaskManager.invokeHistory[ txid ];
                let dappMessage = undefined;
                if (task.type == ConfirmType.contract && invokeHistory) {
                    dappMessage = TaskManager.dappsMessage[ invokeHistory.domain ];
                    task[ 'dappMessage' ] = dappMessage;
                    task[ 'invokeHistory' ] = invokeHistory;
                    list.push(task);
                }
                else if (task.type == ConfirmType.tranfer && sendHistory) {
                    task[ 'sendHistory' ] = sendHistory;
                    list.push(task);
                }
                else if (task.type == ConfirmType.claimgas) {
                    task[ 'sendHistory' ] = sendHistory;
                    list.push(task);
                }
                else if (task.type == ConfirmType.deploy) {
                    const deployhis = TaskManager.deployHistory[ txid ];
                    dappMessage = TaskManager.dappsMessage[ deployhis.domain ];
                    console.log('dappmsg', dappMessage);
                    console.log('deploy history', deployhis);

                    task[ 'deployHistory' ] = deployhis;
                    task[ 'dappMessage' ] = dappMessage;
                    list.push(task);
                }
            }
        }
    }
    return list;
}

interface TaskHistory extends Task {
    dappMessage?: { icon: string, title: string };
    invokeHistory?: InvokeHistory;
    sendHistory?: SendArgs;
    deployHistory?: DeployHistory;
}

class NNSTool {
    static readonly baseContract = Neo.Uint160.parse("348387116c4a75e420663277d9c02049907128c7");

    static async resolveData(domain: string) {

        var scriptaddress = this.baseContract;
        let nnshash = this.domainToHash(domain).toArray().reverse().toHexString();
        const res = await invokeReadGroup({
            group: [
                {
                    scriptHash: scriptaddress.toString(),
                    operation: "resolve",
                    arguments: [
                        { type: "String", value: "addr" },
                        { type: 'ByteArray', value: nnshash },
                        { type: "String", value: "" }
                    ],
                    network: "TestNet"
                },
                {
                    scriptHash: scriptaddress.toString(),
                    operation: 'getOwnerInfo',
                    arguments: [
                        { type: 'ByteArray', value: nnshash }
                    ],
                    network: "TestNet"
                }
            ]
        })

        var state = res[ 'state' ] as string;
        let addr = "";
        let ttl = "";
        if (state.includes("HALT")) {
            var stackarr = res[ "stack" ] as any[];
            let stack = ResultItem.FromJson(DataType.Array, stackarr);
            addr = stack.subItem[ 0 ].AsString();
            const ownerInfo = stack.subItem[ 1 ].subItem;
            ttl = ownerInfo[ 3 ].AsInteger().toString();
            // const resolver = ownerInfo[2].AsHash160().toString();
            // const register = ownerInfo[1].AsHash160().toString();
            // const owner = ownerInfo[0].AsHash160().toString();
        }
        return { address: addr, TTL: ttl };
    }

    /**
     * 域名转hash    
     * #region 域名转hash算法
     * 域名转hash算法
     * aaa.bb.test =>{"test","bb","aa"}
     * @param domain 域名
     */
    static nameHash(domain: string): Neo.Uint256 {
        var domain_bytes = ThinNeo.Helper.String2Bytes(domain);
        var hashd = Neo.Cryptography.Sha256.computeHash(domain_bytes);
        return new Neo.Uint256(hashd);
    }

    /**
     * 子域名转hash
     * @param roothash  根域名hash
     * @param subdomain 子域名
     */
    static nameHashSub(roothash: Neo.Uint256, subdomain: string): Neo.Uint256 {
        var bs: Uint8Array = ThinNeo.Helper.String2Bytes(subdomain);
        if (bs.length == 0)
            return roothash;

        var domain = Neo.Cryptography.Sha256.computeHash(bs);
        var domain_bytes = new Uint8Array(domain);
        var domainUint8arry = domain_bytes.concat(new Uint8Array(roothash.bits.buffer));

        var sub = Neo.Cryptography.Sha256.computeHash(domainUint8arry);
        return new Neo.Uint256(sub);
    }

    /**
     * 返回一组域名的最终hash
     * @param domainarray 域名倒叙的数组
     */
    static nameHashArray(domainarray: string[]): Neo.Uint256 {
        domainarray.reverse();
        var hash: Neo.Uint256 = NNSTool.nameHash(domainarray[ 0 ]);
        for (var i = 1; i < domainarray.length; i++) {
            hash = NNSTool.nameHashSub(hash, domainarray[ i ]);
        }
        return hash;
    }

    static domainToHash(domain: string): Neo.Uint256 {
        return this.nameHashArray(domain.split("."));
    }

    static verifyDomain(domain) {
        //check domain valid
        var reg = /^(.+\.)(test|TEST|neo|NEO[a-z][a-z])$/;
        if (!reg.test(domain)) {
            return false;
        }
        else {
            return true;
        }
    }

    static verifyAddr(addr) {
        var reg = /^[a-zA-Z0-9]{34,34}$/
        if (!reg.test(addr)) {
            return false;
        }
        else {
            return true;
        }
    }

    static verifyNeoDomain(domain) {
        //check domain valid
        var reg = /^(.+\.)(neo|Neo)$/;
        if (!reg.test(domain)) {
            return false;
        }
        else {
            return true;
        }
    }

}

var getAccountTaskState = (addr: string) => {
    const count = storage.accountWaitTaskCount[ addr ] ? storage.accountWaitTaskCount[ addr ] : 0;
    return count;
}