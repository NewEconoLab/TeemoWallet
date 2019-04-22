import { action, observable } from "mobx";
import { ICON } from "../../../../image";
import { bg } from "../../../utils/storagetools";
import intl from "../../../store/intl";

class ManagerStore implements IManagerAssets
{
    @observable myAssets: AssetInfo[];    

    @action public initAssetList = () => {
        const assetids = localStorage.getItem('Teemo-assetManager');
        if(assetids)
        {
            const list = assetids.split('|');
            this.myAssets = bg.assetManager.allAssetInfo.filter(asset=>list.indexOf(asset.assetid)>=0);
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
        localStorage.setItem('Teemo-assetManager',assets.join('|'));
    }    
    
}
export default new ManagerStore();