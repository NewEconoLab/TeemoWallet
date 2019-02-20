// 输入框组件
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { BADFLAGS } from 'dns';
import Select, { IOption } from '../../../../components/Select';
import Button from '../../../../components/Button';
import Nep6Import from './nep6';
import Nep2Import from './nep2';
import WifImport from './wif';

interface IState{
    currentLable:string,
    currentOption:IOption,
    
}
interface IProps{
    goBack:()=>void
    goMyWallet:()=>void
}

// @observer
export default class WalletImport extends React.Component<IProps, IState> {

	constructor(props: any) {
		super(props);
    }

    public reader = new FileReader();
    wallet: ThinNeo.nep6wallet = new ThinNeo.nep6wallet();
    
    public options:IOption[]=
    [
        {id:"nep6",name:"Nep6加密文件"},
        {id:"nep2",name:"Nep2加密字段"},
        {id:"wif",name:"WIF私钥字符串"},
    ]

    public state:IState = 
    {
        currentLable:'',
        currentOption:this.options[0],
    }

    public componentDidMount() 
    {
        // Example of how to send a message to eventPage.ts.
        this.reader.onload=()=>{            
            this.wallet.fromJsonStr(this.reader.result as string);

        }
    }

    onSelectModule = (call:IOption)=>
    {
        this.setState({currentOption:call})
    }

    goBack = ()=>
    {
        this.props.goBack();
    }

    goMyWallet = ()=>{
        this.props.goMyWallet();
    }

    loadWallet =()=>
    {
        if(this.state.currentOption.id==='nep6'){
            let test = this.refs.nep6['loadWallet']
            test();
        }
        
        if(this.state.currentOption.id==='nep2'){            
            let test = this.refs.nep2['loadWallet']
            test();
        }

        if(this.state.currentOption.id==='wif'){

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
                    this.state.currentOption.id==='nep6'?
                    <Nep6Import goMyWallet={this.goMyWallet} ref='nep6'/>:
                    (this.state.currentOption.id==='nep2'?
                    <Nep2Import goMyWallet={this.goMyWallet} ref='nep2'/>:
                    <WifImport goMyWallet={this.goMyWallet} ref='wif' />)
                }                        
                <div className="form-btn-list">
                    <div className="btn-first">
                        <Button type='warn' text="取消" onClick={this.goBack}/>
                    </div>
                    <div>
                        <Button type='primary' text="确定" onClick={this.loadWallet}/>
                    </div>
                </div>
            </div>
        )
	}
}