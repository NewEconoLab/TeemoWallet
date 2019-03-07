///<reference path="./inject.d.ts"/>

window.addEventListener('Teemmo.NEO.READY',()=>{
    console.log("inject ready ");
    var myDate = new Date();
    var eventPool = document.getElementById("event") as HTMLTextAreaElement
    eventPool.value = myDate.toLocaleTimeString() + "ready";
    const main = new Main();
    main.start();
    
})

class Main {
    getAccount_R:HTMLDivElement;
    address:string;
    name:string;
    constructor() {
        this.getAccount_R = document.getElementById("getAccount_R")as HTMLDivElement;
    }

    async start(){
        document.getElementById("getNetworks_do").onclick = async () =>{
            await this.getNetworks();
        }   

        document.getElementById("getAccount_do").onclick = async () =>{
            await this.getAccount();
        }        

        document.getElementById("getBalance_do").onclick = async () =>{ 
            var getBalance_input = document.getElementById("getBalance_input") as HTMLTextAreaElement;
            await this.getBalance(getBalance_input.value)
        }

        document.getElementById("invokeRead_do").onclick = async () =>{ 
            var invokeRead_input = document.getElementById("invokeRead_input") as HTMLTextAreaElement;
            await this.invokeRead(invokeRead_input.value)
        }
        // await this.testrun();
        // await this.testRunGroup();
        // await this.invokeGroup()
        // await this.invokeGroup2();
    }

    /**
     * 获得网络配置
     */
    public getNetworks()
    {
        return new Promise((resolve,reject)=>{            
            Teemmo.NEO.getNetworks()
            .then(result=>{
                console.log(result);
                document.getElementById("getNetworks_R").textContent=JSON.stringify(result, null, 2);
                resolve();
            })
            .catch(error=>{
                console.log(error);
                reject();
            })
        })
    }

    /**
     * 获得账户信息
     */
    public getAccount()
    {
        return new Promise((resolve,reject)=>{            
            Teemmo.NEO.getAccount()
            .then(result=>{
                console.log(result);
                this.getAccount_R.textContent=JSON.stringify(result, null, 2);
                this.address=result.address;    // 当前登陆的地址
                this.name=result.label;         // 当前钱包的名字
                resolve();
            })
            .catch(error=>{
                console.log(error);
                reject();
            })
        })
    }

    /**
     * 获得余额信息
     */
    public getBalance(params:string)
    {
        // const params:BalanceRequest={
        //     address:this.address,   // 你要查询的地址
        //     assets:["602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7"], // 不填则默认查四个资产 NEO　GAS　NNC NNK 可能之后要改一下
        //     // fetchUTXO 可以不填的
        // }
        // 获得余额的参数
        const data:GetBalanceArgs={
            network:"TestNet",
            params:JSON.parse(params) as BalanceRequest
        }
        return new Promise((resolve,reject)=>{            
            Teemmo.NEO.getBalance(data) // 获得余额的方法
            .then(result=>{
                console.log(result);
                document.getElementById("getBalance_R").innerText = JSON.stringify(result, null, 2);
                resolve();
            })
            .catch(error=>{
                console.log(error);
                reject();
            })
        })
    }

    /**
     * 试运行合约（单操作）
     */
    public invokeRead(params:string)
    {
        return new Promise((resolve,reject)=>{        
            let json = JSON.parse(params);
            console.log(json);
                
            Teemmo.NEO.invokeRead(JSON.parse(params) as InvokeReadInput)
            .then(result=>{
                console.log(result);
                document.getElementById("invokeRead_R").innerText = JSON.stringify(result, null, 2);
                resolve();
            })
            .catch(error=>{
                console.log(error);
                reject();
            })
        })
    }

    public invokeGroup()
    {
        console.log("this is InvokeGroup");
        
        const params:InvokeGroup = {
            merge:true,
            group:[
                {
                    scriptHash:"74f2dc36a68fdc4682034178eb2220729231db76",  // 合约地址
                    operation:"transfer",
                    arguments:[
                        {type:"Address",value:"AHDV7M54NHukq8f76QQtBTbrCqKJrBH9UF"},
                        {type:"Address",value:"AbU7BUQHW9sa69pTac7pPR3cq4gQHYC1DH"},
                        {type:"Integer",value:"100000"}
                    ],
                    network:"TestNet",
                    // assets: 暂时用不到
                },
                {
                    scriptHash:"00d00d0ac467a5b7b2ad04052de154bb9fe8c2ff",
                    operation:"setmoneyin",
                    arguments:[
                        /**
                         * 这个地方相当与使用了 Hook_Txid 类型 等同于当前的交易id 代替了 下面这几句
                            sb.EmitSysCall("System.ExecutionEngine.GetScriptContainer");
                            sb.EmitSysCall("Neo.Transaction.GetHash");
                         */
                        {type:"Hook_Txid",value:0}, // 
                        {type:"Hash160",value:"74f2dc36a68fdc4682034178eb2220729231db76"},
                    ],
                    network:"TestNet"
                }
            ]
        }
        return new Promise((resolve,reject)=>{            
            Teemmo.NEO.invokeGroup(params)
            .then(result=>{
                console.log(result);
                console.log("这是交易id"+ result[0].txid);
                
                resolve();
            })
            .catch(error=>{
                console.log("==============进入了异常流程");
                
                console.log(error);
                reject();
            })
        })
    }


    
    public invokeGroup2()
    {
        console.log("this is InvokeGroup");
        
        const params:InvokeGroup = {
            merge:false,
            group:[
                {
                    scriptHash:"74f2dc36a68fdc4682034178eb2220729231db76",  // 合约地址
                    operation:"transfer",
                    arguments:[
                        {type:"Address",value:"AHDV7M54NHukq8f76QQtBTbrCqKJrBH9UF"},
                        {type:"Address",value:"AbU7BUQHW9sa69pTac7pPR3cq4gQHYC1DH"},
                        {type:"Integer",value:"1000"}
                    ],
                    network:"TestNet",
                    // assets: 暂时用不到
                },
                {
                    scriptHash:"00d00d0ac467a5b7b2ad04052de154bb9fe8c2ff",
                    operation:"setmoneyin",
                    arguments:[
                        /**
                         * 这个地方相当与使用了 Hook_Txid 类型 等同于当前的交易id 代替了 下面这几句
                            sb.EmitSysCall("System.ExecutionEngine.GetScriptContainer");
                            sb.EmitSysCall("Neo.Transaction.GetHash");
                         */
                        {type:"Hook_Txid",value:0}, // 
                        {type:"Hash160",value:"74f2dc36a68fdc4682034178eb2220729231db76"},
                    ],
                    network:"TestNet"
                }
            ]
        }
        return new Promise((resolve,reject)=>{            
            Teemmo.NEO.invokeGroup(params)
            .then(result=>{
                console.log(result);
                console.log("这是交易id"+ result[0].txid);
                
                resolve();
            })
            .catch(error=>{
                console.log("==============进入了异常流程");
                
                console.log(error);
                reject();
            })
        })
    }
    /**
     * invoke 发送交易
     */
    public invoke()
    {
        const params:InvokeArgs = {
            scriptHash:"74f2dc36a68fdc4682034178eb2220729231db76",  // 合约地址
            operation:"transfer",
            arguments:[
                {type:"Address",value:"AHDV7M54NHukq8f76QQtBTbrCqKJrBH9UF"},
                {type:"Address",value:"AbU7BUQHW9sa69pTac7pPR3cq4gQHYC1DH"},
                {type:"Integer",value:"100000"}
            ],
            fee:'0.001',
            network:"TestNet",
            // assets: 暂时用不到
        }
        return new Promise((resolve,reject)=>{            
            Teemmo.NEO.invoke(params)
            .then(result=>{
                console.log(result);
                console.log("这是交易id"+ result.txid);
                
                resolve();
            })
            .catch(error=>{
                console.log("==============进入了异常流程");
                
                console.log(error);
                reject();
            })
        })
    }
    
    public testrun()
    {
        const params:InvokeArgs = {
            scriptHash: 'fc732edee1efdf968c23c20a9628eaa5a6ccb934',
            operation: 'symbol',
            arguments: [],
            network: 'TestNet'
          }
        return new Promise((resolve,reject)=>{            
            Teemmo.NEO.invokeRead(params)
            .then(result=>{
                console.log(result);
                resolve();
            })
            .catch(error=>{
                console.log("==============进入了异常流程");
                
                console.log(error);
                reject();
            })
        })
    }

    public testRunGroup()
    {
        const params:InvokeReadGroup={
            group:[
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
                  arguments:[],
                  network: 'TestNet'
                },
                {
                  scriptHash: 'fc732edee1efdf968c23c20a9628eaa5a6ccb934',
                  operation: 'decimals',
                  arguments: [],
                  network: 'TestNet'
                }        
            ]
        }
        return new Promise((resolve,reject)=>{            
            Teemmo.NEO.invokeReadGroup(params)
            .then(result=>{
                console.log(result);
                resolve();
            })
            .catch(error=>{
                console.log("==============进入了异常流程");
                
                console.log(error);
                reject();
            })
        })
    }
}