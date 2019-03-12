///<reference path="../../lib/neo-thinsdk.d.ts"/>

interface BackStore
{
    // [name:string]:any
    network:"TestNet"|"MainNet",
    height:number,
    account:AccountInfo,
    domains:string[],
    titles:string[],
}


var storage:BackStore=
{
    network:"TestNet",
    account:undefined,
    height:0,
    domains:[],
    titles:[]
}

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
const testRpcUrl = "http://47.99.223.87:20332";

/**
 * -------------------------以下是账户所使用到的实体类
 */

class NepAccount{
    index?:number;
    walletName:string;
    address: string;
    nep2key:string;
    scrypt:ThinNeo.nep6ScryptParameters;
    constructor(name:string,addr:string,nep2:string,scrypt:ThinNeo.nep6ScryptParameters,index?:number){
        this.walletName=name;
        this.address=addr;
        this.nep2key=nep2;
        this.scrypt=scrypt
        if(index!==undefined)
            this.index=index;
    }
}

class AccountInfo extends NepAccount{
    constructor(nepaccount:NepAccount,prikey:Uint8Array,pubkey:Uint8Array){
        super(nepaccount.walletName,nepaccount.address,nepaccount.nep2key,nepaccount.scrypt,nepaccount.index);
        this.prikeyHex = prikey.toHexString();
        this.pubkeyHex = pubkey.toHexString();
    }
    private _prikey:Uint8Array;
    private _pubkey:Uint8Array;
    public pubkeyHex:string;
    public prikeyHex:string;
    public address: string; 

    public getPrikey():Uint8Array{
        return this.prikeyHex.hexToBytes();
    };

    public set pubkey(v:Uint8Array){
        this._pubkey=v;
        this.pubkeyHex = v.toHexString();
    }

    public set prikey(v:Uint8Array){
        this._prikey=v;
        this.prikeyHex = v.toHexString();
    }

    public get pubkey(): Uint8Array{
        this._pubkey=this.pubkeyHex.hexToBytes();
        return this._pubkey;
    }

    public get prikey(): Uint8Array{
        this._prikey=this.prikeyHex.hexToBytes();
        return this._prikey
    }    
    
}

interface LoginInfo
{
    pubkey: Uint8Array;
    prikey: Uint8Array;
    address: string;
}

class MarkUtxo
{
    public txid:string;
    public n:number;
    constructor(txid:string,n:number)
    {
        this.txid = txid;
        this.n = n;
    }

    /**
     * 塞入标记
     * @param utxos 标记
     */
    public static setMark(utxos:MarkUtxo[])
    {
        const session = Storage_internal.get<{[txid:string]:number[]}>("utxo_manager");
        for (let index = 0; index < utxos.length; index++) 
        {
            const utxo = utxos[index];
            if(session[utxo.txid])
            {
                session[utxo.txid].push(utxo.n);
            }
            else
            {
                session[utxo.txid] = new Array<number>();
                session[utxo.txid].push(utxo.n);
            }
        }
        Storage_internal.set("utxo_manager",session);

    }

    public static async getAllUtxo():Promise<{ [id: string]: Utxo[] }>
    {
        try 
        {
            const utxos:any[] = await Api.getUtxo(common.account.address);   // 获得为使用的utxo
            if(!utxos)
            {
                return undefined;
            }
            const marks = Storage_internal.get<{ [id: string]: number[] }>("utxo_manager");   // 获得被标记的utxo
            const assets:{ [id: string]: Utxo[] } = {};        
            // 对utxo进行归类，并且将count由string转换成 Neo.Fixed8
            // tslint:disable-next-line:forin        
            for (const item of utxos) {           
                const mark = marks?marks[item["txid"]]:undefined;                
                if(!mark || !mark.join(",").includes(item.n))   // 排除已经标记的utxo返回给调用放
                {
                    const asset = (item.asset as string).replace('0x','');
                    if (assets[ asset ] === undefined || assets[ asset ] == null)
                    {
                        assets[ asset ] = [];
                    }
                    const utxo = new Utxo();
                    utxo.addr = item.addr;
                    utxo.asset = asset;
                    utxo.n = item.n;
                    utxo.txid = item.txid;
                    utxo.count = Neo.Fixed8.parse(item.value);
                    assets[ asset ].push(utxo);
                }
            }            
            return assets;
        } 
        catch (error) 
        {
            if(error["code"]==="-1")
            {
                return {};
            }else
            {
                throw error; 
            }            
        }
    }

    public static async getUtxoByAsset(assetId:string):Promise<Array<Utxo>>
    {
        try {
            const all = await this.getAllUtxo();      
            if(!all)
                return undefined;
            return all[assetId];
        } catch (error) {
            
        }
    }
}

interface ICoinStore{
    assets:{ [ id: string ]: Utxo[] };
    initUtxos: ()=>Promise<boolean>;
}

class Utxo{
    public addr: string;
    public txid: string;
    public n: number;
    public asset: string;
    public count: Neo.Fixed8;
}

const Storage_local = 
{
    setAccount:(account:AccountInfo)=>{
        let arr = Storage_local.getAccount();
        
        let index: number= 0;
        let newacc=new NepAccount(
            account.walletName,
            account.address,
            account.nep2key,
            account.scrypt)
        
        if(arr.length){            
            arr = arr.map((acc,n)=>{
                if(acc.address===account.address)
                {
                    acc.walletName = newacc.walletName?newacc.walletName:acc.walletName;
                    newacc.index = index = n;
                    return newacc;
                }
                return acc;
            });
            if(index<0){
                arr.push(newacc);
            }
        }else{
            arr.push(newacc);
        }
        
        localStorage.setItem("TEEMMOWALLET_ACCOUNT",JSON.stringify(arr));
        return index;
    },
    getAccount:()=>{
        const str = localStorage.getItem("TEEMMOWALLET_ACCOUNT");
        let accounts = [] as NepAccount[];
        if(str) 
        {
            let arr = accounts.concat(JSON.parse(str));
            for (let index = 0; index < arr.length; index++) {
                const acc = arr[index];
                let nep = new NepAccount(acc.walletName,acc.address,acc.nep2key,acc.scrypt,index);
                accounts.push(nep);                
            }
        }
        return accounts;
    }
}
/**
 * 主要用于background的内存数据的存储和读取
 */
class Storage_internal
{
    public static set=(key:string,value:any)=>{
        storage[key]=value;
    };
    public static get<T>(key:string,):T
    {
        return storage[key];
    }
}
class Transaction extends ThinNeo.Transaction
{    

    public marks:MarkUtxo[]=[];

    constructor(type?:ThinNeo.TransactionType)
    {
        super();
        this.type = type ? type : ThinNeo.TransactionType.ContractTransaction;
        this.version = 0;// 0 or 1
        this.extdata = null;
        this.witnesses = [];
        this.attributes = [];
        this.inputs = [];
        this.outputs = [];
    }

    /**
     * setScript 往交易中塞入脚本 修改交易类型为 InvokeTransaction
     */
    public setScript(script: Uint8Array) 
    {
        this.type = ThinNeo.TransactionType.InvocationTransaction;
        this.extdata = new ThinNeo.InvokeTransData();
        (this.extdata as ThinNeo.InvokeTransData).script = script;
        this.attributes = new Array<ThinNeo.Attribute>(1);
        this.attributes[ 0 ] = new ThinNeo.Attribute();
        this.attributes[ 0 ].usage = ThinNeo.TransactionAttributeUsage.Script;
        this.attributes[ 0 ].data = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(common.account.address);
    }

    /**
     * 创建一个交易中的输入和输出 将使用过的utxo 放入 marks
     * @param utxos 资产的utxo 
     * @param sendcount 输出总数
     * @param target 对方地址
     */
    public creatInuptAndOutup(utxos: Utxo[], sendcount: Neo.Fixed8, target?: string)
    {
        let count = Neo.Fixed8.Zero;
        let scraddr = "";
        const assetId: Uint8Array = utxos[0].asset.hexToBytes().reverse();
        // 循环utxo 塞入 input
        for (const utxo of utxos) 
        {
            const input = new ThinNeo.TransactionInput();
            input.hash = utxo.txid.hexToBytes().reverse();
            input.index = utxo.n;
            input.addr = utxo.addr;
            count = count.add(utxo.count);
            scraddr = utxo.addr;
            this.inputs.push(input);
            this.marks.push(new MarkUtxo(utxo.txid,utxo.n));
            if(count.compareTo(sendcount)>0)    // 塞入足够的input的时候跳出循环
            {
                break;
            }
        }
        if(count.compareTo(sendcount)>=0)   // 比较utxo是否足够转账
        {
            if(target)
            {   // 如果有转账地址则塞入转账的金额
                if(sendcount.compareTo(Neo.Fixed8.Zero)>0)
                {
                    const output = new ThinNeo.TransactionOutput();
                    output.assetId = assetId;
                    output.value = sendcount;
                    output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(target);
                    this.outputs.push(output); 
                }
            }
            const change = count.subtract(sendcount); // 应该找零的值
            if (change.compareTo(Neo.Fixed8.Zero) > 0)
            {   // 塞入找零
                const outputchange = new ThinNeo.TransactionOutput();
                outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                outputchange.value = change;
                outputchange.assetId = assetId
                this.outputs.push(outputchange);
            }
        }
        else
        {
            throw new Error("You don't have enough utxo;");            
        }
    }

    public getTxid()
    {
        return this.GetHash().clone().reverse().toHexString();
    }

    
}

/**
 * 我的账户管理
 */
class Common
{
    constructor(){
        this.tabname="account"
    }   
    private tabname:string;

    private _network:string;

    // 账户信息
    private _account:AccountInfo;
    
    private _accountList:NepAccount[];
    
    
    public set network(v : string) {
        Storage_internal.set("network",v);
        this._network = v;
    }    
    
    public get network() : string {
        return this._network = Storage_internal.get("network");
    }
    

    public set accountList(v : NepAccount[]) {
        this.accountList = v;
    }
    
    public get accountList(){
        if(this._accountList && this._accountList.length)
        {
            return this._accountList;
        }
        else
        {
            return Storage_local.getAccount();
        }
    }
    
    // set 方法往background的storage变量赋值
    public set account(v : AccountInfo) {
        this._account = v;
        Storage_internal.set(this.tabname,v);
    }
    
    // 从background storage 变量中取值
    public get account() : AccountInfo {
        const acc =Storage_internal.get<AccountInfo>(this.tabname);

        const newacc = new AccountInfo(
            new NepAccount(acc.walletName,acc.address,acc.nep2key,acc.scrypt,acc.index),
            acc.prikey,acc.pubkey
        );
        
        return newacc;
    }

}
const common = new Common();


const makeRpcPostBody = (method, params) => {
    const body = {};
    body["jsonrpc"] = "2.0";
    body["id"] = 1;
    body["method"] = method;
    body["params"] = params;
    return JSON.stringify(body);
}

interface IOpts {
    method:string, // 接口名
    params: any[], // 参数
    isGET?:boolean, // 是否是get 请求（默认请求是post）
    baseUrl?:'common'|'rpc', // 如果是common 则 取 baseCommonUrl（默认 baseUrl）
    getAll?:boolean, // 是否获取所有返回结果
}

const makeRpcUrl=(url, method, params)=>
{
if (url[url.length - 1] != '/')
url = url + "/";
var urlout = url + "?jsonrpc=2.0&id=1&method=" + method + "&params="+JSON.stringify(params);
return urlout;
}

/**
 * api 请求方法
 * @param opts 请求参数
 */
async function request(opts: IOpts) {
    let url = [baseUrl,common.network].join('/');
    if (opts.baseUrl === 'common') {
        url = [baseCommonUrl,common.network].join('/');
    }else if(opts.baseUrl==='rpc'){
        url = testRpcUrl;
    }
    console.log(url);
  
    const input = opts.isGET?makeRpcUrl(url,opts.method,opts.params):url;
    const init:RequestInit = opts.isGET ?{ method:'GET'}:{method: 'POST',body:makeRpcPostBody(opts.method,opts.params)};
    try {    
        const value = await fetch(input,init);
        const json = await value.json();
        if(json.result)
        {
            if(opts.getAll)
            {
                return json
            }
            else
            {   
                return json.result;
            }
        }
        else if(json.error["code"]===-1)
        {
            return null;
        }
        else
        {
            throw new Error(json.error);    
        }
    } 
    catch (error) 
    {
        throw error;    
    }
}

var Api = {
    getcontractstate:(scriptaddr: string)=>{
        return request({
            method:"getcontractstate",
            params:[scriptaddr]
        })
    },

    getavailableutxos:(address: string, count: number)=>{
        return request({
            method:"getavailableutxos",
            params:[address,count],            
        })
    },

    getInvokeRead:(scriptHash:string)=>{
        const opts:IOpts = {
            method:'invokescript',
            params:[scriptHash],
            baseUrl:'rpc'
        }
        return request(opts)
    },

    /**
     * 获取nep5的资产（CGAS）
     */
    getnep5balanceofaddress : (address,assetId) => {
        const opts:IOpts = {
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
        const opts:IOpts = {
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
        const opts:IOpts = {
        method:'getnep5balanceofaddress',
        params:[
            assetId,
            address
        ],
        baseUrl:'common'
        }
        return request(opts);
    },
    getregisteraddressbalance : (address,register) => {
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
    sendrawtransaction : (data) => {
        const opts:IOpts = {
        method:'sendrawtransaction',
        params:[data],
        baseUrl:'common'
        }
        return request(opts);
    },
    getUtxo:(address)=>{
        const opts:IOpts={
            method:"getutxo",
            params:[address],
            baseUrl:'common'
        }
        return request(opts);
    },
    
    getDomainInfo:(domain)=>{
        return request({
            method:"getdomaininfo",
            params:[domain],
            baseUrl:'rpc'
        });
    },
    
    /**
     * 判断交易是否入链
     * @param txid 交易id
     */
    hasTx:(txid)=>{
        const opts={
            method:"hastx",
            params:[txid]
        }
        return request(opts);
    },

    getrawtransaction:(txid)=>{
        const opts:IOpts={            
            method:"getrawtransaction",
            params:[txid,1],
            baseUrl:'rpc'
        }
        return request(opts);
    },
    /**
     * 
     */
    getrawtransaction_api:(txid)=>{
        return request(
            {
                method:"getrawtransaction",
                params:[txid],
                baseUrl:'common'
            }
        )
    },
    
    /**
     * 判断合约调用是否抛出 notify
     * @param txid 交易id
     */
    hasContract:(txid)=>{
        const opts={
            method:"hascontract",
            params:[txid]
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
            params:[txid]
        }
        return request(opts);
    },
    
    getBlockCount:()=>{
        const opts:IOpts={
            method:"getblockcount",
            params:[],
            baseUrl:"common"
        }
        return request(opts);
    },
    
    getBalance:(addr)=>{
        const opts:IOpts={
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
            params:[asset]
        }
        return request(opts);
    }
}

function invokeScriptBuild(data:InvokeArgs)
{
    let sb = new ThinNeo.ScriptBuilder();
    let arr = data.arguments.map(argument=>{
        let str = ""
        switch (argument.type) {                
            case ArgumentDataType.STRING:
                str="(str)"+argument.value    
                break;
            case ArgumentDataType.INTEGER:
                str="(int)"+argument.value    
                break;
            case ArgumentDataType.HASH160:
                str="(hex160)"+argument.value                        
                break;
            case ArgumentDataType.HASH256:
                str="(hex256)"+argument.value                        
                break;
            case ArgumentDataType.BYTEARRAY:
                str="(bytes)"+argument.value                        
                break;
            case ArgumentDataType.BOOLEAN:
                str="(int)"+(argument.value?1:0);                    
                break;
            case ArgumentDataType.ADDRESS:
                str="(addr)"+argument.value   
                break;             
            case ArgumentDataType.ARRAY:
                // str="(str)"+argument.value 暂时不考虑
                break;
            default:
                throw new Error("No parameter of this type");
        }
        return str;
    })        
    // 生成随机数
    const RANDOM_UINT8:Uint8Array = getWeakRandomValues(32);
    const RANDOM_INT:Neo.BigInteger = Neo.BigInteger.fromUint8Array(RANDOM_UINT8);
    console.log(RANDOM_INT.toString());
    // 塞入随机数
    sb.EmitPushNumber(RANDOM_INT);
    sb.Emit(ThinNeo.OpCode.DROP);
    sb.EmitParamJson(arr)
    sb.EmitPushString(data.operation)
    sb.EmitAppCall(Neo.Uint160.parse(data.scriptHash));
    return sb.ToArray();
}

const getWeakRandomValues=(array: number | Uint8Array)=>{    
    let buffer = typeof array === "number" ? new Uint8Array(array) : array;
    for (let i = 0; i < buffer.length; i++)
        buffer[i] = Math.random() * 256;
    return buffer;
}

class ScriptBuild extends ThinNeo.ScriptBuilder
{
    constructor() {
        super();
    }

    /**
     * 
     * @param argument 
     */
    EmitArguments(argument: Argument[],hookTxid?:string): ThinNeo.ScriptBuilder {
        for (let i = argument.length-1; i >=0; i--) {
            const param = argument[i];        
            if (param.type === ArgumentDataType.ARRAY) {
                var list = param.value as Argument[];
                for (let i = list.length - 1; i >= 0; i--) {
                    this.EmitParamJson(list[i]);
                }
            }
            switch (param.type) {                
                case ArgumentDataType.STRING:
                    this.EmitPushString(param.value as string );
                    break;
                case ArgumentDataType.INTEGER:
                    var num = new Neo.BigInteger(param.value as string);
                    this.EmitPushNumber(num);
                    break;
                case ArgumentDataType.HASH160:
                    var hex = (param.value as string).hexToBytes();
                    if (hex.length != 20)
                        throw new Error("not a hex160");
                    this.EmitPushBytes(hex.reverse());
                    break;                    
                case ArgumentDataType.HASH256:
                    var hex = (param.value as string).hexToBytes();
                    if (hex.length != 32)
                        throw new Error("not a hex256");
                    this.EmitPushBytes(hex.reverse());
                    break;
                case ArgumentDataType.BYTEARRAY:
                    var hex = (param.value as string).hexToBytes();
                    this.EmitPushBytes(hex);                 
                    break;
                case ArgumentDataType.BOOLEAN:
                    var num = new Neo.BigInteger(param.value?1:0);
                    this.EmitPushNumber(num);             
                    break;
                case ArgumentDataType.ADDRESS:
                    var hex = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(param.value as string);
                    this.EmitPushBytes(hex);
                    break;         
                case ArgumentDataType.HOOKTXID:
                    if(hookTxid){
                        var hex = hookTxid.hexToBytes();
                        this.EmitPushBytes(hex.reverse());
                    }else{
                        this.EmitSysCall("System.ExecutionEngine.GetScriptContainer");
                        this.EmitSysCall("Neo.Transaction.GetHash");
                    }
                    break;
                case ArgumentDataType.ARRAY:
                    this.EmitArguments(param.value as Argument[]);
                    break;
                default:
                    throw new Error("No parameter of this type");
            }
        }
        this.EmitPushNumber(new Neo.BigInteger(argument.length));
        this.Emit(ThinNeo.OpCode.PACK);
        return this;
    }

    EmitInvokeArgs(...invokes:InvokeArgs[]){            
        const RANDOM_UINT8:Uint8Array = getWeakRandomValues(32);
        const RANDOM_INT:Neo.BigInteger = Neo.BigInteger.fromUint8Array(RANDOM_UINT8);
        // 塞入随机数
        this.EmitPushNumber(RANDOM_INT);  // 将随机数推入栈顶
        this.Emit(ThinNeo.OpCode.DROP);   // 打包
        for (let index = 0; index < invokes.length; index++) {
            const invoke = invokes[index];
            this.EmitArguments(invoke.arguments);    // 调用EmitArguments方法编译并打包参数
            this.EmitPushString(invoke.operation) // 塞入方法名
            this.EmitAppCall(Neo.Uint160.parse(invoke.scriptHash));   // 塞入合约地址
        }
        return this.ToArray();
    }
}

/**
 * 编译 invoke参数列表
 * @param {InvokeArgs[]} group InvokeGroup参数
 */
function groupScriptBuild(group:InvokeArgs[])
{    
    // invoke 组合 调用
    let sb = new ScriptBuild();
    // 生成随机数
    const RANDOM_UINT8:Uint8Array = getWeakRandomValues(32);
    const RANDOM_INT:Neo.BigInteger = Neo.BigInteger.fromUint8Array(RANDOM_UINT8);
    // 塞入随机数
    sb.EmitPushNumber(RANDOM_INT);  // 将随机数推入栈顶
    sb.Emit(ThinNeo.OpCode.DROP);   // 打包
    /**
     * 循环塞入script参数
     */
    for (let index = 0; index < group.length; index++) {
        const invoke = group[index];
        sb.EmitArguments(invoke.arguments);    // 调用EmitArguments方法编译并打包参数
        sb.EmitPushString(invoke.operation) // 塞入方法名
        sb.EmitAppCall(Neo.Uint160.parse(invoke.scriptHash));   // 塞入合约地址
    }
    return sb.ToArray();
}

/**
 * 打包合并交易
 * @param data 合并合约调用参数
 */
const invokeGroupBuild = async(data:InvokeGroup)=>
{
    // 判断merge的值
    if (data.merge) 
    {
        let tran = new Transaction();
        let script = groupScriptBuild(data.group);
        tran.setScript(script);
        let netfee:Neo.Fixed8 = Neo.Fixed8.Zero;
        let transfer:{[toaddr:string]:AttachedAssets}={} // 用来存放 将要转账的合约地址 资产id 数额
        let utxos = await MarkUtxo.getAllUtxo();
        let assets:{[asset:string]:string};
        for (let index = 0; index < data.group.length; index++) // 循环算utxo资产对应的累加和相对应每笔要转走的money
        {
            const invoke = data.group[index];
            if(invoke.fee)  // 判断是否有手续费
                netfee.add(Neo.Fixed8.parse(invoke.fee)) // 计算总共耗费多少手续费;
            if(invoke.attachedAssets)  // 判断是否有合约转账
            {
                const toaddr = ThinNeo.Helper.GetAddressFromScriptHash(Neo.Uint160.parse(invoke.scriptHash));         // 将scripthash 转地址    
                for (const id in invoke.attachedAssets) {
                    if (invoke.attachedAssets.hasOwnProperty(id)) {
                        const number = invoke.attachedAssets[id];
                        if(id===HASH_CONFIG.ID_GAS)
                        {
                            
                        }
                        else
                        {

                        }
                    }
                }
                transfer[toaddr] = invoke.attachedAssets;
            }
        }
        try {
            let result = await sendTransaction(tran);
            TaskManager.addTask(
                new Task(
                ConfirmType.tranfer,
                result.txid.replace('0x',''))
            )
            return [result];
        } catch (error) {
            throw error
        }
    } 
    else 
    {
        let txids:InvokeOutput[] = []
        let trans:TransferGroup[] = [];
        for (let index = 0; index < data.group.length; index++)
        {
            const invoke = data.group[index];
            console.log(invoke);
            
            if(index==0)
            {
                try {
                    let result = await contractBuilder(invoke);
                    console.log(result);
                    
                    txids.push(result);
                } catch (error) {
                    console.log(error);
                    
                    throw error;
                }
            }
            else
            {
                let tran = new Transaction();
                let script = new ScriptBuild();
                // 生成随机数
                const RANDOM_UINT8:Uint8Array = getWeakRandomValues(32);
                const RANDOM_INT:Neo.BigInteger = Neo.BigInteger.fromUint8Array(RANDOM_UINT8);
                // 塞入随机数
                script.EmitPushNumber(RANDOM_INT);  // 将随机数推入栈顶
                script.Emit(ThinNeo.OpCode.DROP);   // 打包
                script.EmitArguments(invoke.arguments,txids[0].txid);
                script.EmitPushString(invoke.operation);
                script.EmitAppCall(Neo.Uint160.parse(invoke.scriptHash));
                tran.setScript(script.ToArray());
                const message  = tran.GetMessage().clone();
                const signdata = ThinNeo.Helper.Sign(message,common.account.prikey);
                tran.AddWitness(signdata,common.account.pubkey,common.account.address);
                const data:Uint8Array = tran.GetRawData();
                const nextTran = new TransferGroup()
                nextTran.txhex=data.toHexString();
                nextTran.txid=tran.getTxid();
                txids.push({txid:nextTran.txid,nodeUrl:"https://api.nel.group/api"})
                trans.push(nextTran);
            }
        }
        const task = new Task(ConfirmType.tranfer,txids[0].txid.replace('0x',''),trans[0],TaskState.watting);
        TaskManager.addTask(task);
        for (let index = 0; index < trans.length; index++) {
            const tran = trans[index];
            if(index<(trans.length-1)){
                TaskManager.addTask(new Task(
                    ConfirmType.tranfer,tran.txid,trans[index+1],TaskState.watForLast
                ))
            }else{
                TaskManager.addTask(new Task(
                    ConfirmType.tranfer,tran.txid,undefined,TaskState.watForLast
                ))
            }
        }
        return txids;
    }
}

const sendGroupTranstion=(trans:Transaction[])=>{
    return new Promise<InvokeOutput[]>((resolve,reject)=>{
        let outputs:InvokeOutput[]=[];
        for (let index = 0; index < trans.length; index++) {
            const tran = trans[index];            
            const message  = tran.GetMessage().clone();
            const signdata = ThinNeo.Helper.Sign(message,common.account.prikey);
            tran.AddWitness(signdata,common.account.pubkey,common.account.address);
            // const data:Uint8Array = tran.GetRawData();
            console.log(tran.getTxid());
            outputs.push({"txid": tran.getTxid(),nodeUrl:"https://api.nel.group/api"});
        }
    })
}

var makeRefundTransaction = async (transcount:number,netfee:number)=>
{
    //获取sgas合约地址的资产列表
    let utxos_current = await MarkUtxo.getAllUtxo();
    let utxos_cgas = await Api.getavailableutxos(storage.account.address, transcount);
    var nepAddress = ThinNeo.Helper.GetAddressFromScriptHash(HASH_CONFIG.ID_CGAS);
    let gass: Utxo[] = utxos_current[HASH_CONFIG.ID_GAS];
    var cgass: Utxo[] = []
    for (var i in utxos_cgas)
    {
        var item = utxos_cgas[i];
        let utxo = new Utxo();
        utxo.addr = nepAddress;
        utxo.asset = HASH_CONFIG.ID_GAS;
        utxo.n = item.n;
        utxo.txid = item.txid;
        utxo.count = Neo.Fixed8.parse(item.value);
        cgass.push(utxo);
    }
    var tran = new Transaction();

    //sgas 自己给自己转账   用来生成一个utxo  合约会把这个utxo标记给发起的地址使用
    try
    {
        tran.creatInuptAndOutup(cgass, Neo.Fixed8.fromNumber(transcount), nepAddress);
        if (netfee>0)
        {
            tran.creatInuptAndOutup(gass, Neo.Fixed8.fromNumber(netfee));
        }
        for (const i in tran.inputs)
        {
            tran.inputs[i].hash = tran.inputs[i].hash.reverse();
        }
    }
    catch (e)
    {
        throw "";
    }

    var r = await Api.getcontractstate(HASH_CONFIG.ID_CGAS.toString())
    if (r && r['script'])
    {
        var sgasScript = r['script'].hexToBytes();

        var scriptHash = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(storage.account.address);
        var script = new ScriptBuild();
        const refund:InvokeArgs = {
            scriptHash:HASH_CONFIG.ID_CGAS.toString(),
            operation:'refund',
            arguments:[{type:"ByteArray",value:scriptHash.toHexString()}],
            network:storage.network
        }
        script.EmitInvokeArgs(refund);
        tran.setScript(script.ToArray())

        //构建一个script
        let sb = new ScriptBuild();
        sb.EmitArguments([{type:"String",value:"whatever"},{type:'Integer',value:250}])
        tran.AddWitnessScript(sgasScript, sb.ToArray());
        let result = sendTransaction(tran);
        return result;
    }
    else
    {
        throw "Contract acquisition failure";
    }


}
/**
 * 
 * @param utxo 兑换gas的utxo
 * @param transcount 兑换的数量
 */
var makeRefundTransaction_tranGas = async (utxo:Utxo, transcount:Neo.Fixed8,netfee:number)=>
{
    var tran: Transaction = new Transaction();
    //合约类型
    tran.inputs = [];
    tran.outputs = [];
    tran.type = ThinNeo.TransactionType.ContractTransaction;
    tran.version = 0;
    tran.extdata = null;
    tran.attributes = []

    try
    {
        let sendcount = transcount;
        if (netfee)
        {
            let fee = Neo.Fixed8.fromNumber(netfee);                //网络费用
            sendcount = transcount.subtract(fee);    //由于转账使用的utxo和需要转换的金额一样大所以输入只需要塞入减去交易费的金额，utxo也足够使用交易费
        }
        tran.creatInuptAndOutup([utxo], sendcount, storage.account.address);   //创建交易
        tran.outputs.length = 1;  //去掉找零的部分，只保留一个转账位
        for (const n in tran.inputs)
        {
            tran.inputs[n].hash = tran.inputs[n].hash.reverse();
        }
    }
    catch (error)
    {
        console.log(error);
    }
    //sign and broadcast
    //做智能合约的签名
    var r = await Api.getcontractstate(HASH_CONFIG.ID_CGAS.toString())

    if (r && r['script'])
    {
        var sgasScript = r['script'].hexToBytes();
        var sb = new ThinNeo.ScriptBuilder();
        sb.EmitPushNumber(new Neo.BigInteger(0));
        sb.EmitPushNumber(new Neo.BigInteger(0));
        tran.AddWitnessScript(sgasScript, sb.ToArray());
        var trandata = tran.GetRawData();

        return trandata;
    }
    else
    {
        // this.makeRefundTransaction_error("获取转换合约失败！")
    }

}

const sendTransaction = async (tran:Transaction)=>
{
    try {
        const message  = tran.GetMessage().clone();
        const signdata = ThinNeo.Helper.Sign(message,common.account.prikey);
        tran.AddWitness(signdata,common.account.pubkey,common.account.address);
        const data:Uint8Array = tran.GetRawData();
        console.log(data.toHexString());
        
        const result =await Api.sendrawtransaction(data.toHexString());
        if(result[0].txid)
        {
            const txid:string = (result[0].txid as string).replace('0x','');
            const nodeUrl:string="https://api.nel.group/api";
            let ouput:InvokeOutput ={txid,nodeUrl}
            return ouput;            
        }
        else
        {
            throw {type:"TransactionError",description:result[0].errorMessage,data:""};            
        }
        
    } catch (error) {
        console.log(error);            
    }
}

var contractBuilder = async (invoke:InvokeArgs)=>{
    let tran = new Transaction();    
    try {
        // const script=invokeScriptBuild(invoke);
        const script = new ScriptBuild();
        // 生成随机数
        const RANDOM_UINT8:Uint8Array = getWeakRandomValues(32);
        const RANDOM_INT:Neo.BigInteger = Neo.BigInteger.fromUint8Array(RANDOM_UINT8);
        // 塞入随机数
        script.EmitPushNumber(RANDOM_INT);  // 将随机数推入栈顶
        script.Emit(ThinNeo.OpCode.DROP);   // 打包
        script.EmitArguments(invoke.arguments);        // 参数转换与打包
        script.EmitPushString(invoke.operation);    // 塞入需要调用的合约方法名
        script.EmitAppCall(Neo.Uint160.parse(invoke.scriptHash));   // 塞入需要调用的合约hex
        tran.setScript(script.ToArray());
    } catch (error) {
        throw error;    
    }
    if(!!invoke.fee && invoke.fee!=='' && invoke.fee!='0'){        
        try 
        {
            const utxos = await MarkUtxo.getUtxoByAsset(HASH_CONFIG.ID_GAS);
            if(utxos)
                tran.creatInuptAndOutup(utxos,Neo.Fixed8.parse(invoke.fee));
        } 
        catch (error) 
        {
            throw error
        }
    }
    try 
    {
        const message  = tran.GetMessage().clone();
        const signdata = ThinNeo.Helper.Sign(message,common.account.prikey);
        tran.AddWitness(signdata,common.account.pubkey,common.account.address);
        const data:Uint8Array = tran.GetRawData();
        const result =await Api.sendrawtransaction(data.toHexString());
        if(result[0].txid)
        {
            console.log(data.toHexString());
            
            let ouput:InvokeOutput =
            {
                txid:result[0].txid,
                nodeUrl:"https://api.nel.group/api"
            }
            return ouput;            
        }
        else
        {
            throw {type:"TransactionError",description:result[0].errorMessage,data:data.toHexString()};            
        }
        
    } 
    catch (error) 
    {
        throw error;                  
    }
}

interface NotifyMessage{
    header?:{
        title:string,
        domain:string,
        icon?:string
    },
    account?:{
        address:string,
        walletName:string,
    },
    lable:Command
    data?:any
}
/**
 * 打开notify页面并传递信息，返回调用
 * @param call 回调方法
 * @param data 通知信息 
 */
const openNotify=(notifyData:NotifyMessage,call)=> {
    if(notifyData)
    {
        chrome.storage.local.set({notifyData},()=>
        {
            var notify = window.open ('notify.html', 'notify', 'height=636px, width=391px, top=0, left=0, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no')        
            
            //获得关闭事件
            var loop = setInterval(() => {
                   if(notify.closed) {
                        call();
                        clearInterval(loop);
                   }    
                }, 1000
            );
        })
    }
    else
    {        
        var notify = window.open ('notify.html', 'notify', 'height=636px, width=391px, top=0, left=0, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no')        
        //获得关闭事件
        var loop = setInterval(() => {
               if(notify.closed) {
                    call();
                    clearInterval(loop);
               }    
            }, 1000
        );
    }    
}

/**
 * 请求账户信息
 */
const getAccount=(title)=>{    
    return new Promise((resolve,reject)=>{
        // const {address,walletName} = storage.account;
        const data:NotifyMessage = {
            lable:Command.getAccount,
            header:title,
            // account:{address,walletName}
        }
        console.log("---------进入了 getAccount 方法");
        
        if(storage.account){
            chrome.storage.local.set({trust:title})
            resolve({
                address : storage.account.address,
                label : storage.account.walletName
            })
        }else{
            reject({
                type : "AccountError",
                description : "Account not logged in"
            });
        }
    })
}

/**
 * invokeGroup 合约调用
 * @param title 请求的网页信息
 * @param data 传递的数据
 */
const invokeGroup=(title,params)=>{
    return new Promise((resolve,reject)=>{
        const data:NotifyMessage = {
            lable:Command.invokeGroup,
            data:params
        }
        
        openNotify(data,()=>{              
            chrome.storage.local.get("confirm",res=>{
                if(res["confirm"]==="confirm")
                {
                    invokeGroupBuild(params)
                    .then(result=>{
                        resolve(result);
                    })
                    .catch(error=>{        
                        reject(error);
                    })
                }else if(res["confirm"]==="cancel"){       
                    reject({
                        type : "TransactionError",
                        description : "User cancel Authorization "
                    });     
                }
            })
        })
    })
}

/**
 * invoke 合约调用
 * @param title dapp请求方的信息
 * @param data 请求的参数
 */
const invoke=(title,params)=>{
    return new Promise((resolve,reject)=>{
        const data:NotifyMessage = {
            lable:Command.invokeGroup,
            data:params
        }
        openNotify(data,()=>{
            chrome.storage.local.get("confirm",res=>{
                if(res["confirm"]==="confirm")
                {
                    contractBuilder(params)
                    .then(result=>{
                        resolve(result);
                    })
                    .catch(error=>{
                        reject(error);
                    })
                }else if(res["confirm"]==="cancel"){       
                    reject({
                        type : "TransactionError",
                        description : "User cancel Authorization "
                    });
                }
            })
        })
    })
}

/**
 * 获得网络状态信息
 */
const getNetworks=():Promise<GetNetworksOutput>=>{
    return new Promise((resolve,reject)=>{
        const network:GetNetworksOutput={
            networks : ["mainnet","testnet"],
            defaultNetwork : storage.network?storage.network:"testnet"
        }
        resolve(network);
    })
}

/**
 * 余额获取
 * @param data 请求的参数
 */
var getBalance = async (data:GetBalanceArgs)=>{
    if (!Array.isArray(data.params)) {
      data.params = [data.params];
    }
    data.params.forEach(({address, assets, fetchUTXO}, index) => {
      if (assets && !Array.isArray(assets)) {
        data.params[index] = {
          address,
          assets: [assets],
          fetchUTXO,
        };
      }
    });
    let balances:BalanceResults = {};
    
    if (!Array.isArray(data.params)) {
        data.params = [data.params];
    }
    for (const arg of data.params) {
        
        var asset = arg.assets?arg.assets:[HASH_CONFIG.ID_GAS,HASH_CONFIG.ID_NEO,HASH_CONFIG.ID_NNC.toString(),HASH_CONFIG.ID_NNK.toString()];
        var nep5asset:string[] = [];
        var utxoasset:string[] = [];
        const assetArray:Balance[]=[];
        for (const id of asset) {
            if(id.length==40){
                nep5asset.push(id);
            }else{
                utxoasset.push(id);
            }
        }
        if(nep5asset.length){
            try {
                let res = await Api.getallnep5assetofaddress(arg.address);
                let assets={};
                for (const iterator of res) 
                {
                    const {assetid,symbol,balance} = iterator as {assetid:string,symbol:string,balance:string};
                    const assetID=assetid.replace("0x","")
                    assets[assetID]={assetID,symbol,amount:balance}
                }
                for (const id of nep5asset) {
                    if(assets[id]){
                        assetArray.push(assets[id]);
                    }
                }
            } catch (error) {
                throw {type:"NETWORK_ERROR",description:"余额查询失败",data:error};                
            }
        }
        if(utxoasset.length){
            let res = await Api.getBalance(arg.address);
            let assets = {};
            for (const iterator of res) {
                const {asset,balance,name} = iterator as {asset:string,balance:number,name:{lang:string,name:string}[]};
                
                let symbol: string = "";
                const assetID = asset.replace('0x','');
                if (assetID == HASH_CONFIG.ID_GAS)
                {
                    symbol = "GAS";
                }
                else if (assetID == HASH_CONFIG.ID_NEO)
                {
                    symbol = "NEO";
                }
                else
                {
                    for (var i in name)
                    {
                        symbol = name[i].name;
                        if (name[i].lang == "en")
                            break;
                    }
                }
                assets[assetID]={assetID,symbol,amount:balance};
            }
            for (const id of utxoasset) {
                if(assets[id]){
                    assetArray.push(assets[id]);
                }
            }
        }
        balances[arg.address]=assetArray;
    }
    return balances;
}

var transfer= async(data:SendArgs):Promise<SendOutput>=>{
    if(data.asset.hexToBytes().length==20)
    {
        let amount;
        try {
            
            const result = await invokeRead(
                {
                    "scriptHash": "fc732edee1efdf968c23c20a9628eaa5a6ccb934",
                    "operation": "decimals",
                    "arguments": [],
                    "network": "TestNet"
                }
            );
            if(result['state']=='HALT, BREAK')
            {
                let stack = result['stack']
                let dicelams = stack[0]['value'];
                amount = parseFloat(data.amount).toFixed(dicelams).replace('.','')
            }
            else
            {
                throw {type:'ASSET_ERROR',description:"This asset information undefined"}
            }

        } catch (error) {
            throw error;
        }
        // 此资产是 nep5资产
        const outupt = await contractBuilder(
            {
                "scriptHash":data.asset,
                "operation":"transfer",
                "arguments":[
                    {"type":"Address","value":data.fromAddress},
                    {"type":"Address","value":data.toAddress},
                    {"type":"Integer","value":amount}
                ],
                "fee":data.fee,
                "network":data.network
            }
        )
        return outupt;
    }
    else if(data.asset.hexToBytes().length==32)
    {
        try 
        {
            let tran = new Transaction();
            const utxos = await MarkUtxo.getAllUtxo();
            if(data.fee){
                const fee = Neo.Fixed8.parse(data.fee);
                const gass = utxos[data.asset];
                if(data.asset==HASH_CONFIG.ID_GAS)
                {
                    const sum =fee.add(Neo.Fixed8.parse(data.amount));
                    tran.creatInuptAndOutup(gass,sum,data.toAddress);
                    tran.outputs[0].value=tran.outputs[0].value.subtract(fee);
                }
                else
                {
                    const asset = utxos[data.asset];
                    tran.creatInuptAndOutup(asset,Neo.Fixed8.parse(data.amount),data.toAddress);
                    tran.creatInuptAndOutup(gass,fee);
                }
                return sendTransaction(tran);
            }else{                
                const asset = utxos[data.asset];
                const amount = Neo.Fixed8.parse(data.amount);
                tran.creatInuptAndOutup(asset,amount);
                return sendTransaction(tran);
            }
        } 
        catch (error) 
        {
            throw error
        }
    }
}

var send = (title,params:SendArgs) =>
{
    return new Promise<SendOutput>((resolve,reject)=>
    {
        const data:NotifyMessage = {
            lable:Command.send,
            header:title,
            data:params
        }
        openNotify(data,()=>
        {
            transfer(params)
            .then(result=>{
                resolve(result);
            })
            .catch(error=>{
                reject(error);
            })
        })

    })
}

/**
 * invoke试运行方法
 * @param data invokeRead 的参数
 */
var invokeRead=(data:InvokeReadInput)=>{
    return new Promise((r,j)=>{
        const script = new ScriptBuild();
        try {
            script.EmitArguments(data.arguments);        // 参数转换与打包
            script.EmitPushString(data.operation);    // 塞入需要调用的合约方法名
            script.EmitAppCall(Neo.Uint160.parse(data.scriptHash));   // 塞入需要调用的合约hex
            Api.getInvokeRead(script.ToArray().toHexString())
            .then(result=>{
                r(result);
            })
            .then(error=>{
                j(error);
            })
        } catch (error) {
            j(error);
        }
    })
}

var invokeReadGroup=(data:InvokeReadGroup)=>{
    return new Promise((r,j)=>{
        const script = new ScriptBuild();
        try {
            for (const invoke of data.group) {
                script.EmitArguments(invoke.arguments);        // 参数转换与打包
                script.EmitPushString(invoke.operation);    // 塞入需要调用的合约方法名
                script.EmitAppCall(Neo.Uint160.parse(invoke.scriptHash));   // 塞入需要调用的合约hex
            }
            Api.getInvokeRead(script.ToArray().toHexString())
            .then(result=>{
                r(result);
            })
            .then(error=>{
                j(error);
            })
        } catch (error) {
            j(error);
        }
    })
}

const getProvider=()=>
{
    return new Promise((resolve,reject)=>
    {
        let provider:Provider=
        {
            "compatibility":[""],
            "extra":{theme:"",currency:""},
            "name":"Teemmo.NEO",
            "version":VERSION,
            "website":""
        }
        resolve(provider);
    })
}

const notifyInit=(title:string,domain:string,favIconUrl:string)=>{
    return new Promise((r,j)=>{        
        if(storage.domains.indexOf(domain))
        {
            const notifyHeader:NotifyMessage = {
                header:{title,domain,icon:favIconUrl},
                lable:Command.getAccount
            }
            
            getBase64ByUrl(favIconUrl)
            .then(icon=>{
                notifyHeader.header.icon=icon;
                openNotify(notifyHeader,()=>{
                    chrome.storage.local.get("confirm",res=>{
                        if(res["confirm"]==="confirm")
                        {
                            storage.titles.push(title);
                            storage.domains.push(domain);
                            r()
                        }else if(res["confirm"]==="cancel"){
                            j({type:"NOTIFY_ERROR",description:"User cancel Authorization "});
                        }
                    })
                })
            })
        }
        else
        {
            r();
        }
    })
}

const responseMessage =(request)=>
{
    const {ID,command,message,params}=request;
    chrome.tabs.query({ active: true, currentWindow: true },  (tabs)=>
    {
        const title = tabs[0].title;
        const urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;  
        const url=urlReg.exec(tabs[0].url);
        const domain = url?url[0]:tabs[0].url;
        notifyInit(title,domain,tabs[0].favIconUrl)
        .then(()=>{
            switch (request.command) {
                case Command.getProvider:
                    sendResponse(getProvider());
                    break;        
                case Command.getNetworks:
                    sendResponse(getNetworks());
                    break;
                case Command.getAccount:
                    sendResponse(getAccount(message));
                    break;
                case Command.getBalance:
                    sendResponse(getBalance(params));
                    break;
                case Command.getStorage:
                    
                    break;
                case Command.getPublicKey:
                    
                    break;
                case Command.invoke:
                    sendResponse(invoke(message,params));
                    break;
                case Command.send:
                    sendResponse(send(message,params))
                    break;
                case Command.invokeRead:
                    sendResponse(invokeRead(params));
                    break;
                case Command.invokeGroup:
                    sendResponse(invokeGroup(message,params));
                    break;
                case Command.invokeReadGroup:
                    sendResponse(invokeReadGroup(params));
                    break;
                default:
                    sendResponse(new Promise((r,j)=>j({type:"REQUEST_ERROR",description:"This method is not available"})))
                    break;
            }
        })
        const sendResponse=(result:Promise<any>)=>
        {
            result
            .then(data=>{
                chrome.tabs.sendMessage(tabs[0].id, {
                    return:command,
                    ID,data
                });  
            })
            .catch(error=>{
                chrome.tabs.sendMessage(tabs[0].id, {
                    return:command,
                    ID,error
                });  
            })
        }
    })
}


/**
 * 监听
 */
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        //初始化鼠标随机方法
        if(request.command)
            responseMessage(request);
    }
);

enum ConfirmType
{
    tranfer,    // 确认交易是否成功
    contract,   // 确认合约是否成功，等待notify
}

enum TaskState
{
    watting,
    success,
    fail,
    watForLast,
    failForLast,
}

class Task
{
    height: number;
    confirm: number;
    type: ConfirmType;
    txid: string;
    message: any;
    state: TaskState;
    startTime: number;
    next?:TransferGroup;
    constructor(
        type: ConfirmType,
        txid: string,
        next?:TransferGroup,
        state?:TaskState,
        messgae?
    )
    {
        this.height = storage.height;
        this.type = type;
        this.confirm = 0;
        this.txid = txid;
        this.next = next;
        this.state = state?state:TaskState.watting;
        this.message = messgae;
        this.startTime = new Date().getTime();
    }
}

class TransferGroup
{
    txid:string;
    txhex:string;
    executeError?:{type:string,data:string,description:string}
    static update(tran:TransferGroup){
        console.log("-------------------------------------TransferGroup-update");
        
        Api.sendrawtransaction(tran.txhex)
        .then(result=>{
            if(result)
            {
                TaskManager.shed[tran.txid].state = TaskState.watting;
            }
            else
            {
                TaskManager.shed[tran.txid].state = TaskState.fail;
                tran.executeError={
                    type:"TransferError",
                    description:result[0].errorMessage,
                    data:tran.txhex
                }
            }
        })
        .catch(error=>{
            if(error)
            {
                tran.executeError={
                    type:"TransferError",
                    description:"",
                    data:error
                }
            }
        })
    }
}

class TaskManager{

    public static shed :{[txid:string]:Task} = {};

    public static start()
    {
        setInterval(()=>{            
            Api.getBlockCount()
            .then(result=>{
                const count = (parseInt(result[0].blockcount)-1);
                if(count - storage.height>0)
                {
                    storage.height=count;
                    console.log(storage.height);
                    
                    this.update()
                }
            }) 
            .catch(error=>{
                console.log(error);        
            })
        },15000)        
    }

    public static addTask(task:Task)
    {
        this.shed[task.txid] = task;
    }

    public static update()
    {        
        for ( const key in this.shed) 
        {
            const task = this.shed[key];
            if(task.state==TaskState.watting)
            {
                if(task.type===ConfirmType.tranfer){
                    Api.getrawtransaction(task.txid)
                    .then(result=>{
                        console.log('----------------------------------------请注意这里是任务管理器正在处理交易---------------------------------');
                        
                        console.log(result);
                        
                        if(result['blockhash'])
                        {
                            console.log(task.txid+"       该交易查询成功");
                            
                            task.state = TaskState.success;
                            console.log("状态变更");
                            console.log(task);
                            this.shed[key]=task;
                            if(task.next)
                            {
                                TransferGroup.update(task.next);
                            }
                        }
                    })
                    .catch(error=>{
                        console.log(error);
                    })
                }else{
                    Api.hasContract(task.txid)
                    .then(result=>{
                        console.log(result);                        
                    })
                    .catch(error=>{
                        console.log(error);                        
                    })
                }
            }
        }
    }
}


TaskManager.start();

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
  invokeReadGroup='invokeReadGroup',
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
    description?:string;
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

interface InvokeReadInput {
    scriptHash: string;
    operation: string;
    arguments?: Argument[];
    network: string;
}
interface InvokeReadGroup{
    group:InvokeReadInput[];
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
    network: "TestNet"|"MainNet";
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

enum DataType
{
    Array = 'Array',
    ByteArray = 'ByteArray',
    Integer = 'Integer',
    Boolean = 'Boolean',
    String = 'String'
}

class ResultItem
{
    public data: Uint8Array;
    public subItem: ResultItem[];

    public static FromJson(type: string, value: any): ResultItem
    {
        let item: ResultItem = new ResultItem();
        if (type === DataType.Array)
        {
            item.subItem = []//new ResultItem[(value as Array<any>).length];
            for (let i = 0; i < (value as any[]).length; i++)
            {
                let subjson = ((value as any)[i] as Map<string, any>);
                let subtype = (subjson["type"] as string);
                item.subItem.push(ResultItem.FromJson(subtype, subjson["value"]));
            }
        }
        else if (type === DataType.ByteArray)
        {
            item.data = (value as string).hexToBytes()
        }
        else if (type === DataType.Integer)
        {
            item.data = Neo.BigInteger.parse(value as string).toUint8Array();
        }
        else if (type === DataType.Boolean)
        {
            if ((value as number) != 0)
                item.data = new Uint8Array(0x01);
            else
                item.data = new Uint8Array(0x00);
        }
        else if (type === DataType.String)
        {
            item.data = ThinNeo.Helper.String2Bytes(value as string);
        }
        else
        {
            console.log("not support type:" + type);
        }
        return item;
    }


    public AsHexString(): string
    {
        return (this.data).toHexString();
    }
    public AsHashString(): string
    {
        return "0x" + this.data.reverse().toHexString();
    }
    public AsString(): string
    {
        return ThinNeo.Helper.Bytes2String(this.data);
    }
    public AsHash160(): Neo.Uint160
    {
        if (this.data.length === 0)
            return null;
        return new Neo.Uint160(this.data.buffer);
    }

    public AsHash256(): Neo.Uint256
    {
        if (this.data.length === 0)
            return null;
        return new Neo.Uint256(this.data.buffer)
    }
    public AsBoolean(): boolean
    {
        if (this.data.length === 0 || this.data[0] === 0)
            return false;
        return true;
    }

    public AsInteger(): Neo.BigInteger
    {
        return new Neo.BigInteger(this.data);
    }
}

function getBase64Image(img) {  
    var canvas = document.createElement("canvas");  
    canvas.width = img.width;  
    canvas.height = img.height;  
    var ctx = canvas.getContext("2d");  
    ctx.drawImage(img, 0, 0, img.width, img.height);  
    var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();  
    var dataURL = canvas.toDataURL("image/"+ext);  
    return dataURL;  
}

function getBase64ByUrl(url:string) {
    return new Promise<string>((r,j)=>{
        var image = new Image();
        image.src = url;
        image.onload = ()=>{  
        let base64 = getBase64Image(image);  
        r(base64);
        }
    })
}
