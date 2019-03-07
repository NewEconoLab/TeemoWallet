/// <reference path="../inject.d.ts" />
declare class Main {
    getAccount_R: HTMLDivElement;
    address: string;
    name: string;
    constructor();
    start(): Promise<void>;
    /**
     * 获得账户信息
     */
    getAccount(): Promise<{}>;
    /**
     * 获得余额信息
     */
    getBalance(params: string): Promise<{}>;
    invokeGroup(): Promise<{}>;
    invokeGroup2(): Promise<{}>;
    /**
     * invoke 发送交易
     */
    invoke(): Promise<{}>;
    testrun(): Promise<{}>;
    testRunGroup(): Promise<{}>;
}
//# sourceMappingURL=index.d.ts.map