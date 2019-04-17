declare const BLOCKCHAIN = "NEO";
declare const VERSION = "v1";
declare enum WalletEvents {
    READY = "Teemo.NEO.READY",
    CONNECTED = "Teemo.NEO.CONNECTED",
    DISCONNECTED = "Teemo.NEO.DISCONNECTED",
    NETWORK_CHANGED = "Teemo.NEO.NETWORK_CHANGED",
    ACCOUNT_CHANGED = "Teemo.NEO.ACCOUNT_CHANGED"
}
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
    description?: string;
    assetIntentOverrides?: AssetIntentOverrides;
    triggerContractVerification?: boolean;
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
interface GetPublickeyOutput {
    address: string;
    publickey: string;
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
    extra?: {
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
interface DomainArgs {
    domain: string;
    network: 'MainNet' | 'TestNet';
}
interface AddressArgs {
    address: string;
    network: 'MainNet' | 'TestNet';
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
declare namespace Teemo {
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
        static getPublicKey(): Promise<GetPublickeyOutput>;
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
        static invokeReadGroup(params: InvokeReadGroup): Promise<any>;
        /**
         * 查询区块信息
         * @param params
         */
        static getBlock(params: GetBlockArgs): Promise<{}>;
        /**
         * 查询交易信息
         * @param params
         */
        static getTransaction(params: GetTransactionArgs): Promise<{}>;
        /**
         * 查询log
         * @param params
         */
        static getApplicationLog(params: GetApplicationLogArgs): Promise<{}>;
        static TOOLS: {
            /**
             * 验证地址
             * @param address 要验证的地址
             */
            validateAddress: (address: string) => Promise<{}>;
            /**
             * scriptHash转地址
             * @param scriptHash 要转换成地址的ScriptHash
             */
            getAddressFromScriptHash: (scriptHash: string) => Promise<string>;
            /**
             * HexStr转String
             * @param hex hex字符串
             */
            getStringFromHexstr: (hex: string) => Promise<string>;
            /**
             * HexStr 转 BigInteger
             * @param hex hex字符串
             */
            getBigIntegerFromHexstr: (hex: string) => Promise<string>;
            /**
             * Hex 反转
             * @param hex hex字符串
             */
            reverseHexstr: (hex: string) => Promise<string>;
            getBigIntegerFromAssetAmount: (params: GetBigIntegerFromAssetAmountArgs) => Promise<string>;
            getDecimalsStrFromAssetAmount: (params: GetDecimalsFromAssetAmountArgs) => Promise<string>;
        };
        static NNS: {
            getNamehashFromDomain: (params: string) => Promise<{}>;
            getAddressFromDomain: (params: DomainArgs) => Promise<{}>;
            getDomainFromAddress: (params: AddressArgs) => Promise<{}>;
        };
    }
}
declare const EventChange: () => void;
declare const provider: Provider;
//# sourceMappingURL=inject.d.ts.map