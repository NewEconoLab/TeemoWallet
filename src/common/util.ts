import { NepAccount } from "./entity";
import { AccountInfo } from "../lib/background";

export 
class Storage_local
{
    public static setAccount(account:AccountInfo){
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
    }
    public static getAccount(){
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
    public static set(key:string,value:any,call?){
        chrome.storage.local.set({[key]:value},()=>{if(call)call()})
    };
    public static get<T>(key:string,):Promise<T>
    {
        return new Promise<T>((r,j)=>{
            chrome.storage.local.get(key,item=>{
                r(item?item[key]:undefined);
            })
        })
    }
}