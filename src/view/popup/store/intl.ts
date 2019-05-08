import { observable, action } from "mobx";
import { en_US, zh_CN } from "./language";

class Intl
{
    @observable public currentLang:Language;

    @observable public message:{
        button:Language_Button;
        toast:Language_Toast;
        welcome:Language_Welcome;
        walletnew:any;
        login:Language_Login;
        mywallet:Language_MyWallet;
        history:Language_History;
        exchange:Language_exchange;
        transfer:Language_Transfer;
        assets:Language_Assets;
        notify: Language_Notify;
        setting: Language_Setting;
        editwallet:Language_EditWallet
    };

    @action public initLanguage=()=>{
        const lang = localStorage.getItem('language');
        if(lang)
        {
            this.currentLang = lang=='zh'?Language.CN:Language.EN;            
        }
        else
        {
            this.currentLang = Language.CN;
        }
        this.changeLanguage(this.currentLang);
    }

    @action public changeLanguage=(language:Language)=>
    {
        if(language==Language.CN)
        {
            this.currentLang = Language.CN;
            this.message = zh_CN;
            console.log(language);
            
            localStorage.setItem('language', 'zh');
        }else{
            this.currentLang = Language.EN;
            this.message = en_US;
            console.log(language);
            localStorage.setItem('language', 'en');
        }
    }
}

export interface Message_lang
{
    button:Language_Button;
    toast:Language_Toast;
    welcome:Language_Welcome;
    walletnew:any;
    login:Language_Login;
    mywallet:Language_MyWallet;
    history:Language_History;
    exchange:Language_exchange;
    transfer:Language_Transfer;
    assets:Language_Assets;
    notify: Language_Notify;
    setting: Language_Setting;
    editwallet:Language_EditWallet;
};

export interface Language_Button
{
    confirm:string,
    cancel:string,
    refuse: string;
    next: string;
    delete: string;
}

export interface Language_Toast
{
    successfully:string,
    failed:string,
    copySuccess:string
}

export interface Language_Welcome{start:string,welcomeToUse:string,describe:string}

export interface Language_Login{welcome:string,goCreate:string,placeholder1:string,button:string,error:string}

export interface Language_Notify
{
    message1:string,
    message2:string,
    from:string,
    dappNote:string,
    tranData:string,
    Info:string,
    tranInfo:string,
    method:string,
    scriptHash:string,
    toAddress:string,
    AssetsID:string
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
    available:string;
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
    manager: string;
    GasClaimable: string;
    claim: string;
    claimGas:string;
    claiming: string;
    message : string;
    message1:string;
    message2:string;
    save:string;
}

export interface Language_Setting{
    successful: string;
    message: string;
    clearAuthorization: string;
    clear: string;
    clearTx: string;
    autoLock: string;
    off: string;
    second: string;
    minute: string;
    wallet:string;
}

export interface Language_EditWallet{    
    create: string;
    import: string;
    setting: string;
    address: string;
    download: string;
    prikey: string;
    nep2key: string;
    deletewallet: string;
    msg1: string;
    msg2: string;
    msg3: string;
    msg4: string;
    msg5: string;
    msg6: string;
    msg6_2: string;
    msg6_3: string;
    msg7: string;
    msg8: string;
    msg9: string;
    msg10: string;
    msg11: string;
    msg12: string;
    msg13: string;
    msg14: string;
    msg15: string;
    msg16: string;
    msg17: string;
    msg18: string;
}

export enum Language
{
    CN='中',
    EN='En'
}

export default new Intl();