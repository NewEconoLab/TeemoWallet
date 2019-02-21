import { Background } from "../../../lib/background";
import { AccountInfo, NepAccount } from "../../../common/entity";

export const bg = chrome.extension.getBackgroundPage() as Background;

export const Storage_local = 
{
    setAccount:(account:AccountInfo)=>{
        let arr = Storage_local.getAccount();
                
        let newacc=new NepAccount(
            account.walletName,
            account.address,
            account.nep2key,
            account.scrypt)
        
        console.log(arr);
        
        if(arr.length){            
            let index: number= -1;
            arr = arr.map((acc,n)=>{
                if(acc.address===account.address)
                {
                    index = n;
                    return newacc;
                }
                return acc;
            });
            if(index<0){
                arr.push(newacc);
            }
        }else{
            arr.push(newacc);
        }
        console.log(arr);
        
        localStorage.setItem("TEEMMOWALLET_ACCOUNT",JSON.stringify(arr));
    },
    getAccount:()=>{
        const str = localStorage.getItem("TEEMMOWALLET_ACCOUNT");
        let accounts = [] as NepAccount[];
        if(str) 
        {
            let arr = accounts.concat(JSON.parse(str));
            for (let index = 0; index < arr.length; index++) {
                const acc = arr[index];
                let nep = new NepAccount(acc.walletName,acc.address,acc.nep2key,acc.scrypt);
                accounts.push(nep);                
            }
        }
        return accounts;
    }
}

/**
 * 主要用于background的内存数据的存储和读取
 */
export class Storage_internal
{
    public static set=(key:string,value:any)=>{
        bg.storage[key]=value;
    };
    public static get<T>(key:string,):T
    {
        return bg.storage[key];
    }
}