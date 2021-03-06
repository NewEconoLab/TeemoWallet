/**
 * 主页布局
 */
import * as React from 'react';
import Header from '../header';
import Footer from '../footer';
import ContractRequest from '../contract'
import './index.less';
import Dice from '../dice';
import { Command } from '../../../../common/entity';
import Login from '../login';
import { Background } from '../../../../lib/background';
import SendRequest from '../send';

export default class Home extends React.Component<any, any> {
    
  public state={
    label:"",
    header:{title:"",domain:"",icon:""},
    account:{address:"",walletName:""},
    data:null,
    login:false
  }

  public componentDidMount() 
  {
      if(chrome.tabs)
      {
        const bg = chrome.extension.getBackgroundPage() as Background;
        const account = bg.AccountManager.getCurrentAccount();
        if(account)
        {
          const account2 = {address:account.address,label:account.walletName}
          this.setState({account2,login:true});
        }
        else
        {
          this.setState({
            login:false
          })
        }
        chrome.storage.local.get(['notifyData'],(result)=>{
          const label = result.notifyData.lable;
          const header = result.notifyData.header;
          const data = result.notifyData.data;          
          this.setState(
            {
              label,
              data
            })
          if(header)
            this.setState({header});
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

  public goHome=(account:{address:string,label:string})=>{
    this.setState({
      account,
      login:true
    })
  }
  
  public render() {
    return (
      <>
      {this.state.login?
      <div className="notify-page">
        <Header address={this.state.account.address} {...this.props} />
        <div className="notify-content">
          {
            this.state.label==Command.getAccount&&
            <Dice title={this.state.header.title} domain={this.state.header.domain} icon={this.state.header.icon} />
          }
          {
            (this.state.label==Command.invoke||this.state.label==Command.invokeGroup)&&
            <ContractRequest title={this.state.header.title} domain={this.state.header.domain} address={this.state.account.address} data={this.state.data} {...this.props} />
          }
          {
            this.state.label==Command.send &&             
            <SendRequest title={this.state.header.title} domain={this.state.header.domain} address={this.state.account.address} data={this.state.data} {...this.props} />
          }
        </div>
        <Footer onCancel={this.onCancel} onConfirm={this.onConfirm} />
      </div>:
      <Login goHome={this.goHome}/>
      }
      </>
    );
  } 
}

// export default injectIntl(Home);
