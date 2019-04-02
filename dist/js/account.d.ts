declare var AccountManager: {
    createWallet: (key: Uint8Array) => void;
    deciphering: (password: string, nepaccount: NepAccount) => Promise<NepAccount>;
    encryption: (password: string, wif: string) => Promise<AccountInfo>;
    nep2Load: (nep2: string, password: string) => Promise<boolean>;
    nep6Load: (str: string, password: string) => Promise<{
        address: string;
        label: string;
    }>;
    getPriKeyfromAccount: (scrypt: ThinNeo.nep6ScryptParameters, password: string, account: ThinNeo.nep6account) => Promise<LoginInfo>;
    setAccount: (account: AccountInfo) => void;
    logout: () => void;
    netWorkChange: (network: "TestNet" | "MainNet") => Promise<GetNetworksOutput>;
    getCurrentAccount: () => {
        address: string;
        walletName: string;
    };
    getCurrentNetWork: () => "TestNet" | "MainNet";
};
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