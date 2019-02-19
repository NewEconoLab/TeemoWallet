
export class Result
{
    err: boolean;
    info: any;
}

export interface AccountInfo extends LoginInfo{
    nep2key:string;
    scrypt:ThinNeo.nep6ScryptParameters;
}

export interface LoginInfo
{
    pubkey: Uint8Array;
    prikey: Uint8Array;
    address: string;
}