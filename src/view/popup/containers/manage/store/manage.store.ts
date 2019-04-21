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
            return bg.assetManager.allAssetInfo.find(asset=>list.indexOf(asset.assetid)>=0);
        }
        else
        {
            return [];
        }
    }

    @action public queryAssetInfo=(value: string) =>{
        return bg.assetManager.queryAsset(value);;
    }

    @action public addAssetInfo=(assetID:string)=>{
        bg.assetManager.addAsset(assetID);
    }
    
}
export default new ManagerStore();