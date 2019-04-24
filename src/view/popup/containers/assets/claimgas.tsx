/**
 * 交易记录组件
 */
/// <reference path="../../../../../src/lib/neo-thinsdk.d.ts" />
import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import { observer } from 'mobx-react';import { bg } from '../../utils/storagetools';
import common from '../../store/common';
;

@observer
export default class ClaimGAS extends React.Component
{
  public state = {
    claimStatus:0, // 0为可提取，1为不可提取，2为提取中
    claimsAmount:'0'
  }

  componentDidMount(){
    bg.getClaimGasAmount()
    .then(result=>{
      console.log(result);
      
      this.setState({claimsAmount:result})
    })
    const state = localStorage.getItem('Teemo-claimgasState-'+common.network);
    if(state && state=='wait')
    {
      this.setState({claimStatus:2});
    }
    setInterval(()=>{
      if(this.state.claimStatus==2)
      {
        const state = localStorage.getItem('Teemo-claimgasState-'+common.network);
        if(state !='wait')
        {
          this.setState({claimStatus:0});
          bg.getClaimGasAmount()
          .then(result=>{
            this.setState({claimsAmount:result})
          })
        }
      }
    },1000)
  }
  
  public onClaimGAS = () => {
    bg.doClaimGas();
    this.setState({
      claimStatus:2
    })
  }
  public render()
  {
    return (
      <div className="claimgas-wrapper">
        <div className="gas-text">
          可提取GAS
        </div>
        <div className="gas-number">
          {this.state.claimsAmount}
        </div>
        {this.state.claimsAmount !='0' &&
          <div className="claim-btn">
            <Button text={this.state.claimStatus === 0?"提取":"提取中"} size="small" type={this.state.claimStatus === 0 ? 'primary':'disable-btn'} onClick={this.onClaimGAS} />
          </div>      
        }  
      </div>
    );
  }
}
