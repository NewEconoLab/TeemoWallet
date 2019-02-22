import * as React from 'react';
import './reset.less';
import Home from './containers/home';

export interface Props
{
    name: string;
    enthusiasmLevel?: number;
}

export default class Notify extends React.Component<Props, any> 
{
    constructor(props: Props, state: any) 
    {
        super(props, state);
    }
    public prop = this.props;
    public state = {
        title:"",
        domain:"",
        scripthash:""
    }
    
    public componentDidMount() 
    {
        if(chrome.tabs)
        {            
            chrome.storage.local.get(notify=>{
                let info = notify['invokeParam'];
                alert(notify);
                
                // this.setState({
                //     title:info['refTitle'],
                //     domain:info['refDomain'],
                //     scripthash:info['scriptHash']
                // })
            })
        }
    }

    public setStorage()
    {
        chrome.storage.local.set({name:"notify"},()=>{
            alert("数据已存储");
        })
    }

    public render() 
    {
        return (
            <div className="notifyContainer">
                {/* 这里是Notify页面 来自{this.state.title}
                url:{this.state.domain}
                <Button text="开始"/> */}
                <Home {...this.props} />
            </div>
        )
    }
}
