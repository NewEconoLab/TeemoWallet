// 输入框组件
import * as React from 'react';
import Select, { IOption } from '../../../../components/Select';
import Button from '../../../../components/Button';
import Nep6Import from './nep6';
import Nep2Import from './nep2';
import WifImport from './wif';
import intl from '../../../store/intl';

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
        {id:"nep6",name:intl.message.walletnew.option_nep6},
        {id:"nep2",name:intl.message.walletnew.option_nep2},
        {id:"wif",name:intl.message.walletnew.option_wif},
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
            let test = this.refs.wif['loadWallet']
            test();
        }
    }

	public render() {
        return(            
            <div className="form">
                <div className="form-title">
                    <Select text={intl.message.walletnew.importFrom} options={this.options} onCallback={this.onSelectModule}/>
                </div>
                {
                    // 该方法为了渲染form表单对应不同栏目的内容
                    this.state.currentOption.id==='nep6'&&
                    <Nep6Import goMyWallet={this.goMyWallet} ref='nep6'/>
                }                        
                {
                    this.state.currentOption.id==='nep2'&&
                    <Nep2Import goMyWallet={this.goMyWallet} ref='nep2'/>
                }
                {
                    this.state.currentOption.id==='wif'&&                    
                    <WifImport goMyWallet={this.goMyWallet} ref='wif' />
                }
                <div className="form-btn-list">
                    <div className="btn-first">
                        <Button type='warn' size='small-big' text={intl.message.button.cancel} onClick={this.goBack}/>
                    </div>
                    <div>
                        <Button type='primary' size='small-big' text={intl.message.button.confirm} onClick={this.loadWallet}/>
                    </div>
                </div>
            </div>
        )
	}
}