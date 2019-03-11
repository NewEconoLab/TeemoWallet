/**
 * header 组件
 */
import * as React from 'react';
// import { injectIntl } from 'react-intl';
import './index.less';
import HeadImg from '../../utils/headimg';
// import { observer } from 'mobx-react';
// @observer
interface IProps
{
  address: string;
}
export default class Header extends React.Component<IProps>{
  public componentDidMount()
  {
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
            <div className="left-text">我的钱包1</div>
          </div>
          <div className="first-right">
            主网
            </div>
        </div>
        <div className="sec-line">
          <span>{this.props.address}</span>
        </div>
      </div>
    );
  }
}
// export default injectIntl(Header);