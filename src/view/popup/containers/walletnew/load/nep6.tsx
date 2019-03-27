// 输入框组件
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Input from '../../../../components/Input';
import { neotools } from '../../../utils/neotools';
import { Storage_local, bg } from '../../../utils/storagetools';
import common from '../../../store/common';
import intl from '../../../store/intl';

interface IState{
    file:File,
    walletString:string,
    password:string,
    filename:string,    
    file_error:boolean,
    password_error:boolean
}

interface IPorps{
    goMyWallet:()=>void;
}

// @observer
export default class Nep6Import extends React.Component<IPorps, IState> {
	constructor(props: any) {
		super(props);
    }
    public reader = new FileReader();
    public componentDidMount() 
    {
        // Example of how to send a message to eventPage.ts.
        this.reader.onload=()=>{            
            this.setState({ walletString: this.reader.result as string});

        }
    }
    
    public wallet: ThinNeo.nep6wallet = new ThinNeo.nep6wallet();

    public state:IState={
        file:null,
        password:"",
        filename:"",
        walletString:"",
        file_error:false,
        password_error:false
    }
    
    public passwordChange=(event)=>{
        this.setState({
            password:event
        })
    }


    /**
     * 选择文件后触发的方法
     * @param {File} event change方法返回的文件对象
     */
    public fileChange=(event:File)=>
    {   
        this.setState({
            file:event
        })
        this.setState({filename:event.name})
        if(event.name.includes('.json')){
            try {
                this.reader.readAsText(event);
            } catch (error) {
                this.setState({
                    file_error:true
                })
            }
        }
    }
    
    goMyWallet =()=> {
        if(this.props.goMyWallet)
            this.props.goMyWallet();
    }
    /**
     * 导入NEP6钱包
     */
    loadWallet =()=>
    {
        bg.AccountManager.nep6Load(this.state.walletString,this.state.password)
        .then(account =>{
            common.initAccountInfo();
            this.goMyWallet();
        })
        .catch(error =>{
            this.setState({
                password_error:true
            });
        })
    }

	public render() {
        return(
            <div className="form-content">                            
                <div className="input">
                    <Input type="file" placeholder={intl.message.walletnew.nep6.placeholder1}
                        value={this.state.filename} 
                        onChange={this.fileChange}
                        error={this.state.file_error}
                        message={this.state.file_error?intl.message.walletnew.nep6.error1:""}
                    />
                </div>
                <div className="input">
                    <Input type="password" placeholder={intl.message.walletnew.nep6.placeholder2} 
                        value={this.state.password} 
                        onChange={this.passwordChange}
                        error={this.state.password_error}
                        message={this.state.password_error?intl.message.walletnew.nep6.error2:""}
                    />
                </div>
            </div>
        );
	}
}