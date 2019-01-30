import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import { RouteComponentProps } from 'react-router-dom';
import Label from '../../../components/Label';
import Select, { IOption } from '../../../components/Select';
import Input from '../../../components/Input';

interface AppProps extends RouteComponentProps {
    develop:boolean;
}

interface AppState {
    develop:boolean;
}

export default class Login extends React.Component<AppProps> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
    }

    public options:IOption[]=
    [
        {id:"nep6",name:"Nep6加密文件"},
        {id:"nep2",name:"Nep2加密字段"},
        {id:"wif",name:"WIF私钥字符串"},
    ]

    public state = {
        password:"",
        confirm:"",
        currentOption:this.options[0]
    }

    public componentDidMount() 
    {
        // Example of how to send a message to eventPage.ts.
    }

    /**
     * 选择文件后触发的方法
     * @param {File} event change方法返回的文件对象
     */
    public fileChange=(event:File)=>
    {   
        console.log(event);
        
        this.setState({filename:event.name})
    }

    /**
     * 输入密码后触发的改变方法
     * @param {string} event change方法返回的字符对象
     */
    public passwordChange=(event:string)=>
    {
        this.setState({password:event})
    }

    /**
     * 输入密码后触发的改变方法
     * @param {string} event change方法返回的字符对象
     */
    public nep2Change=(event:string)=>
    {
        this.setState({password:event})
    }

    onSelectModule = (call:IOption)=>
    {
        this.setState({currentOption:call})
    }

    public toCreateWallet=()=>
    {
        this.props.history.push('/walletnew')
    }

    render() {
        return (
            <div className="loginContainer">
                <div className="titleBackground">
                    <div className="title">欢迎回来</div>
                </div>
                <div className="content">
                    <div className="box">
                        <div className="box-content">
                            <div className="form-title">
                                <Select text="导入类型" options={this.options} onCallback={this.onSelectModule}/>
                            </div>
                            <div className="login-password">
                                <Input type='password' placeholder='输入密码' value={this.state.password} onChange={this.passwordChange} />
                            </div>
                            <div className="login-button">
                                <Button type='primary' size='long' text="登陆"/>
                            </div>
                        </div>
                    </div>
                    <div className="href" onClick={this.toCreateWallet}>忘记密码，请重新导入钱包。</div>
                </div>
            </div>
        )
    }
}
