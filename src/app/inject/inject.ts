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
    attachedAssets?:AttachedAssets;
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


interface InvokeReadInput {
    scriptHash: string;
    operation: string;
    args?: Argument[];
    network: string;
}

const ids = [];
/**
 * 
 * @param array 随机数
 */
const getMessageID=()=>{
    // 随机6位数
    var Atanisi = Math.floor(Math.random() * 999999);
    // 随机6位数
    //时间
    var myDate = new Date();
    var messageid = myDate.getTime()+""+Atanisi; 
    // console.log("id "+messageid+" 是否存在与数组："+ (ids.join(',').includes(messageid.toString())));
    // ids.push(messageid);
    return messageid;
}

/**
 * 发送请求
 * @param command 指令名称
 * @param data  
 */
function sendMessage<K>(command:Command,params?:any):Promise<K>{
    const ID = getMessageID();
    
    return new Promise((resolve,reject)=>
    {
        const request = params?{command,params,ID}:{command,ID};
        window.postMessage(request,"*");
        window.addEventListener("message",e=>
        {
            const response = e.data;            
            if(response.return==command && response.ID==ID)   // 判断return参数是否有值 并且 判断返回名称是否对应如果是则抛出异常或数据
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

        static invokeGroup(params:InvokeGroup):Promise<InvokeOutput[]>{
            return sendMessage<InvokeOutput[]>(Command.invokeGroup,params);
        }

        static invokeRead(params: InvokeReadInput): Promise<any>{
            return sendMessage(Command.invokeRead,params);
        }
    }
}

var readyEvent = new CustomEvent('Teemmo.NEO.READY',{
    detail:{title:'This is Teemmo'},
});

if (window.dispatchEvent) {
    window.dispatchEvent(readyEvent);
}