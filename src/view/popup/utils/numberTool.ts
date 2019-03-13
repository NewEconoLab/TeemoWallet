// 将数字转化为 1,234,567等形式
export function toThousands(num: string) {
    let result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
}

export function toFixed(number:number,fractionDigits:number)
{
    if(!isNaN(number))
    {
        const reg = new RegExp(`([0-9]+.[0-9]{${fractionDigits}})[0-9]*`);
        return parseFloat(number.toString().replace(reg,"$1"));
    }
    else
    {
        throw new Error("参数错误");
        
    }
}

/**
 * 快速将字符串转成对应的数组字符串
 * @param str 要转换的字符串
 * @param decimal 小数位数
 */
export function asNumber(str:string,decimal?:number)
{
    let value = str;
    // 先把非数字的都替换掉，除了数字和.

    value = value.replace(/[^\d.]/g,"");

    // 保证只有出现一个.而没有多个.

    value = value.replace(/\.{2,}/g,".");

    // 必须保证第一个为数字而不是.

    value = value.replace(/^\./g,"");

    // 保证.只出现一次，而不能出现两次以上

    value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");

    if(decimal)
    {
        const decstr = (new Array(decimal)).fill('\\d').join('');   // 快速创建对应含有多少个的\d 用于匹配位数
        // 只能输入两个小数
        const reg = new RegExp(`^(\-)*(\\d+)\.(${decstr}).*$`);
        value = value.replace(reg,'$1$2.$3');
    }
    
    return value;
}
