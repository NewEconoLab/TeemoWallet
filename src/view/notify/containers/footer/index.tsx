/**
 * footer 组件
 */
import * as React from 'react';
// import { injectIntl } from 'react-intl';
import './index.less';
import Button from '../../../components/Button';
// import { observer } from 'mobx-react';


// @observer
export default class Footer extends React.Component{
  
  public render()
  {
    return (
      <div className="nfooter-wrap">
        <div className="nfooter-btn">
          <Button text="拒绝" type="warn"/>
          <Button text="确认"/>
        </div>
      </div>
    );
  }
}
// export default injectIntl(Footer);