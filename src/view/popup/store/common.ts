import { observable, action } from 'mobx';
import { NepAccount } from "../../../common/entity";
import { Storage_local, bg } from "../utils/storagetools";
import { BalanceRequest, GetBalanceArgs,BalanceResults } from "../../../lib/background";
import { HASH_CONFIG } from "../../config";
import { NetWork, IAccountMessage, ICommonStore } from './interface/common.interface';
import historyStore from '../containers/history/store/history.store';
import manageStore from '../containers/manage/store/manage.store';

/**
 * 我的账户管理
 */
class Common implements ICommonStore
{
    @observable public claimGasAmount: string='0';
    @observable public account:IAccountMessage={address:'',lable:'',pubkeyHex:''};
    @observable public network:NetWork=NetWork.TestNet;
    @observable public balances:{[asset:string]:number}={};

    constructor(){
        this.tabname="account"
    }
    private tabname:string;

    @action public initNetWork=()=>{
        const currentNet = bg.AccountManager.getCurrentNetWork();
        this.network = NetWork[currentNet];        
    }
    
    @action public changeNetWork=(network:NetWork)=>{
        return new Promise<NetWork>((r,j)=>{ 
            bg.AccountManager.netWorkChange(network)
            .then(result=>{
                this.network = network;
                this.initAccountBalance();
                historyStore.initHistoryList();
                this.initClaimGasAmount();
                manageStore.initAssetList();
                r(this.network);
            })
        })
    }

    @action public initAccountBalance=()=>{
        manageStore.initAssetList();
        const params: BalanceRequest = {
            address: this.account.address,   // 你要查询的地址
            assets: manageStore.myAssets.map(asset=>asset.assetid),
        }
        const data:GetBalanceArgs=
        {
            "network":this.network,
            "params":params
        }
        // this.balances={NEO:0,GAS:0,NNC:0,CGAS:0,CNEO:0};
        this.balances={};
        bg.getBalance(data)
        .then((result:BalanceResults)=>{
            result[this.account.address].forEach((value,index)=>{
                this.balances[value.symbol]=parseFloat(value.amount);
            })
        })
    }

    @action public initAccountInfo=()=>{
        const acc =bg.AccountManager.getCurrentAccount();
        this.account.address=acc.address;
        this.account.lable=acc.walletName;
        this.account.pubkeyHex = acc.pubkeyHex;
    }
    
    @action public initClaimGasAmount= () => {
        bg.getClaimGasAmount()
        .then(result=>{
            this.claimGasAmount=result;
        })
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