/// <reference path="./account.d.ts" />

import { InvokeArgs } from "../common/entity";
import { AccountManager } from "./account";

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
    network: "testnet" | "mainnet";
    height: number;
    account: AccountInfo;
}
declare interface Background extends Window{
    getBalance: (data: GetBalanceArgs) => Promise<BalanceResults>
    mytest:(data:Uint8Array)=>void;
    contractBuilder: (invoke: InvokeArgs) => Promise<InvokeOutput>;
    storage: BackStore;
    AccountManager: AccountManager;
    exchangeCgas: (transcount: number, netfee: number) => Promise<void>;
    transfer: (data: SendArgs) => Promise<SendOutput>;
    invokeRead: (data: InvokeReadInput) => Promise<{}>;
    invokeReadGroup: (data: InvokeReadGroup) => Promise<{}>;
}

interface SendArgs {
    fromAddress: string;
    toAddress: string;
    asset: string;
    amount: string;
    remark?: string;
    fee?: string;
    network: "TestNet"|"MainNet";
}
  
interface SendOutput {
    txid: string;
    nodeUrl: string;
}

interface BalanceRequest {
    address: string; // Address to check balance(s)
    assets?: string[]; // Asset symbol or script hash to check balance
    fetchUTXO?: boolean;
}
  
interface GetBalanceArgs {
    params: BalanceRequest|BalanceRequest[];
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


  
/**
 * invoke 请求参数
 * @param {scriptHash} 合约hash
 * @param {operation} 调用合约的方法名
 * @param {stgring} 网络费
 * 
 */
declare interface InvokeArgs{
    scriptHash:string;
    operation:string;
    fee?:string;
    network:"TestNet"|"MainNet";
    arguments:Array<Argument>;
    attachedAssets?:AttachedAssets;
    assetIntentOverrides?: AssetIntentOverrides;
    triggerContractVerification?: boolean;
    description?:string;
}

declare interface AttachedAssets {
    [asset: string]: string;
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

declare interface Argument{
    type:"String"|"Boolean"|"Hash160"|"Hash256"|"Integer"|"ByteArray"|"Array"|"Address"|"Hook_Txid";
    value:string|number|boolean|Array<Argument>
}

declare interface Asset{
    NEO:string;
    GAS:string;
}

declare interface InvokeGroup{
    merge:boolean;
    group:InvokeArgs[];
}

declare interface InvokeReadInput {
    scriptHash: string;
    operation: string;
    arguments?: Argument[];
    network: "TestNet"|"MainNet";
}
declare interface InvokeReadGroup{
    group:InvokeReadInput[];
}

