interface IManagerAssets
{
    myAssets:AssetInfo[];
    
    initAssetList:()=>void;

    queryAssetInfo:(value:string)=>AssetInfo[];
}


interface AssetInfo
{
    assetid:string;
    type:'nep5'|'utxo';
    symbol:string;
    name:string;
    decimals:number;
}