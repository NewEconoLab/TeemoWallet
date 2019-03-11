/**
 * 交易记录组件
 */
/// <reference path="../../../../../src/lib/neo-thinsdk.d.ts" />
import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import Transfer from '../transfer';
import QrCodeBox from '../qrcode';
// import { neotools } from '../../utils/neotools';
import { observer } from 'mobx-react';
import { bg } from '../../utils/storagetools';
import common from '../../store/common';
import hashConfig from "../../../config/hash.config";
import Checkbox from '../../../components/Checkbox';

@observer
export default class ManageAsset extends React.Component<any, {}>
{
  constructor(props: any)
  {
    super(props);
  }
  public render()
  {
    return (
      <div className="manage-wrapper">
        <p className="tips-text">选择要显示在主页的token类型</p>
        <div className="search-asset">
          <input type="text" placeholder="请输入代币名称或哈希进行搜索" />
        </div>
        <div className="asset-list">
          <div className="title">资产列表</div>
          <div className="asset-panel">
            <div className="asset-name">
            <Checkbox text="优先确认交易（支付 0.001 GAS）" /></div>
            <div className="asset-amount">99999999.99999999</div>
          </div>
          <div className="asset-panel">
            <div className="asset-name">GAS</div>
            <div className="asset-amount">99999999.99999999</div>
          </div>
          <div className="asset-panel">
            <div className="asset-name">CGAS</div>
            <div className="asset-amount">99999999.99999999</div>
          </div>
          <div className="asset-panel">
            <div className="asset-name">NNC</div>
            <div className="asset-amount">99999999.99999999</div>
          </div>
        </div>
        
        <div className="manage-footer">
          <Button text="取消" size="adaptation" type="warn" />
          <Button text="保存" size="adaptation"  />
        </div>
      </div>
    );
  }
}
