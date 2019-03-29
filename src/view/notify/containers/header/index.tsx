/**
 * header 组件
 */
import * as React from 'react';
import './index.less';
import HeadImg from '../../utils/headimg';
import { bg } from '../../../popup/utils/storagetools';
import intl from '../../../popup/store/intl';
interface IProps
{
  address: string;
}
export default class Header extends React.Component<IProps>{
  public state={
    network:'TestNet'
  }
  public componentDidMount()
  {
    this.setState({network:
      bg.storage.network})
    if(this.props.address){
      console.log(this.props.address);      
      const div = document.getElementById('mywalletimg')
      HeadImg(div, this.props.address);}
  }
  public render()
  {
    return (
      <div className="nheader-wrap">
        <div className="first-line">
          <div className="first-left">
            <div className="img-icon" id="mywalletimg" />
            <div className="left-text">{bg.storage.account.walletName}</div>
          </div>
          <div className="first-right">
            {this.state.network=='TestNet'?intl.message.mywallet.testnet:intl.message.mywallet.mainnet}
            </div>
        </div>
        <div className="sec-line">
          <span>{this.props.address}</span>
        </div>
      </div>
    );
  }
}