import { action, observable } from "mobx";
import { bg } from "../../../utils/storagetools";
import common from "../../../store/common";
import { HASH_CONFIG } from "../../../../config";

class ManagerStore implements IManagerAssets
{
    @observable myAssets: AssetInfo[]=[];
    @observable allAsset: AssetInfo[]=[];

    @action public initAssetList = async() => {
        bg.assetManager.initAllAseetInfo();
        const assetids = localStorage.getItem('Teemo-assetManager-'+common.network+common.account.address);
        this.allAsset = bg.assetManager.allAssetInfo;
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
                this.myAssets = this.allAsset.filter(asset=>arr.indexOf(asset.assetid)>=0);
            else
                this.myAssets=[];
        }
        else
        {
            const NEO:AssetInfo = {'assetid':HASH_CONFIG.ID_NEO,'symbol':'NEO','name':'NEO','decimals':0,'type':'utxo'};
            const GAS:AssetInfo = {'assetid':HASH_CONFIG.ID_GAS,'symbol':'GAS','name':'GAS','decimals':8,'type':'utxo'};
            this.myAssets = [NEO,GAS];
        }
    }

    @action public queryAssetInfo = (value: string) =>{
        return bg.assetManager.queryAsset(value);;
    }

    @action public addAssetInfo = (assetID:string)=>{
        // bg.assetManager.addAsset(assetID);
    }

    @action public saveAssets = (assets: string[]) => {
        const myAssets = {};
        for (const asset of assets) {
            myAssets[asset]=true;
        }
        myAssets[HASH_CONFIG.ID_NEO]= !!myAssets[HASH_CONFIG.ID_NEO];
        myAssets[HASH_CONFIG.ID_GAS]= !!myAssets[HASH_CONFIG.ID_GAS];
        localStorage.setItem('Teemo-assetManager-'+common.network+common.account.address,JSON.stringify(myAssets));
        common.initAccountBalance();
    }    
    
}
export default new ManagerStore();