import { observable, action } from "mobx";
import { zh_CN, en_US } from "./language";

class Intl
{
    @observable public message:{
        button:{confirm:string,cancel:string};
        toast:{successfully:string,failed:string,copySuccess:string};
        welcome:{start:string,welcomeToUse:string,describe:string};
        walletnew:any;
        login:{welcome:string,goCreate:string,placeholder1:string,button:string,error:string};
        mywallet:Language_MyWallet;
        history:Language_History;
        exchange:Language_exchange;
        transfer:Language_Transfer;
        assets:Language_Assets;
    };

    @action public changeLanguage=(language:Language)=>
    {
        if(language==Language.CN)
        {
            this.message = zh_CN;
        }else{
            this.message = en_US;
        }
    }
}

export interface Language_MyWallet{
    records: string;
    assets: string;
    mainnet: string;
    testnet: string;
    currentnet: string;
    cgasExchange: string;
    explorer: string;
}

export interface Language_History{
    wait: string;
    tranHistory: string;
    contract: string;
    waitConfirm: string;
    failed: string;
    hide: string;
    scriptHash: string;
    note: string;
    amount: string;
    fee: string;
    presonalTransfer: string;
    from:string;
    to:string;
    all: string;
}

export interface Language_exchange{
    gasToCgas: string;
    cgasToGas: string;
    operationType: string;
    amount: string;
    payfee: string;
    noBalance: string;
}

export interface Language_Transfer{    
    sendTo: string;
    amount: string;
    payfee: string;
    title: string;
    title1: string;
    title2: string;
    title3: string;
    title4: string;
    next:string;
    error1:string;
    error2:string;
}

export interface Language_Assets{
    receiving: string;
    transfer: string;
    assetlist: string;
    copy: string;
}

export enum Language
{
    CN='中文',
    EN='English'
}

export default new Intl();