import { Storage_internal } from "../view/popup/utils/storagetools";
import { Api } from "../view/popup/store/api/common.api";
import common from "../view/popup/store/common";

export class Result {
    err: boolean;
    info: any;
}

export interface NotifyMessage {
    header: {
        title: string,
        domain: string,
    },
    account: {
        address: string,
        walletName: string,
    },
    lable: Command
    data?: any
}
/**
 * -------------------------以下是账户所使用到的实体类
 */

export class NepAccount {
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

    static deciphering = async (password: string, nepaccount: NepAccount) => {
        return new Promise<AccountInfo>((resolve, reject) => {
            ThinNeo.Helper.GetPrivateKeyFromNep2(nepaccount.nep2key, password, nepaccount.scrypt.N, nepaccount.scrypt.r, nepaccount.scrypt.p, (info, result) => {
                if ("nep2 hash not match." == result)
                    reject(result);
                const prikey = result as Uint8Array;
                if (prikey != null) {
                    const pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                    let account = new AccountInfo(
                        nepaccount,
                        prikey,
                        pubkey
                    );
                    resolve(account);
                }
                else {
                    reject("prikey is null");
                }
            });
        })
    }

    static encryption = async (password: string, prikey: Uint8Array) => {

        return new Promise<AccountInfo>((resolve, reject) => {
            var array = new Uint8Array(32);
            var key = Neo.Cryptography.RandomNumberGenerator.getRandomValues<Uint8Array>(array);
            // spanPri.textContent = key.toHexString();
            const pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(key);
            const address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
            const scrypt = new ThinNeo.nep6ScryptParameters();
            scrypt.N = 16384;
            scrypt.r = 8;
            scrypt.p = 8;
            ThinNeo.Helper.GetNep2FromPrivateKey(key, password, scrypt.N, scrypt.r, scrypt.p, (info, result) => {
                if (info == "finish") {
                    resolve(new AccountInfo(
                        new NepAccount("", address, result, scrypt),
                        prikey,
                        pubkey
                    ));
                }
                else {
                    reject(result);
                }
            });
        })
    }
}

export class AccountInfo extends NepAccount {
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

export interface LoginInfo {
    pubkey: Uint8Array;
    prikey: Uint8Array;
    address: string;
}


/**
 * Invoke
 */

export interface Invoke {
    scriptHash: string;
    operation: string;
    arguments: Array<Argument>;
    assets: { [ asset: string ]: string };
    fee: string;
    network: "TestNet" | "MainNet"
}

/**
 * 
 */

export class MarkUtxo {
    public txid: string;
    public n: number;
    constructor(txid: string, n: number) {
        this.txid = txid;
        this.n = n;
    }

    /**
     * 塞入标记
     * @param utxos 标记
     */
    public static setMark(utxos: MarkUtxo[]) {
        const session = Storage_internal.get<{ [ txid: string ]: number[] }>("utxo_manager");
        for (let index = 0; index < utxos.length; index++) {
            const utxo = utxos[ index ];
            if (session[ utxo.txid ]) {
                session[ utxo.txid ].push(utxo.n);
            }
            else {
                session[ utxo.txid ] = new Array<number>();
                session[ utxo.txid ].push(utxo.n);
            }
        }
        Storage_internal.set("utxo_manager", session);

    }



    public static async getAllUtxo(): Promise<{ [ id: string ]: Utxo[] }> {
        try {
            const utxos: any[] = await Api.getUtxo(common.account.address);   // 获得为使用的utxo
            if (!utxos) {
                return undefined;
            }
            const marks = Storage_internal.get<{ [ id: string ]: number[] }>("utxo_manager");   // 获得被标记的utxo
            const assets: { [ id: string ]: Utxo[] } = {};
            // 对utxo进行归类，并且将count由string转换成 Neo.Fixed8
            // tslint:disable-next-line:forin        
            for (const item of utxos) {
                const mark = marks ? marks[ item[ "txid" ] ] : undefined;
                if (!mark || !mark.join(",").includes(item.n))   // 排除已经标记的utxo返回给调用放
                {
                    const asset = item.asset;
                    if (assets[ asset ] === undefined || assets[ asset ] == null) {
                        assets[ asset ] = [];
                    }
                    const utxo = new Utxo();
                    utxo.addr = item.addr;
                    utxo.asset = item.asset;
                    utxo.n = item.n;
                    utxo.txid = item.txid;
                    utxo.count = Neo.Fixed8.parse(item.value);
                    assets[ asset ].push(utxo);
                }
            }
            return assets;
        }
        catch (error) {
            if (error[ "code" ] === "-1") {
                return {};
            } else {
                throw error;
            }
        }
    }

    public static async getUtxoByAsset(assetId: string): Promise<Array<Utxo>> {
        try {
            const all = await this.getAllUtxo();
            if (!all)
                return undefined;
            return all[ assetId ];
        } catch (error) {

        }
    }

    /**
     * getMark 获得被标记的utxo
     */
    // public static getMark()
    // {
    //     return Storage_internal.get<{[txid:string]:number[]}>("utxo_manager");
    // }

    // public height:number;
}

export interface ICoinStore {
    assets: { [ id: string ]: Utxo[] };
    initUtxos: () => Promise<boolean>;
}

export class Utxo {
    public addr: string;
    public txid: string;
    public n: number;
    public asset: string;
    public count: Neo.Fixed8;
}


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

export enum Command {
    isReady = 'isReady',
    getProvider = 'getProvider',
    getNetworks = 'getNetworks',
    getAccount = 'getAccount',
    getPublicKey = 'getPublicKey',
    getBalance = 'getBalance',
    getStorage = 'getStorage',
    invokeRead = 'invokeRead',
    send = 'send',
    invoke = 'invoke',
    deployContract = "deployContract",
    sendScript = "sendScript",
    invokeGroup = "invokeGroup",
    event = 'event',
    disconnect = 'disconnect',
}

enum EventName {
    READY = 'READY',
    ACCOUNT_CHANGED = 'ACCOUNT_CHANGED',
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED',
    NETWORK_CHANGED = 'NETWORK_CHANGED',
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
export interface InvokeArgs {
    scriptHash: string;
    operation: string;
    fee?: string;
    network: "TestNet" | "MainNet";
    arguments: Array<Argument>;
    attachedAssets?: AttachedAssets;
    assetIntentOverrides?: AssetIntentOverrides;
    triggerContractVerification?: boolean;
    description?: string;
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


export interface DeployContractArgs {
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
    network?: 'MainNet' | 'TestNet'
}

export interface Argument {
    type: "String" | "Boolean" | "Hash160" | "Hash256" | "Integer" | "ByteArray" | "Array" | "Address" | "Hook_Txid";
    value: string | number | boolean | Array<Argument>
}

export interface Asset {
    NEO: string;
    GAS: string;
}

interface InvokeGroup {
    merge: boolean;
    group: InvokeArgs[];
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
    fee?: string;
    network: string;
}

interface SendOutput {
    txid: string;
    nodeUrl: string;
}


interface Provider {
    name: string;
    version: string;
    compatibility: string[];
    website: string;
    extra: {
        theme: string,
        currency: string,
    };
}