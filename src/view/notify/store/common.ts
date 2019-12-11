import { observable, action } from 'mobx';
import { ICommonStore } from './interface/common.interface';

/**
 * 我的账户管理
 */
class Common implements ICommonStore {
    @observable public error: boolean = false;
    @observable public title: string = "";
    @observable public domain: string = "";
    @observable public address: string = "";
    @observable public loading: boolean = true;
    @action public errorChange = (state: boolean) => {
        this.error = state
    }
    @action public initNotifyHeader = (header: { title: string, domain: string, address: string }) => {
        this.title = header.title;
        this.domain = header.domain;
        this.address = header.address;
    }
    @action public loadingStateChange = (state: boolean) => {
        this.loading = state;
    }
}

export default new Common();