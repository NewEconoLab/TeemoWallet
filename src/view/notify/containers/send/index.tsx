/**
 * 合约交互 组件
 */
import * as React from 'react';
// import { injectIntl } from 'react-intl';
import './index.less';
import Checkbox from '../../../components/Checkbox';
import { Invoke, InvokeArgs, Argument } from '../../../../common/entity';
import { Storage_local } from '../../../../common/util';
import { Background, SendArgs } from '../../../../lib/background';
import { bg } from '../../../popup/utils/storagetools';
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
  toAddress:string,
  amount:string,
  fee: string,
  assetSymbol:string,
  assetID:string,
  remark:string,
}
// @observer
export default class SendRequest extends React.Component<IProps, IState>
{
  public bg:Background = chrome.extension.getBackgroundPage()as Background;
  public state:IState = {
    pageNumber: 0, // 0为上一页，1为下一页
    data: null,
    toAddress:"",
    amount:"0",
    fee: '0',
    assetID:"",
    assetSymbol:"",
    remark:""
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
    let sendData: SendArgs;
    if (this.state.data)
    {
      sendData = this.props.data;
      this.initData(sendData);
    }
  }

  // 初始化state
  public initData = (sendData: SendArgs) =>
  {

    if(sendData.asset)
    {
      this.setState({
        assetID:sendData.asset,
        toAddress:sendData.toAddress,
        fee:sendData.fee?sendData.fee:'0',
        amount:sendData.amount,
        remark:sendData.remark?sendData.remark:''
      })
      bg.queryAssetSymbol(sendData.asset,sendData.network)
      .then(result=>{
        this.setState({
          assetSymbol:result.symbol
        })
      })
    }
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
                  <div className="line-left">目标地址</div>
                  <div className="line-right">
                    {
                      this.state.toAddress
                    }
                  </div>
                </div>
                <div className="line-wrap">
                  <div className="line-left">花费</div>
                  <div className="line-right">
                    <span>
                    {this.state.amount+" "+this.state.assetSymbol}
                    </span>
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
              <div className="contract-title">交易数据</div>

              <div className="transaction-wrap white-wrap">
                <div className="line-wrap">
                  <div className="line-left">资产ID</div>
                  <div className="line-right">
                  { this.state.assetID.substr(0,4)+"..."+this.state.assetID.substr(this.state.assetID.length-4,4) }
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
      </div>
    );
  }
}
// export default injectIntl(ContractRequest);