import { MyStorage } from "../app/storage";

declare interface Background extends Window{
    storage:MyStorage,
    getBalance: (data: GetBalanceArgs) => Promise<BalanceResults>
    mytest:(data:Uint8Array)=>void;
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
