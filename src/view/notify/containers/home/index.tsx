/**
 * 主页布局
 */
import * as React from 'react';
// import { observer, inject } from 'mobx-react';
import Header from '../header';
import Footer from '../footer';
// import Dice from '../dice';
import ContractRequest from '../contract'
import './index.less';
// import { injectIntl } from 'react-intl';
// import Toast from '@/components/Toast';

export default class Home extends React.Component<any, any> {
  
  public render() {
    return (
      <div className="notify-page">
        <Header {...this.props} />
        <div className="notify-content">
          {/* <Dice {...this.props} /> */}
          <ContractRequest {...this.props} />
        </div>
        <Footer {...this.props} />
      </div>
    );
  }
}

// export default injectIntl(Home);
