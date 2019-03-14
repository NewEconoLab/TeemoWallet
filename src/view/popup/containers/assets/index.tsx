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
import ClaimGAS from './claimgas';
import classnames from 'classnames';
interface IProps
{
  lableChange: (table: string) => void
}
@observer
export default class Assets extends React.Component<IProps, {}>
{
  constructor(props: any)
  {
    super(props);
  }
  public state = {
    showNumber: 0,  // 0为不显示弹框，1为显示收款弹框，2为显示转账弹框
    assetData:null,
    balance: {
      neo: "加载中...",
      gas: "加载中...",
      cgas: "加载中...",
      nnc: "加载中..."
    },
    activeLable: "assets"
  }
  async componentDidMount()
  {
    // neotools.invokeTest();
    const params: BalanceRequest = {
      address: common.account.address,   // 你要查询的地址
      assets: [hashConfig.ID_NEO.replace('0x', ''), hashConfig.ID_GAS.replace('0x', ''), hashConfig.ID_CGAS.toString(), hashConfig.ID_NNC.toString()],
    }
    const data: GetBalanceArgs =
    {
      "network": "testnet",
      "params": [
        params
      ]
    }
    let result = await bg.getBalance(data);
    if (result)
    {
      this.initBalance(result);
      this.setState({
        assetData:result
      })
    }
  }
  // 初始化资产
  public initBalance(data: BalanceResults)
  {
    let neo = "0";
    let gas = "0";
    let cgas = "0";
    let nnc = "0";
    data[common.account.address].forEach((value, index) =>
    {
      switch (value.symbol)
      {
        case 'NEO':
          neo = value.amount;
          break;
        case 'GAS':
          gas = value.amount;
          break;
        case 'CGAS':
          cgas = value.amount;
          break;
        case 'NNC':
          nnc = value.amount;
          break;
      }
    })
    this.setState({
      balance: {
        neo: neo,
        gas: gas,
        cgas: cgas,
        nnc: nnc
      }
    })
  }
  // 弹出二维码框
  public onShowQrcode = () =>
  {
    this.setState({ showNumber: 1 })
  }
  // 关闭弹框
  public onCloseModel = () =>
  {
    this.setState({ showNumber: 0 });
  }
  // 弹出转账框
  public onShowTransfer = () =>
  {
    this.setState({ showNumber: 2 })
  }
  // 跳转到管理代币
  public showManage = () =>
  {
    this.setState({
      activeLable: "manage"
    })
    if (this.props.lableChange)
    {
      this.props.lableChange('manage');
    }
  }

  public render()
  {
    const loadClassName = classnames('asset-amount',{
      'loading-amount':!this.state.assetData?true:false
    });
    return (
      <div className="assets">
        <ClaimGAS />
        <div className="btn-list">
          <div className="address">
            <Button text="收款" size="adaptation" onClick={this.onShowQrcode} />
          </div>
          <div className="transfer">
            <Button text="转账" size="adaptation" onClick={this.onShowTransfer} />
          </div>
        </div>
        <div className="asset-list">
          <div className="title">资产列表</div>
          <div className="asset-panel">
            <div className="asset-name">NEO</div>
            <div className={loadClassName}>{this.state.balance.neo}</div>
          </div>
          <div className="asset-panel">
            <div className="asset-name">GAS</div>
            <div className={loadClassName}>{this.state.balance.gas}</div>
          </div>
          <div className="asset-panel">
            <div className="asset-name">CGAS</div>
            <div className={loadClassName}>{this.state.balance.cgas}</div>
          </div>
          <div className="asset-panel">
            <div className="asset-name">NNC</div>
            <div className={loadClassName}>{this.state.balance.nnc}</div>
          </div>
        </div>
        <p className="asset-p">没有你的代币？试试 <span className="asset-a" onClick={this.showManage}>管理代币</span></p>
        <QrCodeBox show={this.state.showNumber === 1} onHide={this.onCloseModel} />
        <Transfer show={this.state.showNumber === 2} onHide={this.onCloseModel} />
      </div>
    );
  }
}
