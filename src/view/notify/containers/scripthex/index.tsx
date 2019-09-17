/**
 * 合约交互 组件
 */
import * as React from 'react';
// import { injectIntl } from 'react-intl';
import './index.less';
import Checkbox from '../../../components/Checkbox';
import { Storage_local } from '../../../../common/util';
import { Background, SendScriptArgs, Argument } from '../../../../lib/background';
import intl from '../../../popup/store/intl';
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
  scriptHash: string;
  fee?: string;
  sysfee?: string;
  description?: string;
  network?: 'TestNet' | 'MainNet';
  arguments: Argument[];
}
// @observer
export default class SendScriptRequest extends React.Component<IProps, IState>
{
  public bg: Background = chrome.extension.getBackgroundPage() as Background;
  public state: IState = {
    pageNumber: 0, // 0为上一页，1为下一页
    data: null,
    scriptHash: "",
    fee: '0',
    sysfee: "0",
    description: "",
    network: 'TestNet',
    arguments: []
  }
  public componentWillReceiveProps(nextProps) {
    console.log("nextProps", nextProps);

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
    let sendData: SendScriptArgs;
    if (this.state.data) {
      sendData = this.props.data;
      this.initData(sendData);
    }
  }

  // 初始化state
  public initData = (sendData: SendScriptArgs) => {

    console.log(sendData);

    this.setState({
      sysfee: sendData.sysfee ? sendData.sysfee : '0',
      fee: sendData.fee ? sendData.fee : '0',
      description: sendData.description ? sendData.description : '',
      // network: sendData.network ? sendData.network : 'TestNet',
      scriptHash: sendData.scriptHash,
      arguments: sendData.scriptArguments,
    })
  }

  public netfeeChange = (check: boolean) => {
    Storage_local.set('checkNetFee', check);
  }

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
    return (
      <div className="ncontract-wrap">
        <div className="first-line">
          {intl.message.history.from + " " + this.props.domain}
        </div>
        <div className="second-line">
          {intl.message.history.contract}
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
                  <div className="line-left">系统费</div>
                  <div className="line-right">
                    <span>
                      {this.state.sysfee ? `${this.state.sysfee} GAS` : "0"}
                    </span>
                  </div>
                </div>
                {
                  parseFloat(this.state.fee) !== 0 && (
                    <div className="line-wrap">
                      <div className="line-left">{intl.message.history.fee}</div>
                      <div className="line-right">
                        <span>{this.state.fee} GAS</span>
                      </div>
                    </div>
                  )
                }
              </div>
              {
                parseFloat(this.state.fee) === 0 && (
                  <div className="check-fee">
                    <Checkbox text={intl.message.transfer.payfee} onClick={this.netfeeChange}></Checkbox>
                  </div>
                )
              }
              <div className="contract-title">{intl.message.notify.dappNote}</div>
              <div className="remark-content white-wrap">
                {
                  this.state.description
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
              {/* <div className="contract-title">交易数据</div> */}
              <div className="contract-title">{intl.message.notify.tranData}</div>

              <div className="transaction-wrap white-wrap">
                <div className="line-wrap">
                  <div className="line-left">{intl.message.notify.scriptHash}</div>
                  <div className="line-right">
                    {
                      this.state.scriptHash.length !== 0 &&
                      <a href="#">{this.state.scriptHash.replace(/^(.{4})(.*)(.{4})$/, '$1...$3')}</a>
                    }
                  </div>
                </div>
                <div className="line-wrap line-method">
                  {
                    this.state.arguments.length !== 0 &&
                    <pre className="second-p">{JSON.stringify(this.state.arguments, null, 3)}</pre>
                  }
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
      </div>
    );
  }
}
// export default injectIntl(ContractRequest);