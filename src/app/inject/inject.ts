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
    invokeReadGroup = 'invokeReadGroup',
    send = 'send',
    invoke = 'invoke',
    invokeGroup = "invokeGroup",
    deployContract = "deployContract",
    sendScript = "sendScript",
    event = 'event',
    disconnect = 'disconnect',
    getAddressFromScriptHash = 'getAddressFromScriptHash',
    getBlock = 'getBlock',
    getTransaction = 'getTransaction',
    getApplicationLog = 'getApplicationLog',
    TOOLS_validateAddress = 'TOOLS.validateAddress',
    TOOLS_getAddressFromScriptHash = 'TOOLS.getAddressFromScriptHash',
    TOOLS_getStringFromHexstr = 'TOOLS.getStringFromHexstr',
    TOOLS_getBigIntegerFromHexstr = 'TOOLS.getBigIntegerFromHexstr',
    TOOLS_reverseHexstr = 'TOOLS.reverseHexstr',
    TOOLS_getBigIntegerFromAssetAmount = 'TOOLS.getBigIntegerFromAssetAmount',
    TOOLS_getDecimalsFromAssetAmount = 'TOOLS.getDecimalsFromAssetAmount',
    NNS_getNamehashFromDomain = 'NNS.getNamehashFromDomain',
    NNS_getAddressFromDomain = 'NNS.getAddressFromDomain',
    NNS_getDomainFromAddress = 'NNS.getDomainFromAddress'
}

enum EventName {
    READY = "Teemo.NEO.READY",
    CONNECTED = "Teemo.NEO.CONNECTED",
    DISCONNECTED = "Teemo.NEO.DISCONNECTED",
    NETWORK_CHANGED = "Teemo.NEO.NETWORK_CHANGED",
    ACCOUNT_CHANGED = "Teemo.NEO.ACCOUNT_CHANGED",
    BLOCK_HEIGHT_CHANGED = "Teemo.NEO.BLOCK_HEIGHT_CHANGED",
    TRANSACTION_CONFIRMED = "Teemo.NEO.TRANSACTION_CONFIRMED"
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
interface InvokeArgs {
    scriptHash: string;
    operation: string;
    fee?: string;
    sys_fee?: string;
    network: "TestNet" | "MainNet";
    arguments: Array<Argument>;
    attachedAssets?: AttachedAssets;
    description?: string;
    assetIntentOverrides?: AssetIntentOverrides;
    triggerContractVerification?: boolean;
}

interface InvokeReadInput {
    scriptHash: string;
    operation: string;
    arguments?: Argument[];
    network: string;
}

interface InvokeReadGroup {
    group: InvokeReadInput[];
}

interface AttachedAssets {
    [ asset: string ]: string;
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

interface Argument {
    type: "String" | "Boolean" | "Hash160" | "Hash256" | "Integer" | "ByteArray" | "Array" | "Address" | "Hook_Txid";
    value: string | number | boolean | Array<Argument>
}

interface Asset {
    NEO: string;
    GAS: string;
}

interface InvokeGroup {
    merge: boolean;
    group: InvokeArgs[];
}
interface InvokeGroupOutup {

}

/**
 * @param {number} blockHeight 区块高度
 * @param {string} network 网络
 */
interface GetBlockArgs {
    blockHeight: number | string;  // 区块高度
    network: string // 网络
}

interface GetTransactionArgs {
    txid: string;
    network: string;
}

interface GetApplicationLogArgs {
    txid: string;
    network: string;
}

interface BalanceRequest {
    address: string; // Address to check balance(s)
    assets?: string[]; // Asset symbol or script hash to check balance
    fetchUTXO?: boolean;
}

interface GetBalanceArgs {
    params: BalanceRequest | BalanceRequest[];
    network: string;
}
interface BalanceResults {
    [ address: string ]: Balance[];
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

interface GetPublickeyOutput {
    address: string,
    publickey: string
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

interface SendScriptArgs {
    script: string;
    fee?: string;
    sysfee?: string;
    description?: string;
    network?: "TestNet" | "MainNet";
}

interface Provider {
    name: string;
    version: string;
    compatibility: string[];
    website: string;
    extra?: {
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

interface GetBigIntegerFromAssetAmountArgs {
    amount: string;
    assetID: string;
    network: 'MainNet' | 'TestNet';
}

interface GetDecimalsFromAssetAmountArgs {
    amount: string;
    assetID: string;
    network: 'MainNet' | 'TestNet';
}

interface DomainArgs {
    domain: string;
    network: 'MainNet' | 'TestNet'
}

interface AddressArgs {
    address: string;
    network: 'MainNet' | 'TestNet'
}

interface DeployContractArgs {
    contractHash: string     // 合约hash
    description: string;     // 备注信息
    email: string;           // 邮件
    author: string;          // 作者
    version: string,        // 版本
    name: string;           // 名称
    avmhex: string;         // avm hex字符串
    call: boolean;           // 是否动态调用
    storage: boolean;        // 是否存储区
    payment: boolean;        // 是否支持付费
    fee?: string;
    network?: 'MainNet' | 'TestNet'
}

const ids = [];
/**
 * 
 * @param array 随机数
 */
const getMessageID = () => {
    // 随机6位数
    var Atanisi = Math.floor(Math.random() * 999999);
    // 随机6位数
    //时间
    var myDate = new Date();
    var messageid = myDate.getTime() + "" + Atanisi;
    // console.log("id "+messageid+" 是否存在与数组："+ (ids.join(',').includes(messageid.toString())));
    // ids.push(messageid);
    return messageid;
}

/**
 * 发送请求
 * @param command 指令名称
 * @param data  
 */
function sendMessage<K>(command: Command, params?: any): Promise<K> {
    const ID = getMessageID();

    return new Promise((resolve, reject) => {
        const request = params ? { command, params, ID } : { command, ID };
        window.postMessage(request, "*");
        window.addEventListener("message", e => {
            const response = e.data;
            if (response.return == command && response.ID == ID)   // 判断return参数是否有值 并且 判断返回名称是否对应如果是则抛出异常或数据
            {
                if (response.error) {
                    reject(response.error);
                } else {
                    resolve(response.data)
                }
            }
        })
    })
}

namespace Teemo {
    export class NEO {
        static getProvider = () => {
            return sendMessage<Provider>(Command.getProvider);
        }

        /**
         * 获得当前网络信息
         * @returns {GetNetworksOutput} 网络信息
         */
        static getNetworks(): Promise<GetNetworksOutput> {
            return sendMessage<GetNetworksOutput>(Command.getNetworks);
        }

        /**
         * 获得当前账户信息
         * @returns {AccountOutput} 账户信息
         */
        static getAccount(): Promise<AccountOutput> {
            return sendMessage<AccountOutput>(Command.getAccount);
        }

        /**
         * 查询余额
         * @param {GetBalanceArgs} params 查询余额参数 
         */
        static getBalance(params: GetBalanceArgs): Promise<BalanceResults> {
            return sendMessage<BalanceResults>(Command.getBalance, params);
        }

        /**
         * 查询存储区数据
         * @param {GetStorageArgs} params 查询存储区参数
         */
        static getStorage(params: GetStorageArgs): Promise<GetStorageOutput> {
            return sendMessage<GetStorageOutput>(Command.getStorage, params);
        }

        static getPublicKey(): Promise<GetPublickeyOutput> {
            return sendMessage<GetPublickeyOutput>(Command.getPublicKey);
        }

        /**
         * 转账方法
         * @param {SendArgs} params 转账参数
         */
        static send(params: SendArgs): Promise<SendOutput> {
            return sendMessage<SendOutput>(Command.send, params);
        }

        /**
         * 转账并调用合约
         * @param params 
         */
        static sendScript(params: SendScriptArgs): Promise<SendOutput> {
            return sendMessage<SendOutput>(Command.sendScript, params);
        }

        /**
         * invoke交易发送
         * @param {InvokeArgs} params invoke 参数
         * @returns {InvokeOutput} invoke执行结果返回
         */
        static invoke(params: InvokeArgs): Promise<InvokeOutput> {
            return sendMessage<InvokeOutput>(Command.invoke, params);
        }

        static invokeGroup(params: InvokeGroup): Promise<InvokeOutput[]> {
            return sendMessage<InvokeOutput[]>(Command.invokeGroup, params);
        }

        static invokeRead(params: InvokeReadInput): Promise<any> {
            return sendMessage(Command.invokeRead, params);
        }

        static invokeReadGroup(params: InvokeReadGroup): Promise<any> {
            return sendMessage(Command.invokeReadGroup, params);
        }

        /**
         * 发布合约
         * @param params 
         */
        static deployContract(params: DeployContractArgs): Promise<InvokeOutput> {
            return sendMessage(Command.deployContract, params)
        }

        /**
         * 查询区块信息
         * @param params 
         */
        static getBlock(params: GetBlockArgs) {
            if (typeof params.blockHeight == 'string')
                params.blockHeight = parseInt(params.blockHeight)
            return sendMessage<any>(Command.getBlock, params)
        }

        /**
         * 查询交易信息
         * @param params 
         */
        static getTransaction(params: GetTransactionArgs) {
            return sendMessage<any>(Command.getTransaction, params)
        }

        /**
         * 查询log
         * @param params 
         */
        static getApplicationLog(params: GetApplicationLogArgs) {
            return sendMessage<any>(Command.getApplicationLog, params)
        }

        static TOOLS = {
            /**
             * 验证地址
             * @param address 要验证的地址
             */
            validateAddress: (address: string) => {
                return sendMessage<boolean>(Command.TOOLS_validateAddress, address)
            },
            /**
             * scriptHash转地址
             * @param scriptHash 要转换成地址的ScriptHash
             */
            getAddressFromScriptHash: (scriptHash: string) => {
                return sendMessage<string>(Command.TOOLS_getAddressFromScriptHash, scriptHash)
            },
            /**
             * HexStr转String
             * @param hex hex字符串
             */
            getStringFromHexstr: (hex: string) => {
                return sendMessage<string>(Command.TOOLS_getStringFromHexstr, hex)
            },
            /**
             * HexStr 转 BigInteger
             * @param hex hex字符串
             */
            getBigIntegerFromHexstr: (hex: string) => {
                return sendMessage<string>(Command.TOOLS_getBigIntegerFromHexstr, hex)
            },
            /**
             * Hex 反转
             * @param hex hex字符串
             */
            reverseHexstr: (hex: string) => {
                return sendMessage<string>(Command.TOOLS_reverseHexstr, hex)
            },
            getBigIntegerFromAssetAmount: (params: GetBigIntegerFromAssetAmountArgs) => {
                return sendMessage<string>(Command.TOOLS_getBigIntegerFromAssetAmount, params)
            },
            getDecimalsStrFromAssetAmount: (params: GetDecimalsFromAssetAmountArgs) => {
                return sendMessage<string>(Command.TOOLS_getDecimalsFromAssetAmount, params)
            },
        }

        static NNS = {
            getNamehashFromDomain: (params: string) => {
                return sendMessage<string>(Command.NNS_getNamehashFromDomain, params)
            },
            getAddressFromDomain: (params: DomainArgs) => {
                return sendMessage<{ address: string, TTL: string }>(Command.NNS_getAddressFromDomain, params)
            },
            getDomainFromAddress: (params: AddressArgs) => {
                return sendMessage<{ namehash: string; fullDomainName: string; TTL: string; }>(Command.NNS_getDomainFromAddress, params)
            }
        }
    }
}

const EventChange = () => {
    window.addEventListener("message", e => {
        const response = e.data;
        if (response.EventName)   // 判断return参数是否有值 并且 判断返回名称是否对应如果是则抛出异常或数据
        {
            window.dispatchEvent(new CustomEvent(
                response.EventName,
                { "detail": response.data }
            ))
        }
    })
}

const provider: Provider = {
    "name": "TeemoWallet",
    "version": "0.1",
    "website": "nel.group",
    "compatibility": [ "typescript", "javascript" ],
    "extra": {
        "theme": "",
        "currency": ""
    }
}
if (window.dispatchEvent) {
    window.dispatchEvent(
        new CustomEvent(EventName.READY, {
            detail: provider,
        })
    );
}

EventChange();

// document.onload=()=>{
    // chrome.tabs.query({currentWindow:true},tabs=>{

    // })
// }