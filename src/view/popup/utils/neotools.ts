import { LoginInfo, Result, AccountInfo, Invoke, MarkUtxo, NepAccount } from "../../../common/entity";
import { Transaction } from "./transaction";
import { HASH_CONFIG } from "../../config";
import common from "../store/common";

export class neotools
{
    /**
     * verifyAddress
     * @param addr
     */
    public static verifyAddress(addr: string): boolean
    {
        return /^[a-zA-Z0-9]{34,34}$/.test(addr) ? neotools.verifyPublicKey(addr) : false;
    }

    /**
     * verifyPublicKey 验证地址
     * @param publicKey 公钥
     */
    public static verifyPublicKey(publicKey: string)
    {
        var array: Uint8Array = Neo.Cryptography.Base58.decode(publicKey);
        var check = array.subarray(21, 21 + 4); //

        var checkdata = array.subarray(0, 21);//
        var hashd = Neo.Cryptography.Sha256.computeHash(checkdata);//
        hashd = Neo.Cryptography.Sha256.computeHash(hashd);//
        var hashd = hashd.slice(0, 4);//    
        var checked = new Uint8Array(hashd);//

        var error = false;
        for (var i = 0; i < 4; i++)
        {
            if (checked[i] != check[i])
            {
                error = true;
                break;
            }
        }
        return !error;
    }

    /**
     * wifDecode wif解码
     * @param wif wif私钥
     */
    public static wifDecode(wif: string)
    {
        let result: Result = new Result();
        let login = {} as LoginInfo;
        try
        {
            login.prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
        }
        catch (e)
        {
            result.err = true;
            result.info = e.message;
            return result
        }
        try
        {
            login.pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(login.prikey);
        }
        catch (e)
        {
            result.err = true;
            result.info = e.message;
            return result
        }
        try
        {
            login.address = ThinNeo.Helper.GetAddressFromPublicKey(login.pubkey);
        }
        catch (e)
        {
            result.err = true;
            result.info = e.message;
            return result
        }
        result.info = login;
        return result;
    }
    /**
     * nep2FromWif
     */
    public static nep2FromWif(wif: string, password: string): Result
    {
        var prikey: Uint8Array;
        var pubkey: Uint8Array;
        var address: string;
        let res: Result = new Result();
        try
        {
            prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
            var n = 16384;
            var r = 8;
            var p = 8
            ThinNeo.Helper.GetNep2FromPrivateKey(prikey, password, n, r, p, (info, result) =>
            {
                res.err = false;
                res.info.nep2 = result;
                pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                var hexstr = pubkey.toHexString();
                address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                res.info.address = address
                return res;
            });
        }
        catch (e)
        {
            res.err = true;
            res.info = e.message;
            return res;
        }
    }

    /**
     * nep2TOWif
     */
    public static async nep2Load(nep2: string, password: string): Promise<AccountInfo>
    {
        let promise: Promise<AccountInfo> = new Promise((resolve, reject) =>
        {
            const scrypt={N:16384,r:8,p:8};
            ThinNeo.Helper.GetPrivateKeyFromNep2(nep2, password, scrypt.N, scrypt.r, scrypt.p, (info, result) =>
            {
                if ("nep2 hash not match." == result)
                    reject(result);
                const prikey = result as Uint8Array;
                if (prikey != null)
                {
                    const pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                    const address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                    resolve(new AccountInfo(
                        new NepAccount("",address,nep2,scrypt),
                        prikey,
                        pubkey
                    ));
                }
                else
                {
                    reject("");
                }
            });
        });
        return promise;
    }

    /**
     * nep6Load
     */
    public static async nep6Load(wallet: ThinNeo.nep6wallet, password: string): Promise< Array< AccountInfo > >
    {
        try
        {
            //getPrivateKey 是异步方法，且同时只能执行一个
            let arr:AccountInfo[]=[]
            if (wallet.accounts)
            {
                for (let keyindex = 0; keyindex < wallet.accounts.length; keyindex++)
                {
                    let account = wallet.accounts[keyindex];
                    if (account.nep2key == null)
                    {
                        continue;
                    }
                    try
                    {
                        const info = await neotools.getPriKeyfromAccount(wallet.scrypt, password, account);                        
                        arr.push(new AccountInfo(
                            new NepAccount("",account.address,account.nep2key,wallet.scrypt),
                            info.prikey,
                            info.pubkey
                        ));
                        return arr;
                    } catch (error)
                    {
                        throw error;
                    }
                }
            } else
            {
                throw console.error("The account cannot be empty");

            }
        }
        catch (e)
        {
            throw e.result;

        }
    }

    /**
     * getPriKeyform
     */
    public static async getPriKeyfromAccount(
        scrypt: ThinNeo.nep6ScryptParameters, 
        password: string, 
        account: ThinNeo.nep6account): Promise<LoginInfo>
    {
        let promise: Promise<LoginInfo> =
            new Promise((resolve, reject) =>
            {
                account.getPrivateKey(scrypt, password, (info, result) =>
                {
                    if (info == "finish")
                    {
                        var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(result as Uint8Array);
                        var address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                        resolve({ pubkey, address: address, prikey: result as Uint8Array });
                    }
                    else
                    {
                        reject(result);
                    }

                });
            })
        return promise;
    }

    public static invokeScriptBuild(data:Invoke)
    {
        let sb = new ThinNeo.ScriptBuilder();
        let arr = data.arguments.map(argument=>{
            let str = ""
            switch (argument.type) {                
                case "String":
                    str="(str)"+argument.value    
                    break;
                case "Integer":
                    str="(int)"+argument.value    
                    break;
                case "Hash160":
                    str="(hex160)"+argument.value                        
                    break;
                case "ByteArray":
                    str="(bytes)"+argument.value                        
                    break;
                case "Boolean":
                    str="(int)"+(argument.value?1:0);                    
                    break;
                case "Address":
                    str="(addr)"+argument.value   
                    break;             
                case "Array":
                    // str="(str)"+argument.value 暂时不考虑                
                    break;
                default:
                    throw new Error("No parameter of this type");
            }
            return str;
        })
        sb.EmitParamJson(arr)
        sb.EmitPushString(data.operation)
        sb.EmitAppCall(Neo.Uint160.parse(data.scriptHash));
        return sb.ToArray();
    }

    public static async contractBuilder(invoke:Invoke):Promise<Uint8Array>{
        let tran = new Transaction();
        
        try {
            const script=this.invokeScriptBuild(invoke);
            tran.setScript(script);
        } catch (error) {
            console.log(error);            
        }
        if(!!invoke.fee && invoke.fee!=='' && invoke.fee!='0'){
            
            try {
                const utxos = await MarkUtxo.getUtxoByAsset(HASH_CONFIG.ID_GAS);
                if(utxos)
                    tran.creatInuptAndOutup(utxos,Neo.Fixed8.parse(invoke.fee));
            } catch (error) {
                console.log(error);
            }
        }
        try {
            const message  = tran.GetMessage().clone();
            const signdata = ThinNeo.Helper.Sign(message,common.account.prikey);
            tran.AddWitness(signdata,common.account.pubkey,common.account.address);
            const data:Uint8Array = tran.GetRawData();
            return data;
            
        } catch (error) {
            console.log(error);            
        }
    }

    public static invokeTest(){
        var script:Invoke = {
            scriptHash:"74f2dc36a68fdc4682034178eb2220729231db76",
            operation:"transfer",
            arguments:[
                {type:"Address",value:"AHDV7M54NHukq8f76QQtBTbrCqKJrBH9UF"},
                {type:"Address",value:"AbU7BUQHW9sa69pTac7pPR3cq4gQHYC1DH"},
                {type:"Integer",value:"100000"}
            ],
            fee:'0.001',
            network:'TestNet',
            assets:{}
        }
        console.log(common.account.prikey.toHexString());
        neotools.contractBuilder(script)
        .then(result=>{
            console.log(result);
            console.log(result.toHexString());
            
        })
        .catch(reason=>{
            console.log(reason);            
        })
    }

}
