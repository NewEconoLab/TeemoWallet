// 输入框组件
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Select, { IOption } from '../../../components/Select';

interface IState{
    currentOption:IOption,
    currentLable:string,
    password:string,
    filename:string,
    confirm:string,
    nep2:string,
    wif:string,
}
interface IProps{
    goBack:()=>void
}

// @observer
export default class WalletImport extends React.Component<IProps, IState> {
	constructor(props: any) {
		super(props);
    }
    
    public options:IOption[]=
    [
        {id:"nep6",name:"Nep6加密文件"},
        {id:"nep2",name:"Nep2加密字段"},
        {id:"wif",name:"WIF私钥字符串"},
    ]

    public state = 
    {
        currentOption:this.options[0],
        currentLable:"import",
        password:"",
        filename:"",
        confirm:"",
        nep2:"",
        wif:"",
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

    goBack = ()=>
    {
        this.props.goBack();
    }
    /**
     * 根据选项返回对应的模块
     * @param {IOption} option 当前的选择项
     */
    public getFormContent=(option:IOption)=>
    {
        if (option.id==='nep6') 
        {
            return(
                <div className="form-content">                            
                    <div className="input">
                        <Input type="file" placeholder="选择Nep6文件（.json）" value={this.state.filename} onChange={this.fileChange}/>
                    </div>
                    <div className="input">
                        <Input type="password" placeholder="输入密码" value={this.state.password} onChange={this.passwordChange}/>
                    </div>
                </div>
            );
        } 
        else if(option.id==='nep2')
        {
            return(                
                <div className="form-content">                            
                    <div className="input">
                        <Input type="text" placeholder="输入Nep2" value={this.state.nep2} onChange={this.passwordChange}/>
                    </div>
                    <div className="input">
                        <Input type="password" placeholder="输入密码" value={this.state.password} onChange={this.passwordChange}/>
                    </div>
                </div>
            )
        }
        else
        {
            return(                
                <div className="form-content">                            
                    <div className="wif">
                        <Input type="text" placeholder="输入私钥" value={this.state.wif} onChange={this.passwordChange}/>
                    </div>
                    <div className="wif">
                        <Input type="password" placeholder="设置密码" value={this.state.password} onChange={this.passwordChange}/>
                    </div>
                    <div className="wif">
                        <Input type="password" placeholder="确认密码" value={this.state.confirm} onChange={this.passwordChange}/>
                    </div>
                </div>
            )
        }
    }


	public render() {
        return(            
            <div className="form">
                <div className="form-title">
                    <Select text="导入类型" options={this.options} onCallback={this.onSelectModule}/>
                </div>
                {
                    // 该方法为了渲染form表单对应不同栏目的内容
                    this.getFormContent(this.state.currentOption)
                }                        
                <div className="form-btn-list">
                    <div className="btn-first">
                        <Button type='warn' text="取消" onClick={this.goBack}/>
                    </div>
                    <div>
                        <Button type='primary' text="确定"/>
                    </div>
                </div>
            </div>
        )
	}
}