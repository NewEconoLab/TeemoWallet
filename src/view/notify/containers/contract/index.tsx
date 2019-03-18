/**
 * 合约交互 组件
 */
import * as React from 'react';
// import { injectIntl } from 'react-intl';
import './index.less';
import Checkbox from '../../../components/Checkbox';
import { Invoke, InvokeArgs, Argument } from '../../../../common/entity';
import { Storage_local } from '../../../../common/util';
// import { observer } from 'mobx-react';

interface IProps
{
  title: string,
  domain: string,
  data: any,
  address:string,
}
interface IState
{
  pageNumber: number,
  data: any,
  description: string[],
  scriptHash: string[],
  fee: string,
  operation: string[],
  arguments: Array<Argument>
  expenses:{[asset:string]:string}
}
// @observer
export default class ContractRequest extends React.Component<IProps, IState>
{
  public state = {
    pageNumber: 0, // 0为上一页，1为下一页
    data: null,
    description: [],
    scriptHash: [],
    fee: '0',
    operation: [],
    arguments: [],
    expenses:{},
  }
  public componentWillReceiveProps(nextProps)
  {
    this.setState({
      data: nextProps.data
    }, () =>
      {
        this.getRenderState();
      })
  }
  // 更新数据
  public getRenderState = () =>
  {
    console.log("渲染hash");
    console.log(this.props.data);
    console.log(JSON.stringify(this.state.data))
    let invoke: InvokeArgs[] = [];
    if (this.state.data && this.state.data.group)
    {
      console.log("发送的是多条的交易");
      invoke = this.props.data.group;
      this.initData(invoke);
    }
    else if (this.state.data)
    {
      console.log("发送的是单条的交易");
      invoke[0] = this.props.data;
      this.initData(invoke);
    }
  }
  // 初始化state
  public initData = (invoke: InvokeArgs[]) =>
  {
    let description = [];
    let scriptHash = [];
    let fee = 0;
    let operation = [];
    let argument = [];
    let expenses = {}
    invoke.map((key, value) =>
    {
      console.log(key);
      console.log(value);
      description[value] = key.description;
      scriptHash[value] = key.scriptHash;
      fee = key.fee ? parseFloat(key.fee) : 0 + fee;
      operation[value] = key.operation;
      argument[value] = key.arguments;
      // 判断 nep5的转账花费
      // if(key.operation=="transfer")
      // {
      //   if(key.arguments[0].value==this.props.address)
      //   {
      //     expenses[key.scriptHash]=key.arguments[2];
      //   }
      // }
      if(key.attachedAssets)
      {
        for (const asset in key.attachedAssets) {
          if (key.attachedAssets.hasOwnProperty(asset)) {
            const amount = parseFloat(key.attachedAssets[asset]);
            expenses[asset]=expenses[asset]?expenses[asset]+amount:amount;
          }
        }
        Object.keys(key.attachedAssets).map(value=>{
          expenses[value]=key.attachedAssets[value];
        })
      }
    })
    this.setState({
      description: description,
      scriptHash: scriptHash,
      fee: fee.toString(),
      operation: operation,
      arguments: argument
    }, () =>
      {
        console.log("打印state");
        console.log(this.state);
      });
  }

  public netfeeChange=(check:boolean)=>
  {
    Storage_local.set('checkNetFee',check);
  }

  public nextPage = () =>
  {
    this.setState({
      pageNumber: 1
    })
  }
  public previousPage = () =>
  {
    this.setState({
      pageNumber: 0
    })
  }
  public render()
  {
    return (
      <div className="ncontract-wrap">
        <div className="first-line">
          来自 {this.props.domain}
        </div>
        <div className="second-line">
          合约交互
        </div>
        {/* <div className="second-line">
          请求签名 
        </div> */}
        {
          this.state.pageNumber === 0 && (
            <>
              <div className="contract-title">交易详情</div>
              <div className="transaction-wrap white-wrap">
                <div className="line-wrap">
                  <div className="line-left">合约hash</div>
                  <div className="line-right">
                    {
                      this.state.scriptHash.length !== 0 && this.state.scriptHash.map((k, v) =>
                      {
                        return <a href="#">{k.replace(/^(.{4})(.*)(.{4})$/, '$1...$3')}{(this.state.scriptHash.length > 1 && (v + 1) !== this.state.scriptHash.length) ? "," : ""}</a>
                      })
                    }
                  </div>
                </div>
                <div className="line-wrap">
                  <div className="line-left">花费</div>
                  <div className="line-right">
                    <span>0 GAS</span>
                  </div>
                </div>
                {
                  parseFloat(this.state.fee) !== 0 && (
                    <div className="line-wrap">
                      <div className="line-left">手续费</div>
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
                    <Checkbox text="优先确认交易（支付0.001 GAS）" onClick={this.netfeeChange}></Checkbox>
                  </div>
                )
              }
              <div className="contract-title">来自应用的备注</div>
              <div className="remark-content white-wrap">
                {
                  this.state.description.length !== 0 && this.state.description.map((k, v) =>
                  {
                    return (k?k:'') + ((this.state.scriptHash.length > 1 && (v + 1) !== this.state.scriptHash.length&&k) ? "/" : "")
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
              <div className="contract-title">签名消息</div>

              <div className="transaction-wrap white-wrap">
                <div className="line-wrap">
                  <div className="line-left">合约hash</div>
                  <div className="line-right">
                  {
                      this.state.scriptHash.length !== 0 && this.state.scriptHash.map((k, v) =>
                      {
                        return <a href="#">{k.replace(/^(.{4})(.*)(.{4})$/, '$1...$3')}{(this.state.scriptHash.length > 1 && (v + 1) !== this.state.scriptHash.length) ? "," : ""}</a>
                      })
                    }
                  </div>
                </div>
                {
                  this.state.operation.length !== 0 && this.state.operation.map((okey, oindex) =>
                  {
                    console.log("ok:" + okey)
                    return (
                      <div className="line-wrap line-method">
                        <div className="one-line">
                          <div className="line-left">
                            <p className="first-p">方法</p>
                          </div>
                          <div className="line-right">
                            <p className="first-p">{okey}</p>
                          </div>
                        </div>
                        {
                          this.state.arguments.length !== 0 && Object.keys(this.state.arguments[oindex]).map((akey, aindex) =>
                          {
                            return (
                              <div className="one-line">
                                <div className="line-left">
                                  <p className="first-p">{this.state.arguments[oindex][akey].type}</p>
                                </div>
                                <div className="line-right">
                                  <p className="second-p">{this.state.arguments[oindex][akey].value}</p>
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
      </div>
    );
  }
}
// export default injectIntl(ContractRequest);