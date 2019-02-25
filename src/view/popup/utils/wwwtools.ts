import request from './request';

/**
 * 获取资产
 */
export const getbalance = (address: string) =>
{
  const opts = {
    method: 'getbalance',
    params: [
        address
    ],
    baseUrl:'commom'
  }
  return request(opts);
}
