/// <reference path="../../src/lib/neo-thinsdk.d.ts" />
/// <reference types="chrome" />
interface BackStore {
    network: "TestNet" | "MainNet";
    height: number;
    account: AccountInfo;
    domains: string[];
    titles: string[];
    oldUtxo: {
        [txid: string]: number[];
    };
}
declare const storage: BackStore;
declare const HASH_CONFIG: {
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
declare const testRpcUrl = "http://test.nel.group:20332";
declare const mainRpcUrl = "http://seed.nel.group:10332";
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
declare class Storage_local {
    static setAccount(account: NepAccount): NepAccount;
    static getAccount(): NepAccount[];
    static set(key: string, value: any): Promise<{}>;
    static get<T>(key: string): Promise<T>;
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
     * @param netfee 有手续费的时候使用，并且使用的utxos是gas的时候
     */
    creatInuptAndOutup(utxos: Utxo[], sendcount: Neo.Fixed8, target?: string, netfee?: Neo.Fixed8): void;
    getTxid(): string;
}
declare const makeRpcPostBody: (method: any, params: any) => string;
interface IOpts {
    method: string;
    params: any[];
    isGET?: boolean;
    baseUrl?: 'common' | 'rpc';
    getAll?: boolean;
    network?: "TestNet" | "MainNet";
    getNode?: boolean;
}
declare const makeRpcUrl: (url: any, method: any, params: any) => string;
/**
 * api 请求方法
 * @param opts 请求参数
 */
declare function request(opts: IOpts): Promise<any>;
declare const Api: {
    getAssetState: (assetID: string) => Promise<any>;
    getStorage: (scriptHash: string, key: string) => Promise<any>;
    getcontractstate: (scriptaddr: string) => Promise<any>;
    getavailableutxos: (address: string, count: number) => Promise<any>;
    getInvokeRead: (scriptHash: string) => Promise<any>;
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
    sendrawtransaction: (data: any, network?: "TestNet" | "MainNet") => Promise<any>;
    getUtxo: (address: any) => Promise<any>;
    getDomainInfo: (domain: any) => Promise<any>;
    /**
     * 判断交易是否入链
     * @param txid 交易id
     */
    hasTx: (txid: any) => Promise<any>;
    getrawtransaction: (txid: any, network?: "TestNet" | "MainNet") => Promise<any>;
    /**
     *
     */
    getrawtransaction_api: (txid: any) => Promise<any>;
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
declare const setContractMessage: (txid: string, domain: string, data: any) => void;
declare const getWeakRandomValues: (array: number | Uint8Array) => Uint8Array;
declare class ScriptBuild extends ThinNeo.ScriptBuilder {
    constructor();
    /**
     *
     * @param argument
     */
    EmitArguments(argument: Argument[], hookTxid?: string): ThinNeo.ScriptBuilder;
    EmitInvokeArgs(data: InvokeArgs | InvokeArgs[], hookTxid?: string): Uint8Array;
}
/**
 * 构造合约调用交易
 * @param invoke invoke调用参数
 */
declare var contractBuilder: (invoke: InvokeArgs) => Promise<InvokeOutput>;
/**
 * 打包合并交易
 * @param data 合并合约调用参数
 */
declare const invokeGroupBuild: (data: InvokeGroup) => Promise<InvokeOutput[]>;
/**
 * 发送
 * @param trans
 */
declare const sendGroupTranstion: (trans: Transaction[]) => Promise<InvokeOutput[]>;
/**
 *
 * @param transcount 转换金额
 * @param netfee 交易费用
 */
declare var exchangeCgas: (transcount: number, netfee: number) => Promise<InvokeOutput[]>;
declare var exchangeGas: (transcount: number, netfee: number) => Promise<InvokeOutput>;
declare var makeRefundTransaction: (transcount: number, netfee: number) => Promise<InvokeOutput>;
/**
 *
 * @param utxo 兑换gas的utxo
 * @param transcount 兑换的数量
 */
declare var makeRefundTransaction_tranGas: (utxo: Utxo, transcount: number, netfee: number) => Promise<TransferGroup>;
declare const transactionSignAndSend: (tran: Transaction) => Promise<InvokeOutput>;
interface NotifyMessage {
    header?: {
        title: string;
        domain: string;
        icon?: string;
    };
    account?: {
        address: string;
        walletName: string;
    };
    lable: Command;
    data?: any;
}
/**
 * 打开notify页面并传递信息，返回调用
 * @param call 回调方法
 * @param data 通知信息
 */
declare const openNotify: (notifyData: NotifyMessage) => Promise<boolean>;
/**
 * 请求账户信息
 */
declare const getAccount: () => Promise<{}>;
/**
 * invokeGroup 合约调用
 * @param title 请求的网页信息
 * @param data 传递的数据
 */
declare const invokeGroup: (header: any, params: InvokeGroup) => Promise<{}>;
/**
 * invoke 合约调用
 * @param title dapp请求方的信息
 * @param data 请求的参数
 */
declare const invoke: (header: any, params: InvokeArgs) => Promise<{}>;
/**
 * 获得网络状态信息
 */
declare const getNetworks: () => Promise<GetNetworksOutput>;
/**
 * 余额获取
 * @param data 请求的参数
 */
declare var getBalance: (data: GetBalanceArgs) => Promise<{}>;
declare var transfer: (data: SendArgs) => Promise<SendOutput>;
declare var send: (header: any, params: SendArgs) => Promise<SendOutput>;
/**
 * invoke试运行方法
 * @param data invokeRead 的参数
 */
declare var invokeRead: (data: InvokeReadInput) => Promise<{}>;
declare var invokeReadTest: () => void;
declare var invokeReadGroup: (data: InvokeReadGroup) => Promise<{}>;
declare var invokeArgsAnalyse: (...invokes: InvokeArgs[]) => Promise<{
    scriptHashs: string[];
    descriptions: string[];
    operations: string[];
    arguments: any[];
    expenses: {
        symbol: string;
        amount: string;
        assetid: string;
    }[];
    fee: string;
}>;
declare var queryAssetSymbol: (assetID: string, network: "TestNet" | "MainNet") => Promise<{
    symbol: string;
    decimals: number;
}>;
declare const getProvider: () => Promise<{}>;
declare const getStorage: (data: GetStorageArgs) => Promise<GetStorageOutput>;
declare const getPublicKey: () => Promise<GetPublickeyOutput>;
declare const notifyInit: (title: string, domain: string, favIconUrl: string) => Promise<{}>;
declare const showNotify: (title: any, msg: any) => void;
/**
 * 通过正则获得url中的域名
 * @param Url url链接
 */
declare const getURLDomain: (Url: string) => string;
/**
 * 处理请求并返回
 * @param sender An object containing information about the script context that sent a message or request.
 * @param request 请求数据
 */
declare const responseMessage: (sender: chrome.runtime.MessageSender, request: any) => void;
declare enum ConfirmType {
    tranfer = 0,
    contract = 1
}
declare enum TaskState {
    watting = 0,
    success = 1,
    fail = 2,
    watForLast = 3,
    failForLast = 4
}
declare class Task {
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
    constructor(type: ConfirmType, txid: string, next?: TransferGroup, state?: TaskState, messgae?: any);
}
declare class TransferGroup {
    txid: string;
    txhex: string;
    executeError?: {
        type: string;
        data: string;
        description: string;
    };
    static update(tran: TransferGroup, network?: 'TestNet' | 'MainNet'): void;
}
interface InvokeHistory {
    domain: string;
    scriptHashs: string[];
    descripts: string[];
    expenses: {
        assetid: string;
        symbol: string;
        amount: string;
    }[];
    netfee: string;
}
declare class TaskManager {
    static shed: {
        [txid: string]: Task;
    };
    static invokeHistory: {
        [txid: string]: InvokeHistory;
    };
    static sendHistory: {
        [txid: string]: SendArgs;
    };
    static dappsMessage: {
        [txid: string]: {
            title: string;
            icon: string;
        };
    };
    static table: string;
    static socket: SocketManager;
    static blockDatas: {
        blockHeight: number;
        blockTime: number;
        blockHash: string;
        timeDiff: number;
    }[];
    static start(): void;
    static readonly webSocketURL: "wss://testws.nel.group/ws/mainnet" | "wss://testws.nel.group/ws/testnet";
    static addSendData(txid: string, data: SendArgs): void;
    static addInvokeData(txid: string, domain: string, data: InvokeArgs | InvokeArgs[]): void;
    static InvokeDataUpdate(): void;
    static addTask(task: Task): void;
    static initShed(): Promise<{}>;
    static update(): void;
}
declare const BLOCKCHAIN = "NEO";
declare const VERSION = "v1";
declare enum ArgumentDataType {
    STRING = "String",
    BOOLEAN = "Boolean",
    HASH160 = "Hash160",
    HASH256 = "Hash256",
    INTEGER = "Integer",
    BYTEARRAY = "ByteArray",
    ARRAY = "Array",
    ADDRESS = "Address",
    HOOKTXID = "Hook_Txid"
}
declare enum Command {
    isReady = "isReady",
    getProvider = "getProvider",
    getNetworks = "getNetworks",
    getAccount = "getAccount",
    getPublicKey = "getPublicKey",
    getBalance = "getBalance",
    getStorage = "getStorage",
    invokeRead = "invokeRead",
    invokeReadGroup = "invokeReadGroup",
    send = "send",
    invoke = "invoke",
    invokeGroup = "invokeGroup",
    event = "event",
    disconnect = "disconnect",
    getAddressFromScriptHash = "getAddressFromScriptHash"
}
declare enum EventName {
    READY = "READY",
    ACCOUNT_CHANGED = "ACCOUNT_CHANGED",
    CONNECTED = "CONNECTED",
    DISCONNECTED = "DISCONNECTED",
    NETWORK_CHANGED = "NETWORK_CHANGED"
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
interface InvokeArgs {
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
    [asset: string]: string;
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
    value: string | number | boolean | Array<Argument>;
}
interface Asset {
    NEO: string;
    GAS: string;
}
interface InvokeGroup {
    merge: boolean;
    group: InvokeArgs[];
}
interface InvokeReadInput {
    scriptHash: string;
    operation: string;
    arguments?: Argument[];
    network: string;
}
interface InvokeReadGroup {
    group: InvokeReadInput[];
}
interface InvokeGroupOutup {
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
    network: "TestNet" | "MainNet";
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
        theme: string;
        currency: string;
    };
}
interface GetPublickeyOutput {
    address: string;
    publickey: string;
}
declare enum DataType {
    Array = "Array",
    ByteArray = "ByteArray",
    Integer = "Integer",
    Boolean = "Boolean",
    String = "String"
}
declare class ResultItem {
    data: Uint8Array;
    subItem: ResultItem[];
    static FromJson(type: string, value: any): ResultItem;
    AsHexString(): string;
    AsHashString(): string;
    AsString(): string;
    AsHash160(): Neo.Uint160;
    AsHash256(): Neo.Uint256;
    AsBoolean(): boolean;
    AsInteger(): Neo.BigInteger;
}
declare function getBase64Image(img: any): string;
declare function getBase64ByUrl(url: string): Promise<string>;
declare var getHistoryList: () => TaskHistory[];
interface TaskHistory extends Task {
    dappMessage?: {
        icon: string;
        title: string;
    };
    invokeHistory?: InvokeHistory;
    sendHistory?: SendArgs;
}
//# sourceMappingURL=background.d.ts.map