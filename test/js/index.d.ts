/// <reference path="../inject.d.ts" />
declare class Main {
    getAccount_R: HTMLDivElement;
    address: string;
    name: string;
    constructor();
    start(): Promise<void>;
    /**
     * 获得网络配置
     */
    getNetworks(): Promise<{}>;
    /**
     * 获得账户信息
     */
    getAccount(): Promise<{}>;
    /**
     * 获得余额信息
     */
    getBalance(params: string): Promise<{}>;
    /**
     * 试运行合约（单操作）
     */
    invokeRead(params: string): Promise<{}>;
    /**
     * 试运行合约（多操作）
     */
    invokeReadGroup(params: string): Promise<{}>;
    /**
     * invoke 发送合约调用交易（单操作）
     */
    invoke(params: string): Promise<{}>;
    /**
     * invoke 发送合约调用交易（多操作）
     */
    invokeGroup(params: string): Promise<{}>;
}
//# sourceMappingURL=index.d.ts.map