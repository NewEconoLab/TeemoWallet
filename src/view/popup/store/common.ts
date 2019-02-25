import { AccountInfo, NepAccount } from "../../../common/entity";
import { Storage_internal, Storage_local } from "../utils/storagetools";

/**
 * 我的账户管理
 */
class Common
{
    constructor(){
        this.tabname="account"
    }   
    private tabname:string;

    private _network:string;

    // 账户信息
    private _account:AccountInfo;
    
    private _accountList:NepAccount[];
    
    
    public set network(v : string) {
        Storage_internal.set("network",v);
        this._network = v;
    }    
    
    public get network() : string {
        return this._network = Storage_internal.get("network");
    }
    

    public set accountList(v : NepAccount[]) {
        this.accountList = v;
        // Storage_local.setAccount(v);
    }
    
    public get accountList(){
        if(this._accountList && this._accountList.length)
        {
            return this._accountList;
        }
        else
        {
            return Storage_local.getAccount();
        }
    }
    
    // set 方法往background的storage变量赋值
    public set account(v : AccountInfo) {
        this._account = v;
        Storage_internal.set(this.tabname,v);
    }
    
    // 从background storage 变量中取值
    public get account() : AccountInfo {
        const acc =Storage_internal.get<AccountInfo>(this.tabname);

        const newacc = new AccountInfo(
            new NepAccount(acc.walletName,acc.address,acc.nep2key,acc.scrypt,acc.index),
            acc.prikey,acc.pubkey
        );
        
        return newacc;
    }

}

export default new Common();