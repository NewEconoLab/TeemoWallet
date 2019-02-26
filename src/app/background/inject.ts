const BLOCKCHAIN = 'NEO';
const VERSION = 'v1';

enum ArgumentDataType {
  STRING = 'String',
  BOOLEAN = 'Boolean',
  HASH160 = 'Hash160',
  HASH256 = 'Hash256',
  INTEGER = 'Integer',
  BYTEARRAY = 'ByteArray',
  ARRAY = 'Array',
  ADDRESS = 'Address',
}

enum Command {
  isReady = 'isReady',
  getProvider = 'getProvider',
  getNetworks = 'getNetworks',
  getAccount = 'getAccount',
  getPublicKey = 'getPublicKey',
  getBalance = 'getBalance',
  getStorage = 'getStorage',
  invokeRead = 'invokeRead',
  send = 'send',
  invoke = 'invoke',
  event = 'event',
  disconnect = 'disconnect',
}

enum EventName {
  READY = 'READY',
  ACCOUNT_CHANGED = 'ACCOUNT_CHANGED',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  NETWORK_CHANGED = 'NETWORK_CHANGED',
}

interface GetStorageArgs {
    scriptHash: string;
    key: string;
    network: string;
}

interface GetStorageOutput {
    result: string;
}
  

interface InvokeArgs{
    scriptHash:string;
    operation:string;
    fee:string;
    network:"TestNet"|"MainNet";
    arguments:Array<Argument>;
    attachedAssets?:Array<AttachedAssets>;
    assetIntentOverrides?: AssetIntentOverrides;
    triggerContractVerification?: boolean;
}

interface AttachedAssets {
    [asset: string]: string;
}
interface AssetIntentOverrides {
    inputs: AssetInput[];
    outputs: AssetOutput[];
}
interface AssetInput {
    txid: string;
    index: number;
}

interface AssetOutput {
    asset: string;
    address: number;
    value: string;
}
interface InvokeOutput {
    txid: string;
    nodeUrl: string;
}

interface Argument{
    type:"String"|"Boolean"|"Hash160"|"Integer"|"ByteArray"|"Array"|"Address"|"Hook_Txid";
    value:string|number|boolean|Array<Argument>
}

interface Asset{
    NEO:string;
    GAS:string;
}

interface InvokeGroup{
    merge:boolean;
    group:InvokeArgs[];
}

interface BalanceRequest {
    address: string; // Address to check balance(s)
    assets?: string[]; // Asset symbol or script hash to check balance
    fetchUTXO?: boolean;
}
  
interface GetBalanceArgs {
    params: BalanceRequest|BalanceRequest[];
    network: string;
}
interface BalanceResults {
    [address: string]: Balance[];
}
interface Balance {
    assetID: string;
    symbol: string;
    amount: string;
}

interface GetNetworksOutput {
    networks: string[];
    defaultNetwork: string;
}


interface AccountOutput {
    address: string;
    label: string;
}

interface SendArgs {
    fromAddress: string;
    toAddress: string;
    asset: string;
    amount: string;
    remark?: string;
    fee?: string;
    network: string;
}
  
interface SendOutput {
    txid: string;
    nodeUrl: string;
}

namespace Teemmo
{    
    export class NEO {        
        static getProvider=()=>{
            return new Promise((resolve, reject) =>{
                window.postMessage({
                    key:"getProvider",
                    msg:{}
                },"*");            
                window.addEventListener("message", function(e)
                {
                    var request = e.data;
                    if(request.key === "getProvider_R")
                    {
                        resolve(request.msg);
                    }
                }, false);
            });
        }

        static getNetworks():Promise<GetNetworksOutput>{
            return new Promise((resolve, reject) =>{
                window.postMessage({
                    key:"getNetworks",
                    msg:{}
                },"*");            
                window.addEventListener("message", function(e)
                {
                    var request = e.data;
                    if(request.key === "getProvider_R")
                    {
                        resolve(request.msg);
                    }
                }, false);
            });
        }

        static getAccount():Promise<AccountOutput>{
            return new Promise((resolve, reject) =>{
            
                window.addEventListener("message", function(e)
                {
                    var request = e.data;
                    if(request.key === "getAccount_R")
                    {
                        resolve(request.msg);
                    }
                }, false);
                
                window.postMessage({
                    key:"getAccount",
                    msg:{}
                },"*")
            });
        }

        static getBalance(data:GetBalanceArgs):Promise<BalanceResults>{
            return new Promise((resolve, reject) =>{
                window.postMessage({
                    key:Command.getBalance,
                    msg:data
                },"*");            
                window.addEventListener("message", function(e)
                {
                    var request = e.data;
                    if(request.key === "getBalance_R")
                    {
                        resolve(request.msg);
                    }
                }, false);
            });
        }

        static getStorage(params:GetStorageArgs):Promise<GetStorageOutput>{
            return new Promise((resolve, reject) =>{
                window.postMessage({
                    key:"getStorage",
                    msg:{}
                },"*");            
                window.addEventListener("message", function(e)
                {
                    var request = e.data;
                    if(request.key === "getProvider_R")
                    {
                        resolve(request.msg);
                    }
                }, false);
            });
        }
        
        static send(params:SendArgs):Promise<SendOutput>{
            return new Promise((resolve, reject) =>{
                window.postMessage({
                    key:"send",
                    msg:params
                },"*");            
                window.addEventListener("message", function(e)
                {
                    var request = e.data;
                    if(request.key === "getProvider_R")
                    {
                        resolve(request.msg);
                    }
                }, false);
            });
        }
        
        static invoke(params:InvokeArgs): Promise<InvokeOutput>{
            return new Promise((resolve, reject) =>{
                
                window.addEventListener("message", function(e)
                {
                    var request = e.data;
                    if( request.key === "invoke_R")
                    {   
                        if(request.msg.txid){                  
                            resolve(request.msg);
                        }else{
                            reject(request.msg)
                        }

                    }
                }, false);
                
                window.postMessage({
                    key:"invoke",
                    msg:{
                        invokeParam: params
                    }
                },"*")
            
            });
        }
    }
}