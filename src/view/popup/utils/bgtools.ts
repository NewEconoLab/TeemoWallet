import { Background } from "../../../lib/background";
import { AccountInfo, NepAccount } from "../../../common/entity";

export const bg = chrome.extension.getBackgroundPage() as Background;

export const tools = 
{
    setAccount:(account:AccountInfo)=>{
        let arr = tools.getAccount();
                
        let newacc:NepAccount = {
            address:account.address,
            nep2key:account.nep2key,
            walletName:account.walletName,
            scrypt:account.scrypt,
        }
        
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
        if(str) accounts = accounts.concat(JSON.parse(str));
        return accounts;
    }
}