/**
 * 合约交互 组件
 */
import * as React from 'react';
// import { injectIntl } from 'react-intl';
import './index.less';
import Checkbox from '../../../components/Checkbox';
import { Invoke, InvokeArgs } from '../../../../common/entity';
// import { observer } from 'mobx-react';

interface IProps{
  title:string,
  domain:string,
  invoek:InvokeArgs
}
// @observer
export default class ContractRequest extends React.Component<IProps>
{
  public state = {
    pageNumber: 0 // 0为上一页，1为下一页
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
          来自 www.dice.com
        </div>
        <div className="second-line">
          合约交互
        </div>
        <div className="second-line">
          请求签名 
        </div>
        {
          this.state.pageNumber === 0 && (
            <>
              <div className="contract-title">交易详情</div>
              <div className="transaction-wrap white-wrap">
                <div className="line-wrap">
                  <div className="line-left">合约hash</div>
                  <div className="line-right">
                    <a href="#">2a69...1cbd,2a69...1cbd</a>
                  </div>
                </div>
                <div className="line-wrap">
                  <div className="line-left">花费</div>
                  <div className="line-right">
                    <span>5 GAS</span>
                  </div>
                </div>
                <div className="line-wrap">
                  <div className="line-left">手续费</div>
                  <div className="line-right">
                    <span>0.001 GAS</span>
                  </div>
                </div>
              </div>
              <div className="check-fee">
                <Checkbox text="优先确认交易（支付0.001 GAS）"></Checkbox>
              </div>
              <div className="contract-title">来自应用的备注</div>
              <div className="remark-content white-wrap">游戏充值</div>
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
              <div className="contract-title">签名消息</div>
               
              {/* <div className="transaction-wrap white-wrap">
                <div className="line-wrap">
                  <div className="line-left">合约hash</div>
                  <div className="line-right">
                    <a href="#">2a69...1cbd,2a69...1cbd</a>
                  </div>
                </div>
                <div className="line-wrap">
                    <div className="line-left">
                      <p className="first-p">方法</p>
                      <p className="second-p">参数hash</p>
                    </div>
                    <div className="line-right">
                      <p className="first-p">aaa</p>
                      <p className="second-p">0xa3ca3c748d22c97381b18a249dd1ece4dec4681ff4721bb6ba0025b75b51c77a</p>
                    </div>
                </div>
                <div className="line-wrap">
                    <div className="line-left">
                      <p className="first-p">方法</p>
                      <p className="second-p">参数hash</p>
                    </div>
                    <div className="line-right">
                      <p className="first-p">aaa</p>
                      <p className="second-p">0xa3ca3c748d22c97381b18a249dd1ece4dec4681ff4721bb6ba0025b75b51c77a</p>
                    </div>
                </div>
              </div> */}
              <div className="transaction-content">
                <span>内容</span>
              </div>
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