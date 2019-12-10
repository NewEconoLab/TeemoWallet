/**
 * 合约交互 组件
 */
import * as React from 'react';
// import { injectIntl } from 'react-intl';
import './index.less';
import Checkbox from '../../../components/Checkbox';
import { Storage_local } from '../../../../common/util';
import { Background, SendArgs, BalanceRequest } from '../../../../lib/background';
import { bg } from '../../../popup/utils/storagetools';
import intl from '../../../popup/store/intl';
import { ICON } from '../../../image';
import { observer } from 'mobx-react';
import common from '../../store/common';
import { HASH_CONFIG } from '../../../config';
// import { observer } from 'mobx-react';

interface IProps {
  title: string,
  domain: string,
  data: any,
  address: string,
}
interface IState {
  pageNumber: number,
  data: any,
  toAddress: string,
  amount: string,
  systemFee: string,
  networkFee: string,
  assetSymbol: string,
  assetID: string,
  remark: string,
  network: 'TestNet' | 'MainNet';
  err: boolean;
}
@observer
export default class SendRequest extends React.Component<IProps, IState>
{
  public bg: Background = chrome.extension.getBackgroundPage() as Background;
  public state: IState = {
    pageNumber: 0, // 0为上一页，1为下一页
    data: null,
    toAddress: "",
    amount: "0",
    systemFee: '0',
    networkFee: '0',
    assetID: "",
    assetSymbol: "",
    remark: "",
    network: 'TestNet',
    err: false
  }
  public componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data
    }, () => {
      this.getRenderState();
    })
  }
  // 更新数据
  public getRenderState = () => {
    console.log(this.props.data);
    console.log(JSON.stringify(this.state.data))
    let sendData: SendArgs;
    if (this.state.data) {
      sendData = this.props.data;
      this.initData(sendData);
    }
  }

  // 初始化state
  public initData = async (sendData: SendArgs) => {
    if (sendData.asset) {
      this.setState({
        assetID: sendData.asset,
        toAddress: sendData.toAddress,
        networkFee: sendData.networkFee ? sendData.networkFee : '0',
        systemFee: sendData.systemFee ? sendData.systemFee : '0',
        amount: sendData.amount,
        remark: sendData.remark ? sendData.remark : '',
        network: sendData.network ? sendData.network : 'TestNet'
      })
      if (sendData.asset == HASH_CONFIG.ID_GAS) {
        const params: BalanceRequest = {
          "assets": [ HASH_CONFIG.ID_GAS ],
          "address": this.props.address
        }
        const result = await bg.getBalance({ params, "network": sendData.network })
        const balances = result[ this.props.address ];
        if (balances) {
          const balance = balances.find(balance => balance.assetID == HASH_CONFIG.ID_GAS)
          const count = parseFloat(sendData.amount) + parseFloat(sendData.networkFee) + parseFloat(sendData.systemFee);
          if (count > parseFloat(balance.amount)) {
            common.errorChange(true);
          }
        }
        else {
          common.errorChange(true);
        }
      }
      else {
        const params: BalanceRequest = {
          "assets": [ sendData.asset, HASH_CONFIG.ID_GAS ],
          "address": this.props.address
        }
        const result = await bg.getBalance({ params, "network": sendData.network })
        const balances = result[ this.props.address ];
        const gasbalance = balances.find(balance => balance.assetID == HASH_CONFIG.ID_GAS)
        const assetbalance = balances.find(balance => balance.assetID == sendData.asset);
        const fee = parseFloat(sendData.networkFee) + parseFloat(sendData.systemFee);
        const amount = parseFloat(sendData.amount);
        if (fee > parseFloat(gasbalance.amount) || amount > parseFloat(assetbalance.amount)) {
          common.errorChange(true);
        }
      }
      const result = await bg.queryAssetSymbol(sendData.asset, sendData.network)
      console.log(result);

      this.setState({
        assetSymbol: result.symbol
      })
    }
  }

  // public netfeeChange = (check: boolean) => {
  //   Storage_local.set('checkNetFee', check);
  // }

  public nextPage = () => {
    this.setState({
      pageNumber: 1
    })
  }

  public previousPage = () => {
    this.setState({
      pageNumber: 0
    })
  }

  public render() {
    const assetHref = `https://scan.nel.group/${this.state.network == 'TestNet' ? 'neo3' : 'main'}/asset/`;
    return (
      <div className="ncontract-wrap">
        <div className="first-line">
          {intl.message.history.from + " " + this.props.domain}
        </div>
        <div className="second-line">
          {intl.message.assets.transfer}
        </div>
        {/* <div className="second-line">
          请求签名 
        </div> */}
        {
          this.state.pageNumber === 0 && (
            <>
              <div className="contract-title">{intl.message.notify.tranInfo}</div>
              <div className="transaction-wrap white-wrap">
                <div className="line-wrap">
                  <div className="line-left">{intl.message.notify.toAddress}</div>
                  <div className="line-right address">
                    {
                      this.state.toAddress
                    }
                  </div>
                </div>
                <div className="line-wrap">
                  <div className="line-left">{intl.message.history.amount}</div>
                  <div className="line-right">
                    <span>
                      {this.state.amount ? `${this.state.amount} ${this.state.assetSymbol}` : "0"}
                    </span>
                  </div>
                </div>
                <div className="line-wrap">
                  <div className="line-left">{intl.message.history.sysfee}</div>
                  <div className="line-right">
                    <span>{this.state.systemFee} GAS</span>
                  </div>
                </div>
                <div className="line-wrap">
                  <div className="line-left">{intl.message.history.netfee}</div>
                  <div className="line-right">
                    <span>{this.state.networkFee} GAS</span>
                  </div>
                </div>
              </div>
              <div className="contract-title">{intl.message.notify.dappNote}</div>
              <div className="remark-content white-wrap">
                {
                  this.state.remark
                }
              </div>
              <div className="previous-img" onClick={this.nextPage}>
                <img src={require('../../../image/previous.png')} alt="" />
              </div>
            </>
          )
        }
        {
          this.state.pageNumber === 1 && (
            <>
              <div className="contract-title">{intl.message.notify.tranData}</div>
              <div className="transaction-wrap white-wrap">
                <div className="line-wrap">
                  <div className="line-left">{intl.message.notify.AssetsID}</div>
                  <div className="line-right">
                    <a href={assetHref + this.state.assetID} target="_blank">
                      {this.state.assetID.substr(0, 4) + "..." + this.state.assetID.substr(this.state.assetID.length - 4, 4)}
                    </a>
                  </div>
                </div>
              </div>
              {/* <div className="transaction-content">
                <span>内容</span>
              </div> */}
              <div className="previous-img" onClick={this.previousPage}>
                <img src={require('../../../image/next.png')} alt="" />
              </div>
            </>
          )
        }
        {
          common.error &&
          <div className="error-message">
            <img src={ICON.attention} className="error-message-icon" />
            <div className="error-message-text">余额不足</div>
          </div>
        }
      </div>
    );
  }
}
// export default injectIntl(ContractRequest);