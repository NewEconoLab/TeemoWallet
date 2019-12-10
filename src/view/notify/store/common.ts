import { observable, action } from 'mobx';
import { ICommonStore } from './interface/common.interface';

/**
 * 我的账户管理
 */
class Common implements ICommonStore {
    @observable public error: boolean = false;
    @action public errorChange = (state: boolean) => {
        this.error = state
    }
}

export default new Common();