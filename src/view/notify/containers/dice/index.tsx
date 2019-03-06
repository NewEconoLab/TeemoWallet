/**
 * dice 组件
 */
import * as React from 'react';
// import { injectIntl } from 'react-intl';
import './index.less';
import Button from '../../../components/Button';
// import { observer } from 'mobx-react';

interface IPorps
{
  title: string;
  domain: string;
}

// @observer
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
        <div className="dice-logo" />
        <div className="third-line">
          <p>想要连接到您的钱包</p>
          <p>请检查您是否在正确的站点</p>
        </div>
      </div>
    );
  }
}
// export default injectIntl(Dice);