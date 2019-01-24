import * as React from 'react';
import Button from '../components/Button';

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
        chrome.storage.local.get(notify=>{
            let info = notify['refInfo'];
            alert(notify);
            
            this.setState({
                title:info['refTitle'],
                domain:info['refDomain'],
                scripthash:info['scriptHash']
            })
        })
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
            <div className="popupContainer">
                这里是Notify页面 来自{this.state.title}
                url:{this.state.domain}
                <Button text="开始"/>
            </div>
        )
    }
}
