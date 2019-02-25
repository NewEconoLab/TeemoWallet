/// <reference path="../../lib/neo-thinsdk.d.ts" />
declare function injectCustomJs(jsPath?: any): void;
declare function sendMsgTest(): void;
declare var Test: () => void;
declare var getAccount: (callback: any) => void;
declare var invokeGroup: (invokeMessage: any) => void;
declare var sendTransferTx: (from: any, to: any, asset: any, value: any, callback: any) => void;
declare var sendInvokeTx: (scriptHash: any, invokeParam: any, callback: any) => void;
declare module "app/back/store/common" {
    import { AccountInfo, NepAccount } from "app/back/entity";
    /**
     * 我的账户管理
     */
    class Common {
        constructor();
        private tabname;
        private _network;
        private _account;
        private _accountList;
        network: string;
        accountList: NepAccount[];
        account: AccountInfo;
    }
    export const common: Common;
}
declare module "app/back/store/api/request" {
    interface IOpts {
        method: string;
        params: any[];
        isGET?: boolean;
        baseUrl?: string;
        getAll?: boolean;
    }
    export function request(opts: IOpts): Promise<any>;
}
declare module "app/back/store/api/common.api" {
    export class Api {
        /**
         * 获取nep5的资产（CGAS）
         */
        static getnep5balanceofaddress: (address: string, assetId: string) => Promise<any>;
        /**
         *
         * @param address
         */
        static getregisteraddressbalance: (address: string, register: string) => Promise<any>;
        /**
         * 发送交易
         * @param data 交易数据
         */
        static sendrawtransaction: (data: string) => Promise<any>;
        /**
         * 获得指定地址对应的utxo
         * @param address 地址
         */
        static getUtxo: (address: string) => Promise<any>;
        /**
         * 获得指定地址对应的utxo
         * @param address 地址
         */
        static getDomainInfo: (domain: string) => Promise<any>;
        /**
         * 判断交易是否入链
         * @param txid 交易id
         */
        static hasTx: (txid: string) => Promise<any>;
        /**
         * 判断合约调用是否抛出 notify
         * @param txid 交易id
         */
        static hasContract: (txid: string) => Promise<any>;
        /**
         * 判断双交易是否成功
         * @param txid 交易id
         */
        static getRehargeAndTransfer: (txid: string) => Promise<any>;
        static getBlockCount: () => Promise<any>;
        static rechargeAndTransfer: (data1: string, data2: string) => Promise<any>;
        /**
         * @method 获得nep5资产信息
         * @param asset 资产id
         */
        static getnep5asset: (asset: string) => Promise<any>;
    }
}
declare module "app/back/entity" {
    export class Result {
        err: boolean;
        info: any;
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
        constructor(name: string, addr: string, nep2: string, scrypt: ThinNeo.nep6ScryptParameters, index?: number);
        static deciphering: (password: string, nepaccount: NepAccount) => Promise<AccountInfo>;
        static encryption: (password: string, prikey: Uint8Array) => Promise<AccountInfo>;
    }
    export class AccountInfo extends NepAccount {
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
        assets: {
            [asset: string]: string;
        };
        fee: string;
        network: "TestNet" | "MainNet";
    }
    export interface Argument {
        type: "String" | "Boolean" | "Hash160" | "Integer" | "ByteArray" | "Array" | "Address";
        value: string | number | boolean | Array<Argument>;
    }
    export interface Asset {
        NEO: string;
        GAS: string;
    }
    /**
     *
     */
    export class MarkUtxo {
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
    export interface ICoinStore {
        assets: {
            [id: string]: Utxo[];
        };
        initUtxos: () => Promise<boolean>;
    }
    export class Utxo {
        addr: string;
        txid: string;
        n: number;
        asset: string;
        count: Neo.Fixed8;
    }
}
declare module "app/back/storagetools" {
    import { NepAccount, AccountInfo } from "app/back/entity";
    export const bg: Window;
    export const Storage_local: {
        setAccount: (account: AccountInfo) => number;
        getAccount: () => NepAccount[];
    };
    /**
     * 主要用于background的内存数据的存储和读取
     */
    export class Storage_internal {
        static set: (key: string, value: any) => void;
        static get<T>(key: string): T;
    }
}
declare module "common/entity" {
    export class Result {
        err: boolean;
        info: any;
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
        constructor(name: string, addr: string, nep2: string, scrypt: ThinNeo.nep6ScryptParameters, index?: number);
        static deciphering: (password: string, nepaccount: NepAccount) => Promise<AccountInfo>;
        static encryption: (password: string, prikey: Uint8Array) => Promise<AccountInfo>;
    }
    export class AccountInfo extends NepAccount {
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
        assets: {
            [asset: string]: string;
        };
        fee: string;
        network: "TestNet" | "MainNet";
    }
    export interface Argument {
        type: "String" | "Boolean" | "Hash160" | "Integer" | "ByteArray" | "Array" | "Address";
        value: string | number | boolean | Array<Argument>;
    }
    export interface Asset {
        NEO: string;
        GAS: string;
    }
    /**
     *
     */
    export class MarkUtxo {
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
    export interface ICoinStore {
        assets: {
            [id: string]: Utxo[];
        };
        initUtxos: () => Promise<boolean>;
    }
    export class Utxo {
        addr: string;
        txid: string;
        n: number;
        asset: string;
        count: Neo.Fixed8;
    }
}
declare module "app/storage" {
    import { AccountInfo } from "common/entity";
    export class MyStorage {
        account: AccountInfo;
    }
}
declare module "app/back/transaction" {
    import { Utxo, MarkUtxo } from "app/back/entity";
    /**
     * 继承 NEO-TS SDK - Transaction类
     */
    export class Transaction extends ThinNeo.Transaction {
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
}
declare module "app/back/neotools" {
    import { Result, LoginInfo, AccountInfo, Invoke } from "app/back/entity";
    export class neotools {
        /**
         * verifyAddress
         * @param addr
         */
        static verifyAddress(addr: string): boolean;
        /**
         * verifyPublicKey 验证地址
         * @param publicKey 公钥
         */
        static verifyPublicKey(publicKey: string): boolean;
        /**
         * wifDecode wif解码
         * @param wif wif私钥
         */
        static wifDecode(wif: string): Result;
        /**
         * nep2FromWif
         */
        static nep2FromWif(wif: string, password: string): Result;
        /**
         * nep2TOWif
         */
        static nep2Load(nep2: string, password: string): Promise<AccountInfo>;
        /**
         * nep6Load
         */
        static nep6Load(wallet: ThinNeo.nep6wallet, password: string): Promise<Array<AccountInfo>>;
        /**
         * getPriKeyform
         */
        static getPriKeyfromAccount(scrypt: ThinNeo.nep6ScryptParameters, password: string, account: ThinNeo.nep6account): Promise<LoginInfo>;
        static invokeScriptBuild(data: Invoke): Uint8Array;
        static contractBuilder(invoke: Invoke): Promise<Uint8Array>;
        static invokeTest(): void;
    }
    export const HASH_CONFIG: {
        accountCGAS: Neo.Uint160;
        ID_CGAS: Neo.Uint160;
        DAPP_NNC: Neo.Uint160;
        baseContract: Neo.Uint160;
        resolverHash: string;
        ID_GAS: string;
        ID_NEO: string;
        saleContract: Neo.Uint160;
        ID_NNC: Neo.Uint160;
    };
}
declare module "app/back/background" { }
//# sourceMappingURL=background.d.ts.map