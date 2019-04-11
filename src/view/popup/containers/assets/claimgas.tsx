/**
 * 交易记录组件
 */
/// <reference path="../../../../../src/lib/neo-thinsdk.d.ts" />
import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import { observer } from 'mobx-react';;

@observer
export default class ClaimGAS extends React.Component
{
  public state = {
    claimStatus:0 // 0为可提取，1为不可提取，2为提取中
  }
  public onClaimGAS = () => {
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
          9999999999.99999999
        </div>
        <div className="claim-btn">
        <Button text={this.state.claimStatus === 0?"提取":"提取中"} size="small" type={this.state.claimStatus === 0 ? 'primary':'disable-btn'} onClick={this.onClaimGAS} />
        </div>        
      </div>
    );
  }
}
