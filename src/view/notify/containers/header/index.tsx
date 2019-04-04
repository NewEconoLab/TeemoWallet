/**
 * header 组件
 */
import * as React from 'react';
import './index.less';
import { bg } from '../../../popup/utils/storagetools';
import intl from '../../../popup/store/intl';
import { ICON } from '../../../image';
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
    this.setState({network:bg.AccountManager.getCurrentNetWork()})
    // if(this.props.address){
      // console.log(this.props.address);      
      // const div = document.getElementById('mywalletimg')
      // HeadImg(div, this.props.address);}
  }
  public render()
  {
    const account = bg.AccountManager.getCurrentAccount();
    return (
      <div className="nheader-wrap">
        <div className="first-line">
          <div className="first-left">
            <div className="img-icon" ><img src={ICON.header}/></div>
            <div className="account-message">
                <div className=''>{account.walletName}</div>
                <div className='address'>{account.address.substring(0,4)+'...'+account.address.substring(30,34)}</div>
            </div>
          </div>
          <div className="first-right">
            {this.state.network=='TestNet'?intl.message.mywallet.testnet:intl.message.mywallet.mainnet}
            </div>
        </div>
        {/* <div className="sec-line">
          <span>{this.props.address}</span>
        </div> */}
      </div>
    );
  }
}