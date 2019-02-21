import request from '../../utils/request';
/**
 * 获取nep5的资产（CGAS）
 */
export const getnep5balanceofaddress =  (address:string,assetId:string) => {
  const opts = {
   method:'getnep5balanceofaddress',
   params:[
     assetId,
     address
   ],
   baseUrl:'common'
  }
  return request(opts);
}

/**
 * 
 * @param address 
 */
export const getregisteraddressbalance =  (address:string,register:string) => {
  // alert(DomainSelling.RootNeo.register.toString())
  const opts = {
   method:'getregisteraddressbalance',
   params:[
    address,
    register
   ]
  }
  return request(opts);
}

/**
 * 发送交易
 * @param data 交易数据
 */
export const sendrawtransaction =  (data:string) => {
  const opts = {
   method:'sendrawtransaction',
   params:[
    data
   ],
   baseUrl:'common'
  }
  return request(opts);
}

/**
 * 获得指定地址对应的utxo
 * @param address 地址
 */
export const getUtxo=(address:string)=>{
  const opts={
    method:"getutxo",
    params:[
      address
    ],
    baseUrl:'common'
  }
  return request(opts);
}


/**
 * 获得指定地址对应的utxo
 * @param address 地址
 */
export const getDomainInfo=(domain:string)=>{
  const opts={
    method:"getdomaininfo",
    params:[
      domain
    ]
  }
  return request(opts);
}

/**
 * 判断交易是否入链
 * @param txid 交易id
 */
export const hasTx=(txid:string)=>{
  const opts={
    method:"hastx",
    params:[
      txid
    ]
  }
  return request(opts);
}

/**
 * 判断合约调用是否抛出 notify
 * @param txid 交易id
 */
export const hasContract=(txid:string)=>{
  const opts={
    method:"hascontract",
    params:[
      txid
    ]
  }
  return request(opts);
}

/**
 * 判断双交易是否成功
 * @param txid 交易id
 */
export const getRehargeAndTransfer=(txid:string)=>{
  const opts={
    method:"getrechargeandtransfer",
    params:[
      txid
    ]
  }
  return request(opts);
}

export const getBlockCount=()=>{
  const opts={
    method:"getblockcount",
    params:[],
    baseUrl:"common"
  }
  return request(opts);
}

export const rechargeAndTransfer=(data1:string,data2:string)=>{
  const opts={
    method:"rechargeandtransfer",
    params:[
      data1,
      data2
    ]
  }
  return request(opts);
}
/**
 * @method 获得nep5资产信息
 * @param asset 资产id
 */
export const getnep5asset=(asset: string)=>{
  const opts={
    method:"getnep5asset",
    params:[
      asset
    ]
  }
  return request(opts);
}