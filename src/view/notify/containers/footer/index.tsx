/**
 * footer 组件
 */
import * as React from 'react';
// import { injectIntl } from 'react-intl';
import './index.less';
import Button from '../../../components/Button';
import intl from '../../../popup/store/intl';
// import { observer } from 'mobx-react';
interface IProps {
  onConfirm: () => void;
  onCancel: () => void;
  disable: boolean
}
// @observer
export default class Footer extends React.Component<IProps>{

  public render() {
    return (
      <div className="nfooter-wrap">
        <div className="nfooter-btn">
          <Button text={intl.message.button.refuse} size="small-big" type="warn" onClick={this.props.onCancel} />
          <Button text={intl.message.button.confirm} size="small-big" onClick={this.props.onConfirm} disabled={this.props.disable} />
        </div>
      </div>
    );
  }
}
// export default injectIntl(Footer);