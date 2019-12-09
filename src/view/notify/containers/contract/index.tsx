/**
 * 合约交互 组件
 */
import * as React from 'react';
// import { injectIntl } from 'react-intl';
import './index.less';
import Checkbox from '../../../components/Checkbox';
import { Invoke, InvokeArgs, Argument } from '../../../../common/entity';
import { Storage_local } from '../../../../common/util';
import { Background, BalanceRequest, GetBalanceArgs } from '../../../../lib/background';
import intl from '../../../popup/store/intl';
import { ICON } from '../../../image';
import { HASH_CONFIG } from '../../../config';
// import { observer } from 'mobx-react';

interface IProps {
  title: string,
  domain: string,
  data: any,
  address: string,
  toError: () => void
}
interface IState {
  pageNumber: number,
  data: any,
  description: string[],
  scriptHash: string[],
  fee: string,
  sysfee: string;
  netfee: string;
  operation: string[],
  arguments: Array<Argument>,
  expenses: { symbol: string, amount: string, assetid: string }[],
  err: boolean,
}
// @observer
export default class ContractRequest extends React.Component<IProps, IState>
{
  public bg: Background = chrome.extension.getBackgroundPage() as Background;
  public state: IState = {
    pageNumber: 0, // 0为上一页，1为下一页
    data: null,
    description: [],
    scriptHash: [],
    fee: '0',
    sysfee: "0",
    netfee: '0',
    operation: [],
    arguments: [],
    expenses: [],
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
    let invoke: InvokeArgs[] = [];
    if (this.state.data && this.state.data.group) {
      invoke = this.props.data.group;
      this.initData(invoke);
    }
    else if (this.state.data) {
      invoke[ 0 ] = this.props.data;
      this.initData(invoke);
    }
  }

  // 初始化state
  public initData = (invoke: InvokeArgs[]) => {
    this.bg.invokeArgsAnalyse(...invoke)
      .then(result => {
        this.setState({
          description: result.descriptions,
          scriptHash: result.scriptHashs,
          operation: result.operations,
          arguments: result.arguments,
          expenses: result.expenses,
          fee: result.fee
        }, () => {
          let params: BalanceRequest = { "address": this.props.address, "assets": this.state.expenses.map(asset => asset.assetid) };
          // for (const asset of result.expenses) {
          // }
          // const params:BalanceRequest[]=result.expenses.map(exp=>{return {"address":this.props.address,"assets":exp.assetid}}) as BalanceRequest[];
          this.bg.getBalance({ "network": invoke[ 0 ].network, params })
            .then(balancesRes => {
              const balances = balancesRes[ this.props.address ];
              if (balances.length > 0) {
                for (const asset of this.state.expenses) {
                  const balance = balances.find(bal => bal.assetID == asset.assetid);
                  if (asset.assetid === HASH_CONFIG.ID_GAS && (parseFloat(this.state.fee) + parseFloat(asset.amount)) > parseFloat(balance.amount)) {
                    this.setState({ err: true });
                    // if (this.props.toError) {
                    //   this.props.toError()
                    // }
                    return;
                  }
                  else if (parseFloat(asset.amount) > parseFloat(balance.amount)) {
                    this.setState({ err: true })
                    // if (this.props.toError) {
                    //   this.props.toError()
                    // }
                    return;
                  }
                }
                const balance = balances.find(bal => bal.assetID == HASH_CONFIG.ID_GAS);
                if (balance && parseFloat(this.state.fee) > parseFloat(balance.amount)) {
                  this.setState({ err: true })
                  // if (this.props.toError) {
                  //   this.props.toError()
                  // }
                  return;
                }
                if (!balance && parseFloat(this.state.fee) > 0) {
                  this.setState({ err: true })
                  // if (this.props.toError) {
                  //   this.props.toError()
                  // }
                  return;
                }
              }
              else if (parseFloat(this.state.fee) > 0) {
                this.setState({ err: true })
                // if (this.props.toError) {
                //   this.props.toError()
                // }
                return;
              }
            })
        }
        );
      })
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
    return (
      <div className="ncontract-wrap">
        <div className="first-line">
          {`${intl.message.history.from} ${this.props.domain}`}
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
              <div className="contract-title">{intl.message.notify.Info}</div>
              <div className="transaction-wrap white-wrap">
                <div className="line-wrap">
                  <div className="line-left">{intl.message.notify.scriptHash}</div>
                  <div className="line-right">
                    {
                      this.state.scriptHash.length !== 0 && this.state.scriptHash.map((k, v) => {
                        return <a href="#">{k.replace(/^(.{4})(.*)(.{4})$/, '$1...$3')}{(this.state.scriptHash.length > 1 && (v + 1) !== this.state.scriptHash.length) ? "," : ""}</a>
                      })
                    }
                  </div>
                </div>
                <div className="line-wrap">
                  <div className="line-left">{intl.message.history.amount}</div>
                  <div className="line-right">
                    <span>
                      {(this.state.expenses && this.state.expenses.length > 0) ?
                        this.state.expenses.map(val => parseFloat(val.amount) + " " + val.symbol).join(',') :
                        "0"
                      }
                    </span>
                  </div>
                </div>
                {
                  // <div className="line-wrap">
                  //   <div className="line-left">{intl.message.history.netfee}</div>
                  //   <div className="line-right">
                  //     <span>{this.state.netfee} GAS</span>
                  //   </div>
                  // </div>
                }
                {
                  <div className="line-wrap">
                    <div className="line-left">{intl.message.history.fee}</div>
                    <div className="line-right">
                      <span>{this.state.fee} GAS</span>
                    </div>
                  </div>
                }
              </div>
              {/**
                parseFloat(this.state.fee) === 0 && (
                  <div className="check-fee">
                    <Checkbox text={intl.message.transfer.payfee} onClick={this.netfeeChange}></Checkbox>
                  </div>
                )
               */}
              <div className="contract-title">{intl.message.notify.dappNote}</div>
              <div className="remark-content white-wrap">
                {
                  this.state.description.length !== 0 && this.state.description.map((k, v) => {
                    return (k ? k : '') + ((this.state.scriptHash.length > 1 && (v + 1) !== this.state.scriptHash.length && k) ? "/" : "")
                  })
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
                      this.state.scriptHash.length !== 0 && this.state.scriptHash.map((k, v) => {
                        return <a href="#">{k.replace(/^(.{4})(.*)(.{4})$/, '$1...$3')}{(this.state.scriptHash.length > 1 && (v + 1) !== this.state.scriptHash.length) ? "," : ""}</a>
                      })
                    }
                  </div>
                </div>
                {
                  this.state.operation.length !== 0 && this.state.operation.map((okey, oindex) => {
                    // console.log("ok:" + okey)
                    return (
                      <div className="line-wrap line-method">
                        <div className="one-line">
                          <div className="line-left">
                            <p className="first-p">{intl.message.notify.method}</p>
                          </div>
                          <div className="line-right">
                            <p className="first-p">{okey}</p>
                          </div>
                        </div>
                        {
                          this.state.arguments.length !== 0 && Object.keys(this.state.arguments[ oindex ]).map((akey, aindex) => {
                            return (
                              <div className="one-line">
                                <div className="line-left">
                                  <p className="first-p">{this.state.arguments[ oindex ][ akey ].type}</p>
                                </div>
                                <div className="line-right">
                                  {this.state.arguments[ oindex ][ akey ].type == "Array" ?
                                    <p className="second-p">{JSON.stringify(this.state.arguments[ oindex ][ akey ].value)}</p> :
                                    <p className="second-p">{this.state.arguments[ oindex ][ akey ].value}</p>
                                  }
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  })
                }
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
          this.state.err &&
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