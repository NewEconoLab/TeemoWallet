///<reference path="../../lib/neo-thinsdk.d.ts"/>

interface BackStore
{
    // [name:string]:any
    network:"TestNet"|"MainNet",
    height:number,
    account:AccountInfo,
    domains:string[],
    titles:string[],
    oldUtxo:{[txid:string]:number[]},
    allAssetInfo:AssetInfo[],
    accountWaitTaskCount:{[addr:string]:number}
}

const storage:BackStore=
{
    network:"MainNet",
    account:undefined,
    height:0,
    domains:[],
    titles:[],
    oldUtxo:{},
    allAssetInfo:[],
    accountWaitTaskCount:{}
}

const netstr = localStorage.getItem('Teemo-NetWork');
storage.network = netstr?((netstr=='TestNet'||netstr=='MainNet')?netstr:"MainNet"):"MainNet";

const HASH_CONFIG = {
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
const testRpcUrl = "http://test.nel.group:20332";
const mainRpcUrl = "http://seed.nel.group:10332";

const testRpcUrlList=[
    'http://test.nel.group:20332',
    'http://seed5.ngd.network:20332',
    'http://seed2.ngd.network:20332',
    'http://seed4.ngd.network:20332',
    'http://seed3.ngd.network:20332',
    'http://seed9.ngd.network:20332',
    'http://seed8.ngd.network:20332',
]

const mainRpcUrlList=[
    'http://seed.nel.group:10332',
    'http://seed5.ngd.network:10332',
    'http://seed10.ngd.network:10332',
    'http://seed8.ngd.network:10332',
    'http://seed9.ngd.network:10332',
    'http://seed4.neo.org:10332',
    'http://node2.sgp1.bridgeprotocol.io:10332',
]
let testNode:Array<{node:string,height:number}>=[
    {node:'http://test.nel.group:20332',height:0},
    {node:'http://seed5.ngd.network:20332',height:0},
    {node:'http://seed2.ngd.network:20332',height:0},
    {node:'http://seed4.ngd.network:20332',height:0},
    {node:'http://seed3.ngd.network:20332',height:0},
    {node:'http://seed9.ngd.network:20332',height:0},
    {node:'http://seed8.ngd.network:20332',height:0},
];   
let mainNode:Array<{node:string,height:number}>=[
    {node:'http://seed.nel.group:10332',height:0},
    {node:'http://seed5.ngd.network:10332',height:0},
    {node:'http://seed10.ngd.network:10332',height:0},
    {node:'http://seed8.ngd.network:10332',height:0},
    {node:'http://seed9.ngd.network:10332',height:0},
    {node:'http://seed4.neo.org:10332',height:0},
    {node:'http://node2.sgp1.bridgeprotocol.io:10332',height:0},
];     


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
        for (let index = 0; index < utxos.length; index++) 
        {
            const utxo = utxos[index];
            const txid = utxo.txid.replace('0x','');
            if(storage.oldUtxo[txid])
            {
                storage.oldUtxo[txid].push(utxo.n);
            }
            else
            {
                storage.oldUtxo[txid] = new Array<number>();
                storage.oldUtxo[txid].push(utxo.n);
            }
        }
    }

    public static async getAllUtxo():Promise<{ [id: string]: Utxo[] }>
    {
        try 
        {
            const utxos:any[] = await Api.getUtxo(storage.account.address);   // 获得为使用的utxo
            if(!utxos)
            {
                return undefined;
            }
            const marks = storage.oldUtxo   // 获得被标记的utxo
            const assets:{ [id: string]: Utxo[] } = {};        
            // 对utxo进行归类，并且将count由string转换成 Neo.Fixed8
            for (const item of utxos) {         
                const utxo = new Utxo();
                utxo.addr = item.addr;
                utxo.asset = item.asset.replace('0x','');
                utxo.n = item.n;
                utxo.txid = item.txid.replace('0x','');
                utxo.count = Neo.Fixed8.parse(item.value);  
                assets[utxo.asset]=assets[utxo.asset]?assets[utxo.asset]:[];
                const mark = marks?marks[utxo.txid]:undefined;
                if(!mark)
                {
                    assets[utxo.asset].push(utxo);
                }
                else if(mark.indexOf(item.n)<0)   // 排除已经标记的utxo返回给调用放
                {
                    assets[utxo.asset].push(utxo);
                }
                else    // 对被使用过的utxo进行排除
                {                    
                    // console.log('被排除的utxo',item);
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

class Storage_local
{
    public static setAccount(account:NepAccount){        
        const lang = localStorage.getItem('language');
        const name = (!lang||lang=='zh')?'我的钱包':'Wallet';
        let arr = Storage_local.getAccount();        
        let index: number= -1;
        let newacc=new NepAccount(
            account.walletName,
            account.address,
            account.nep2key,
            account.scrypt)
        
        if(arr.length){            
            arr = arr.map((acc,n)=>{
                if(acc.address===account.address)
                {
                    newacc.walletName = newacc.walletName?newacc.walletName:(acc.walletName?acc.walletName:name+(n+1));
                    newacc.index = index = n;
                    return newacc;
                }
                return acc;
            });
            if(index<0){
                newacc.walletName=newacc.walletName?newacc.walletName:name+(arr.length+1);
                arr.push(newacc);
            }
        }else{
            newacc.walletName=newacc.walletName?newacc.walletName:name+1;
            arr.push(newacc);
        }
        
        localStorage.setItem("TeemoWALLET_ACCOUNT",JSON.stringify(arr));
        return newacc;
    }
    public static getAccount(){
        const str = localStorage.getItem("TeemoWALLET_ACCOUNT");
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
    public static set(key:string,value:any){
        return new Promise((r,j)=>{
            chrome.storage.local.set({[key]:value},()=>{r()})
        })
    };
    public static get<T>(key:string,):Promise<T>
    {
        return new Promise<T>((r,j)=>{
            chrome.storage.local.get(key,item=>{                
                r(item?item[key]:undefined);
            })
        })
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
        this.attributes[ 0 ].data = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(storage.account.address);
    }

    /**
     * 创建一个交易中的输入和输出 将使用过的utxo 放入 marks
     * @param utxos 资产的utxo 
     * @param sendcount 输出总数
     * @param target 对方地址
     * @param netfee 有手续费的时候使用，并且使用的utxos是gas的时候
     */
    public creatInuptAndOutup(utxos: Utxo[], sendcount: Neo.Fixed8, target?: string,netfee?:Neo.Fixed8)
    {
        let count = Neo.Fixed8.Zero;
        let scraddr = "";
        const assetId: Uint8Array = utxos[0].asset.hexToBytes().reverse();
        const amount = netfee?sendcount.add(netfee):sendcount;  // 判断是否有添加网络费用如果有，则转账金额加上网络费用
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
            if(count.compareTo(amount)>0)    // 塞入足够的input的时候跳出循环
            {
                break;
            }
        }
        if(count.compareTo(amount)>=0)   // 比较utxo是否足够转账
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
            const change = count.subtract(amount); // 应该找零的值
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
            throw {type:'INSUFFICIENT_FUNDS',description:'The user does not have a sufficient balance to perform the requested action'};
        }
    }

    public getTxid()
    {
        return this.GetHash().clone().reverse().toHexString();
    }

    
}

const makeRpcPostBody = (method, params) => {
    const body = {};
    body["jsonrpc"] = "2.0";
    body["id"] = 1;
    body["method"] = method;
    body["params"] = params;
    return JSON.stringify(body);
}

interface IOpts {
    method:string; // 接口名
    params: any[]; // 参数
    isGET?:boolean; // 是否是get 请求（默认请求是post）
    baseUrl?:'common'|'rpc'; // 如果是common 则 取 baseCommonUrl（默认 baseUrl）
    otherUrl?:string;
    getAll?:boolean; // 是否获取所有返回结果
    network?:"TestNet" | "MainNet";
    getNode?:boolean;

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
    // 判断当前网络
    let network = opts.network?opts.network:storage.network;
    let url = '';
    // 筛选节点
    if(opts.otherUrl){
        url = opts.otherUrl;
    }else if (opts.baseUrl === 'common') {
        url = [baseCommonUrl,network=="TestNet"?"testnet":"mainnet"].join('/');
    }else if(opts.baseUrl==='rpc'){
        url = network=="TestNet"?testNode[0].node:mainNode[0].node;
    }else{
        url = [baseUrl,network=="TestNet"?"testnet":"mainnet"].join('/');
    }

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
                const result  = opts.getNode?{nodeUrl:url,data:json.result}:json.result;
                return result;
            }
        }
        else if(json.error["code"]===-1)
        {
            return null;
        }
        else
        {
            throw new Error(JSON.stringify(json.error));    
        }
    }
    catch (error) 
    {
        console.log("网络请求异常 请求参数：",opts); 
        throw error;    
    }
}

const Api = {

    getAssetState:(assetID:string)=>{
        return request({
            method:"getassetstate",
            params:[assetID],
            baseUrl:'rpc'
        })
    },

    getStorage:(scriptHash:string,key:string)=>{
        return request({
            method:"getstorage",
            params:[scriptHash,key],
            baseUrl:"rpc"
        })
    },

    getcontractstate:(scriptaddr: string)=>{
        return request({
            method:"getcontractstate",
            params:[scriptaddr],
            baseUrl:"common"
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
    getallasset :  () => {
        const opts:IOpts = {
            method:'getallasset',
            params:[],
            baseUrl:'common'
        }
        return request(opts);
    },
    
    /**
     * 获取nep5的资产（CGAS）
     */
    getallnep5asset :  () => {
        const opts:IOpts = {
            method:'getallnep5asset',
            params:[],
            baseUrl:'common'
        }
        return request(opts);
    },
    
    /**
     * 获取nep5的资产（CGAS）
     */
    getallnep5assetofaddress : (address) => {
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
    getUtxoBalance : (address,assetId) => {
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
        return request({
            method:'getregisteraddressbalance',
            params:[
                address,
                register
            ]
        });
    },

    sendrawtransaction : (data,network?:'TestNet'|'MainNet') => {
        const opts:IOpts = {
            method:'sendrawtransaction',
            params:[data],
            baseUrl:'rpc',
            getNode:true,
            network
        }
        return request(opts);
    },

    getUtxo: (address)=>{
        const opts:IOpts={
            method:"getutxo",
            params:[address],
            baseUrl:'common'
        }
        return request(opts);
    },
    
    getDomainInfo : (domain)=>{
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
    hasTx : (txid)=>{
        const opts={
            method:"hastx",
            params:[txid]
        }
        return request(opts);
    },

    getrawtransaction : (txid,network?:'TestNet'|'MainNet')=>{
        const opts:IOpts={            
            method:"getrawtransaction",
            params:[txid,1],
            baseUrl:'rpc',
            network          
        }
        return request(opts);
    },

    /**
     * 
     */
    getrawtransaction_api : (txid)=>{
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
    hasContract : (txid)=>{
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
    getRehargeAndTransfer : (txid)=>{
        const opts={
            method:"getrechargeandtransfer",
            params:[txid]
        }
        return request(opts);
    },
    
    getBlockCount : (rpc?:string)=>{
        const opts:IOpts={
            method:"getblockcount",
            params:[],
            otherUrl:rpc,
            baseUrl:"rpc"
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

    rechargeAndTransfer : (data1,data2)=>{
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
    getnep5asset : (asset)=>{
        const opts={
            method:"getnep5asset",
            params:[asset]
        }
        return request(opts);
    },

    getBlock:(height:number)=>{
        return request({
            method:'getblock',
            params:[height,1],
            baseUrl:'rpc'
        })
    },

    getApplicationLog:(txid:string)=>{
        return request({
            method:'getapplicationlog',
            params:[txid],
            baseUrl:'rpc'

            // method:'getnotify',
            // params:[txid],
            // baseUrl:'common'
        })
    },

    /**
     * 获得claimgas的utxo
     * @param address 地址
     * @param type 类型 1:不可领取；其余：可领取
     * @param page 页数
     * @param size 每页条数
     */
    getClaimgasUtxoList:(address:string,type:number,page:number,size:number,network?:'MainNet'|'TestNet')=>{
        return request({
            method:'getclaimgasUtxoList',
            params:[address,type,page,size],
            baseUrl:'common',
            network
        })
    },

    getclaimgas:(address:string,type:number,size:number,hide:number)=>{
        return request({
            method:'getclaimgas',
            params:[address,type,size,hide],
            baseUrl:'common',
        })
    }

}


async function networkSort()
{    
    for (let index = 0; index < testNode.length; index++) {
        const node = testNode[index].node;
        try {
            const result = await Api.getBlockCount(node)
            const height = (parseInt(result)-1);
            testNode[index]={node,height};
        } catch (error) {
            console.log("异常测试节点",node);            
        }
    }
    testNode = testNode.sort((b,a)=>{
        return a.height-b.height;
    })
    
    for (let index = 0; index < mainNode.length; index++) {
        const node = mainNode[index].node;
        try {            
            const result = await Api.getBlockCount(node)
            const height = (parseInt(result)-1);
            mainNode[index]={node,height};
        } catch (error) {
            console.log("异常主网节点",node);
        }
    }
    mainNode = mainNode.sort((b,a)=>{
        return a.height-b.height;
    })
    // console.log('main rpc node',mainNode);
    
    // console.log('test rpc node',testNode);
}
networkSort();

const setContractMessage=(txid:string,domain:string,data)=>{
    Storage_local.get("invoke-message")
    .then(result=>{
        if(result)
        {
            result[txid] = {domain,data}
            Storage_local.set("invoke-message",{result})
        }
        else
        {
            let message = {};
            message[txid] = {domain,data}
            Storage_local.set("invoke-message",{message})
        }
    })
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

    EmitInvokeArgs(data:InvokeArgs|InvokeArgs[],hookTxid?:string){
        const invokes=Array.isArray(data)?data:[data];
        const RANDOM_UINT8:Uint8Array = getWeakRandomValues(32);
        const RANDOM_INT:Neo.BigInteger = Neo.BigInteger.fromUint8Array(RANDOM_UINT8);
        // 塞入随机数
        this.EmitPushNumber(RANDOM_INT);  // 将随机数推入栈顶
        this.Emit(ThinNeo.OpCode.DROP);   // 打包

        for (let index = 0; index < invokes.length; index++) {
            const invoke = invokes[index];
            this.EmitArguments(invoke.arguments,hookTxid);    // 调用EmitArguments方法编译并打包参数
            this.EmitPushString(invoke.operation) // 塞入方法名
            this.EmitAppCall(Neo.Uint160.parse(invoke.scriptHash));   // 塞入合约地址
        }
        return this.ToArray();
    }
}

/**
 * 构造合约调用交易
 * @param invoke invoke调用参数
 */
var contractBuilder = async (invoke:InvokeArgs)=>{
    let tran = new Transaction();    
    const script = new ScriptBuild();
    script.EmitInvokeArgs(invoke);
    tran.setScript(script.ToArray());
    try 
    {
        const script = new ScriptBuild();
        script.EmitInvokeArgs(invoke);
        tran.setScript(script.ToArray());
        const utxos = await MarkUtxo.getAllUtxo();
        const fee = invoke.fee?Neo.Fixed8.parse(invoke.fee):Neo.Fixed8.Zero;
        if(invoke.attachedAssets){
            for (const asset in invoke.attachedAssets) {
                if (invoke.attachedAssets.hasOwnProperty(asset)) {
                    const toaddr = ThinNeo.Helper.GetAddressFromScriptHash(Neo.Uint160.parse(invoke.scriptHash));
                    const amount = Neo.Fixed8.parse(invoke.attachedAssets[asset]);
                    const utxo = utxos[asset];
                    if(asset.includes(HASH_CONFIG.ID_GAS))
                        tran.creatInuptAndOutup(utxo,amount,toaddr,fee)
                    else
                        tran.creatInuptAndOutup(utxo,amount,toaddr)
                }
            }
        }
        else if(fee.compareTo(Neo.Fixed8.Zero)>0)
        {
            if(utxos && utxos[HASH_CONFIG.ID_GAS])
            {
                const utxo = utxos[HASH_CONFIG.ID_GAS]
                tran.creatInuptAndOutup(utxo,fee);
            }
            else
            {
                throw {type:'INSUFFICIENT_FUNDS',description:'The user does not have a sufficient balance to perform the requested action'};
            }
        }
        let result = await transactionSignAndSend(tran);        
        TaskManager.addTask(new Task(ConfirmType.contract,result.txid));
        return result;
    } 
    catch (error) 
    {
        throw error;                  
    }
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
        let netfee:Neo.Fixed8 = Neo.Fixed8.Zero;
        let tran = new Transaction();
        // let script = groupScriptBuild(data.group);
        const script = new ScriptBuild();
        script.EmitInvokeArgs(data.group)
        tran.setScript(script.ToArray());
        // let transfer:{[asset: string]:{}}=null // 用来存放 将要转账的合约地址 资产id 数额
        let utxos = await MarkUtxo.getUtxoByAsset(HASH_CONFIG.ID_GAS);
        // let assets:{[asset:string]:string};
        for (let index = 0; index < data.group.length; index++) // 循环算utxo资产对应的累加和相对应每笔要转走的money
        {
            const invoke = data.group[index];
            if(invoke.fee)  // 判断是否有手续费
                netfee = netfee.add(Neo.Fixed8.parse(invoke.fee)) // 计算总共耗费多少手续费;
            // if(invoke.attachedAssets)  // 判断是否有合约转账
            // {
            //     transfer=transfer?transfer:{};
            //     const toaddr = ThinNeo.Helper.GetAddressFromScriptHash(Neo.Uint160.parse(invoke.scriptHash));         // 将scripthash 转地址 
            //     if(transfer[toaddr])   
            //     {
            //         for (const id in invoke.attachedAssets) {
            //             if (invoke.attachedAssets.hasOwnProperty(id)) {
            //                 if(transfer[toaddr][id])
            //                 {
            //                     transfer[toaddr][id]=Neo.Fixed8.parse(transfer[toaddr][id]).add(Neo.Fixed8.parse(invoke.attachedAssets[id])).toString();
            //                 }
            //                 else
            //                 {
            //                     transfer[toaddr][id]=invoke.attachedAssets[id];    
            //                 }
            //             }
            //         }
            //     }
            //     else
            //     {                    
            //         transfer[toaddr] = invoke.attachedAssets;
            //     }
            // }
        }
        if(netfee.compareTo(Neo.Fixed8.Zero)>0)
        {
            tran.creatInuptAndOutup(utxos,netfee)
        }
        try {
            let result = await transactionSignAndSend(tran);
            TaskManager.addTask(
                new Task(
                ConfirmType.contract,
                result.txid.replace('0x',''),
                )
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
            
            if(index==0)
            {
                try {
                    let result = await contractBuilder(invoke);
                    txids.push(result);
                } catch (error) {
                    throw error;
                }
            }
            else
            {
                let utxos = await MarkUtxo.getUtxoByAsset(HASH_CONFIG.ID_GAS);
                let tran = new Transaction();
                let script = new ScriptBuild();
                script.EmitInvokeArgs(invoke,txids[0].txid);
                tran.setScript(script.ToArray());
                if(invoke.fee && invoke.fee!='0')
                    tran.creatInuptAndOutup(utxos,Neo.Fixed8.parse(invoke.fee));
                const message  = tran.GetMessage().clone();
                const signdata = ThinNeo.Helper.Sign(message,storage.account.prikey);
                tran.AddWitness(signdata,storage.account.pubkey,storage.account.address);
                const data:Uint8Array = tran.GetRawData();
                const nextTran = new TransferGroup()
                nextTran.txhex=data.toHexString();
                nextTran.txid=tran.getTxid();
                txids.push({txid:nextTran.txid,nodeUrl:storage.network=='TestNet'?testRpcUrl:mainRpcUrl});
                trans.push(nextTran);
                MarkUtxo.setMark(tran.marks);
            }
        }
        // const task = new Task(ConfirmType.contract,txids[0].txid.replace('0x',''),trans[0],TaskState.watting);
        // TaskManager.addTask(task);
        for (let index = 0; index < trans.length; index++) {
            const tran = trans[index];
            if(index<(trans.length-1)){
                TaskManager.addTask(new Task(
                    ConfirmType.contract,tran.txid,trans[index+1],TaskState.watForLast
                ))
            }else{
                TaskManager.addTask(new Task(
                    ConfirmType.contract,tran.txid,undefined,TaskState.watForLast
                ))
            }
        }
        return txids;
    }
}


/**
 * 发送
 * @param trans 
 */
const sendGroupTranstion=(trans:Transaction[])=>{
    return new Promise<InvokeOutput[]>((resolve,reject)=>{
        let outputs:InvokeOutput[]=[];
        for (let index = 0; index < trans.length; index++) {
            const tran = trans[index];            
            const message  = tran.GetMessage().clone();
            const signdata = ThinNeo.Helper.Sign(message,storage.account.prikey);
            tran.AddWitness(signdata,storage.account.pubkey,storage.account.address);
            // const data:Uint8Array = tran.GetRawData();
            outputs.push({"txid": tran.getTxid(),nodeUrl:"https://api.nel.group/api"});
        }
    })
}

/**
 * 
 * @param transcount 转换金额
 * @param netfee 交易费用
 */
var exchangeCgas=async(transcount:number,netfee:number)=>{
    const result = await makeRefundTransaction(transcount,netfee);
    // 已经确认
    //tx的第一个utxo就是给自己的
    let utxo = new Utxo();
    // utxo.addr = storage.account.address;
    utxo.addr = ThinNeo.Helper.GetAddressFromScriptHash(HASH_CONFIG.ID_CGAS);
    utxo.txid = result.txid;
    utxo.asset = HASH_CONFIG.ID_GAS;
    utxo.count = Neo.Fixed8.fromNumber(transcount);
    utxo.n = 0;
    const data = await makeRefundTransaction_tranGas(utxo,transcount,netfee);
    TaskManager.addTask(new Task(ConfirmType.contract,result.txid,data));
    TaskManager.addTask(new Task(ConfirmType.contract,data.txid,undefined,TaskState.watForLast));
    let txids:InvokeOutput[] = [result,{"txid":data.txid,"nodeUrl":"https://api.nel.group/api"}];
    return txids;
}

var exchangeGas=async(transcount:number,netfee:number)=>{    
    const invoke:InvokeArgs={
        scriptHash:HASH_CONFIG.ID_CGAS.toString(),
        operation:"mintTokens",
        arguments:[],
        attachedAssets:{[HASH_CONFIG.ID_GAS]:transcount.toString()},
        network:storage.network,
        fee:netfee?"0.001":"0",
        description:'gasToCgas'
    }
    try {
        const result =await contractBuilder(invoke);
        TaskManager.addInvokeData(result.txid,'TeemoWallet.exchangeCgas',invoke);
        return result;
    } catch (error) {
        throw error;
    }
}  

interface AssetInfo
{
    assetid:string;
    type:'nep5'|'utxo';
    symbol:string;
    name:string;
    decimals:number;
}

interface Nep5AssetInfo{
    assetid:string;
    totalsupply:string;
    name:string;
    symbol:string;
    decimals:number;
}

interface UtxoAssetInfo{
    version: number,
    id: string,
    type: string,
    name: 
    {
        lang: string,
        name: string
    }[],
    amount: string,
    available: string,
    precision: number,
    owner: string,
    admin: string,
    issuer: string,
    expiration: number,
    frozen: boolean
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

    // CGAS合约地址 转账给 CGAS合约地址。用来生成一个utxo,合约会把这个utxo标记给发起的地址使用

    tran.creatInuptAndOutup(cgass, Neo.Fixed8.fromNumber(transcount), nepAddress);
    if (netfee>0) // 判断是否有手续费
    {   // 创建当前交易的手续费
        
        tran.creatInuptAndOutup(gass, Neo.Fixed8.fromNumber(netfee));
    }
    var scriptHash = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(storage.account.address);
    var script = new ScriptBuild();
    const refund:InvokeArgs = {
        scriptHash:HASH_CONFIG.ID_CGAS.toString(),
        operation:'refund',
        arguments:[{type:"ByteArray",value:scriptHash.toHexString()}],
        network:storage.network,
        fee:netfee.toString(),
        description:'cgasToGas'
    }
    script.EmitInvokeArgs(refund);  // 这里的方法有推随机数进去不知道具体是否有影响
    tran.setScript(script.ToArray())
    let sb = new ThinNeo.ScriptBuilder();
    sb.EmitPushString("whatever")
    sb.EmitPushNumber(new Neo.BigInteger(250));
    // 这里多传一个参数 cgas 的scriptHash 
    tran.AddWitnessScript(new Uint8Array(0), sb.ToArray(),HASH_CONFIG.ID_CGAS.toArray());
    // let result = transactionSignAndSend(tran);
    const message  = tran.GetMessage().clone();
    const signdata = ThinNeo.Helper.Sign(message,storage.account.prikey);        
    tran.AddWitness(signdata,storage.account.pubkey,storage.account.address);
    const data:Uint8Array = tran.GetRawData();
    const txid:string = tran.getTxid();
    const result =await Api.sendrawtransaction(data.toHexString());
    if(result['data'])
    {
        MarkUtxo.setMark(tran.marks);
        const nodeUrl:string=result['nodeUrl'];
        let ouput:InvokeOutput ={txid,nodeUrl}
        // 为了popup显示对应的refund的数额
        // TaskManager.addInvokeData(txid,"TeemoWallet.exchangeCgas",refund);
        const message:InvokeHistory={
            domain:"TeemoWallet.exchangeCgas",
            scriptHashs:[refund.scriptHash],
            descripts:[refund.description],
            expenses:[{'assetid':HASH_CONFIG.ID_CGAS.toString(),'amount':transcount.toString(),'symbol':'CGAS'}],
            netfee:refund.fee?refund.fee:'0',
        }
        TaskManager.invokeHistory[txid]=message;
        Storage_local.set('invoke-data',TaskManager.invokeHistory);
        return ouput;
    }
    else
    {
        throw {type:"TransactionError",description:result[0].errorMessage,data:""};            
    }
        
    // return result;
}
/**
 * 
 * @param utxo 兑换gas的utxo
 * @param transcount 兑换的数量
 */
var makeRefundTransaction_tranGas = async (utxo:Utxo, transcount:number,netfee:number)=>
{
    var tran: Transaction = new Transaction();
    try
    {
        let sendcount = Neo.Fixed8.fromNumber(transcount);
        if (netfee)
        {
            let fee = Neo.Fixed8.fromNumber(netfee);                //网络费用
            sendcount = sendcount.subtract(fee);    //由于转账使用的utxo和需要转换的金额一样大所以输入只需要塞入减去交易费的金额，utxo也足够使用交易费
        }
        tran.creatInuptAndOutup([utxo], sendcount, storage.account.address);   //创建交易
        tran.outputs.length = 1;  //去掉找零的部分，只保留一个转账位
    }
    catch (error)
    {
        console.log(error);
    }
    //sign and broadcast
    //做智能合约的签名
    var sb = new ThinNeo.ScriptBuilder();
    sb.EmitPushNumber(new Neo.BigInteger(0));
    sb.EmitPushNumber(new Neo.BigInteger(0));

    // 多传一个参数
    tran.AddWitnessScript(new Uint8Array(0), sb.ToArray(),HASH_CONFIG.ID_CGAS.toArray());
    var trandata = new TransferGroup()
    trandata.txhex=tran.GetRawData().toHexString();
    trandata.txid = tran.getTxid();
    MarkUtxo.setMark(tran.marks);
    const senddata:SendArgs={
        'fromAddress':utxo.addr,
        'toAddress':storage.account.address,
        'asset':HASH_CONFIG.ID_GAS,
        'amount':transcount.toString(),
        'fee':netfee.toString(),
        'remark':'cgasToGas',
        network:storage.network}
    TaskManager.addSendData(trandata.txid,senddata)
    return trandata;

}

const transactionSignAndSend = async (tran:Transaction,net?:'TestNet'|'MainNet')=>
{
    const message  = tran.GetMessage().clone();
    const signdata = ThinNeo.Helper.Sign(message,storage.account.prikey);        
    tran.AddWitness(signdata,storage.account.pubkey,storage.account.address);
    const data:Uint8Array = tran.GetRawData();
    const txid=tran.getTxid();
    try {
        const result =await Api.sendrawtransaction(data.toHexString(),net);
        if(result['data'])
        {
            MarkUtxo.setMark(tran.marks);
            const nodeUrl:string=result.nodeUrl;
            let ouput:InvokeOutput ={txid,nodeUrl}
            return ouput;
        }
        else
        {
            throw {type:"RPC_ERROR",description:'An RPC error occured when submitting the request',data:result[0].errorMessage};            
        }
        
    } catch (error) {
        // console.log('异常claimed交易体Hex',data.toHexString());
        // console.log('异常交易体',tran);
        console.error(error);
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
const openNotify=(notifyData:NotifyMessage):Promise<boolean>=> {
    if(notifyData)
    {
        return new Promise((resolve,reject)=>{            
            chrome.storage.local.set({notifyData},()=>
            {
                var notify = window.open ('notify.html', 'notify', 'height=636px, width=391px, top=150, left=100, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no')        
                
                //获得关闭事件
                var loop = setInterval(() => {
                       if(notify.closed) {                        
                        chrome.storage.local.get(["confirm"],res=>{
                            if(res && res["confirm"]==="confirm")
                            {
                                Storage_local.set('confirm','');
                                resolve(true)
                            }
                            else
                            {
                                reject({type:'CANCELED',description:'The user cancels, or refuses the dapps request'})
                            }
                        })
                            clearInterval(loop);
                       }    
                    }, 1000
                );
            })
        })
    }
}

/**
 * 请求账户信息
 */
const getAccount=()=>{    
    return new Promise((resolve,reject)=>{        
        if(storage.account){
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
const invokeGroup=(header,params:InvokeGroup)=>{
    return new Promise((resolve,reject)=>{
        const data:NotifyMessage = {
            lable:Command.invokeGroup,
            data:params,
            header
        }        
        openNotify(data)
        .then(confrim=>{
            Storage_local.get('checkNetFee')
            .then(check=>{
                Storage_local.set('checkNetFee',false);
                if(params.merge)
                {
                    const fee = Neo.Fixed8.Zero;
                    params.group.map((invoke,index)=>{
                        fee.add(Neo.Fixed8.parse(invoke.fee?invoke.fee:'0'));
                    })
                    if(fee.compareTo(Neo.Fixed8.Zero)<0)
                    {
                        params.group[0].fee=check?'0.001':'0';
                    }
                }
                invokeGroupBuild(params)
                .then(result=>{
                    if(params.merge)
                    {                            
                        TaskManager.addInvokeData(result[0].txid,header.domain,params.group);
                    }else{
                        result.forEach((output,index,)=>{                                
                            TaskManager.addInvokeData(output.txid,header.domain,params.group[index]);
                        });
                    }
                    resolve(result);
                })
                .catch(error=>{        
                    reject(error);
                })
            })
        })
        .catch(error=>{        
            reject(error);
        })
    })
}

/**
 * invoke 合约调用
 * @param title dapp请求方的信息
 * @param data 请求的参数
 */
const invoke=(header,params:InvokeArgs)=>{
    return new Promise((resolve,reject)=>{
        const data:NotifyMessage = {
            lable:Command.invokeGroup,
            data:params,
            header
        }
        openNotify(data)
        .then(()=>{            
            Storage_local.get('checkNetFee')
            .then(checkNetFee=>{
                Storage_local.set('checkNetFee',false);
                params.fee=(params.fee && params.fee!='0')?params.fee:(checkNetFee?'0.001':'0');
                contractBuilder(params)
                .then(result=>{
                    resolve(result);
                    TaskManager.addInvokeData(result.txid,header.domain,params);
                })
                .catch(error=>{
                    reject(error);
                })
            })
        })
        .catch(error=>{
            reject(error);
        })
    })
}

/**
 * 获得网络状态信息
 */
const getNetworks=():Promise<GetNetworksOutput>=>{
    return new Promise((resolve,reject)=>{
        const network:GetNetworksOutput={
            networks : [storage.network?storage.network:"TestNet"],
            defaultNetwork : storage.network?storage.network:"TestNet"
        }
        resolve(network);
    })
}

/**
 * 余额获取
 * @param data 请求的参数
 */
var getBalance = async (data:GetBalanceArgs)=>{
    return new Promise(async(r,j)=>{
        try {
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
                
                var asset = arg.assets?arg.assets:[HASH_CONFIG.ID_GAS,HASH_CONFIG.ID_NEO,HASH_CONFIG.ID_NNC.toString(),HASH_CONFIG.ID_CGAS.toString()];
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
                    let res = undefined;
                    try {
                        res = await Api.getallnep5assetofaddress(arg.address);
                    } catch (error) {
                        console.log(error);                        
                    }
                    let assets={};
                    if(res)
                    {
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
                            else
                            {
                                const info = assetManager.allAssetInfo.find(asset=>asset.assetid==id);
                                assetArray.push({assetID:info.assetid,symbol:info.symbol,amount:'0'})
                            }
                        }
                    }
                    else
                    {
                        for (const id of nep5asset) {
                            const info = assetManager.allAssetInfo.find(asset=>asset.assetid==id);
                            assetArray.push({assetID:info.assetid,symbol:info.symbol,amount:'0'})
                        }
                    }
                }
                if(utxoasset.length){
                    let res = await Api.getBalance(arg.address);
                    let assets = {};
                    if(res)
                    {                        
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
                    }
                    for (const id of utxoasset) {
                        if(assets[id]){
                            assetArray.push(assets[id]);
                        }else
                        {
                            const info = assetManager.allAssetInfo.find(asset=>asset.assetid==id);
                            assetArray.push({assetID:info.assetid,symbol:info.symbol,amount:'0'})
                        }
                    }
                }
                balances[arg.address]=assetArray;
            }
            r(balances)
        } catch (error) {
            j ({type:"NETWORK_ERROR",description:"余额查询失败",data:error});                
        }
    })
}

var transfer= async(data:SendArgs):Promise<SendOutput>=>{
    if(data.asset.hexToBytes().length==20)
    {
        let amount;
        try {
            
            const result = await invokeRead(
                {
                    "scriptHash": data.asset,
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
                throw {type:'MALFORMED_INPUT',description:"This scripthash information undefined"}
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
            TaskManager.addTask(new Task(ConfirmType.tranfer,outupt.txid))
            TaskManager.addSendData(outupt.txid,data);
            return outupt;
        } catch (error) {
            throw error;
        }
    }
    else if(data.asset.hexToBytes().length==32)
    {
        try 
        {
            let tran = new Transaction();
            const utxos = await MarkUtxo.getAllUtxo();
            if(data.fee && data.fee!='0'){
                const fee = Neo.Fixed8.parse(data.fee);
                const gass = utxos[HASH_CONFIG.ID_GAS];
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
            }else{                
                const asset = utxos[data.asset];
                const amount = Neo.Fixed8.parse(data.amount);
                tran.creatInuptAndOutup(asset,amount,data.toAddress);
            }
            const outupt = await transactionSignAndSend(tran);
            TaskManager.addTask(new Task(ConfirmType.tranfer,outupt.txid));            
            TaskManager.addSendData(outupt.txid,data);
            return outupt
        } 
        catch (error) 
        {
            throw error
        }
    }
}

var send = (header,params:SendArgs) =>
{
    return new Promise<SendOutput>((resolve,reject)=>
    {
        if(params.fromAddress!==storage.account.address)
        {
            reject({type:"MALFORMED_INPUT",description:'The input address is not the current wallet address'})
        }
        else
        {
            const data:NotifyMessage = {
                lable:Command.send,
                data:params,
                header
            }
            openNotify(data)
            .then(confirm=>{
                transfer(params)
                .then(result=>{
                    resolve(result);
                })
            })
            .catch(error=>{
                reject(error);
            })
        }
    })
}

/**
 * invoke试运行方法
 * @param data invokeRead 的参数
 */
var invokeRead=(data:InvokeReadInput)=>{
    return new Promise<any>((r,j)=>{
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

var invokeReadTest=()=>{
    const script = new ScriptBuild();
    script.EmitParamJson([['(str)test','(str)qmz']])
    script.EmitPushString('nameHashArray');    // 塞入需要调用的合约方法名
    script.EmitAppCall(Neo.Uint160.parse('348387116c4a75e420663277d9c02049907128c7'));   // 塞入需要调用的合约hex
    Api.getInvokeRead(script.ToArray().toHexString())
    .then(result=>{
        // console.log(result);        
    })
    .then(error=>{
        console.log(error);        
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

var invokeArgsAnalyse=async(...invokes:InvokeArgs[])=>{
    let descriptions:string[] = [];
    let scriptHashs:string[] = [];
    let fee = Neo.Fixed8.Zero;
    let operations:string[] = [];
    let argument = [];
    let expenses:{symbol:string,amount:string,assetid:string}[] = [];
    let nep5assets:{[asset:string]:Neo.BigInteger}= {};
    let utxoassets:{[asset:string]:Neo.Fixed8}={};
    for (let index = 0; index < invokes.length; index++) {
        const invoke = invokes[index];        
        descriptions.push(invoke.description);
        scriptHashs.push(invoke.scriptHash);
        fee = invoke.fee ? fee.add(Neo.Fixed8.parse(invoke.fee)) :fee;
        operations.push(invoke.operation);
        argument.push(invoke.arguments);
        // 判断 nep5的转账花费
        if(invoke.operation=="transfer")
        {
            if(invoke.arguments[0].value==storage.account.address)
            {
                const amount = Neo.BigInteger.fromString(invoke.arguments[2].value.toString());
                if(!nep5assets[invoke.scriptHash])
                    nep5assets[invoke.scriptHash]=Neo.BigInteger.Zero;
                nep5assets[invoke.scriptHash]=nep5assets[invoke.scriptHash].add(amount);
            }
        }
        if(invoke.attachedAssets)
        {
            for (const asset in invoke.attachedAssets) {                
                const amount = Neo.Fixed8.parse(invoke.attachedAssets[asset].toString());
                if(!utxoassets[asset])
                    utxoassets[asset]=Neo.Fixed8.Zero;
                utxoassets[asset]=utxoassets[asset].add(amount);
            }
        }
        if(HASH_CONFIG.ID_CGAS.compareTo(Neo.Uint160.parse(invoke.scriptHash))===0 && invoke.operation=="refund"){

        }
    }
    for (const key in utxoassets) {
        const amount = utxoassets[key]
        const assetstate = await queryAssetSymbol(key,invokes[0].network);
        expenses.push({
            symbol:assetstate.symbol,
            amount:amount.toString(),
            assetid:key
        })
    }
    for (const key in nep5assets) {
        const amount = nep5assets[key]
        const assetstate = await queryAssetSymbol(key,invokes[0].network);
        var v = 1;
        for (var i = 0; i < assetstate.decimals; i++) {
            v *= 10;
        }
        var intv = parseInt(amount.divide(v).toString());
        var smallv = parseInt(amount.mod(v).toString()) / v;

        expenses.push({
            symbol:assetstate.symbol,
            amount:(intv+smallv).toString(),
            assetid:key
        })
    }
    return {scriptHashs,descriptions,operations,arguments:argument,expenses,fee:fee.toString()}
}

var queryAssetSymbol=async(assetID:string,network:'TestNet'|'MainNet')=>
{
    assetID = assetID.replace('0x','');
    if(assetID.hexToBytes().length==20)
    {
        const group:InvokeReadGroup = {
          "group":[
                {
                    "scriptHash": assetID,
                    "operation": "symbol",
                    "arguments":[],
                    "network": network
                },
                {
                    "scriptHash": assetID,
                    "operation": "decimals",
                    "arguments": [],
                    "network": network
                }
            ]
        }
        const result = await invokeReadGroup(group);
        const stack:string = result['stack'];
        if(stack)
        {
            const symbol:string = ThinNeo.Helper.Bytes2String((stack[0]['value'] as string).hexToBytes());
            const decimals:number = parseInt(stack[1]['value']);
            return {symbol,decimals}; 
        }
    }
    if(assetID.hexToBytes().length==32)
    {
        let asset = {symbol:'',decimals:0};
        if(assetID===HASH_CONFIG.ID_NEO)
            asset.symbol='NEO'
        else if(assetID===HASH_CONFIG.ID_GAS)
            asset.symbol='GAS'
        else
        {
            const result = await Api.getAssetState(assetID);
            const names = result[name];
            for (var i in names)
            {
                asset.symbol = names[i].name;
            }
        }
        return asset;
    }
}

const getProvider=()=>
{
    return new Promise((resolve,reject)=>
    {
        let provider:Provider=
        {
            "compatibility":["TypeScript","JavaScript"],
            "extra":null,
            "name":"Teemo.NEO",
            "version":VERSION,
            "website":"https://teemo.nel.group"
        }
        resolve(provider);
    })
}

const getStorage=(data:GetStorageArgs)=>
{
    return new Promise<GetStorageOutput>((resolve,reject)=>
    {
        Api.getStorage(data.scriptHash,data.key)
        .then(result=>{
            if(result)
                resolve(result);
            else
                reject({type:'RPC_ERROR',description:"An RPC error occured when submitting the request"})
        })
        .catch(error=>{
            
            reject({type:'RPC_ERROR',description:"An RPC error occured when submitting the request",data:error})
        })
    })
}

const getPublicKey=()=>{
    return new Promise<GetPublickeyOutput>((resolve,reject)=>
    {
        let provider:GetPublickeyOutput=
        {address:storage.account.address,publickey:storage.account.pubkey.toHexString()}
        resolve(provider);
    })
}

const notifyInit=(title:string,domain:string,favIconUrl:string)=>{
    return new Promise((r,j)=>{        
        if(storage.domains.indexOf(domain)<0)
        {
            const notifyHeader:NotifyMessage = {
                header:{title,domain,icon:favIconUrl},
                lable:Command.getAccount
            }
            
            getBase64ByUrl(favIconUrl)
            .then(icon=>{
                notifyHeader.header.icon=icon;
                openNotify(notifyHeader)
                .then(result=>{
                    storage.domains.push(domain);
                    Storage_local.get('white_list')
                    .then(result=>{
                        let setData = result?result:{};                        
                        TaskManager.dappsMessage[domain]=setData[domain]={title,icon};
                        Storage_local.set('white_list',setData);
                        EventsOnChange(WalletEvents.CONNECTED,{address:storage.account.address,label:storage.account.walletName});
                    })
                    r()
                })
                .catch(error=>{
                    j(error);
                })
            })
        }
        else
        {
            r();
        }
    })
}

const showNotify = (title:string,msg:string,call?:(notificationIds:string)=>void) =>{
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'icon128.png',
        title: title,
        message: msg,
        isClickable:true,
    },(notificationIds:string)=>{
        call(notificationIds);
    });
}

/**
 * 通过正则获得url中的域名
 * @param Url url链接
 */
const getURLDomain=(Url:string)=>
{
    var durl=/http:\/\/([^\/]+)\//i;
    var durl2=/https:\/\/([^\/]+)\//i;
    var durl3=/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
    
    var arr = Url.match(durl);
    if(arr && arr.length>1)
        return arr[1].toString();
    arr = Url.match(durl2);
    if(arr && arr.length>1)
        return arr[1].toString();
    arr = durl3.exec(Url);
    if(arr && arr.length>0)
        return arr[0].toString();
    else
        return Url;
}

/**
 * 查询区块高度
 * @param data 查询区块信息的参数，blockHeight,network
 */
const getBlock=(data:GetBlockArgs)=>{
    return new Promise((resolve,reject)=>
    {
        Api.getBlock(data.blockHeight)
        .then(result=>{
            if(result)
                resolve(result);
            else
                reject({type:'RPC_ERROR',description:"An RPC error occured when submitting the request"})
        })
        .catch(error=>{
            
            reject({type:'RPC_ERROR',description:"An RPC error occured when submitting the request",data:error})
        })
    })
}

/**
 * 查询Application Log
 * @param data 
 */
const getApplicationLog=(data:GetApplicationLogArgs)=>{
    return new Promise((resolve,reject)=>
    {
        Api.getApplicationLog(data.txid)
        .then(result=>{
            if(result)
                resolve(result);
            else
                reject({type:'RPC_ERROR',description:"An RPC error occured when submitting the request"})
        })
        .catch(error=>{
            
            reject({type:'RPC_ERROR',description:"An RPC error occured when submitting the request",data:error})
        })
    })
}

/**
 * 查询交易信息
 * @param data 
 */
const getTransaction=(data:GetTransactionArgs)=>{
    return new Promise((resolve,reject)=>
    {
        Api.getrawtransaction(data.txid)
        .then(result=>{
            if(result)
                resolve(result);
            else
                reject({type:'RPC_ERROR',description:"An RPC error occured when submitting the request"})
        })
        .catch(error=>{
            
            reject({type:'RPC_ERROR',description:"An RPC error occured when submitting the request",data:error})
        })
    })
}

/**
 * 验证地址是否正确
 * @param address 
 */
const validateAddress=(address:string)=>{
    return new Promise((resolve,reject)=>
    {
        try {            
            var array: Uint8Array = Neo.Cryptography.Base58.decode(address);
            var check = array.subarray(21, 21 + 4); //

            var checkdata = array.subarray(0, 21);//
            var hashd = Neo.Cryptography.Sha256.computeHash(checkdata);//
            hashd = Neo.Cryptography.Sha256.computeHash(hashd);//
            var hashd = hashd.slice(0, 4);//    
            var checked = new Uint8Array(hashd);//

            var error = false;
            for (var i = 0; i < 4; i++)
            {
                if (checked[i] != check[i])
                {
                    error = true;
                    break;
                }
            }
            resolve(!error)
        } catch (error) {
            resolve(false);
        }
    })
}

/**
 * 将ScriptHash转换成Address
 * @param scriptHash 
 */
const getAddressFromScriptHash=(scriptHash:string)=>{
    return new Promise((resolve,reject)=>
    {
        try {   
            const addr = ThinNeo.Helper.GetAddressFromScriptHash(scriptHash.hexToBytes());
            resolve(addr);
        } catch (error) {
            reject({type:"MALFORMED_INPUT",description:'The input scriptHash is not right, scripthash'})
        }
    })
}

/**
 * 将hexstr转换成字符串
 * @param hexStr 
 */
const getStringFromHexstr=(hexStr:string)=>{
    return new Promise((resolve,reject)=>
    {
        try {   
            const value = ThinNeo.Helper.Bytes2String(hexStr.hexToBytes())
            resolve(value);
        } catch (error) {
            reject({type:"MALFORMED_INPUT",description:'The input hexStr is not right, hexStr'})
        }
    })
}

/**
 * 将hex转换成BigIngteger
 * @param hexStr 
 */
const getBigIntegerFromHexstr=(hexStr:string)=>{
    return new Promise((resolve,reject)=>
    {
        try {
            if(!hexStr)
                resolve('0');
            const value = Neo.BigInteger.fromUint8Array(hexStr.hexToBytes())
            resolve(value.toString());
        } catch (error) {
            reject({type:"MALFORMED_INPUT",description:'The input hexStr is not right, hexStr'})
        }
    })
}

/**
 * 反转 HexStr
 * @param hexStr 
 */
const reverseHexstr=(hexStr:string)=>{
    return new Promise((resolve,reject)=>
    {
        try {   
            const value = hexStr.hexToBytes().reverse().toHexString()
            resolve(value);
        } catch (error) {
            reject({type:"MALFORMED_INPUT",description:'The input hexStr is not right, hexStr'})
        }
    })
}

/**
 * 将资产精度转换到大整数
 * @param amount 
 * @param assetID 
 */
const getBigIntegerFromAssetAmount= async(params:GetBigIntegerFromAssetAmountArgs)=>{
    try {
        const data = await queryAssetSymbol(params.assetID,params.network);
        return parseFloat(params.amount).toFixed(data.decimals).replace('.','');
    } catch (error) {
        throw({type:"MALFORMED_INPUT",description:'The input hexStr is not right, hexStr'})
    }
}

/**
 * 将资产精度转换到Decimals
 * @param amount 
 * @param assetID 
 */
const getDecimalsFromAssetAmount= async(params:GetDecimalsFromAssetAmountArgs)=>{
    try {
        const data = await queryAssetSymbol(params.assetID,params.network);
        const bnum = new Neo.BigInteger(params.amount);
        var v = 1;
        for (var i = 0; i < data.decimals; i++) {
            v *= 10;
        }
        var intv = parseInt(bnum.divide(v).toString());
        var smallv = parseInt(bnum.mod(v).toString()) / v;
        return `${intv+smallv}`
    } catch (error) {
        throw({type:"MALFORMED_INPUT",description:'The input hexStr is not right, hexStr'})
    }
}

const getNamehashFromDomain=async(params:string)=>{
    try {
        return NNSTool.domainToHash(params).toArray().reverse().toHexString();
    } catch (error) {
        throw "";        
    }
}

var getAddressFromDomain=(params:DomainArgs)=>{
    return NNSTool.resolveData(params.domain)
}

var getDomainFromAddress=async(params:AddressArgs)=>{
    const invoke_credit_revoke:InvokeReadInput =  {
        "scriptHash": "960b41a05588d2f55acbc13a1e3aa464eec6fff5",
        "operation": "getCreditInfo",
        "arguments": [
            {"type":"Address","value":params.address},
        ],
        "network": params.network
    }
    const result = await invokeRead(invoke_credit_revoke);
    
    if(result.stack[0] != null){
        var stackarr = result[ "stack" ] as any[];
        let stack = ResultItem.FromJson(DataType.Array, stackarr).subItem[ 0 ].subItem
        var creditInfo = {
            namehash:stack[0].AsHexString(),
            fullDomainName:stack[1].AsString(),
            TTL:stack[2].AsInteger().toString(),
        }
        return creditInfo;
    }
    else
    {
        return {namehash:'',fullDomainName:'',TTL:''}
    }
}

/**
 * 处理请求并返回
 * @param sender An object containing information about the script context that sent a message or request.
 * @param request 请求数据
 */
const responseMessage =(sender:chrome.runtime.MessageSender,request:any)=>
{
    const {ID,command,params}=request;
    const tab = sender.tab;
    const title = sender.tab.title;
    const domain = getURLDomain(tab.url)
    const header={title,domain,icon:tab.favIconUrl};
    if(Storage_local.getAccount().length<1)
    {
        const lang = localStorage.getItem('language');
        const titles:Array<string> = (!lang||lang=='zh')?['未检测到钱包','请先创建或导入钱包']:['Wallet not detected.', 'Please create or import a wallet first. ']
        showNotify(titles[0],titles[1]);
        const error = {type:'CONNECTION_DENIED',description:'No account response to current dapp request '}
        chrome.tabs.sendMessage(tab.id, {
            return:command,ID,error
        });
        return;
    }
    const network = params?(params['group']?params['group'][0]['network']:params['network']):undefined;
    if(network && network!=storage.network)
    {
        const error = {type:'MALFORMED_INPUT',description:'The network is not a valid network'}
        chrome.tabs.sendMessage(tab.id, {
            return:command,ID,error
        });
        return;
    }
    notifyInit(title,domain,tab.favIconUrl)
    .then(()=>{
        switch (command) {
            case Command.getAccount:
                sendResponse(getAccount());
                break;
            case Command.getProvider:
                sendResponse(getProvider());
                break;        
            case Command.getNetworks:
                sendResponse(getNetworks());
                break;
            case Command.getPublicKey:
                sendResponse(getPublicKey());
                break;
            case Command.send:
                sendResponse(send(header,params))
                break;
            case Command.getBalance:
                sendResponse(getBalance(params));
                break;
            case Command.getStorage:
                sendResponse(getStorage(params));
                break;
            case Command.invokeRead:
                sendResponse(invokeRead(params));
                break;
            case Command.invoke:
                sendResponse(invoke(header,params));
                break;
            case Command.invokeReadGroup:
                sendResponse(invokeReadGroup(params));
                break;
            case Command.invokeGroup:
                sendResponse(invokeGroup(header,params));
                break;
            case Command.getBlock:
                sendResponse(getBlock(params));
                break;
            case Command.getTransaction:
                sendResponse(getTransaction(params));
                break;
            case Command.getApplicationLog:
                sendResponse(getApplicationLog(params));
                break;
            case Command.TOOLS_validateAddress:
                sendResponse(validateAddress(params));
                break;
            case Command.TOOLS_reverseHexstr:
                sendResponse(reverseHexstr(params));
                break;
            case Command.TOOLS_getStringFromHexstr:
                sendResponse(getStringFromHexstr(params));
                break;
            case Command.TOOLS_getDecimalsFromAssetAmount:
                sendResponse(getDecimalsFromAssetAmount(params));
                break;
            case Command.TOOLS_getBigIntegerFromHexstr:
                sendResponse(getBigIntegerFromHexstr(params));
                break;
            case Command.TOOLS_getBigIntegerFromAssetAmount:
                sendResponse(getBigIntegerFromAssetAmount(params));
                break;
            case Command.TOOLS_getAddressFromScriptHash:
                sendResponse(getAddressFromScriptHash(params));
                break;
            case Command.NNS_getAddressFromDomain:
                sendResponse(getAddressFromDomain(params));
                break;
            case Command.NNS_getDomainFromAddress:
                sendResponse(getDomainFromAddress(params));
                break;
            case Command.NNS_getNamehashFromDomain:
                sendResponse(getNamehashFromDomain(params));
                break;
            default:
                sendResponse(new Promise((r,j)=>j({type:"NO_PROVIDER",description:"Could not find an instance of the dAPI in the webpage"})))
                break;
        }
    })
    const sendResponse=(result:Promise<any>)=>
    {
        result
        .then(data=>{
            chrome.tabs.sendMessage(tab.id, {
                return:command,
                ID,data
            });  
        })
        .catch(error=>{
            chrome.tabs.sendMessage(tab.id, {
                return:command,
                ID,error
            });  
        })
    }
}

/**
 * 监听
 */
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {        
        //初始化鼠标随机方法
        if(request.command)
            responseMessage(sender,request);
    }
);

enum ConfirmType
{
    tranfer,    // 确认交易是否成功
    contract,   // 确认合约是否成功，等待notify
    toClaimgas, // Claim GAS前的自己转自己NEO的交易
    claimgas,   // 确认claimgas的交易
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
    network:"TestNet" | "MainNet";
    currentAddr:string;
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
        this.network = storage.network;
        this.currentAddr = storage.account.address;
        this.message = messgae;
        this.startTime = new Date().getTime();
    }
}

class TransferGroup
{
    txid:string;
    txhex:string;
    executeError?:{type:string,data:string,description:string}
    static update(tran:TransferGroup,network?:'TestNet'|'MainNet'){        
        Api.sendrawtransaction(tran.txhex,network)
        .then(result=>{
            if(result['data'])
            {
                TaskManager.shed[tran.txid].state = TaskState.watting;                
            }
            else
            {
                TaskManager.shed[tran.txid].state = TaskState.fail;
                TaskManager.shed[tran.txid].next.executeError={
                    type:"RPC_ERROR",
                    description:result[0].errorMessage,
                    data:tran.txhex
                }
            }
            Storage_local.set(TaskManager.table,TaskManager.shed);
            
        })
        .catch(error=>{
            TaskManager.shed[tran.txid].state = TaskState.fail;
            TaskManager.shed[tran.txid].next.executeError={
                type:"RPC_ERROR",
                description:error,
                data:tran.txhex
            }
            Storage_local.set(TaskManager.table,TaskManager.shed);
        })
    }
}

interface InvokeHistory
{
    domain: string;
    scriptHashs: string[];
    descripts: string[];
    expenses: {assetid:string,symbol:string,amount:string}[];
    netfee: string;
}

class TaskManager{

    public static shed :{[txid:string]:Task} = {};

    public static invokeHistory: {[txid:string]:InvokeHistory} = {};

    public static sendHistory:{[txid:string]:SendArgs}={};

    public static dappsMessage:{[txid:string]:{title:string,icon:string}}={};

    public static table:string = "Task-Manager-shed";

    public static socket = new SocketManager();

    public static blockDatas=[{
        blockHeight:-1,
        blockTime:0,
        blockHash:'',
        timeDiff:0
      }]

    public static start()
    {
        chrome.storage.local.get([this.table,'invoke-data','send-data','white_list'],item=>{
            this.shed=item[this.table]?item[this.table]:{};
            this.invokeHistory=item['invoke-data']?item['invoke-data']:{};
            this.sendHistory=item['send-data']?item['send-data']:{};
            this.dappsMessage=item['white_list']?item['white_list']:{};
        })
        // this.updateBlock();
        this.socket.socketInit();
        this.socket.updateLastWSmsgSec()
    }
    
    public static get webSocketURL(){
        if(storage.network=='MainNet') return 'wss://testws.nel.group/ws/mainnet'
        else return 'wss://testws.nel.group/ws/testnet'
    }

    public static addSendData(txid:string,data:SendArgs)
    {
        queryAssetSymbol(data.asset,data.network)
        .then(assetState=>{
            this.sendHistory[txid]=data;
            this.sendHistory[txid]['symbol']=assetState.symbol;
            Storage_local.set('send-data',this.sendHistory);
        })
    }

    public static addInvokeData(txid:string,domain:string,data:InvokeArgs|InvokeArgs[])
    {
        const invokeArgs = Array.isArray(data)?data:[data];
        invokeArgsAnalyse(...invokeArgs)
        .then(result=>{
            const message:InvokeHistory={
                domain:domain,
                scriptHashs:result.scriptHashs,
                descripts:result.descriptions,
                expenses:result.expenses,
                netfee:result.fee,
            }
            this.invokeHistory[txid]=message;
            Storage_local.set('invoke-data',this.invokeHistory);
        })
    }

    public static InvokeDataUpdate(){
        Storage_local.set('invoke-data',this.invokeHistory);
    }

    public static addTask(task:Task)
    {
        this.shed[task.txid]=task;
        Storage_local.set(this.table,this.shed);
        const count = storage.accountWaitTaskCount[task.currentAddr]?storage.accountWaitTaskCount[task.currentAddr]:0;
        storage.accountWaitTaskCount[task.currentAddr]=count+1;
    }

    public static initShed()
    {
        return new Promise((resolve,reject)=>{
            chrome.storage.local.get([this.table,'invoke-data','send-data'],item=>{
                this.shed=item[this.table]?item[this.table]:{};
                this.invokeHistory=item['invoke-data']?item['invoke-data']:{};
                this.sendHistory=item['send-data']?item['send-data']:{};
                resolve();
            })
        })
    }

    public static update()
    {
        for ( const key in this.shed) 
        {
            const task = this.shed[key];
            if(task.state==TaskState.watting && task.network==storage.network)
            {
                if(task.type===ConfirmType.tranfer){
                    Api.getrawtransaction(task.txid,task.network)
                    .then(result=>{
                        if(result['blockhash'])
                        {      
                            task.state = TaskState.success;
                            this.shed[key]=task;
                            Storage_local.set(this.table,this.shed);
                            TaskNotify(task);
                            const count = storage.accountWaitTaskCount[task.currentAddr]?storage.accountWaitTaskCount[task.currentAddr]:0;
                            storage.accountWaitTaskCount[task.currentAddr]=count-1;
                            if(task.next)
                            {
                                TransferGroup.update(task.next,task.network);
                            }
                        }
                    })
                    .catch(error=>{
                        console.log(error);
                    })
                }
                else if(task.type==ConfirmType.toClaimgas)
                {
                    Api.getrawtransaction(task.txid,task.network)
                    .then(result=>{                        
                        if(result['blockhash'])
                        {
                            task.state = TaskState.success;
                            this.shed[key]=task;
                            Storage_local.set(this.table,this.shed);
                            const count = storage.accountWaitTaskCount[task.currentAddr]?storage.accountWaitTaskCount[task.currentAddr]:0;
                            storage.accountWaitTaskCount[task.currentAddr]=count-1;
                            if(storage.account && storage.account.address == task.message)
                            {
                                try {
                                    claimGas(task.network);
                                } catch (error) {                                    
                                    localStorage.setItem('Teemo-claimgasState-'+task.network,'');
                                }
                            }
                            else
                            {
                                localStorage.setItem('Teemo-claimgasState-'+task.network,'');
                            }
                        }
                    })
                    .catch(error=>{
                        console.log(error);
                    })
                }
                else if(task.type==ConfirmType.claimgas)
                {
                    Api.getrawtransaction(task.txid,task.network)
                    .then(result=>{                        
                        if(result['blockhash'])
                        {
                            TaskNotify(task);
                            const count = storage.accountWaitTaskCount[task.currentAddr]?storage.accountWaitTaskCount[task.currentAddr]:0;
                            storage.accountWaitTaskCount[task.currentAddr]=count-1;
                            task.state = TaskState.success;
                            this.shed[key]=task;
                            Storage_local.set(this.table,this.shed);                            
                            localStorage.setItem('Teemo-claimgasState-'+task.network,'');
                        }
                    })
                    .catch(error=>{
                        console.log(error);
                    })
                }
                else if(task.type==ConfirmType.contract)
                {
                    Api.getrawtransaction(task.txid,task.network)
                    .then(result=>{
                        if(result['blockhash'])
                        {
                            TaskNotify(task);
                            const count = storage.accountWaitTaskCount[task.currentAddr]?storage.accountWaitTaskCount[task.currentAddr]:0;
                            storage.accountWaitTaskCount[task.currentAddr]=count-1;
                            task.state = TaskState.success;
                            this.shed[key]=task;
                            Storage_local.set(this.table,this.shed);
                            if(task.next)
                            {
                                TransferGroup.update(task.next,task.network);
                            }
                        }
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

var cleanHistory=()=>
{
    const address:string = storage.account.address
    for (const txid in TaskManager.shed) {
        if (TaskManager.shed.hasOwnProperty(txid)) {
            const task:TaskHistory = TaskManager.shed[txid];
            if(task.currentAddr == address && task.state !== TaskState.watting && task.state !== TaskState.watForLast)
            {
                delete TaskManager.shed[txid];
            }
        }
    }
    Storage_local.set(TaskManager.table,this.shed);
}

var cleanTaskForAddr=(address:string)=>{
    for (const txid in TaskManager.shed) {
        if (TaskManager.shed.hasOwnProperty(txid)) {
            const task:TaskHistory = TaskManager.shed[txid];
            if(task.currentAddr == address)
            {
                delete TaskManager.shed[txid];
            }
        }
    }
    Storage_local.set(TaskManager.table,this.shed);
}

var getClaimGasAmount= async()=>{
    let claims:Neo.Fixed8;
    let noclaims:Neo.Fixed8;
    try {
        const result = await Api.getclaimgas(storage.account.address,0,1,0);
        claims = Neo.Fixed8.parse(result[0]["gas"].toString());
    } catch (error) {
        claims=Neo.Fixed8.Zero;
    }
    try {
        const result = await Api.getclaimgas(storage.account.address,1,1,0);
        noclaims = Neo.Fixed8.parse(result[0]['gas'].toString());
    } catch (error) {
        noclaims=Neo.Fixed8.Zero;
    }
    let sum = claims.add(noclaims).toString()
    return sum;
}

var getClaimGasState=()=>{
    const state = localStorage.getItem('Teemo-claimgasState-'+storage.network);
    return state?state:'';
}

var doClaimGas=async()=>{
    const network = storage.network;
    const neoutxo = await MarkUtxo.getUtxoByAsset(HASH_CONFIG.ID_NEO);
    if(neoutxo)
    {
        let sum = Neo.Fixed8.Zero;
        const tran = new Transaction();
        for (const utxo of neoutxo) {            
            const input = new ThinNeo.TransactionInput();
            input.hash = utxo.txid.hexToBytes().reverse();
            input.index = utxo.n;
            input.addr = utxo.addr;
            sum = sum.add(utxo.count);
            tran.inputs.push(input);
            tran.marks.push(new MarkUtxo(utxo.txid,utxo.n));
        }
        
        const output = new ThinNeo.TransactionOutput();
        const assetId: Uint8Array = neoutxo[0].asset.hexToBytes().reverse();
        output.assetId = assetId;
        output.value = sum;
        output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(storage.account.address);
        tran.outputs.push(output); 
        const result = await transactionSignAndSend(tran)
        TaskManager.addTask(new Task(ConfirmType.toClaimgas,result.txid,undefined,TaskState.watting,storage.account.address));
        localStorage.setItem('Teemo-claimgasState-'+storage.network,'wait')
    }
    else
    {
        try {
            if(storage.account && storage.account.address)
            {
                claimGas(network);
            }
        } catch (error) {
            localStorage.setItem('Teemo-claimgasState-'+storage.network,'')
        }
    }
}

const claimGas=async(network:'TestNet'|'MainNet')=>{
    var address = storage.account.address
    let claimresult = await Api.getClaimgasUtxoList(address, 1,0,0,network);
    let claims = claimresult[0]["list"] as Claim[];
    let sum = Neo.Fixed8.Zero;
    // const amount = Neo.Fixed8.parse(claimsAmount[0]["gas"].toFixed(8))

    // console.log('claime utxo 获得时间: '+new Date().getTime(),claimresult);
    var tran = new Transaction(ThinNeo.TransactionType.ClaimTransaction);
    //交易类型为合约交易
    tran.type = ThinNeo.TransactionType.ClaimTransaction;
    tran.version = 0;//0 or 1
    tran.extdata = new ThinNeo.ClaimTransData(); //JSON.parse(JSON.stringify(claims));
    (tran.extdata as ThinNeo.ClaimTransData).claims = []
    for (const claim of claims)
    {
        var input = new ThinNeo.TransactionInput();
        input.hash = (claim.txid).hexToBytes().reverse();
        input.index = claim.n;
        input["_addr"] = claim.addr;
        sum = sum.add(Neo.Fixed8.parse(claim.gas.toString()));
        (tran.extdata as ThinNeo.ClaimTransData).claims.push(input);
    }
    var output = new ThinNeo.TransactionOutput();
    output.assetId = (HASH_CONFIG.ID_GAS).hexToBytes().reverse();
    output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(address)
    // output.value = amount;
    output.value = sum;
    tran.outputs = [];
    tran.outputs.push(output);
    try {
        const result = await transactionSignAndSend(tran,network)
        const task = new Task(ConfirmType.claimgas,result.txid);
        task.network=network;
        TaskManager.addTask(task);
        const sendMsg:SendArgs ={fromAddress:address,toAddress:address,amount:sum.toString(),asset:HASH_CONFIG.ID_GAS,network:network,remark:'提取GAS',fee:'0'};
        TaskManager.addSendData(result.txid,sendMsg)
        localStorage.setItem('Teemo-claimgasState-'+network,'wait')
        return result
    } catch (error) {
        localStorage.setItem('Teemo-claimgasState-'+network,'');
        
        const lang = localStorage.getItem('language');
        if(!lang||lang=='zh')
        {
            showNotify("提取失败","提取失败，请稍后再试。")
        }
        else
        {
            showNotify("Claim failed","Claim failed,try again later.")
        }
    }
}

interface Claim
{
    addr: string;//"ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s"
    asset: string;//"0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b"
    claimed: boolean;//""
    createHeight: number;//1365554
    n: number;//0
    txid: string;//"0x90800a9dde3f00b61e16a387aa4a2ea15e4c7a4711a51aa9751da224d9178c64"
    useHeight: number;//1373557
    used: string;//"0x47bf58edae75796b1ba4fd5085e5012c3661109e2e82ad9b84666740e561c795"
    value: number;//"1"
    gas:number;
}

class AssetManager{
    testAssetInfo : AssetInfo[] = [];
    mainAssetInfo : AssetInfo[] = [];
    get allAssetInfo(){
        return storage.network=='MainNet'?this.mainAssetInfo:this.testAssetInfo;
    }
    set allAssetInfo(arr: AssetInfo[])
    {
        if(storage.network=="MainNet")
        {
            this.mainAssetInfo=arr;
        }
        if(storage.network=="TestNet")
        {
            this.testAssetInfo=arr;
        }
    }
    
    async initAllAseetInfo(){
        const nep5Assets:Nep5AssetInfo[] = await Api.getallnep5asset();
        const allassets:UtxoAssetInfo[] = await Api.getallasset();
        this.allAssetInfo=[];
        for (const asset of allassets) {
            let assetInfo = {} as AssetInfo;
            assetInfo.assetid = asset.id.replace('0x','');
            assetInfo.decimals = asset.precision;
            assetInfo.type='utxo';
            if(assetInfo.assetid == HASH_CONFIG.ID_GAS)
                assetInfo.symbol='GAS';
            else if(assetInfo.assetid == HASH_CONFIG.ID_NEO)
                assetInfo.symbol='NEO';
            else
                assetInfo.symbol=asset.name[asset.name.length-1].name;
            assetInfo.name=assetInfo.symbol;
            this.allAssetInfo.push(assetInfo);
        }
        for (const nep5 of nep5Assets) {
            let assetInfo = {} as AssetInfo;
            assetInfo.assetid = nep5.assetid.replace('0x','');
            assetInfo.decimals = nep5.decimals;
            assetInfo.type='nep5';
            assetInfo.symbol=nep5.symbol?nep5.symbol:(nep5.name?nep5.name:'');
            assetInfo.name=nep5.name;
            this.allAssetInfo.push(assetInfo);
        }
        return true;
    }

    /**
     * 模糊搜索资产
     * @param value 搜索值，资产名称或者id
     */
    queryAsset(value:string)
    {
        // 筛选名字或者id包含搜索值的结果(id 忽略 0x)
        return this.allAssetInfo.filter(
            asset=>
            {
                // console.log(asset);
                try {    
                    const result = asset.symbol.toUpperCase().indexOf(value.toUpperCase())>=0;
                    return result;
                } catch (error) {
                    console.log(error);
                    
                    return false;
                }
            }
        )
        .sort((a,b)=>{return a.symbol.toUpperCase().indexOf(value.toUpperCase())-b.symbol.toUpperCase().indexOf(value.toUpperCase())})
    }

    saveAsset(assets:string[])
    {
        localStorage.setItem('Teemo-assetManager-'+storage.network+storage.account.address,assets.join('|'));
    }

    /**
     * 根据资产id添加资产
     * @param assetID 资产id
     */
    addAsset(assetID:string)
    {
        const assetids =  localStorage.getItem('Teemo-assetManager-'+storage.network+storage.account.address);
        const list = assetids? assetids.split('|'):[];
        list.push(assetID);
        const arr = list.filter((element,index,self)=>self.indexOf(element)===index);
        localStorage.setItem('Teemo-assetManager-'+storage.network+storage.account.address,list.join('|'));
    }

    /**
     * 根据资产id删除资产
     * @param assetID 资产id
     */
    deleteAsset(assetID:string)
    {
        const assetids =  localStorage.getItem('Teemo-assetManager-'+storage.network+storage.account.address);
        const list = assetids? assetids.split('|'):[];
        const arr = list.filter((element)=>element!=assetID);
        localStorage.setItem('Teemo-assetManager-'+storage.network+storage.account.address,JSON.stringify(arr));
    }

    /**
     * 获得用户拥有的资产列表
     */
    getMyAsset()
    {
        const assetids =  localStorage.getItem('Teemo-assetManager-'+storage.network+storage.account.address);
        return this.allAssetInfo.filter(asset=>assetids.includes(asset.assetid));
    }

}

var assetManager = new AssetManager();
assetManager.initAllAseetInfo();


const BLOCKCHAIN = 'NEO';
const VERSION = 'v1.2.0';

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
    invokeGroup="invokeGroup",
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
  READY = 'READY',
  ACCOUNT_CHANGED = 'ACCOUNT_CHANGED',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  NETWORK_CHANGED = 'NETWORK_CHANGED',
}

interface GetBigIntegerFromAssetAmountArgs
{
    amount:string;
    assetID:string;
    network:'MainNet'|'TestNet';
}

interface GetDecimalsFromAssetAmountArgs
{
    amount:string;
    assetID:string;
    network:'MainNet'|'TestNet';
}

/**
 * @param {number} blockHeight 区块高度
 * @param {string} network 网络
 */
interface GetBlockArgs{
    blockHeight:number;  // 区块高度
    network:string // 网络
}

interface GetTransactionArgs{
    txid:string;
    network:string;
}

interface GetApplicationLogArgs{
    txid:string;
    network:string;
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
    extra?: {
        theme: string,
        currency: string,
    };
}

interface GetPublickeyOutput{
    address:string,
    publickey:string
}

interface DomainArgs{
    domain:string;
    network:'MainNet'|'TestNet'
}

interface AddressArgs{
    address:string;
    network:'MainNet'|'TestNet'
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
            item.data = ((value as string)).hexToBytes()
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
        return this.data.reverse().toHexString();
    }
    public AsString(): string
    {
        if (this.data.length === 1 && this.data[0] === 0)
            return "";
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

var getHistoryList=()=>{
    const list:TaskHistory[] = [];
    if(!storage.account){
        return list;
    }
    for (const txid in TaskManager.shed) {
        if (TaskManager.shed.hasOwnProperty(txid)) {
            const task:TaskHistory = TaskManager.shed[txid];
            if(task.network==storage.network && task.currentAddr==storage.account.address)
            {
                const sendHistory = TaskManager.sendHistory[txid];
                const invokeHistory = TaskManager.invokeHistory[txid];
                let dappMessage=undefined;
                if(task.type==ConfirmType.contract && invokeHistory)
                {
                    dappMessage = TaskManager.dappsMessage[invokeHistory.domain];
                    task['dappMessage']=dappMessage;
                    task['invokeHistory']=invokeHistory;
                    list.push(task);
                }
                else if(task.type==ConfirmType.tranfer && sendHistory)
                {
                    task['sendHistory']=sendHistory;
                    list.push(task);
                }
                else if(task.type==ConfirmType.claimgas)
                {
                    task['sendHistory']=sendHistory;
                    list.push(task);
                }
            }
        }
    }
    return list;
}

interface TaskHistory extends Task{
    dappMessage?:{icon:string,title:string};
    invokeHistory?:InvokeHistory;
    sendHistory?:SendArgs;
}

class NNSTool
{
    static readonly baseContract = Neo.Uint160.parse("348387116c4a75e420663277d9c02049907128c7");

    static async resolveData(domain: string)
    {
        
        var scriptaddress = this.baseContract;
        let nnshash = this.domainToHash(domain).toArray().reverse().toHexString();
        const res =await invokeReadGroup({
            group:[
                {
                    scriptHash:scriptaddress.toString(),
                    operation:"resolve",
                    arguments:[
                        {type:"String",value:"addr"},
                        {type:'ByteArray',value:nnshash},
                        {type:"String",value:""}
                    ],
                    network:"TestNet"
                },
                {
                    scriptHash:scriptaddress.toString(),
                    operation:'getOwnerInfo',
                    arguments:[
                        {type:'ByteArray',value:nnshash}
                    ],
                    network:"TestNet"
                }
            ]
        })
        
        var state = res['state'] as string;
        let addr = "";
        let ttl="";
        if (state.includes("HALT, BREAK"))
        {
            var stackarr = res[ "stack" ] as any[];
            let stack = ResultItem.FromJson(DataType.Array, stackarr);
            addr = stack.subItem[ 0 ].AsString();
            const ownerInfo=stack.subItem[1].subItem;
            ttl = ownerInfo[3].AsInteger().toString();
            // const resolver = ownerInfo[2].AsHash160().toString();
            // const register = ownerInfo[1].AsHash160().toString();
            // const owner = ownerInfo[0].AsHash160().toString();
        }
        return {address:addr,TTL:ttl};
    }

    /**
     * 域名转hash    
     * #region 域名转hash算法
     * 域名转hash算法
     * aaa.bb.test =>{"test","bb","aa"}
     * @param domain 域名
     */
    static nameHash(domain: string): Neo.Uint256
    {
        var domain_bytes = ThinNeo.Helper.String2Bytes(domain);
        var hashd = Neo.Cryptography.Sha256.computeHash(domain_bytes);
        return new Neo.Uint256(hashd);
    }

    /**
     * 子域名转hash
     * @param roothash  根域名hash
     * @param subdomain 子域名
     */
    static nameHashSub(roothash: Neo.Uint256, subdomain: string): Neo.Uint256
    {
        var bs: Uint8Array = ThinNeo.Helper.String2Bytes(subdomain);
        if (bs.length == 0)
            return roothash;

        var domain = Neo.Cryptography.Sha256.computeHash(bs);
        var domain_bytes = new Uint8Array(domain);
        var domainUint8arry = domain_bytes.concat(new Uint8Array(roothash.bits.buffer));

        var sub = Neo.Cryptography.Sha256.computeHash(domainUint8arry);
        return new Neo.Uint256(sub);
    }

    /**
     * 返回一组域名的最终hash
     * @param domainarray 域名倒叙的数组
     */
    static nameHashArray(domainarray: string[]): Neo.Uint256
    {
        domainarray.reverse();
        var hash: Neo.Uint256 = NNSTool.nameHash(domainarray[0]);
        for (var i = 1; i < domainarray.length; i++)
        {
            hash = NNSTool.nameHashSub(hash, domainarray[i]);
        }
        return hash;
    }

    static domainToHash(domain: string): Neo.Uint256
    {
        return this.nameHashArray(domain.split("."));
    }

    static verifyDomain(domain)
    {
        //check domain valid
        var reg = /^(.+\.)(test|TEST|neo|NEO[a-z][a-z])$/;
        if (!reg.test(domain))
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    static verifyAddr(addr)
    {
        var reg = /^[a-zA-Z0-9]{34,34}$/
        if (!reg.test(addr))
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    static verifyNeoDomain(domain)
    {
        //check domain valid
        var reg = /^(.+\.)(neo|Neo)$/;
        if (!reg.test(domain))
        {
            return false;
        }
        else
        {
            return true;
        }
    }

}

var getAccountTaskState = (addr:string)=>{    
    const count = storage.accountWaitTaskCount[addr]?storage.accountWaitTaskCount[addr]:0;
    return count;
}