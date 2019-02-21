import { AccountInfo } from "../../../common/entity";
import { Storage_internal } from "../utils/storagetools";

class MyAccount
{
    constructor(){
        this.tabname="account"
    }   
    private tabname:string;
    private _account:AccountInfo;
    
    public set account(v : AccountInfo) {
        this._account = v;
        Storage_internal.set(this.tabname,v);
    }
    
    
    public get account() : AccountInfo {
        return Storage_internal.get<AccountInfo>(this.tabname);
    }
    
}

export default new MyAccount();