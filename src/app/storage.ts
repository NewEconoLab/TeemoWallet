export interface LoginInfo
{    
    address: string;
    pubkey: Uint8Array;
    prikey: Uint8Array;
}

export class MyStorage
{
    public login:LoginInfo;
}