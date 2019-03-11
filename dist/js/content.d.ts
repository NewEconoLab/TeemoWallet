declare function injectCustomJs(jsPath?: any): void;
declare function sendMsgTest(): void;
declare const sendMesageToBackground: (e: any) => Promise<void>;
declare enum WalletEventsName {
    READY = "Teemmo.NEO.READY",
    CONNECTED = "Teemmo.NEO.CONNECTED",
    DISCONNECTED = "Teemmo.NEO.DISCONNECTED",
    NETWORK_CHANGED = "Teemmo.NEO.NETWORK_CHANGED",
    ACCOUNT_CHANGED = "Teemmo.NEO.ACCOUNT_CHANGED"
}
declare function getBase64Image(img: any): string;
declare function getBase64ByUrl(url: string): Promise<string>;
//# sourceMappingURL=content.d.ts.map