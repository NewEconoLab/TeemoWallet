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
import { Command,NotifyMessage } from '../../../../common/entity';
// import { injectIntl } from 'react-intl';
// import Toast from '@/components/Toast';

export default class Home extends React.Component<any, any> {
    
  public state={
    lable:"",
    header:{title:"",domain:""},
    account:{address:"",walletName:""},
    data:null,
  }
  public componentDidMount() 
  {
      if(chrome.tabs)
      {
        chrome.storage.local.get(['notifyData'],(result:NotifyMessage)=>{
          this.setState(result["notifyData"],()=>{
            console.log(this.state)
            console.log(this.state.data)
          });       
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
        <Header address={this.state.account.address} {...this.props} />
        <div className="notify-content">
          {
            this.state.lable==Command.getAccount?
            <Dice title={this.state.header.title} domain={this.state.header.domain} />:
            <ContractRequest title={this.state.header.title} domain={this.state.header.domain} data={this.state.data} {...this.props} />
          }
          {/* <Dice {...this.props} /> */}
        </div>
        <Footer onCancel={this.onCancel} onConfirm={this.onConfirm} />
      </div>
    );
  } 
}

// export default injectIntl(Home);
