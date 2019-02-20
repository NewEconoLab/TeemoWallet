/**
 * dice 组件
 */
import * as React from 'react';
// import { injectIntl } from 'react-intl';
import './index.less';
import Button from '../../../components/Button';
// import { observer } from 'mobx-react';

// @observer
export default class Dice extends React.Component{
  
  public render()
  {
    return (
      <div className="ndice-wrap">
        <div className="first-line">
          DICE-NEO上第一款公平骰子游戏
        </div>
        <div className="second-line">
          www.dice.com
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