import { Storage_internal } from "../view/popup/utils/storagetools";

export class Result
{
    err: boolean;
    info: any;
}

/**
 * -------------------------以下是账户所使用到的实体类
 */
export interface AccountInfo extends NepAccount{
    // walletName:string;
    // nep2key:string;
    // scrypt:ThinNeo.nep6ScryptParameters;

    
    pubkey: Uint8Array;
    prikey: Uint8Array;
    address: string;
}

export class NepAccount{
    index?:number;
    walletName:string;
    address: string;
    nep2key:string;
    scrypt:ThinNeo.nep6ScryptParameters;
    constructor(name:string,addr:string,nep2:string,scrypt:ThinNeo.nep6ScryptParameters,index?:number){
        this.walletName=name;
        this.address=addr;
        this.nep2key=nep2;
        this.scrypt=scrypt
        if(index!==undefined)
            this.index=index;
    }

    static deciphering= async (password:string,nepaccount:NepAccount)=>{
        return new Promise<AccountInfo>((resolve, reject) =>
        {
            console.log(nepaccount);
            
            let account = {} as AccountInfo;
            account.scrypt=nepaccount.scrypt
            account.nep2key=nepaccount.nep2key;
            ThinNeo.Helper.GetPrivateKeyFromNep2(nepaccount.nep2key, password, nepaccount.scrypt.N, nepaccount.scrypt.r, nepaccount.scrypt.p, (info, result) =>
            {
                if ("nep2 hash not match." == result)
                    reject(result);
                account.prikey = result as Uint8Array;
                if (account.prikey != null)
                {
                    account.pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(account.prikey);
                    account.address = ThinNeo.Helper.GetAddressFromPublicKey(account.pubkey);
                    account.index = nepaccount.index;
                    resolve(account);
                }
                else
                {
                    reject("prikey is null");
                }
            });
        })
    }

    static encryption=async(password:string,prikey:Uint8Array)=>{

        return new Promise<AccountInfo>((resolve, reject) =>
        {
            var array = new Uint8Array(32);
            var key = Neo.Cryptography.RandomNumberGenerator.getRandomValues<Uint8Array>(array);
            // spanPri.textContent = key.toHexString();
            let account={}as AccountInfo
            account.pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(key);
            account.address = ThinNeo.Helper.GetAddressFromPublicKey(account.pubkey);
            account.scrypt = new ThinNeo.nep6ScryptParameters();
            account.scrypt.N = 16384;
            account.scrypt.r = 8;
            account.scrypt.p = 8;
            ThinNeo.Helper.GetNep2FromPrivateKey(key, password, account.scrypt.N, account.scrypt.r, account.scrypt.p, (info, result) =>
            {
                if (info == "finish")
                {
                    account.nep2key = result;
                    resolve(account);
                }
                else
                {
                    reject(result);
                }
            });
        })
    }
}

export interface LoginInfo
{
    pubkey: Uint8Array;
    prikey: Uint8Array;
    address: string;
}


/**
 * Invoke
 */

export interface Invoke{
    scriptHash:string;
    operation:string;
    arguments:Array<Argument>;
    assets:{[asset:string]:string};
    fee:string;
    network:"TestNet"|"MainNet"
}

export interface Argument{
    type:"String"|"Boolean"|"Hash160"|"Integer"|"ByteArray"|"Array"|"Address"
    value:string|number|boolean|Array<Argument>
}

export interface Asset{
    NEO:string;
    GAS:string;
}

/**
 * 
 */

export class MarkUtxo
{

    /**
     * 塞入标记
     * @param utxos 标记
     */
    public static setMark(utxos:MarkUtxo[])
    {
        const session = Storage_internal.get<{[txid:string]:number[]}>("utxo_manager");
        for (let index = 0; index < utxos.length; index++) 
        {
            const utxo = utxos[index];
            if(session[utxo.txid])
            {
                session[utxo.txid].push(utxo.n);
            }
            else
            {
                session[utxo.txid] = new Array<number>();
                session[utxo.txid].push(utxo.n);
            }
        }
        Storage_internal.set("utxo_manager",session);

    }

    public static getUtxo():{

    }

    /**
     * getMark 获得被标记的utxo
     */
    // public static getMark()
    // {
    //     return Storage_internal.get<{[txid:string]:number[]}>("utxo_manager");
    // }

    // public height:number;
    public txid:string;
    public n:number;
    constructor(txid:string,n:number)
    {
        this.txid = txid;
        this.n = n;
    }
}

export interface ICoinStore{
    assets:{ [ id: string ]: Utxo[] };
    initUtxos: ()=>Promise<boolean>;
}

export class Utxo{
    public addr: string;
    public txid: string;
    public n: number;
    public asset: string;
    public count: Neo.Fixed8;
}