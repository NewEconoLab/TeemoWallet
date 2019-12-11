/// <reference path="../../src/lib/neo-thinsdk.d.ts" />
/// <reference types="chrome" />
interface BackStore {
    network: "TestNet" | "MainNet";
    height: number;
    account: AccountInfo;
    domains: string[];
    titles: string[];
    oldUtxo: {
        [ txid: string ]: number[];
    };
    allAssetInfo: AssetInfo[];
    accountWaitTaskCount: {
        [ addr: string ]: number;
    };
}
declare const storage: BackStore;
declare var getBlockHeight: () => number;
declare const netstr: string;
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
declare const baseCommonUrl = "https://apiblockneo3.nel.group/api";
declare const baseUrl = "https://apiscanneo3.nel.group/api";
declare const testRpcUrl = "http://seed1t.neo.org:20332";
declare const mainRpcUrl = "http://seed.nel.group:10332";
declare const testRpcUrlList: string[];
declare const mainRpcUrlList: string[];
declare let testNode: Array<{
    node: string;
    height: number;
}>;
declare let mainNode: Array<{
    node: string;
    height: number;
}>;
interface Number {
    add(...arg: number[]): number;
    sub(...arg: number[]): number;
    mul(...arg: number[]): number;
    div(...arg: number[]): number;
}
/**
 * 以下是账户所使用到的实体类
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
declare class Storage_local {
    static setAccount(account: NepAccount): NepAccount;
    static getAccount(): NepAccount[];
    static set(key: string, value: any): Promise<unknown>;
    static get<T>(key: string): Promise<T>;
}
declare class Transaction extends ThinNeo.Transaction {
    scriptBuilder: ScriptBuild;
    contract: ThinSdk.Contract;
    constructor(sender?: string, currentBlockIndex?: number);
    calculateNetworkFee(): Neo.Long;
    getSystemFee(): Promise<Neo.Long>;
    pack(sysFee: number, netFee: number): {
        networkFee: Neo.Long;
        systemFee: Neo.Long;
    };
    signAndPack(prikey: Uint8Array): Uint8Array;
    getTxid(): string;
}
declare const makeRpcPostBody: (method: any, params: any) => string;
interface IOpts {
    method: string;
    params: any[];
    isGET?: boolean;
    baseUrl?: 'common' | 'rpc';
    otherUrl?: string;
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
    getInvokeRead: (scriptHash: string, network?: "TestNet" | "MainNet") => Promise<any>;
    /**
     * 获取nep5的资产（CGAS）
     */
    getnep5balanceofaddress: (address: any, assetId: any) => Promise<any>;
    /**
     * 获取nep5的资产（CGAS）
     */
    getallasset: () => Promise<any>;
    /**
     * 获取nep5的资产（CGAS）
     */
    getallnep5asset: () => Promise<any>;
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
    getBlockCount: (rpc?: string) => Promise<any>;
    getBalance: (addr: any) => Promise<any>;
    rechargeAndTransfer: (data1: any, data2: any) => Promise<any>;
    /**
     * @method 获得nep5资产信息
     * @param asset 资产id
     */
    getnep5asset: (asset: any) => Promise<any>;
    getBlock: (height: number) => Promise<any>;
    getApplicationLog: (txid: string) => Promise<any>;
    /**
     * 获得claimgas的utxo
     * @param address 地址
     * @param type 类型 1:不可领取；其余：可领取
     * @param page 页数
     * @param size 每页条数
     */
    getClaimgasUtxoList: (address: string, type: number, page: number, size: number, network?: "TestNet" | "MainNet") => Promise<any>;
    getclaimgas: (address: string, type: number, size: number, hide: number) => Promise<any>;
};
declare function networkSort(): Promise<void>;
declare const setContractMessage: (txid: string, domain: string, data: any) => void;
declare const getWeakRandomValues: (array: number | Uint8Array) => Uint8Array;
declare class ScriptBuild extends ThinNeo.ScriptBuilder {
    constructor();
    EmitParam(param: Argument, hookTxid?: string): this;
    /**
     *
     * @param argument 参数数组
     * @param hookTxid 关联交易id
     */
    EmitArguments(argument: Argument[], hookTxid?: string): ThinNeo.ScriptBuilder;
    EmitInvokeArgs(data: InvokeInput | InvokeInput[], hookTxid?: string): Uint8Array;
}
/**
 * 构造合约调用交易
 * @param invoke invoke调用参数
 */
declare var contractBuilder: (invokeArgs: InvokeArgs) => Promise<{
    txid: string;
    nodeUrl: string;
}>;
/**
 * 打包合并交易
 * @param data 合并合约调用参数
 */
declare const invokeGroupBuild: (data: InvokeGroup) => Promise<{
    txid: string;
    nodeUrl: string;
}[]>;
/**
 * 发送
 * @param trans
 */
declare const sendGroupTranstion: (trans: Transaction[]) => Promise<InvokeOutput[]>;
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
    version: number;
    id: string;
    type: string;
    name: {
        lang: string;
        name: string;
    }[];
    amount: string;
    available: string;
    precision: number;
    owner: string;
    admin: string;
    issuer: string;
    expiration: number;
    frozen: boolean;
}
declare const transactionSignAndSend: (tran: Transaction, net?: "TestNet" | "MainNet") => Promise<InvokeOutput>;
interface NotifyMessage {
    header: {
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
declare const openNotify: (notifyData: NotifyMessage, getData?: Promise<any>) => Promise<any>;
declare const getMessageID: () => string;
/**
 * 请求账户信息
 */
declare const getAccount: () => Promise<unknown>;
declare const calculateInvokeGroup: (params: InvokeGroup) => Promise<InvokeGroup>;
/**
 * invokeGroup 合约调用
 * @param title 请求的网页信息
 * @param data 传递的数据
 */
declare const invokeGroup: (header: any, params: InvokeGroup) => Promise<{
    txid: string;
    nodeUrl: string;
}[]>;
declare const createInvokeTran: (params: InvokeArgs) => Promise<InvokeArgs>;
/**
 * invoke 合约调用
 * @param title dapp请求方的信息
 * @param data 请求的参数
 */
declare const invoke: (header: any, params: InvokeArgs) => Promise<{
    txid: string;
    nodeUrl: string;
}>;
/**
 * 获得网络状态信息
 */
declare const getNetworks: () => Promise<GetNetworksOutput>;
/**
 * 余额获取
 * @param data 请求的参数
 */
declare var getBalance: (data: GetBalanceArgs) => Promise<unknown>;
declare var transfer: (data: SendArgs) => Promise<SendOutput>;
declare const createTranData: (data: SendArgs) => Promise<SendArgs>;
declare var send: (header: any, params: SendArgs) => Promise<SendOutput>;
/**
 * invoke试运行方法
 * @param data invokeRead 的参数
 */
declare var invokeRead: (data: InvokeInput) => Promise<any>;
declare var invokeReadGroup: (data: InvokeReadGroup) => Promise<unknown>;
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
    networkFee: string;
    systemFee: string;
}>;
declare var queryAssetSymbol: (assetID: string, network: "TestNet" | "MainNet") => Promise<{
    symbol: string;
    decimals: number;
}>;
declare const getProvider: () => Promise<unknown>;
declare const getStorage: (data: GetStorageArgs) => Promise<GetStorageOutput>;
declare const getPublicKey: () => Promise<GetPublickeyOutput>;
declare const notifyInit: (title: string, domain: string, favIconUrl: string) => Promise<unknown>;
declare const showNotify: (title: string, msg: string, call?: (notificationIds: string) => void) => void;
/**
 * 通过正则获得url中的域名
 * @param Url url链接
 */
declare const getURLDomain: (Url: string) => string;
/**
 * 查询区块高度
 * @param data 查询区块信息的参数，blockHeight,network
 */
declare const getBlock: (data: GetBlockArgs) => Promise<unknown>;
/**
 * 查询Application Log
 * @param data
 */
declare const getApplicationLog: (data: GetApplicationLogArgs) => Promise<unknown>;
/**
 * 查询交易信息
 * @param data
 */
declare const getTransaction: (data: GetTransactionArgs) => Promise<unknown>;
/**
 * 验证地址是否正确
 * @param address
 */
declare const validateAddress: (address: string) => Promise<unknown>;
/**
 * 将ScriptHash转换成Address
 * @param scriptHash
 */
declare const getAddressFromScriptHash: (scriptHash: string) => Promise<unknown>;
/**
 * 将hexstr转换成字符串
 * @param hexStr
 */
declare const getStringFromHexstr: (hexStr: string) => Promise<unknown>;
/**
 * 将hex转换成BigIngteger
 * @param hexStr
 */
declare const getBigIntegerFromHexstr: (hexStr: string) => Promise<unknown>;
/**
 * 反转 HexStr
 * @param hexStr
 */
declare const reverseHexstr: (hexStr: string) => Promise<unknown>;
/**
 * 将资产精度转换到大整数
 * @param amount
 * @param assetID
 */
declare const getBigIntegerFromAssetAmount: (params: GetBigIntegerFromAssetAmountArgs) => Promise<string>;
/**
 * 将资产精度转换到Decimals
 * @param amount
 * @param assetID
 */
declare const getDecimalsFromAssetAmount: (params: GetDecimalsFromAssetAmountArgs) => Promise<string>;
declare const getNamehashFromDomain: (params: string) => Promise<string>;
declare var getAddressFromDomain: (params: DomainArgs) => Promise<{
    address: string;
    TTL: string;
}>;
declare var getDomainFromAddress: (params: AddressArgs) => Promise<{
    namehash: string;
    fullDomainName: string;
    TTL: string;
}>;
/**
 * 处理请求并返回
 * @param sender An object containing information about the script context that sent a message or request.
 * @param request 请求数据
 */
declare const responseMessage: (sender: chrome.runtime.MessageSender, request: any) => void;
declare enum ConfirmType {
    tranfer = 0,
    contract = 1,
    toClaimgas = 2,
    claimgas = 3,
    deploy = 4
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
    systemFee?: string;
    networkFee?: string;
}
interface DeployHistory {
    domain: string;
    contractHash: string;
    description: string;
    email: string;
    author: string;
    version: string;
    name: string;
    call: boolean;
    storage: boolean;
    payment: boolean;
    sysfee: number;
}
declare class TaskManager {
    static shed: {
        [ txid: string ]: Task;
    };
    static invokeHistory: {
        [ txid: string ]: InvokeHistory;
    };
    static deployHistory: {
        [ txid: string ]: DeployHistory;
    };
    static sendHistory: {
        [ txid: string ]: SendArgs;
    };
    static dappsMessage: {
        [ txid: string ]: {
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
    static addDeployData(txid: string, domain: string, info: DeployContractArgs): void;
    static InvokeDataUpdate(): void;
    static addTask(task: Task): void;
    static initShed(): Promise<unknown>;
    static update(): void;
}
declare var cleanHistory: () => void;
declare var cleanTaskForAddr: (address: string) => void;
interface Claim {
    addr: string;
    asset: string;
    claimed: boolean;
    createHeight: number;
    n: number;
    txid: string;
    useHeight: number;
    used: string;
    value: number;
    gas: number;
}
declare class AssetManager {
    testAssetInfo: AssetInfo[];
    mainAssetInfo: AssetInfo[];
    allAssetInfo: AssetInfo[];
    initAllAseetInfo(): Promise<boolean>;
    /**
     * 模糊搜索资产
     * @param value 搜索值，资产名称或者id
     */
    queryAsset(value: string): AssetInfo[];
    saveAsset(assets: string[]): void;
    /**
     * 根据资产id添加资产
     * @param assetID 资产id
     */
    addAsset(assetID: string): void;
    /**
     * 根据资产id删除资产
     * @param assetID 资产id
     */
    deleteAsset(assetID: string): void;
    /**
     * 获得用户拥有的资产列表
     */
    getMyAsset(): AssetInfo[];
}
declare var assetManager: AssetManager;
declare const BLOCKCHAIN = "NEO";
declare const VERSION = "v1.3.0";
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
    deployContract = "deployContract",
    sendScript = "sendScript",
    getAddressFromScriptHash = "getAddressFromScriptHash",
    getBlock = "getBlock",
    getTransaction = "getTransaction",
    getApplicationLog = "getApplicationLog",
    TOOLS_validateAddress = "TOOLS.validateAddress",
    TOOLS_getAddressFromScriptHash = "TOOLS.getAddressFromScriptHash",
    TOOLS_getStringFromHexstr = "TOOLS.getStringFromHexstr",
    TOOLS_getBigIntegerFromHexstr = "TOOLS.getBigIntegerFromHexstr",
    TOOLS_reverseHexstr = "TOOLS.reverseHexstr",
    TOOLS_getBigIntegerFromAssetAmount = "TOOLS.getBigIntegerFromAssetAmount",
    TOOLS_getDecimalsFromAssetAmount = "TOOLS.getDecimalsFromAssetAmount",
    NNS_getNamehashFromDomain = "NNS.getNamehashFromDomain",
    NNS_getAddressFromDomain = "NNS.getAddressFromDomain",
    NNS_getDomainFromAddress = "NNS.getDomainFromAddress"
}
declare enum EventName {
    READY = "READY",
    ACCOUNT_CHANGED = "ACCOUNT_CHANGED",
    CONNECTED = "CONNECTED",
    DISCONNECTED = "DISCONNECTED",
    NETWORK_CHANGED = "NETWORK_CHANGED"
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
    blockHeight: number;
    network: string;
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
    address: string;
    assets?: string[];
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
    contractHash: string;
    description: string;
    email: string;
    author: string;
    version: string;
    name: string;
    avmhex: string;
    call: boolean;
    storage: boolean;
    payment: boolean;
    fee?: string;
    network?: 'MainNet' | 'TestNet';
}
interface Provider {
    name: string;
    version: string;
    compatibility: string[];
    website: string;
    extra?: {
        theme: string;
        currency: string;
    };
}
interface GetPublickeyOutput {
    address: string;
    publickey: string;
}
interface DomainArgs {
    domain: string;
    network: 'MainNet' | 'TestNet';
}
interface AddressArgs {
    address: string;
    network: 'MainNet' | 'TestNet';
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
    deployHistory?: DeployHistory;
}
declare class NNSTool {
    static readonly baseContract: Neo.Uint160;
    static resolveData(domain: string): Promise<{
        address: string;
        TTL: string;
    }>;
    /**
     * 域名转hash
     * #region 域名转hash算法
     * 域名转hash算法
     * aaa.bb.test =>{"test","bb","aa"}
     * @param domain 域名
     */
    static nameHash(domain: string): Neo.Uint256;
    /**
     * 子域名转hash
     * @param roothash  根域名hash
     * @param subdomain 子域名
     */
    static nameHashSub(roothash: Neo.Uint256, subdomain: string): Neo.Uint256;
    /**
     * 返回一组域名的最终hash
     * @param domainarray 域名倒叙的数组
     */
    static nameHashArray(domainarray: string[]): Neo.Uint256;
    static domainToHash(domain: string): Neo.Uint256;
    static verifyDomain(domain: any): boolean;
    static verifyAddr(addr: any): boolean;
    static verifyNeoDomain(domain: any): boolean;
}
declare var getAccountTaskState: (addr: string) => number;
//# sourceMappingURL=background.d.ts.map