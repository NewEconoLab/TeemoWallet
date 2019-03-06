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
    send = "send",
    invoke = "invoke",
    invokeGroup = "invokeGroup",
    event = "event",
    disconnect = "disconnect"
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
        theme: string;
        currency: string;
    };
}
interface InvokeReadInput {
    scriptHash: string;
    operation: string;
    args?: Argument[];
    network: string;
}
declare const ids: any[];
/**
 *
 * @param array 随机数
 */
declare const getMessageID: () => string;
/**
 * 发送请求
 * @param command 指令名称
 * @param data
 */
declare function sendMessage<K>(command: Command, params?: any): Promise<K>;
declare namespace Teemmo {
    class NEO {
        static getProvider: () => Promise<Provider>;
        /**
         * 获得当前网络信息
         * @returns {GetNetworksOutput} 网络信息
         */
        static getNetworks(): Promise<GetNetworksOutput>;
        /**
         * 获得当前账户信息
         * @returns {AccountOutput} 账户信息
         */
        static getAccount(): Promise<AccountOutput>;
        /**
         * 查询余额
         * @param {GetBalanceArgs} params 查询余额参数
         */
        static getBalance(params: GetBalanceArgs): Promise<BalanceResults>;
        /**
         * 查询存储区数据
         * @param {GetStorageArgs} params 查询存储区参数
         */
        static getStorage(params: GetStorageArgs): Promise<GetStorageOutput>;
        /**
         * 转账方法
         * @param {SendArgs} params 转账参数
         */
        static send(params: SendArgs): Promise<SendOutput>;
        /**
         * invoke交易发送
         * @param {InvokeArgs} params invoke 参数
         * @returns {InvokeOutput} invoke执行结果返回
         */
        static invoke(params: InvokeArgs): Promise<InvokeOutput>;
        static invokeGroup(params: InvokeGroup): Promise<InvokeOutput[]>;
        static invokeRead(params: InvokeReadInput): Promise<any>;
    }
}
declare var readyEvent: CustomEvent<{
    title: string;
}>;
//# sourceMappingURL=inject.d.ts.map