// 整体布局
import * as React from 'react';
import * as PropTypes from 'prop-types';
import './index.less'
// import {zh_CN, en_US} from '@/language';
// import store from '@/store/common';

export default class LayoutIndex extends React.Component<any, any> {
  public static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
      }).isRequired
    }).isRequired
  }

  public componentDidMount () {
  }

  public render() {
    return (
      <div className="layout-container">
        {/* <Header locale={store.language === 'en' ? en_US.header : zh_CN.header}/> */}
        <div className="layout-main">
          {this.props.children}
        </div>
      </div>
    );
  }
}
