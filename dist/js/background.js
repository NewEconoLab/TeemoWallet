var storage;
(function(storage){
var account = null
storage.account=account
})(storage || (storage = {}));

const HASH_CONFIG = {
    accountCGAS:Neo.Uint160.parse('4c7cca112a8c5666bce5da373010fc0920d0e0d2'),
    ID_CGAS: Neo.Uint160.parse('74f2dc36a68fdc4682034178eb2220729231db76'),
    DAPP_NNC: Neo.Uint160.parse("fc732edee1efdf968c23c20a9628eaa5a6ccb934"),
    baseContract : Neo.Uint160.parse("348387116c4a75e420663277d9c02049907128c7"),
    resolverHash: `6e2aea28af9c5febea0774759b1b76398e3167f1`,
    ID_GAS:"602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7",
    ID_NEO:"c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
    saleContract: Neo.Uint160.parse("1b0ca9a908e07b20469917aed8d503049b420eeb"),
    ID_NNC: Neo.Uint160.parse('fc732edee1efdf968c23c20a9628eaa5a6ccb934'),
    ID_NNK: Neo.Uint160.parse('c36aee199dbba6c3f439983657558cfb67629599'),
  }

const baseCommonUrl = "https://api.nel.group/api";
const baseUrl = "https://apiwallet.nel.group/api";

console.log(baseCommonUrl);
console.log(baseUrl);


const makeRpcPostBody = (method, params) => {
const body = {};
body["jsonrpc"] = "2.0";
body["id"] = 1;
body["method"] = method;
body["params"] = params;
return JSON.stringify(body);
}

const makeRpcUrl=(url, method, params)=>
{
if (url[url.length - 1] != '/')
url = url + "/";
var urlout = url + "?jsonrpc=2.0&id=1&method=" + method + "&params="+JSON.stringify(params);
return urlout;
}

var request = (opts) => {
    let url = [baseUrl,storage.network].join('/');
    if (opts.baseUrl === 'common') {
    url = [baseCommonUrl,storage.network].join('/')
    }

    const input = opts.isGET?makeRpcUrl(url,opts.method,opts.params):url;
    const init = opts.isGET ?{ method:'GET'}:{method: 'POST',body:makeRpcPostBody(opts.method,opts.params)};
    return new Promise((resolve,reject)=>{
        fetch(input,init)
        .then(value=>{
            value.json()
            .then(json=>{
                if(json.result){      
                    if(opts.getAll){
                        resolve(json)
                    }
                    else
                    {
                        resolve(json.result)
                    }
                }
                else if(json.error["code"]===-1)
                {
                    resolve(null);
                }else{
                    reject(json.error);
                }
            })
        })
    })
}

const Api = {
    /**
     * 获取nep5的资产（CGAS）
     */
    getnep5balanceofaddress :  (address,assetId) => {
      const opts = {
       method:'getnep5balanceofaddress',
       params:[
         assetId,
         address
       ],
       baseUrl:'common'
      }
      return request(opts);
    },
    /**
     * 获取nep5的资产（CGAS）
     */
    getallnep5assetofaddress :  (address) => {
      const opts = {
       method:'getallnep5assetofaddress',
       params:[
         address,1
       ],
       baseUrl:'common'
      }
      return request(opts);
    },
    /**
     * 获取nep5的资产（CGAS）
     */
    getUtxoBalance :  (address,assetId) => {
      const opts = {
       method:'getnep5balanceofaddress',
       params:[
         assetId,
         address
       ],
       baseUrl:'common'
      }
      return request(opts);
    },
    getregisteraddressbalance :  (address,register) => {
      // alert(DomainSelling.RootNeo.register.toString())
      const opts = {
       method:'getregisteraddressbalance',
       params:[
        address,
        register
       ]
      }
      return request(opts);
    },
    sendrawtransaction :  (data) => {
      const opts = {
       method:'sendrawtransaction',
       params:[
        data
       ],
       baseUrl:'common'
      }
      return request(opts);
    },
    getUtxo:(address)=>{
      const opts={
        method:"getutxo",
        params:[
          address
        ],
        baseUrl:'common'
      }
      return request(opts);
    },
    
    getDomainInfo:(domain)=>{
      const opts={
        method:"getdomaininfo",
        params:[
          domain
        ]
      }
      return request(opts);
    },
    
    /**
     * 判断交易是否入链
     * @param txid 交易id
     */
    hasTx:(txid)=>{
      const opts={
        method:"hastx",
        params:[
          txid
        ]
      }
      return request(opts);
    },
    
    /**
     * 判断合约调用是否抛出 notify
     * @param txid 交易id
     */
    hasContract:(txid)=>{
      const opts={
        method:"hascontract",
        params:[
          txid
        ]
      }
      return request(opts);
    },
    
    /**
     * 判断双交易是否成功
     * @param txid 交易id
     */
    getRehargeAndTransfer:(txid)=>{
      const opts={
        method:"getrechargeandtransfer",
        params:[
          txid
        ]
      }
      return request(opts);
    },
    
    getBlockCount:()=>{
      const opts={
        method:"getblockcount",
        params:[],
        baseUrl:"common"
      }
      return request(opts);
    },
    
    getBalance:(addr)=>{
        const opts={
            method:"getbalance",
            params:[addr],
            baseUrl:"common"
        }
        return request(opts);
    },

    rechargeAndTransfer:(data1,data2)=>{
      const opts={
        method:"rechargeandtransfer",
        params:[
          data1,
          data2
        ]
      }
      return request(opts);
    },
    /**
     * @method 获得nep5资产信息
     * @param asset 资产id
     */
    getnep5asset:(asset)=>{
      const opts={
        method:"getnep5asset",
        params:[
          asset
        ]
      }
      return request(opts);
    }
}
function invokeScriptBuild(data)
{
    let sb = new ThinNeo.ScriptBuilder();
    let arr = data.arguments.map(argument=>{
        let str = ""
        switch (argument.type) {                
            case "String":
                str="(str)"+argument.value    
                break;
            case "Integer":
                str="(int)"+argument.value    
                break;
            case "Hash160":
                str="(hex160)"+argument.value                        
                break;
            case "ByteArray":
                str="(bytes)"+argument.value                        
                break;
            case "Boolean":
                str="(int)"+(argument.value?1:0);                    
                break;
            case "Address":
                str="(addr)"+argument.value   
                break;             
            case "Array":
                // str="(str)"+argument.value 暂时不考虑                
                break;
            default:
                throw new Error("No parameter of this type");
        }
        return str;
    })
    sb.EmitParamJson(arr)
    sb.EmitPushString(data.operation)
    sb.EmitAppCall(Neo.Uint160.parse(data.scriptHash));
    return sb.ToArray();
}

const sendInvokeGroup = (invoke)=>{
    let script = invokeScriptBuild(invoke)
    let tran = new ThinNeo.Transaction();
    tran.version = 0;// 0 or 1
    tran.extdata = null;
    tran.witnesses = [];
    tran.attributes = [];
    tran.inputs = [];
    tran.outputs = [];
    this.type = ThinNeo.TransactionType.InvocationTransaction;
    this.extdata = new ThinNeo.InvokeTransData();
    (this.extdata)['script'] = script;
    this.attributes = [];
    this.attributes[ 0 ] = new ThinNeo.Attribute();
    this.attributes[ 0 ].usage = ThinNeo.TransactionAttributeUsage.Script;
    this.attributes[ 0 ].data = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(common.account.address);
    
    var message  = tran.GetMessage().clone();
    var signdata = ThinNeo.Helper.Sign(message,storage.account.prikeyHex.toHexString());
    tran.AddWitness(signdata,common.account.pubkeyHex.toHexString(),storage.account.address);
    var data = tran.GetRawData();
    var hex = data.toHexString();
    return Api.sendrawtransaction(hex);
}


function openNotify(call) {
    var notify = window.open ('notify.html', 'notify', 'height=602, width=377, top=0, left=0, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no')        
    
    //获得关闭事件
    var loop = setInterval(() => {
           if(notify.closed) {
                call();
                clearInterval(loop);
           }    
        }, 1000
    );
    
}


getAccount=(title,data)=>{
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        
        if(!storage.account){            
            chrome.tabs.sendMessage(tabs[0].id, {
                message: "getAccount_R",
                error:{
                    type : "AccountError",
                    description : "Account not logged in"
                }
            });
            return;
        }      
        chrome.storage.local.set(
            {
                label:"getAccount",                        
                message:{
                    account:storage.account?{address:storage.account.address}:undefined,
                    title:title.refTitle,
                    domain:title.refDomain
                },
            },
            ()=>{
                openNotify(()=>{                            
                    chrome.storage.local.get("confirm",res=>{
                        if(res["confirm"]==="confirm")
                        {
                            if(storage.account){
                                chrome.tabs.sendMessage(tabs[0].id, {
                                    message: "getAccount_R",
                                    data:{
                                        address : storage.account.address,
                                        label : storage.account.walletname
                                    }
                                });  
                            }else{
                                chrome.tabs.sendMessage(tabs[0].id, {
                                    message: "getAccount_R",
                                    error:{
                                        type : "AccountError",
                                        description : "Account not logged in"
                                    }
                                });  
                            }
                        }else if(result["confirm"]==="cancel"){
                            chrome.tabs.sendMessage(tabs[0].id, {
                                message: "getAccount_R",
                                error:{
                                    type : "AccountError",
                                    description : "User cancel Authorization "
                                }
                            });  
                        }
                    })
                });
            }
        );
    })
}

invokeGroup=(title,data)=>{
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.storage.local.set({
            label:"invokeGroup",
            message:{
                account:storage.account?{address:storage.account.address}:undefined,
                title:title.refTitle,
                domain:title.refDomain,
                invoke:request.msg.params
            }
        },()=>{
            openNotify(()=>{                        
                chrome.storage.local.get("confirm",res=>{
                    if(res["confirm"]==="confirm")
                    {
                        sendInvokeGroup(request.msg)
                        .then(result=>{
                            chrome.tabs.sendMessage(tabs[0].id, {
                                message: "invoke_R",
                                data:{
                                    addr : storage.account.address
                                }
                            });  
                        })
                        .catch(error=>{

                        })
                    }else if(result["confirm"]==="cancel"){              
                    }
                })
            })

        });

    })
}

getNetworks=(title,data)=>{
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {      
        chrome.tabs.sendMessage(tabs[0].id, {
            message: "getNetworks_R",
            data:{
                networks : "mainnet"|"testnet",
                defaultNetwork : storage.network?storage.network:"testnet"
            }
        });  
    })
}

getBalance=(title,data)=>{
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {        
       (data instanceof Array)
       {
            for (const obj of data) {
                var address = obj["address"];
                var asset = obj['asset']?obj['asset']:[HASH_CONFIG.ID_GAS,HASH_CONFIG.ID_NEO,HASH_CONFIG.ID_NNC.toHexString(),HASH_CONFIG.ID_NNK.toHexString()];
                var nep5asset = [];
                var utxoasset = [];
                for (const id of asset) {
                    if(id.length==40){
                        nep5asset.push(id);
                    }else{
                        utxoasset.push(id);
                    }
                }
                var proms = [];
                if(nep5asset.length){
                    proms.push(Api.getallnep5assetofaddress(address));
                }
                if(utxoasset.length){
                    proms.push(Api.getBalance(address));
                }

                Promise.all(proms)
                .then(result=>{
                    for (let index = 0; index < result.length; index++) {
                        const element = result[index];
                        // element[]
                    }
                })
           }
       }
    })
}

send=()=>{
}

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.key === "getAccount") {
            getAccount(request.title,request.msg);
        }
        if (request.key === 'invoke')
        {

        }
        if (request.key === 'getNetworks')
        {
        }
        if (request.key === 'getBalance')
        {
        }
        if (request.key === 'getStorage')
        {
        }
        if (request.key === 'getProvider')
        {
        }
        if (request.key === 'send')
        {
        }
    }
);