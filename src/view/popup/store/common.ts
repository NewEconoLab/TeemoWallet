import { observable, action } from 'mobx';
import { AccountInfo, NepAccount } from "../../../common/entity";
import { Storage_internal, Storage_local, bg } from "../utils/storagetools";
import { BalanceRequest, GetBalanceArgs,BalanceResults } from "../../../lib/background";
import { HASH_CONFIG } from "../../config";
import { IAccountBalanceStore, NetWork, IAccountMessage } from './interface/common.interface';

/**
 * 我的账户管理
 */
class Common
{
    @observable public account:IAccountMessage={address:'',lable:''};
    @observable public network:NetWork=NetWork.TestNet;
    @observable public balances:IAccountBalanceStore={NEO:0,GAS:0,CGAS:0,NNC:0,CNEO:0};
    constructor(){
        this.tabname="account"
    }
    private tabname:string;

    @action public initNetWork=()=>{
        this.network = NetWork[bg.storage.network]        
    }
    
    @action public changeNetWork=(network:NetWork)=>{
        return new Promise((r,j)=>{ 
            bg.AccountManager.netWorkChange(network)
            .then(result=>{
                this.network = network;
                this.initAccountBalance();
            })
        })
    }

    @action public initAccountBalance=()=>{
        const params: BalanceRequest = {
            address: this.account.address,   // 你要查询的地址
            assets: [HASH_CONFIG.ID_NEO,HASH_CONFIG.ID_GAS, HASH_CONFIG.ID_CGAS.toString(),HASH_CONFIG.ID_NNC.toString()],
        }
        const data:GetBalanceArgs=
        {
            "network":this.network,
            "params":params
        }
        bg.getBalance(data)
        .then((result:BalanceResults)=>{
            result[this.account.address].forEach((value,index)=>{
                switch(value.symbol){
                    case 'NEO':
                        this.balances.NEO = parseFloat(value.amount);
                        break;
                    case 'GAS':
                        this.balances.GAS = parseFloat(value.amount);
                        break;
                    case 'CGAS':
                        this.balances.CGAS = parseFloat(value.amount);
                        break;
                    case 'NNC':
                        this.balances.NNC = parseFloat(value.amount);
                        break;                    
                }
            })
        })
    }

    @action public initAccountInfo=()=>{
        const acc =Storage_internal.get<AccountInfo>(this.tabname);
        this.account.address=acc.address;
        this.account.lable=acc.walletName;
    }
    
    private _accountList:NepAccount[];
    

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

}

export default new Common();