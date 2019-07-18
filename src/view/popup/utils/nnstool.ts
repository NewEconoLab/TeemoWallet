import { bg } from "./storagetools";

/**
 * @name NEONameServiceTool
 * @method initRootDomain_初始化根域名信息
 */
export class NNSTool
{
    static readonly baseContract = Neo.Uint160.parse("348387116c4a75e420663277d9c02049907128c7");

    static async resolveData(domain: string)
    {
        return new Promise<string>((r,j)=>{
            var scriptaddress = this.baseContract;
            let arr = domain.split(".");
            let nnshash = NNSTool.nameHashArray(arr);
            bg.invokeRead({
                scriptHash:scriptaddress.toString(),
                operation:"resolve",
                arguments:[
                    {type:"String",value:"addr"},
                    {type:"Hash256",value:nnshash.toString()},
                    {type:"String",value:""}
                ],
                network:"TestNet"
            })
            .then(res=>{
                var state = res['state'] as string;
                let addr = "";
                if (state.includes("HALT"))
                {
                    // info2.textContent += "Succ\n";
                    var stack = res['stack'] as any[];
                    //find name 他的type 有可能是string 或者ByteArray
                    if (stack[0].type == "ByteArray")
                    {
                        if (stack[0].value as string != "00")
                        {
                            let value = (stack[0].value as string).hexToBytes();
                            addr = ThinNeo.Helper.Bytes2String(value);
                        }
                    }
                }
                r(addr);
            })
            .catch(error=>{
                // console.log(error);                
                r("");
            })
        })
    }


    //解析域名完整模式
    static async resolveFull(protocol: string, nameArray: string[]) { }

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