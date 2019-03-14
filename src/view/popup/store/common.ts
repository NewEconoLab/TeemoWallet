import { AccountInfo, NepAccount } from "../../../common/entity";
import { Storage_internal, Storage_local, bg } from "../utils/storagetools";
import { BalanceRequest, GetBalanceArgs,BalanceResults } from "../../../lib/background";
import { HASH_CONFIG } from "../../config";

/**
 * 我的账户管理
 */
class Common
{
    constructor(){
        this.tabname="account"
    }   
    private tabname:string;

    public _balance:{NEO:number,GAS:number,CGAS:number,NNC:number}={NEO:0,GAS:0,CGAS:0,NNC:0};

    
    public set balance(v : {NEO:number,GAS:number,CGAS:number,NNC:number}) {
        this._balance = bg.storage['balance'] = v;
    }    
    
    public get balance() : {NEO:number,GAS:number,CGAS:number,NNC:number} {
        return bg.storage['balance']?bg.storage['balance']:{NEO:0,GAS:0,CGAS:0,NNC:0};
    }
    

    public initBalance=()=>{
        const params: BalanceRequest = {
            address: this.account.address,   // 你要查询的地址
            assets: [HASH_CONFIG.ID_NEO,HASH_CONFIG.ID_GAS, HASH_CONFIG.ID_CGAS.toString(),HASH_CONFIG.ID_NNC.toString()],
          }
        const data:GetBalanceArgs=
        {
            "network":"TestNet",
            "params":params
        }
        let assets = {NEO:0,GAS:0,CGAS:0,NNC:0};
        bg.getBalance(data)
        .then((result:BalanceResults)=>{
            result[this.account.address].forEach((value,index)=>{
                console.log(value);
                
                switch(value.symbol){
                    case 'NEO':
                        assets.NEO = parseFloat(value.amount);
                        break;
                    case 'GAS':
                        assets.GAS = parseFloat(value.amount);
                        break;
                    case 'CGAS':
                        assets.CGAS = parseFloat(value.amount);
                        break;
                    case 'NNC':
                        assets.NNC = parseFloat(value.amount);
                        break;                    
                }
                this.balance=assets;
                
            })
        })
    }

    private _network:"TestNet"|"MainNet";

    // 账户信息
    private _account:AccountInfo;
    
    private _accountList:NepAccount[];
    
    
    public set network(v : "TestNet"|"MainNet") {
        bg.AccountManager.netWorkChange(v);
        this._network = v;
    }    
    
    public get network() : "TestNet"|"MainNet" {
        return this._network = Storage_internal.get<"TestNet"|"MainNet">("network");
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