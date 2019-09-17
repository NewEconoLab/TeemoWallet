/// <reference path="./account.d.ts" />

import { InvokeArgs } from "../common/entity";
import { AccountManager } from "./account";
import { IHistory } from "../view/popup/containers/history/store/interface/history.interface";

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
interface BackStore {
    network: "TestNet" | "MainNet";
    height: number;
    account: AccountInfo;
}
declare interface Background extends Window {
    getBlockHeight: () => number;
    getBalance: (data: GetBalanceArgs) => Promise<BalanceResults>;
    mytest: (data: Uint8Array) => void;
    contractBuilder: (invoke: InvokeArgs) => Promise<InvokeOutput>;
    storage: BackStore;
    AccountManager: AccountManager;
    exchangeCgas: (transcount: number, netfee: number) => Promise<void>;
    exchangeGas: (transcount: number, netfee: number) => Promise<InvokeOutput>;
    transfer: (data: SendArgs) => Promise<SendOutput>;
    invokeRead: (data: InvokeReadInput) => Promise<{}>;
    invokeReadGroup: (data: InvokeReadGroup) => Promise<{}>;
    queryAssetSymbol: (assetID: string, network: "TestNet" | "MainNet") => Promise<{
        symbol: string;
        decimals: number;
    }>
    invokeArgsAnalyse: (...invokes: InvokeArgs[]) => Promise<{
        scriptHashs: any[];
        descriptions: any[];
        operations: any[];
        arguments: any[];
        expenses: {
            symbol: string;
            amount: string;
        }[];
        fee: string;
    }>;
    getHistoryList: () => IHistory[];
    getDomainFromAddress: (params: AddressArgs) => Promise<{
        namehash: string;
        fullDomainName: string;
        TTL: string;
    }>;
    doClaimGas: () => Promise<void>;
    getClaimGasAmount: () => Promise<string>;
    getClaimGasState: () => string;
    assetManager: AssetManager;
    cleanHistory: () => void;
    cleanTaskForAddr: (address: string) => void;
    getAccountTaskState: (addr: string) => number;
}

declare class AssetManager {
    allAssetInfo: AssetInfo[];
    initAllAseetInfo(): Promise<void>;
    /**
     * 模糊搜索资产
     * @param value 搜索值，资产名称或者id
     */
    queryAsset(value: string): AssetInfo[];
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

interface AddressArgs {
    address: string;
    network: 'MainNet' | 'TestNet'
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

interface BalanceRequest {
    address: string; // Address to check balance(s)
    assets?: string[]; // Asset symbol or script hash to check balance
    fetchUTXO?: boolean;
}

interface GetBalanceArgs {
    params: BalanceRequest | BalanceRequest[];
    network?: string;
}

interface BalanceResults {
    [ address: string ]: Balance[];
}

interface Balance {
    assetID: string;
    symbol: string;
    amount: string;
}

/**
 * invoke 请求参数
 * @param {scriptHash} 合约hash
 * @param {operation} 调用合约的方法名
 * @param {stgring} 网络费
 * 
 */
declare interface InvokeArgs {
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

declare interface AttachedAssets {
    [ asset: string ]: string;
}

declare interface AssetIntentOverrides {
    inputs: AssetInput[];
    outputs: AssetOutput[];
}

declare interface AssetInput {
    txid: string;
    index: number;
}

declare interface AssetOutput {
    asset: string;
    address: number;
    value: string;
}

declare interface InvokeOutput {
    txid: string;
    nodeUrl: string;
}

declare interface Argument {
    type: "String" | "Boolean" | "Hash160" | "Hash256" | "Integer" | "ByteArray" | "Array" | "Address" | "Hook_Txid";
    value: string | number | boolean | Array<Argument>
}

declare interface Asset {
    NEO: string;
    GAS: string;
}

declare interface InvokeGroup {
    merge: boolean;
    group: InvokeArgs[];
}

declare interface InvokeReadInput {
    scriptHash: string;
    operation: string;
    arguments?: Argument[];
    network: "TestNet" | "MainNet";
}
declare interface InvokeReadGroup {
    group: InvokeReadInput[];
}

