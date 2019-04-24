/**
 * 交易记录组件
 */
/// <reference path="../../../../../src/lib/neo-thinsdk.d.ts" />
import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import { observer } from 'mobx-react';import { bg } from '../../utils/storagetools';
import common from '../../store/common';
import Toast from '../../../components/Toast';
;

@observer
export default class ClaimGAS extends React.Component
{
  public state = {
    claimStatus:0, // 0为可提取，1为不可提取，2为提取中
    claimsAmount:'0'
  }

  componentDidMount(){
    common.initClaimGasAmount()
    const state = localStorage.getItem('Teemo-claimgasState-'+common.network);
    if(state && state=='wait')
    {
      this.setState({claimStatus:2});
    }
    setInterval(()=>{
      const status = localStorage.getItem('Teemo-claimgasState-'+common.network);
      if(this.state.claimStatus==2)
      {
        if(status !='wait')
        {
          common.initClaimGasAmount();
          this.setState({claimStatus:0});
        }
      }else
      {
        if(status =='wait')
        {
          common.initClaimGasAmount();
          this.setState({claimStatus:2});
        }
      }
    },1000)
  }
  
  public onClaimGAS = () => {
    try {
      bg.doClaimGas();
      localStorage.setItem('Teemo-claimgasState-'+common.network,'wait');
      Toast("正在提取gas，请勿退出钱包。")
      this.setState({
        claimStatus:2
      })
    } catch (error) {
      
    }
  }
  public render()
  {
    return (
      <div className="claimgas-wrapper">
        <div className="gas-text">
          可提取GAS
        </div>
        <div className="gas-number">
          {common.claimGasAmount}
        </div>
        {common.claimGasAmount !='0' &&
          <div className="claim-btn">
            <Button text={this.state.claimStatus === 0?"提取":"提取中"} size="small" type={this.state.claimStatus === 0 ? 'primary':'disable-btn'} onClick={this.onClaimGAS} />
          </div>      
        }  
      </div>
    );
  }
}
