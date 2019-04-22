interface IManagerAssets
{
    myAssets:AssetInfo[];
    
    initAssetList:()=>void;

    queryAssetInfo:(value:string)=>AssetInfo[];

    addAssetInfo:(assetID:string)=>void;

    saveAssets:(assets:string[])=>void;

}


interface AssetInfo
{
    assetid:string;
    type:'nep5'|'utxo';
    symbol:string;
    name:string;
    decimals:number;
}