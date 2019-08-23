import { SendArgs } from "../../../../../../lib/background";

export interface InvokeHistory {
    domain: string;
    scriptHashs: string[];
    descripts: string[];
    expenses: { assetid: string, symbol: string, amount: string }[];
    netfee: string;
}

export interface IDeployHistory {
    domain: string;
    contractHash: string     // 合约hash
    description: string;     // 备注信息
    email: string;           // 邮件
    author: string;          // 作者
    version: string,        // 版本
    name: string;           // 名称
    call: boolean;           // 是否动态调用
    storage: boolean;        // 是否存储区
    sysfee: number;
    payment: boolean;        // 是否支持付费
}

export interface ISendHistory extends SendArgs {
    symbol?: string;
}

export interface IHistory extends Task {
    dappMessage?: { icon: string, title: string };
    invokeHistory?: InvokeHistory;
    sendHistory?: ISendHistory;
    deployHistory?: IDeployHistory
}

export interface IHistoryList {
    taskList: IHistory[];
    initHistoryList: () => void;
}

export interface Task {
    height?: number;
    confirm?: number;
    type: ConfirmType;
    txid: string;
    message?: any;
    state: TaskState;
    startTime: number;
    network: "TestNet" | "MainNet";
    currentAddr: string;
}

export enum TaskState {
    watting = 0,
    success = 1,
    fail = 2,
    watForLast = 3,
    failForLast = 4
}
export enum ConfirmType {
    tranfer,
    contract,
    toClaimgas, // Claim GAS前的自己转自己NEO的交易
    claimgas,   // 确认claimgas的交易
    deploy,     // 部署合约
}
export interface TransferGroup {
    txid: string;
    txhex: string;
    executeError?: {
        type: string;
        data: string;
        description: string;
    };
}