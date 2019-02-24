/// <reference path="../../src/lib/neo-thinsdk.d.ts" />
declare module "background" { }
declare namespace background {
    class Result {
        err: boolean;
        info: any;
    }
    class NepAccount {
        index?: number;
        walletName: string;
        address: string;
        nep2key: string;
        scrypt: ThinNeo.nep6ScryptParameters;
        constructor(name: string, addr: string, nep2: string, scrypt: ThinNeo.nep6ScryptParameters, index?: number);
        static deciphering: (password: string, nepaccount: NepAccount) => Promise<AccountInfo>;
        static encryption: (password: string, prikey: Uint8Array) => Promise<AccountInfo>;
    }
    class AccountInfo extends NepAccount {
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
    interface Invoke {
        scriptHash: string;
        operation: string;
        arguments: Array<Argument>;
        assets: {
            [asset: string]: string;
        };
        fee: string;
        network: "TestNet" | "MainNet";
    }
    interface Argument {
        type: "String" | "Boolean" | "Hash160" | "Integer" | "ByteArray" | "Array" | "Address";
        value: string | number | boolean | Array<Argument>;
    }
    interface Asset {
        NEO: string;
        GAS: string;
    }
    class MarkUtxo {
        txid: string;
        n: number;
        constructor(txid: string, n: number);
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
    class Utxo {
        addr: string;
        txid: string;
        n: number;
        asset: string;
        count: Neo.Fixed8;
    }
}
declare namespace background {
    class neotools {
        static verifyAddress(addr: string): boolean;
        static verifyPublicKey(publicKey: string): boolean;
        static wifDecode(wif: string): Result;
        static nep2FromWif(wif: string, password: string): Result;
        static nep2Load(nep2: string, password: string): Promise<AccountInfo>;
        static nep6Load(wallet: ThinNeo.nep6wallet, password: string): Promise<Array<AccountInfo>>;
        static getPriKeyfromAccount(scrypt: ThinNeo.nep6ScryptParameters, password: string, account: ThinNeo.nep6account): Promise<LoginInfo>;
        static invokeScriptBuild(data: Invoke): Uint8Array;
        static contractBuilder(invoke: Invoke): Promise<Uint8Array>;
        static invokeTest(): void;
    }
    const HASH_CONFIG: {
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
declare namespace background {
    const bg: Window;
    const Storage_local: {
        setAccount: (account: AccountInfo) => number;
        getAccount: () => NepAccount[];
    };
    class Storage_internal {
        static set: (key: string, value: any) => void;
        static get<T>(key: string): T;
    }
}
declare namespace background {
    class Transaction extends ThinNeo.Transaction {
        marks: MarkUtxo[];
        constructor(type?: ThinNeo.TransactionType);
        setScript(script: Uint8Array): void;
        creatInuptAndOutup(utxos: Utxo[], sendcount: Neo.Fixed8, target?: string): void;
        getTxid(): string;
    }
}
declare namespace background {
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
    const common: Common;
}
declare namespace background {
    class Api {
        static getnep5balanceofaddress: (address: string, assetId: string) => Promise<any>;
        static getregisteraddressbalance: (address: string, register: string) => Promise<any>;
        static sendrawtransaction: (data: string) => Promise<any>;
        static getUtxo: (address: string) => Promise<any>;
        static getDomainInfo: (domain: string) => Promise<any>;
        static hasTx: (txid: string) => Promise<any>;
        static hasContract: (txid: string) => Promise<any>;
        static getRehargeAndTransfer: (txid: string) => Promise<any>;
        static getBlockCount: () => Promise<any>;
        static rechargeAndTransfer: (data1: string, data2: string) => Promise<any>;
        static getnep5asset: (asset: string) => Promise<any>;
    }
}
declare namespace background {
    interface IOpts {
        method: string;
        params: any[];
        isGET?: boolean;
        baseUrl?: string;
        getAll?: boolean;
    }
    function request(opts: IOpts): Promise<any>;
}
