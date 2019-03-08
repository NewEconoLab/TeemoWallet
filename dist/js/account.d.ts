declare var AccountManager: {
    createWallet: (key: Uint8Array) => void;
    deciphering: (password: string, nepaccount: NepAccount) => Promise<NepAccount>;
    encryption: (password: string, wif: string) => Promise<AccountInfo>;
    nep2Load: (nep2: string, password: string) => Promise<boolean>;
    nep6Load: (wallet: ThinNeo.nep6wallet, password: string) => Promise<AccountInfo[]>;
    getPriKeyfromAccount: (scrypt: ThinNeo.nep6ScryptParameters, password: string, account: ThinNeo.nep6account) => Promise<LoginInfo>;
};
//# sourceMappingURL=account.d.ts.map