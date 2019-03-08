var AccountManager = {
    createWallet: () => {
        let wallet = new ThinNeo.nep6wallet();
    },
    // 解密方法，放在background避免popup直接访问
    deciphering: (password, nepaccount) => {
        return new Promise((resolve, reject) => {
            ThinNeo.Helper.GetPrivateKeyFromNep2(nepaccount.nep2key, password, nepaccount.scrypt.N, nepaccount.scrypt.r, nepaccount.scrypt.p, (info, result) => {
                if ("nep2 hash not match." == result)
                    reject(result);
                const prikey = result;
                if (prikey != null) {
                    const pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                    storage.account = new AccountInfo(nepaccount, prikey, pubkey);
                    resolve(nepaccount);
                }
                else {
                    reject("prikey is null");
                }
            });
        });
    },
    // 加密方法同样放在background
    encryption: (password, prikey) => {
        return new Promise((resolve, reject) => {
            var array = new Uint8Array(32);
            var key = Neo.Cryptography.RandomNumberGenerator.getRandomValues(array);
            // spanPri.textContent = key.toHexString();
            const pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(key);
            const address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
            const scrypt = new ThinNeo.nep6ScryptParameters();
            scrypt.N = 16384;
            scrypt.r = 8;
            scrypt.p = 8;
            ThinNeo.Helper.GetNep2FromPrivateKey(key, password, scrypt.N, scrypt.r, scrypt.p, (info, result) => {
                if (info == "finish") {
                    resolve(new AccountInfo(new NepAccount("", address, result, scrypt), prikey, pubkey));
                }
                else {
                    reject(result);
                }
            });
        });
    },
};
//# sourceMappingURL=account.js.map