import Axios from 'axios';
import common from '@/store/common';

interface IOpts {
  method:string, // 接口名
  params: any[], // 参数
  isGET?:boolean, // 是否是get 请求（默认请求是post）
  baseUrl?:string, // 如果是common 则 取 baseCommonUrl（默认 baseUrl）
  getAll?:boolean, // 是否获取所有返回结果
}

const baseCommonUrl: string = "https://api.nel.group/api";
const baseUrl: string = "https://apiwallet.nel.group/api";

console.log(baseCommonUrl);
console.log(baseUrl);


const makeRpcPostBody = (method: string, params: any): {} => {
    
  const body = {};
  body["jsonrpc"] = "2.0";
  body["id"] = 1;
  body["method"] = method;
  body["params"] = params;
  return body;
}
const defaultConfig = {
  headers:{
    'Content-Type':'application/json'
  }
}
export default function request(opts: IOpts): Promise<any> {
  let url = [baseUrl,common.network].join('/');
  if (opts.baseUrl === 'common') {
    url = [baseCommonUrl,common.network].join('/')
  }  
  const params = makeRpcPostBody(opts.method, opts.params);
  const args = {
    url,
    method: opts.isGET ? 'GET' : 'POST',
    [opts.isGET ? 'params' : 'data']: opts.method ? params : JSON.stringify(params),
    ...defaultConfig,
  }
  return new Promise((resolve, reject) => {
    Axios(args)
      .then((data: any) => {
        if(data.data.result) {
          if(opts.getAll) {
            resolve(data.data);
            return;
          }
          resolve(data.data.result);
          return;
        }
        else if(data.data.error["code"]===-1)
        {
          resolve(null);
        }
        reject(data.data.error);
      })
      .catch((err: any) => { reject(err) });
  });
}
