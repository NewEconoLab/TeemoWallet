/**
 * footer 组件
 */
import * as React from 'react';
// import { injectIntl } from 'react-intl';
import './index.less';
import Button from '../../../components/Button';
import intl from '../../../popup/store/intl';
// import { observer } from 'mobx-react';
interface IProps{
  onConfirm:()=>void;
  onCancel:()=>void;
}
// @observer
export default class Footer extends React.Component<IProps>{
  
  public render()
  {
    return (
      <div className="nfooter-wrap">
        <div className="nfooter-btn">
          <Button text={intl.message.button.refuse} type="warn" onClick={this.props.onCancel}/>
          <Button text={intl.message.button.confirm} onClick={this.props.onConfirm}/>
        </div>
      </div>
    );
  }
}
// export default injectIntl(Footer);