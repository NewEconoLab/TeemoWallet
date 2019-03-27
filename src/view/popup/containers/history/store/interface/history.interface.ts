import { SendArgs } from "../../../../../../lib/background";

export interface InvokeHistory
{
    domain: string;
    scriptHashs: string[];
    descripts: string[];
    expenses: {assetid:string,symbol:string,amount:string}[];
    netfee: string;
}

export interface ISendHistory extends SendArgs
{
    symbol?:string;
}

export interface IHistory extends Task{
    dappMessage?:{icon:string,title:string};
    invokeHistory?:InvokeHistory;
    sendHistory?:ISendHistory;
}

export interface IHistoryList{
    taskList:IHistory[];
    initHistoryList:()=>void;
}

export interface Task
{
    height?: number;
    confirm?: number;
    type: ConfirmType;
    txid: string;
    message?: any;
    state: TaskState;
    startTime: number;
    network:"TestNet" | "MainNet";
    currentAddr:string;
}

export enum TaskState
{
    watting = 0,
    success = 1,
    fail = 2,
    watForLast = 3,
    failForLast = 4
}
export enum ConfirmType
{
    tranfer = 0,
    contract = 1
}
export interface TransferGroup
{
    txid: string;
    txhex: string;
    executeError?: {
        type: string;
        data: string;
        description: string;
    };
}