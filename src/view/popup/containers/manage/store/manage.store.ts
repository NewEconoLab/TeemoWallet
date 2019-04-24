import { action, observable } from "mobx";
import { ICON } from "../../../../image";
import { bg } from "../../../utils/storagetools";
import intl from "../../../store/intl";
import common from "../../../store/common";

class ManagerStore implements IManagerAssets
{
    @observable myAssets: AssetInfo[]=[];
    @observable allAsset: AssetInfo[]=[];

    @action public initAssetList = async() => {
        const assetids = localStorage.getItem('Teemo-assetManager-'+common.network);
        this.allAsset = bg.assetManager.allAssetInfo;
        if(assetids)
        {
            const list = assetids.split('|');
            this.myAssets = this.allAsset.filter(asset=>list.indexOf(asset.assetid)>=0);
        }
        else
        {
            this.myAssets = [];
        }
    }

    @action public queryAssetInfo = (value: string) =>{
        return bg.assetManager.queryAsset(value);;
    }

    @action public addAssetInfo = (assetID:string)=>{
        bg.assetManager.addAsset(assetID);
    }

    @action public saveAssets = (assets: string[]) => {        
        localStorage.setItem('Teemo-assetManager-'+common.network,assets.join('|'));
    }    
    
}
export default new ManagerStore();