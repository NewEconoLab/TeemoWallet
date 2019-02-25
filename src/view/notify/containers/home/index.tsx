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
import Dice from '../dice';
import { Invoke } from '../../../../app/back/entity';
// import { injectIntl } from 'react-intl';
// import Toast from '@/components/Toast';

export default class Home extends React.Component<any, any> {
    
  public state ={
    label:"",
    title:"",
    domain:"",
    address:"",
    invoke:{} as Invoke
  }
  public componentDidMount() 
  {
      if(chrome.tabs)
      {
          chrome.storage.local.get(['label','message'],result=>{
            this.setState({
                label:result.label,
                title:result.message.title,
                domain:result.message.domain,
                address:result.message.account.address
            })
          })
      }
  }

  public onCancel=()=>{          
    chrome.storage.local.set({confirm:"cancel"},()=>{
      window.opener=null;
      window.open('','_self');
      window.close();
    });
  }

  public onConfirm=()=>{ 
    chrome.storage.local.set({confirm:"confirm"},()=>{
      window.opener=null;
      window.open('','_self');
      window.close();
    });
  }
  
  public render() {
    return (
      <div className="notify-page">
        <Header address={this.state.address} {...this.props} />
        <div className="notify-content">
          {
            this.state.label=="getAccount"?
            <Dice title={this.state.title} domain={this.state.domain} />:
            <ContractRequest title={this.state.title} domain={this.state.domain} invoek={this.state.invoke} {...this.props} />
          }
          {/* <Dice {...this.props} /> */}
        </div>
        <Footer onCancel={this.onCancel} onConfirm={this.onConfirm} />
      </div>
    );
  } 
}

// export default injectIntl(Home);
