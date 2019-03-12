/// <reference path="./background.d.ts" />

import { NepAccount } from "./background";
import { LoginInfo } from "../view/notify/utils/neotools";
import { AccountInfo } from "../common/entity";

declare interface AccountManager{
    createWallet: (key: Uint8Array) => void;
    deciphering: (password: string, nepaccount: NepAccount) => Promise<WalletAccount>;
    encryption: (password: string, wif: string) => Promise<WalletAccount>;
    nep2Load: (nep2: string, password: string) => Promise<WalletAccount>;
    nep6Load: (walletstr: string, password: string) => Promise<WalletAccount>;
    /**
     * 获得账户私钥等信息从account解密
     */
    getPriKeyfromAccount: (scrypt: ThinNeo.nep6ScryptParameters, password: string, account: ThinNeo.nep6account) => Promise<LoginInfo>;
    netWorkChange: (network: "TestNet"|"MainNet") => void;
    logout: () => void;
    setAccount: (account: AccountInfo) => void;
    getCurrent: () => WalletAccount;
}
/**
 * 事件出发返回方法
 * @param event 事件名称
 * @param data 传递参数
 */
declare const EventsOnChange: (event: WalletEvents, data?: any) => void;
declare enum WalletEvents {
    READY = "Teemmo.NEO.READY",
    CONNECTED = "Teemmo.NEO.CONNECTED",
    DISCONNECTED = "Teemmo.NEO.DISCONNECTED",
    NETWORK_CHANGED = "Teemmo.NEO.NETWORK_CHANGED",
    ACCOUNT_CHANGED = "Teemmo.NEO.ACCOUNT_CHANGED"
}
interface WalletAccount {
    address: string;
    label: string;
}
//# sourceMappingURL=account.d.ts.map
//# sourceMappingURL=account.d.ts.map