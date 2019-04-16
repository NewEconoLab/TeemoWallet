///<reference path="./inject.d.ts"/>
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * 定义事件接收与响应代码
 */
window.addEventListener('Teemo.NEO.READY', (data) => {
    console.log("inject READY ");
    //console.log(JSON.stringify(data.detail))
    var myDate = new Date();
    var eventPool = document.getElementById("event");
    eventPool.value = myDate.toLocaleTimeString() + "  READY" + "\n" + eventPool.value;
    document.getElementById("eventData").textContent = JSON.stringify(data.detail, null, 2);
    const main = new Main();
    main.start(); //监听到这个事件后，才能开始插件的相关方法调用
});
window.addEventListener('Teemo.NEO.ACCOUNT_CHANGED', (data) => {
    console.log("inject ACCOUNT_CHANGED ");
    var myDate = new Date();
    var eventPool = document.getElementById("event");
    eventPool.value = myDate.toLocaleTimeString() + "  ACCOUNT_CHANGED" + "\n" + eventPool.value;
    document.getElementById("eventData").textContent = JSON.stringify(data.detail, null, 2);
});
window.addEventListener('Teemo.NEO.CONNECTED', (data) => {
    console.log("inject CONNECTED ");
    var myDate = new Date();
    var eventPool = document.getElementById("event");
    eventPool.value = myDate.toLocaleTimeString() + "  CONNECTED" + "\n" + eventPool.value;
    document.getElementById("eventData").textContent = JSON.stringify(data.detail, null, 2);
});
window.addEventListener('Teemo.NEO.DISCONNECTED', (data) => {
    console.log("inject DISCONNECTED ");
    var myDate = new Date();
    var eventPool = document.getElementById("event");
    eventPool.value = myDate.toLocaleTimeString() + "  DISCONNECTED" + "\n" + eventPool.value;
    document.getElementById("eventData").textContent = JSON.stringify(data.detail, null, 2);
});
window.addEventListener('Teemo.NEO.NETWORK_CHANGED', (data) => {
    console.log("inject NETWORK_CHANGED ");
    var myDate = new Date();
    var eventPool = document.getElementById("event");
    eventPool.value = myDate.toLocaleTimeString() + "  NETWORK_CHANGED" + "\n" + eventPool.value;
    document.getElementById("eventData").textContent = JSON.stringify(data.detail, null, 2);
});
window.addEventListener('Teemo.NEO.BLOCK_HEIGHT_CHANGED', (data) => {
    console.log("inject BLOCK_HEIGHT_CHANGED ");
    var myDate = new Date();
    var eventPool = document.getElementById("event");
    eventPool.value = myDate.toLocaleTimeString() + "  BLOCK_HEIGHT_CHANGED" + "\n" + eventPool.value;
    document.getElementById("eventData").textContent = JSON.stringify(JSON.parse(data.detail), null, 2);
});
window.addEventListener('Teemo.NEO.TRANSACTION_CONFIRMED', (data) => {
    console.log("inject TRANSACTION_CONFIRMED ");
    var myDate = new Date();
    var eventPool = document.getElementById("event");
    eventPool.value = myDate.toLocaleTimeString() + "  TRANSACTION_CONFIRMED" + "\n" + eventPool.value;
    document.getElementById("eventData").textContent = JSON.stringify(data.detail, null, 2);
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
            document.getElementById("getBlock_do").onclick = () => __awaiter(this, void 0, void 0, function* () {
                var getBlock_input = document.getElementById("getBlock_input");
                yield this.getBlock(parseInt(JSON.parse(getBlock_input.value)['blockHeight']));
            });
            document.getElementById("getTransaction_do").onclick = () => __awaiter(this, void 0, void 0, function* () {
                var getTransaction_input = document.getElementById("getTransaction_input");
                yield this.getTransaction(JSON.parse(getTransaction_input.value)['txid']);
            });
            document.getElementById("getApplicationLog_do").onclick = () => __awaiter(this, void 0, void 0, function* () {
                var getApplicationLog_input = document.getElementById("getApplicationLog_input");
                yield this.getApplicationLog(JSON.parse(getApplicationLog_input.value)['txid']);
            });
            document.getElementById("getBalance_do").onclick = () => __awaiter(this, void 0, void 0, function* () {
                var getBalance_input = document.getElementById("getBalance_input");
                yield this.getBalance(getBalance_input.value);
            });
            document.getElementById("invokeRead_do").onclick = () => __awaiter(this, void 0, void 0, function* () {
                var invokeRead_input = document.getElementById("invokeRead_input");
                yield this.invokeRead(invokeRead_input.value);
            });
            document.getElementById("invokeReadGroup_do").onclick = () => __awaiter(this, void 0, void 0, function* () {
                var invokeReadGroup_input = document.getElementById("invokeReadGroup_input");
                yield this.invokeReadGroup(invokeReadGroup_input.value);
            });
            document.getElementById("send_do").onclick = () => __awaiter(this, void 0, void 0, function* () {
                var send_input = document.getElementById("send_input");
                yield this.send(send_input.value);
            });
            document.getElementById("invoke_do").onclick = () => __awaiter(this, void 0, void 0, function* () {
                var invoke_input = document.getElementById("invoke_input");
                yield this.invoke(invoke_input.value);
            });
            document.getElementById("invokeGroup_do").onclick = () => __awaiter(this, void 0, void 0, function* () {
                var invokeGroup_input = document.getElementById("invokeGroup_input");
                yield this.invokeGroup(invokeGroup_input.value);
            });
            document.getElementById("getStorage_do").onclick = () => __awaiter(this, void 0, void 0, function* () {
                var getStorage_input = document.getElementById("getStorage_input");
                yield this.getStorage(getStorage_input.value);
            });
            document.getElementById("getAddressFromScriptHash_do").onclick = () => __awaiter(this, void 0, void 0, function* () {
                var getAddressFromScriptHash_input = document.getElementById("getAddressFromScriptHash_input");
                yield this.getAddressFromScriptHash(getAddressFromScriptHash_input.value.replace(/(^\s*)|(\s*$)/g, ""));
            });
            document.getElementById("merge").onclick = () => {
                var invokeGroup_input = document.getElementById("invokeGroup_input");
                invokeGroup_input.value = JSON.stringify({
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
                            "description": "NNC转账",
                            "fee": "0",
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
                            "description": "充值确认",
                            "fee": "0.001",
                            network: "TestNet"
                        }
                    ]
                }, null, 2);
            };
            document.getElementById("unmerge").onclick = () => {
                var invokeGroup_input = document.getElementById("invokeGroup_input");
                invokeGroup_input.value = JSON.stringify({
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
                            "description": "NNC转账",
                            "fee": "0.001",
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
                            "description": "充值确认",
                            "fee": "0.001",
                            network: "TestNet"
                        }
                    ]
                }, null, 2);
            };
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
            Teemo.NEO.getNetworks()
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
            Teemo.NEO.getAccount()
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
    getBlock(params) {
        // 获得余额的参数
        const data = {
            blockHeight: params,
            network: "TestNet",
        };
        return new Promise((resolve, reject) => {
            Teemo.NEO.getBlock(data) // 获得余额的方法
                .then(result => {
                console.log(result);
                document.getElementById("getBlock_R").innerText = JSON.stringify(result, null, 2);
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
    getTransaction(params) {
        const data = {
            network: "TestNet",
            txid: params
        };
        return new Promise((resolve, reject) => {
            Teemo.NEO.getTransaction(data) // 获得余额的方法
                .then(result => {
                console.log(result);
                document.getElementById("getTransaction_R").innerText = JSON.stringify(result, null, 2);
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
    getApplicationLog(params) {
        const data = {
            network: "TestNet",
            txid: params
        };
        return new Promise((resolve, reject) => {
            Teemo.NEO.getApplicationLog(data) // 获得余额的方法
                .then(result => {
                console.log(result);
                document.getElementById("getApplicationLog_R").innerText = JSON.stringify(result, null, 2);
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
            Teemo.NEO.getBalance(data) // 获得余额的方法
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
            Teemo.NEO.invokeRead(JSON.parse(params))
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
    /**
     * 试运行合约（多操作）
     */
    invokeReadGroup(params) {
        return new Promise((resolve, reject) => {
            let json = JSON.parse(params);
            console.log(json);
            Teemo.NEO.invokeReadGroup(JSON.parse(params))
                .then(result => {
                console.log(result);
                document.getElementById("invokeReadGroup_R").innerText = JSON.stringify(result, null, 2);
                resolve();
            })
                .catch(error => {
                console.log(error);
                reject();
            });
        });
    }
    /**
     * send 发送转账交易
     */
    send(params) {
        return new Promise((resolve, reject) => {
            Teemo.NEO.send(JSON.parse(params))
                .then(result => {
                console.log(result);
                document.getElementById("send_R").innerText = JSON.stringify(result, null, 2);
                resolve();
            })
                .catch(error => {
                console.log("==============进入了异常流程");
                console.log(error);
                document.getElementById("send_R").innerText = JSON.stringify(error, null, 2);
                reject();
            });
        });
    }
    /**
     * invoke 发送合约调用交易（单操作）
     */
    invoke(params) {
        // const params:InvokeArgs = {
        //     scriptHash:"74f2dc36a68fdc4682034178eb2220729231db76",  // 合约地址
        //     operation:"transfer",
        //     arguments:[
        //         {type:"Address",value:"AHDV7M54NHukq8f76QQtBTbrCqKJrBH9UF"},
        //         {type:"Address",value:"AbU7BUQHW9sa69pTac7pPR3cq4gQHYC1DH"},
        //         {type:"Integer",value:"100000"}
        //     ],
        //     fee:'0.001',
        //     network:"TestNet",
        //     // assets: 暂时用不到
        // }
        return new Promise((resolve, reject) => {
            Teemo.NEO.invoke(JSON.parse(params))
                .then(result => {
                console.log(result);
                console.log("这是交易id" + result.txid);
                document.getElementById("invoke_R").innerText = JSON.stringify(result, null, 2);
                resolve();
            })
                .catch(error => {
                console.log("==============进入了异常流程");
                console.log(error);
                document.getElementById("invoke_R").innerText = JSON.stringify(error, null, 2);
                reject();
            });
        });
    }
    /**
     * invoke 发送合约调用交易（多操作）
     */
    invokeGroup(params) {
        // console.log("this is InvokeGroup");
        // const params:InvokeGroup = {
        //     merge:true,
        //     group:[
        //         {
        //             scriptHash:"74f2dc36a68fdc4682034178eb2220729231db76",  // 合约地址
        //             operation:"transfer",
        //             arguments:[
        //                 {type:"Address",value:"AHDV7M54NHukq8f76QQtBTbrCqKJrBH9UF"},
        //                 {type:"Address",value:"AbU7BUQHW9sa69pTac7pPR3cq4gQHYC1DH"},
        //                 {type:"Integer",value:"100000"}
        //             ],
        //             network:"TestNet",
        //             // assets: 暂时用不到
        //         },
        //         {
        //             scriptHash:"00d00d0ac467a5b7b2ad04052de154bb9fe8c2ff",
        //             operation:"setmoneyin",
        //             arguments:[
        //                 /**
        //                  * 这个地方相当与使用了 Hook_Txid 类型 等同于当前的交易id 代替了 下面这几句
        //                     sb.EmitSysCall("System.ExecutionEngine.GetScriptContainer");
        //                     sb.EmitSysCall("Neo.Transaction.GetHash");
        //                  */
        //                 {type:"Hook_Txid",value:0}, // 
        //                 {type:"Hash160",value:"74f2dc36a68fdc4682034178eb2220729231db76"},
        //             ],
        //             network:"TestNet"
        //         }
        //     ]
        // }
        return new Promise((resolve, reject) => {
            Teemo.NEO.invokeGroup(JSON.parse(params))
                .then(result => {
                console.log(result);
                //console.log("这是交易id"+ result[0].txid);
                document.getElementById("invokeGroup_R").innerText = JSON.stringify(result, null, 2);
                resolve();
            })
                .catch(error => {
                console.log("==============进入了异常流程");
                console.log(error);
                document.getElementById("invokeGroup_R").innerText = JSON.stringify(error, null, 2);
                reject();
            });
        });
    }
    /**
     * getAddressFromScriptHash
     */
    getAddressFromScriptHash(params) {
        return new Promise((resolve, reject) => {
            Teemo.NEO.getAddressFromScriptHash(params)
                .then(result => {
                console.log(result);
                console.log("得到的地址" + result);
                document.getElementById("getAddressFromScriptHash_R").innerText = JSON.stringify(result, null, 2);
                resolve();
            })
                .catch(error => {
                console.log("==============进入了异常流程");
                console.log(error);
                document.getElementById("getAddressFromScriptHash_R").innerText = JSON.stringify(error, null, 2);
                reject();
            });
        });
    }
    getStorage(params) {
        // const params:InvokeArgs = {
        //     scriptHash:"74f2dc36a68fdc4682034178eb2220729231db76",  // 合约地址
        //     operation:"transfer",
        //     arguments:[
        //         {type:"Address",value:"AHDV7M54NHukq8f76QQtBTbrCqKJrBH9UF"},
        //         {type:"Address",value:"AbU7BUQHW9sa69pTac7pPR3cq4gQHYC1DH"},
        //         {type:"Integer",value:"100000"}
        //     ],
        //     fee:'0.001',
        //     network:"TestNet",
        //     // assets: 暂时用不到
        // }
        return new Promise((resolve, reject) => {
            Teemo.NEO.getStorage(JSON.parse(params))
                .then(result => {
                console.log(result);
                console.log("这是交易id" + result);
                document.getElementById("getStorage_R").innerText = JSON.stringify(result, null, 2);
                resolve();
            })
                .catch(error => {
                console.log("==============进入了异常流程");
                console.log(error);
                document.getElementById("getStorage_R").innerText = JSON.stringify(error, null, 2);
                reject();
            });
        });
    }
}
//# sourceMappingURL=index.js.map