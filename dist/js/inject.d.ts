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
    ADDRESS = "Address"
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
interface InvokeArgs {
    scriptHash: string;
    operation: string;
    fee: string;
    network: "TestNet" | "MainNet";
    arguments: Array<Argument>;
    assets?: Array<AttachedAssets>;
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
    type: "String" | "Boolean" | "Hash160" | "Integer" | "ByteArray" | "Array" | "Address" | "Hook_Txid";
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
declare namespace Teemmo {
    class NEO {
        static getProvider: () => Promise<{}>;
        static getNetworks: () => Promise<{}>;
        static getAccount: () => Promise<{}>;
        static getBalance(data: GetBalanceArgs): Promise<BalanceResults>;
        static getStorage(params: GetStorageArgs): Promise<GetStorageOutput>;
        static send: (params: any) => Promise<{}>;
        static invoke(params: InvokeArgs): Promise<InvokeOutput>;
    }
}
//# sourceMappingURL=inject.d.ts.map