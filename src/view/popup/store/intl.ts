import { observable, action } from "mobx";
import { zh_CN, en_US } from "./language";

class Intl
{
    @observable public message:{
        button:any;
        welcome:any;
        walletnew:any;
        mywallet:any;
        login:any;
        asset:any;
        exchange:any;
        assets:any;
        history:any;
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

export enum Language
{
    CN='中文',
    EN='English'
}

export default new Intl();