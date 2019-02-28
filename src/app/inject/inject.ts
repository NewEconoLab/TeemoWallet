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
    HOOKTXID = 'Hook_Txid',
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
  invokeGroup="invokeGroup",
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
  
/**
 * invoke 请求参数
 * @param {scriptHash} 合约hash
 * @param {operation} 调用合约的方法名
 * @param {stgring} 网络费
 * 
 */
interface InvokeArgs{
    scriptHash:string;
    operation:string;
    fee?:string;
    network:"TestNet"|"MainNet";
    arguments:Array<Argument>;
    attachedAssets?:AttachedAssets[];
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
    type:"String"|"Boolean"|"Hash160"|"Hash256"|"Integer"|"ByteArray"|"Array"|"Address"|"Hook_Txid";
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
interface InvokeGroupOutup{

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


interface Provider {
    name: string;
    version: string;
    compatibility: string[];
    website: string;
    extra: {
        theme: string,
        currency: string,
    };
}

/**
 * 
 * @param array 随机数
 */
const getWeakRandomValues=(array: number | Uint8Array)=>{    
    let buffer = typeof array === "number" ? new Uint8Array(array) : array;
    for (let i = 0; i < buffer.length; i++)
        buffer[i] = Math.random() * 256;
    return buffer;
}

/**
 * 发送请求
 * @param command 指令名称
 * @param data  
 */
function sendMessage<K>(command:Command,params?:any):Promise<K>{
    // 获得随机数来控制消息发送
    // const RANDOM_UINT8:Uint8Array = getWeakRandomValues(12);
    // let time = new Date();
    // time.getTime();
    return new Promise((resolve,reject)=>
    {
        const request = params?{command,params}:{command};
        window.postMessage(request,"*");
        window.addEventListener("message",e=>
        {
            const response = e.data;
            console.log(response);
            
            if(response.return==command)   // 判断return参数是否有值 并且 判断返回名称是否对应如果是则抛出异常或数据
            {                
                if (response.error) 
                {
                    reject(response.error);
                }else
                {
                    resolve(response.data)
                }
            }
        })
    })
}

namespace Teemmo
{
    export class NEO {        
        static getProvider=()=>{
            return sendMessage<Provider>(Command.getProvider);
        }

        /**
         * 获得当前网络信息
         * @returns {GetNetworksOutput} 网络信息
         */
        static getNetworks():Promise<GetNetworksOutput>{
            return sendMessage<GetNetworksOutput>(Command.getNetworks);
        }

        /**
         * 获得当前账户信息
         * @returns {AccountOutput} 账户信息
         */
        static getAccount():Promise<AccountOutput>{
            return sendMessage<AccountOutput>(Command.getAccount);
        }

        /**
         * 查询余额
         * @param {GetBalanceArgs} params 查询余额参数 
         */
        static getBalance(params:GetBalanceArgs):Promise<BalanceResults>{
            return sendMessage<BalanceResults>(Command.getBalance,params);
        }

        /**
         * 查询存储区数据
         * @param {GetStorageArgs} params 查询存储区参数
         */
        static getStorage(params:GetStorageArgs):Promise<GetStorageOutput>{
            return sendMessage<GetStorageOutput>(Command.getStorage,params);
        }
        
        /**
         * 转账方法
         * @param {SendArgs} params 转账参数
         */
        static send(params:SendArgs):Promise<SendOutput>{
            return sendMessage<SendOutput>(Command.send,params);
        }
        
        /**
         * invoke交易发送
         * @param {InvokeArgs} params invoke 参数
         * @returns {InvokeOutput} invoke执行结果返回
         */
        static invoke(params:InvokeArgs): Promise<InvokeOutput>{
            return sendMessage<InvokeOutput>(Command.invoke,params);
        }

        static invokeGroup(params:InvokeGroup):Promise<InvokeArgs[]>{
            return sendMessage<InvokeArgs[]>(Command.invoke,params);
        }
    }
}