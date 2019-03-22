import { AccountInfo, NepAccount } from "../../../common/entity";
import { Background } from "../../../lib/background";

export const bg = chrome.extension.getBackgroundPage() as Background;

export const Storage_local = 
{
    setAccount:(account:AccountInfo)=>{
        let arr = Storage_local.getAccount();
        
        let index: number= 0;
        let newacc=new NepAccount(
            account.walletName,
            account.address,
            account.nep2key,
            account.scrypt)
        
        if(arr.length){            
            arr = arr.map((acc,n)=>{
                if(acc.address===account.address)
                {
                    acc.walletName = newacc.walletName?newacc.walletName:acc.walletName;
                    newacc.index = index = n;
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
        
        localStorage.setItem("TeemoWALLET_ACCOUNT",JSON.stringify(arr));
        return index;
    },
    getAccount:()=>{
        const str = localStorage.getItem("TeemoWALLET_ACCOUNT");
        let accounts = [] as NepAccount[];
        if(str) 
        {
            let arr = accounts.concat(JSON.parse(str));
            for (let index = 0; index < arr.length; index++) {
                const acc = arr[index];
                let nep = new NepAccount(acc.walletName,acc.address,acc.nep2key,acc.scrypt,index);
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
        bg['storage'][key]=value;
    };
    public static get<T>(key:string,):T
    {
        return bg['storage'][key];
    }
}

// export class Storage_local
// {
//     public static set=(key:string,value:any)=>{
//         localStorage.setItem(key,JSON.stringify(value));
//     }

//     public static get<T>(key:string):T
//     {
//         return JSON.parse(localStorage.getItem(key))
//     }
// }