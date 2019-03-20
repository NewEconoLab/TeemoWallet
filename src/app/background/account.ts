var AccountManager={
    createWallet:(key:Uint8Array)=>{
        let wallet: ThinNeo.nep6wallet = new ThinNeo.nep6wallet();
    },

    // 解密方法，放在background避免popup直接访问
    deciphering:(password:string,nepaccount:NepAccount)=>{
        return new Promise<NepAccount>((resolve, reject) =>
        {
            ThinNeo.Helper.GetPrivateKeyFromNep2(nepaccount.nep2key, password, nepaccount.scrypt.N, nepaccount.scrypt.r, nepaccount.scrypt.p, (info, result) =>
            {
                if ("nep2 hash not match." == result)
                    reject(result);
                const prikey = result as Uint8Array;
                if (prikey != null)
                {
                    const pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                    AccountManager.setAccount(new AccountInfo(nepaccount,prikey,pubkey));
                    resolve(nepaccount)
                }
                else
                {
                    reject("prikey is null");
                }
            });
        })
    },
    // 加密方法同样放在background
    encryption:(password:string,wif:string)=>{

        let prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif)
        return new Promise<AccountInfo>((resolve, reject) =>
        {
            var array = new Uint8Array(32);
            var key = Neo.Cryptography.RandomNumberGenerator.getRandomValues<Uint8Array>(array);
            // spanPri.textContent = key.toHexString();
            const pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(key);
            const address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
            const scrypt = new ThinNeo.nep6ScryptParameters();
            scrypt.N = 16384;
            scrypt.r = 8;
            scrypt.p = 8;
            ThinNeo.Helper.GetNep2FromPrivateKey(key, password, scrypt.N, scrypt.r, scrypt.p, (info, result) =>
            {
                if (info == "finish")
                {                 
                    AccountManager.setAccount(new AccountInfo(
                        new NepAccount("",address,result,scrypt),
                        prikey,
                        pubkey
                    ))
                    resolve(new AccountInfo(
                        new NepAccount("",address,result,scrypt),
                        prikey,
                        pubkey
                    ));
                }
                else
                {
                    reject(result);
                }
            });
        })
    },
    nep2Load : (nep2: string, password: string): Promise<boolean>=>
    {
        let promise: Promise<boolean> = new Promise((resolve, reject) =>
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
                    
                    const nepacc = Storage_local.setAccount(new NepAccount("",address,nep2,scrypt));
                    AccountManager.setAccount(new AccountInfo(
                        nepacc,
                        prikey,
                        pubkey
                    ));
                    resolve(true)
                }
                else
                {
                    reject("Password error");
                }
            });
        });
        return promise;
    },
    nep6Load:async(str:string, password: string): Promise<{address:string,lable:string}>=>
    {
        try
        {
            let wallet = new ThinNeo.nep6wallet();
            wallet.fromJsonStr(str);
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
                        const info = await AccountManager.getPriKeyfromAccount(wallet.scrypt, password, account);      
                        const nepacc = Storage_local.setAccount(new NepAccount("",account.address,account.nep2key,wallet.scrypt));
                        arr.push(new AccountInfo(
                            nepacc,
                            info.prikey,
                            info.pubkey
                        ));
                        AccountManager.setAccount(arr[0]);
                    } catch (error)
                    {
                        throw error;
                    }
                }
                return {address:arr[0].address,lable:arr[0].walletName};
            } else
            {
                throw console.error("The account cannot be empty");

            }
        }
        catch (e)
        {
            throw e.result;

        }
    },
    getPriKeyfromAccount:(
        scrypt: ThinNeo.nep6ScryptParameters, 
        password: string, 
        account: ThinNeo.nep6account): Promise<LoginInfo>=>
    {
        const {N,r,p} = scrypt;
        let promise: Promise<LoginInfo> =
            new Promise((resolve, reject) =>
            {
                ThinNeo.Helper.GetPrivateKeyFromNep2(account.nep2key,password,N,r,p,(info,result)=>{
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
                })
            })
        return promise;
    },
    
    setAccount:(account:AccountInfo)=>{
        storage.account = account;
        EventsOnChange(WalletEvents.CONNECTED,{address:account.address,label:account.walletName});
    },

    logout:()=>{
        storage.account=null;
        EventsOnChange(WalletEvents.DISCONNECTED);
    },

    netWorkChange:(network:"TestNet"|"MainNet")=>{
        return new Promise<GetNetworksOutput>((r,j)=>{            
            storage.network=network;
            const message:GetNetworksOutput={networks:[network],defaultNetwork:network};
            EventsOnChange(WalletEvents.NETWORK_CHANGED,message);
            r(message)
        })
    }

}
/**
 * 事件出发返回方法
 * @param event 事件名称
 * @param data 传递参数
 */
const EventsOnChange= (event: WalletEvents, data?: any) => {
    chrome.tabs.query({},tabs=>{
        for (const tab of tabs) {
            const urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;  
            const url=urlReg.exec(tab.url);
            const domain = url?url[0]:tab.url;
            if(storage.domains.indexOf(domain)>=0)
            {
                chrome.tabs.sendMessage(tab.id,{EventName:event,data});
            }
        }
    })
};

enum WalletEvents {
    READY = "Teemmo.NEO.READY",
    CONNECTED = "Teemmo.NEO.CONNECTED",
    DISCONNECTED = "Teemmo.NEO.DISCONNECTED",
    NETWORK_CHANGED = "Teemmo.NEO.NETWORK_CHANGED",
    ACCOUNT_CHANGED = "Teemmo.NEO.ACCOUNT_CHANGED"
}
interface WalletAccount {
    address: string;
    label: string;
}