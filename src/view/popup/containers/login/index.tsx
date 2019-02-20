import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import { RouteComponentProps } from 'react-router-dom';
import Label from '../../../components/Label';
import Select, { IOption } from '../../../components/Select';
import Input from '../../../components/Input';
import { bg, tools } from '../../utils/bgtools';
import Chooser from '../../../components/Chooser';
import { AccountInfo, NepAccount } from '../../../../common/entity';
import { neotools } from '../../utils/neotools';

interface AppProps extends RouteComponentProps {
    develop:boolean;
}

interface AppState {
    password:string,
    passwordError:boolean,
    confirm:string,
    options:IOption[],
    currentOption:IOption,
    currentAccount:NepAccount,
    accounts:NepAccount[]

}

export default class Login extends React.Component<AppProps,AppState> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
    }
    public options=[]
    public state:AppState = {
        password:"",
        passwordError:false,
        confirm:"",
        options:[],
        currentOption:{id:"",name:""},
        currentAccount:null,
        accounts:[]
    }

    public componentDidMount() 
    {
        if(bg.storage && bg.storage.account){            
            this.props.history.push("/mywallet")
        }else{
            this.props.history.push("/login")
        }
        let accounts = tools.getAccount();
        if(accounts.length){            
            let options = accounts.map((acc,index)=>{
                return {id:acc.address,name:(acc.walletName?acc.walletName:["我的钱包",(index+1)].join(' '))}as IOption;
            })
            this.setState({
                accounts,
                options,       
            })
            this.getcurrentOption(options[0]);
        }
    }

    public getcurrentOption=(event: IOption)=>{        
        tools.getAccount().forEach(currentAccount=>{
            if(currentAccount.address===event.id){
                this.setState({
                    currentAccount
                })
            }
        })
        this.setState({
            currentOption:event
        })
    }

    /**
     * 输入密码后触发的改变方法
     * @param {string} event change方法返回的字符对象
     */
    public passwordChange=(event:string)=>
    {
        this.setState({password:event})
    }

    public chooserAddr=(event:IOption)=>
    {
        this.setState({
            currentOption:event
        });
    }

    /**
     * 输入密码后触发的改变方法
     * @param {string} event change方法返回的字符对象
     */
    public nep2Change=(event:string)=>
    {
        this.setState({password:event})
    }

    public toCreateWallet=()=>
    {
        this.props.history.push('/walletnew')
    }

    public loginWallet=()=>{
        console.log(this.state.currentAccount)
        NepAccount.deciphering(this.state.password,this.state.currentAccount)
        .then(account =>{
            bg.storage.account = account;
            this.props.history.push('/mywallet')
        })
        .catch(error=>{
            console.log(error);
            
            this.setState({
                passwordError:true
            })
        })
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
                            <div className="select-group">
                                <div className="select-title">
                                    <span> {this.state.currentOption.name} </span>         
                                    <span className="triangle "></span>
                                    <div className="wallet-list">
                                        <div className="list-content">
                                            {this.state.options.map(option=>{
                                                return (
                                                    <div className="list-line" onClick={this.chooserAddr.bind(this,option)}>
                                                        <div className="line-text">{option.name}</div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className="wallet-list-wrapper">
                                            <div className="arrow" />
                                        </div>
                                    </div>
                                </div>
                                <div className="select-line">
                                    
                                </div>
                                <div className="select-message">{this.state.currentOption.id}</div>
                            </div>
                            </div>
                            <div className="login-password">
                                <Input type='password' placeholder='输入密码' 
                                    value={this.state.password} 
                                    onChange={this.passwordChange}
                                    error={this.state.passwordError}
                                    message={this.state.passwordError?"密码错误，请重试":""}
                                />
                            </div>
                            <div className="login-button">
                                <Button type='primary' size='long' text="登陆" onClick={this.loginWallet} />
                            </div>
                        </div>
                    </div>
                    <div className="href" onClick={this.toCreateWallet}>忘记密码，请重新导入钱包。</div>
                </div>
            </div>
        )
    }
}