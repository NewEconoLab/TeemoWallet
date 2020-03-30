import { observable, action } from 'mobx';
import { NepAccount } from "../../../common/entity";
import { Storage_local, bg } from "../utils/storagetools";
import { BalanceRequest, GetBalanceArgs, BalanceResults, Balance } from "../../../lib/background";
import { NetWork, IAccountMessage, ICommonStore } from './interface/common.interface';
import historyStore from '../containers/history/store/history.store';
import manageStore from '../containers/manage/store/manage.store';
import { HASH_CONFIG } from '../../config';

/**
 * 我的账户管理
 */
class Common implements ICommonStore {
    @observable public walletnew_label: string = 'create';
    @observable public claimGasAmount: string = '0';
    @observable public account: IAccountMessage = { address: '', lable: '', pubkeyHex: '' };
    @observable public network: NetWork = NetWork.TestNet;
    @observable public balances: Balance[] = [];

    @action public selectLabel = (lable: string) => {
        this.walletnew_label = lable;
    }

    @action public initNetWork = () => {
        const currentNet = bg.AccountManager.getCurrentNetWork();
        this.network = NetWork[ currentNet ];
        this.initAccountBalance();
    }

    @action public changeNetWork = (network: NetWork) => {
        return new Promise<NetWork>((r, j) => {
            bg.AccountManager.netWorkChange(network)
                .then(result => {
                    this.network = network;
                    manageStore.initAssetList();
                    this.initAccountBalance();
                    historyStore.initHistoryList();
                    this.initClaimGasAmount();
                    r(this.network);
                })
        })
    }

    @action public initAccountBalance = () => {
        const assetids = localStorage.getItem('Teemo-assetManager-' + this.network + this.account.address);
        if (assetids) {
            const list = JSON.parse(assetids);
            const arr = [];
            this.balances = [];
            for (const key in list) {
                if (list[ key ]) {
                    const asset = manageStore.allAsset.find(asset => asset.assetid == key)
                    if (asset) this.balances.push({ symbol: asset.symbol.toLocaleUpperCase(), assetID: key, amount: '0' })
                    arr.push(key)
                }
            }
            if (arr.length > 0) {
                const params: BalanceRequest = {
                    address: this.account.address,   // 你要查询的地址
                    assets: arr,
                }
                const data: GetBalanceArgs = {
                    "network": this.network,
                    "params": params
                }
                bg.getBalance(data).then((result: BalanceResults) => {
                    console.log("getBalance Result", result);

                    this.balances = result[ this.account.address ];
                })
            }
        }
        else {
            this.balances = [
                { symbol: 'NEO', assetID: HASH_CONFIG.ID_NEO, amount: '0' },
                { symbol: 'GAS', assetID: HASH_CONFIG.ID_GAS, amount: '0' }
            ];
            const params: BalanceRequest = {
                address: this.account.address,   // 你要查询的地址
                assets: [ HASH_CONFIG.ID_NEO, HASH_CONFIG.ID_GAS ],
            }
            const data: GetBalanceArgs = {
                "network": this.network,
                "params": params
            }
            bg.getBalance(data).then((result: BalanceResults) => {
                console.log("getBalance Result", result);
                // console.log("BalanceResults", result);
                this.balances = result[ this.account.address ];
            })
        }
    }

    @action public initAccountInfo = () => {
        const acc = bg.AccountManager.getCurrentAccount();
        this.account.address = acc.address;
        this.account.lable = acc.walletName;
        this.account.pubkeyHex = acc.pubkeyHex;
    }

    @action public initClaimGasAmount = () => {
        bg.getClaimGasAmount()
            .then(result => {
                this.claimGasAmount = result;
            })
    }

    @action public getBalanceByAsset = async (assetid: string) => {
        const params: BalanceRequest = {
            address: this.account.address,   // 你要查询的地址
            assets: [ assetid ],
        }
        const data: GetBalanceArgs = {
            "network": this.network,
            "params": params
        }
        const result = await bg.getBalance(data)
        console.log("getBalance Result", result);
        return result[ this.account.address ][ 0 ];
    }

    private _accountList: NepAccount[];


    public set accountList(v: NepAccount[]) {
        this.accountList = v;
        // Storage_local.setAccount(v);
    }

    public get accountList() {
        if (this._accountList && this._accountList.length) {
            return this._accountList;
        }
        else {
            return Storage_local.getAccount();
        }
    }

}

export default new Common();