/// <reference path="../../src/lib/neo-thinsdk.d.ts" />
declare var storage: any;
declare const HASH_CONFIG: {
    accountCGAS: Neo.Uint160;
    ID_CGAS: Neo.Uint160;
    DAPP_NNC: Neo.Uint160;
    baseContract: Neo.Uint160;
    resolverHash: string;
    ID_GAS: string;
    ID_NEO: string;
    saleContract: Neo.Uint160;
    ID_NNC: Neo.Uint160;
    ID_NNK: Neo.Uint160;
};
declare const baseCommonUrl = "https://api.nel.group/api";
declare const baseUrl = "https://apiwallet.nel.group/api";
declare class Result {
    err: boolean;
    info: any;
}
/**
 * -------------------------以下是账户所使用到的实体类
 */
declare class NepAccount {
    index?: number;
    walletName: string;
    address: string;
    nep2key: string;
    scrypt: ThinNeo.nep6ScryptParameters;
    constructor(name: string, addr: string, nep2: string, scrypt: ThinNeo.nep6ScryptParameters, index?: number);
    static deciphering: (password: string, nepaccount: NepAccount) => Promise<AccountInfo>;
    static encryption: (password: string, prikey: Uint8Array) => Promise<AccountInfo>;
}
declare class AccountInfo extends NepAccount {
    constructor(nepaccount: NepAccount, prikey: Uint8Array, pubkey: Uint8Array);
    private _prikey;
    private _pubkey;
    pubkeyHex: string;
    prikeyHex: string;
    address: string;
    getPrikey(): Uint8Array;
    pubkey: Uint8Array;
    prikey: Uint8Array;
}
interface LoginInfo {
    pubkey: Uint8Array;
    prikey: Uint8Array;
    address: string;
}
/**
 * invoke 请求参数
 * @param {scriptHash} 合约hash
 * @param {operation} 调用合约的方法名
 * @param {stgring} 网络费
 *
 */
interface InvokeArgs {
    scriptHash: string;
    operation: string;
    fee?: string;
    network: "TestNet" | "MainNet";
    arguments: Array<Argument>;
    attachedAssets?: Array<AttachedAssets>;
    assetIntentOverrides?: AssetIntentOverrides;
    triggerContractVerification?: boolean;
}
interface AttachedAssets {
    [asset: string]: string;
}
interface Argument {
    type: "String" | "Boolean" | "Hash160" | "Integer" | "ByteArray" | "Array" | "Address" | "Hook_Txid";
    value: string | number | boolean | Array<Argument>;
}
interface Asset {
    NEO: string;
    GAS: string;
}
declare class MarkUtxo {
    txid: string;
    n: number;
    constructor(txid: string, n: number);
    /**
     * 塞入标记
     * @param utxos 标记
     */
    static setMark(utxos: MarkUtxo[]): void;
    static getAllUtxo(): Promise<{
        [id: string]: Utxo[];
    }>;
    static getUtxoByAsset(assetId: string): Promise<Array<Utxo>>;
}
interface ICoinStore {
    assets: {
        [id: string]: Utxo[];
    };
    initUtxos: () => Promise<boolean>;
}
declare class Utxo {
    addr: string;
    txid: string;
    n: number;
    asset: string;
    count: Neo.Fixed8;
}
declare const bg: Window;
declare const Storage_local: {
    setAccount: (account: AccountInfo) => number;
    getAccount: () => NepAccount[];
};
/**
 * 主要用于background的内存数据的存储和读取
 */
declare class Storage_internal {
    static set: (key: string, value: any) => void;
    static get<T>(key: string): T;
}
declare class Transaction extends ThinNeo.Transaction {
    marks: MarkUtxo[];
    constructor(type?: ThinNeo.TransactionType);
    /**
     * setScript 往交易中塞入脚本 修改交易类型为 InvokeTransaction
     */
    setScript(script: Uint8Array): void;
    /**
     * 创建一个交易中的输入和输出 将使用过的utxo 放入 marks
     * @param utxos 资产的utxo
     * @param sendcount 输出总数
     * @param target 对方地址
     */
    creatInuptAndOutup(utxos: Utxo[], sendcount: Neo.Fixed8, target?: string): void;
    getTxid(): string;
}
/**
 * 我的账户管理
 */
declare class Common {
    constructor();
    private tabname;
    private _network;
    private _account;
    private _accountList;
    network: string;
    accountList: NepAccount[];
    account: AccountInfo;
}
declare const common: Common;
declare const makeRpcPostBody: (method: any, params: any) => string;
interface IOpts {
    method: string;
    params: any[];
    isGET?: boolean;
    baseUrl?: string;
    getAll?: boolean;
}
declare const makeRpcUrl: (url: any, method: any, params: any) => string;
declare function request(opts: IOpts): Promise<any>;
declare const Api: {
    /**
     * 获取nep5的资产（CGAS）
     */
    getnep5balanceofaddress: (address: any, assetId: any) => Promise<any>;
    /**
     * 获取nep5的资产（CGAS）
     */
    getallnep5assetofaddress: (address: any) => Promise<any>;
    /**
     * 获取nep5的资产（CGAS）
     */
    getUtxoBalance: (address: any, assetId: any) => Promise<any>;
    getregisteraddressbalance: (address: any, register: any) => Promise<any>;
    sendrawtransaction: (data: any) => Promise<any>;
    getUtxo: (address: any) => Promise<any>;
    getDomainInfo: (domain: any) => Promise<any>;
    /**
     * 判断交易是否入链
     * @param txid 交易id
     */
    hasTx: (txid: any) => Promise<any>;
    /**
     * 判断合约调用是否抛出 notify
     * @param txid 交易id
     */
    hasContract: (txid: any) => Promise<any>;
    /**
     * 判断双交易是否成功
     * @param txid 交易id
     */
    getRehargeAndTransfer: (txid: any) => Promise<any>;
    getBlockCount: () => Promise<any>;
    getBalance: (addr: any) => Promise<any>;
    rechargeAndTransfer: (data1: any, data2: any) => Promise<any>;
    /**
     * @method 获得nep5资产信息
     * @param asset 资产id
     */
    getnep5asset: (asset: any) => Promise<any>;
};
declare function invokeScriptBuild(data: any): Uint8Array;
declare const contractBuilder: (invoke: InvokeArgs) => Promise<any>;
declare function openNotify(call: any): void;
declare const getAccount: (title: any, data: any) => void;
declare const invokeGroup: (title: any, data: any) => void;
declare const getNetworks: (title: any, data: any) => void;
declare const getBalance: (title: any, data: GetBalanceArgs) => Promise<void>;
declare const send: (title: any, data: any) => void;
interface GetStorageArgs {
    scriptHash: string;
    key: string;
    network: string;
}
interface GetStorageOutput {
    result: string;
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
    type: "String" | "Boolean" | "Hash160" | "Integer" | "ByteArray" | "Array" | "Address" | "Hook_Txid";
    value: string | number | boolean | Array<Argument>;
}
interface Asset {
    NEO: string;
    GAS: string;
}
interface InvokeGroup {
    merge: boolean;
    group: Array<InvokeArgs>;
}
interface BalanceRequest {
    address: string;
    assets?: string[];
    fetchUTXO?: boolean;
}
interface GetBalanceArgs {
    params: BalanceRequest | BalanceRequest[];
    network: string;
}
interface BalanceResults {
    [address: string]: Balance[];
}
interface Balance {
    assetID: string;
    symbol: string;
    amount: string;
}
//# sourceMappingURL=background.d.ts.map