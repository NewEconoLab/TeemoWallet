/// <reference path="./background.d.ts" />

import { NepAccount } from "./background";
import { LoginInfo } from "../view/notify/utils/neotools";
import { AccountInfo } from "../common/entity";
import { NetWork } from "../view/popup/store/interface/common.interface";

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
    netWorkChange: (network: "TestNet" | "MainNet") => Promise<GetNetworksOutput>;
    logout: () => void;
    setAccount: (account: AccountInfo) => void;
    getCurrent: () => WalletAccount;
    getCurrentAccount: () => {
        address: string;
        walletName: string;
        pubkeyHex: string;
    };
    setAccountName: (label: string) => void;
    getCurrentNetWork: () => "TestNet" | "MainNet";
    settingDisconnection: (time: number) => void;
    cleanTrustList: () => void;
}

interface GetNetworksOutput {
    networks: string[];
    defaultNetwork: NetWork;
}
/**
 * 事件出发返回方法
 * @param event 事件名称
 * @param data 传递参数
 */
declare const EventsOnChange: (event: WalletEvents, data?: any) => void;
declare enum WalletEvents {
    READY = "Teemo.NEO.READY",
    CONNECTED = "Teemo.NEO.CONNECTED",
    DISCONNECTED = "Teemo.NEO.DISCONNECTED",
    NETWORK_CHANGED = "Teemo.NEO.NETWORK_CHANGED",
    ACCOUNT_CHANGED = "Teemo.NEO.ACCOUNT_CHANGED"
}
interface WalletAccount {
    address: string;
    label: string;
}
//# sourceMappingURL=account.d.ts.map
//# sourceMappingURL=account.d.ts.map