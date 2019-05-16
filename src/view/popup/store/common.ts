import { observable, action } from 'mobx';
import { NepAccount } from "../../../common/entity";
import { Storage_local, bg } from "../utils/storagetools";
import { BalanceRequest, GetBalanceArgs,BalanceResults, Balance } from "../../../lib/background";
import { NetWork, IAccountMessage, ICommonStore } from './interface/common.interface';
import historyStore from '../containers/history/store/history.store';
import manageStore from '../containers/manage/store/manage.store';
import { HASH_CONFIG } from '../../config';

/**
 * 我的账户管理
 */
class Common implements ICommonStore
{
    @observable public walletnew_label: string='creat';
    @observable public claimGasAmount: string='0';
    @observable public account:IAccountMessage={address:'',lable:'',pubkeyHex:''};
    @observable public network:NetWork=NetWork.TestNet;
    @observable public balances:Balance[]=[];

    @action public initNetWork=()=>{
        const currentNet = bg.AccountManager.getCurrentNetWork();
        this.network = NetWork[currentNet];        
        this.initAccountBalance();
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
        const assetids = localStorage.getItem('Teemo-assetManager-'+this.network);
        if(assetids)
        {
            const list = JSON.parse(assetids);
            const arr = [];
            for (const key in list) {
                if (list.hasOwnProperty(key)) {
                    if(list[key])
                    {
                        arr.push(key)
                    }
                }
            }
            if(arr.length>0)
            {
                const params: BalanceRequest = {
                    address: this.account.address,   // 你要查询的地址
                    assets: arr,
                }
                const data:GetBalanceArgs=
                {
                    "network":this.network,
                    "params":params
                }
                this.balances=[];
                bg.getBalance(data)
                .then((result:BalanceResults)=>{
                    this.balances=result[this.account.address];
                })
            }
            else
            {
                this.balances=[];
            }
        }
        else
        {
            const params: BalanceRequest = {
                address: this.account.address,   // 你要查询的地址
                assets: [HASH_CONFIG.ID_NEO,HASH_CONFIG.ID_GAS],
            }
            const data:GetBalanceArgs=
            {
                "network":this.network,
                "params":params
            }
            this.balances=[];
            bg.getBalance(data)
            .then((result:BalanceResults)=>{
                this.balances=result[this.account.address];
            })
        }
    }

    @action public initAccountInfo=()=>{
        const acc = bg.AccountManager.getCurrentAccount();
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

    @action public getBalanceByAsset=async(assetid:string)=>{
        const params: BalanceRequest = 
        {
            address: this.account.address,   // 你要查询的地址
            assets: [assetid],
        }
        const data:GetBalanceArgs =
        {
            "network":this.network,
            "params":params
        }
        const result = await bg.getBalance(data)
        return result[this.account.address][0];
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