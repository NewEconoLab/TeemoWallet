export interface NepAccount{
    walletName:string;
    address: string;
    nep2key:string;
    scrypt:ThinNeo.nep6ScryptParameters;
}

export enum NetWork{
    MainNet="MainNet",
    TestNet='TestNet'
}

export interface IAccountBalanceStore
{
    NEO:number;   // 当前账户NEO余额
    GAS:number;   // 当前账户GAS余额
    CGAS:number;  // 当前账户CGAS余额
    NNC:number;   // 当前账户NNC余额
    CNEO:number;  // 当前账户CNEO余额
}

export interface IAccountMessage{
    address:string;
    lable:string;
    pubkeyHex:string;
}

export interface ICommonStore {
    account:IAccountMessage,
    accountList:NepAccount[],
    claimGasAmount:string;
    network: string,
    balances:{[asset:string]:number},  // 账户余额的信息
    changeNetWork:(network:NetWork)=>Promise<NetWork>,
    // initAccountList:()=>void,
    initAccountInfo:()=>void,
    initAccountBalance:() => void, // 初始化账户余额
    initClaimGasAmount:() => void; // 初始化可提取的Gas金额
}