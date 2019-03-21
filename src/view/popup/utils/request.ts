import common from '../store/common';
import { join } from 'path';

interface IOpts {
    method:string, // 接口名
    params: any[], // 参数
    isGET?:boolean, // 是否是get 请求（默认请求是post）
    baseUrl?:string, // 如果是common 则 取 baseCommonUrl（默认 baseUrl）
    getAll?:boolean, // 是否获取所有返回结果
}

  const baseCommonUrl: string = "https://api.nel.group/api";
  const baseUrl: string = "https://apiwallet.nel.group/api";

const makeRpcPostBody = (method: string, params: any[]):string => {
  const body = {};
  body["jsonrpc"] = "2.0";
  body["id"] = 1;
  body["method"] = method;
  body["params"] = params;
  return JSON.stringify(body);
}

const makeRpcUrl=(url: string, method: string, params: any[])=>
{
  if (url[url.length - 1] != '/')
    url = url + "/";
  var urlout = url + "?jsonrpc=2.0&id=1&method=" + method + "&params="+JSON.stringify(params);
  return urlout;
}

export default async function request(opts: IOpts): Promise<any> {
  let url = [baseUrl,common.network].join('/');
  if (opts.baseUrl === 'common') {
    url = [baseCommonUrl,common.network].join('/')
  }
  const input = opts.isGET?makeRpcUrl(url,opts.method,opts.params):url;
  const init:RequestInit = opts.isGET ?{ method:'GET'}:{method: 'POST',body:makeRpcPostBody(opts.method,opts.params)};
  try {    
      const value = await fetch(input,init);
      const json = await value.json();
      if(json.result){      
        if(opts.getAll){
          return json
        }else{
          return json.result;
        }
      }
      else if(json.error["code"]===-1)
      {
        return null;
      }else{
        throw new Error(json.error);    
      }
  } catch (error) {
    throw error;    
  }
}
