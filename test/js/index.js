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
    var myDate = new Date();
    var eventPool = document.getElementById("event");
    eventPool.value = myDate.toLocaleTimeString() + "ready";
    const main = new Main();
    main.start();
});
class Main {
    constructor() {
        this.getAccount_R = document.getElementById("getAccount_R");
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            document.getElementById("getNetworks_do").onclick = () => __awaiter(this, void 0, void 0, function* () {
                yield this.getNetworks();
            });
            document.getElementById("getAccount_do").onclick = () => __awaiter(this, void 0, void 0, function* () {
                yield this.getAccount();
            });
            document.getElementById("getBalance_do").onclick = () => __awaiter(this, void 0, void 0, function* () {
                var getBalance_input = document.getElementById("getBalance_input");
                yield this.getBalance(getBalance_input.value);
            });
            document.getElementById("invokeRead_do").onclick = () => __awaiter(this, void 0, void 0, function* () {
                var invokeRead_input = document.getElementById("invokeRead_input");
                yield this.invokeRead(invokeRead_input.value);
            });
            // await this.testrun();
            // await this.testRunGroup();
            // await this.invokeGroup()
            // await this.invokeGroup2();
        });
    }
    /**
     * 获得网络配置
     */
    getNetworks() {
        return new Promise((resolve, reject) => {
            Teemmo.NEO.getNetworks()
                .then(result => {
                console.log(result);
                document.getElementById("getNetworks_R").textContent = JSON.stringify(result, null, 2);
                resolve();
            })
                .catch(error => {
                console.log(error);
                reject();
            });
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
                this.getAccount_R.textContent = JSON.stringify(result, null, 2);
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
    getBalance(params) {
        // const params:BalanceRequest={
        //     address:this.address,   // 你要查询的地址
        //     assets:["602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7"], // 不填则默认查四个资产 NEO　GAS　NNC NNK 可能之后要改一下
        //     // fetchUTXO 可以不填的
        // }
        // 获得余额的参数
        const data = {
            network: "TestNet",
            params: JSON.parse(params)
        };
        return new Promise((resolve, reject) => {
            Teemmo.NEO.getBalance(data) // 获得余额的方法
                .then(result => {
                console.log(result);
                document.getElementById("getBalance_R").innerText = JSON.stringify(result, null, 2);
                resolve();
            })
                .catch(error => {
                console.log(error);
                reject();
            });
        });
    }
    /**
     * 试运行合约（单操作）
     */
    invokeRead(params) {
        return new Promise((resolve, reject) => {
            let json = JSON.parse(params);
            console.log(json);
            Teemmo.NEO.invokeRead(JSON.parse(params))
                .then(result => {
                console.log(result);
                document.getElementById("invokeRead_R").innerText = JSON.stringify(result, null, 2);
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
                        { type: "Integer", value: "1000" }
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
    testrun() {
        const params = {
            scriptHash: 'fc732edee1efdf968c23c20a9628eaa5a6ccb934',
            operation: 'symbol',
            arguments: [],
            network: 'TestNet'
        };
        return new Promise((resolve, reject) => {
            Teemmo.NEO.invokeRead(params)
                .then(result => {
                console.log(result);
                resolve();
            })
                .catch(error => {
                console.log("==============进入了异常流程");
                console.log(error);
                reject();
            });
        });
    }
    testRunGroup() {
        const params = {
            group: [
                {
                    scriptHash: 'fc732edee1efdf968c23c20a9628eaa5a6ccb934',
                    operation: 'totalSupply',
                    arguments: [],
                    network: 'TestNet'
                },
                {
                    scriptHash: 'fc732edee1efdf968c23c20a9628eaa5a6ccb934',
                    operation: 'name',
                    arguments: [],
                    network: 'TestNet'
                },
                {
                    scriptHash: 'fc732edee1efdf968c23c20a9628eaa5a6ccb934',
                    operation: 'symbol',
                    arguments: [],
                    network: 'TestNet'
                },
                {
                    scriptHash: 'fc732edee1efdf968c23c20a9628eaa5a6ccb934',
                    operation: 'decimals',
                    arguments: [],
                    network: 'TestNet'
                }
            ]
        };
        return new Promise((resolve, reject) => {
            Teemmo.NEO.invokeReadGroup(params)
                .then(result => {
                console.log(result);
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