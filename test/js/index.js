///<reference path="./inject.d.ts"/>
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
window.addEventListener('Teemmo.NEO.READY', () => {
    console.log("inject ready ");
    const main = new Main();
    main.start();
});
class Main {
    constructor() {
        this.index = document.getElementById("index");
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getAccount();
            yield this.getBalance();
            yield this.invokeGroup();
            yield this.invokeGroup2();
        });
    }
    /**
     * 获得账户信息
     */
    getAccount() {
        return new Promise((resolve, reject) => {
            Teemmo.NEO.getAccount()
                .then(result => {
                console.log(result);
                this.index.textContent = JSON.stringify(result);
                this.address = result.address; // 当前登陆的地址
                this.name = result.label; // 当前钱包的名字
                resolve();
            })
                .catch(error => {
                console.log(error);
                reject();
            });
        });
    }
    /**
     * 获得余额信息
     */
    getBalance() {
        const params = {
            address: this.address,
            assets: ["602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7"],
        };
        // 获得余额的参数
        const data = {
            network: "TestNet",
            params: params
        };
        return new Promise((resolve, reject) => {
            Teemmo.NEO.getBalance(data) // 获得余额的方法
                .then(result => {
                console.log(result);
                resolve();
            })
                .catch(error => {
                console.log(error);
                reject();
            });
        });
    }
    invokeGroup() {
        console.log("this is InvokeGroup");
        const params = {
            merge: true,
            group: [
                {
                    scriptHash: "74f2dc36a68fdc4682034178eb2220729231db76",
                    operation: "transfer",
                    arguments: [
                        { type: "Address", value: "AHDV7M54NHukq8f76QQtBTbrCqKJrBH9UF" },
                        { type: "Address", value: "AbU7BUQHW9sa69pTac7pPR3cq4gQHYC1DH" },
                        { type: "Integer", value: "100000" }
                    ],
                    network: "TestNet",
                },
                {
                    scriptHash: "00d00d0ac467a5b7b2ad04052de154bb9fe8c2ff",
                    operation: "setmoneyin",
                    arguments: [
                        /**
                         * 这个地方相当与使用了 Hook_Txid 类型 等同于当前的交易id 代替了 下面这几句
                            sb.EmitSysCall("System.ExecutionEngine.GetScriptContainer");
                            sb.EmitSysCall("Neo.Transaction.GetHash");
                         */
                        { type: "Hook_Txid", value: 0 },
                        { type: "Hash160", value: "74f2dc36a68fdc4682034178eb2220729231db76" },
                    ],
                    network: "TestNet"
                }
            ]
        };
        return new Promise((resolve, reject) => {
            Teemmo.NEO.invokeGroup(params)
                .then(result => {
                console.log(result);
                console.log("这是交易id" + result[0].txid);
                resolve();
            })
                .catch(error => {
                console.log("==============进入了异常流程");
                console.log(error);
                reject();
            });
        });
    }
    invokeGroup2() {
        console.log("this is InvokeGroup");
        const params = {
            merge: false,
            group: [
                {
                    scriptHash: "74f2dc36a68fdc4682034178eb2220729231db76",
                    operation: "transfer",
                    arguments: [
                        { type: "Address", value: "AHDV7M54NHukq8f76QQtBTbrCqKJrBH9UF" },
                        { type: "Address", value: "AbU7BUQHW9sa69pTac7pPR3cq4gQHYC1DH" },
                        { type: "Integer", value: "100000" }
                    ],
                    network: "TestNet",
                },
                {
                    scriptHash: "00d00d0ac467a5b7b2ad04052de154bb9fe8c2ff",
                    operation: "setmoneyin",
                    arguments: [
                        /**
                         * 这个地方相当与使用了 Hook_Txid 类型 等同于当前的交易id 代替了 下面这几句
                            sb.EmitSysCall("System.ExecutionEngine.GetScriptContainer");
                            sb.EmitSysCall("Neo.Transaction.GetHash");
                         */
                        { type: "Hook_Txid", value: 0 },
                        { type: "Hash160", value: "74f2dc36a68fdc4682034178eb2220729231db76" },
                    ],
                    network: "TestNet"
                }
            ]
        };
        return new Promise((resolve, reject) => {
            Teemmo.NEO.invokeGroup(params)
                .then(result => {
                console.log(result);
                console.log("这是交易id" + result[0].txid);
                resolve();
            })
                .catch(error => {
                console.log("==============进入了异常流程");
                console.log(error);
                reject();
            });
        });
    }
    /**
     * invoke 发送交易
     */
    invoke() {
        const params = {
            scriptHash: "74f2dc36a68fdc4682034178eb2220729231db76",
            operation: "transfer",
            arguments: [
                { type: "Address", value: "AHDV7M54NHukq8f76QQtBTbrCqKJrBH9UF" },
                { type: "Address", value: "AbU7BUQHW9sa69pTac7pPR3cq4gQHYC1DH" },
                { type: "Integer", value: "100000" }
            ],
            fee: '0.001',
            network: "TestNet",
        };
        return new Promise((resolve, reject) => {
            Teemmo.NEO.invoke(params)
                .then(result => {
                console.log(result);
                console.log("这是交易id" + result.txid);
                resolve();
            })
                .catch(error => {
                console.log("==============进入了异常流程");
                console.log(error);
                reject();
            });
        });
    }
}
//# sourceMappingURL=index.js.map