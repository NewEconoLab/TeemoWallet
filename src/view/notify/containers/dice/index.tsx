/**
 * dice 组件
 */
import * as React from 'react';
// import { injectIntl } from 'react-intl';
import './index.less';
import { observer } from 'mobx-react';
import intl from '../../../popup/store/intl';

interface IPorps
{
  title: string;
  domain: string;
  icon:string;
}

@observer
export default class Dice extends React.Component<IPorps>{

  public render()
  {
    return (
      <div className="ndice-wrap">
        <div className="first-line">
          {this.props.title}
        </div>
        <div className="second-line">
          {this.props.domain}
        </div>
        <div className="dice-logo">
        {this.props.icon?        
        <img src={this.props.icon} alt="" />:
        <></>
        }
        </div>
        <div className="third-line">
          <p>{intl.message.notify.message1}</p>
          <p>{intl.message.notify.message2}</p>
        </div>
      </div>
    );
  }
}