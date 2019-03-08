declare var AccountManager: {
    createWallet: () => void;
    deciphering: (password: string, nepaccount: NepAccount) => Promise<NepAccount>;
    encryption: (password: string, prikey: Uint8Array) => Promise<AccountInfo>;
};
//# sourceMappingURL=account.d.ts.map