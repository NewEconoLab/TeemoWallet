import * as React from 'react';
import './reset.less';
import Home from './containers/home';
import { observer } from 'mobx-react';

export interface Props
{
    name: string;
    enthusiasmLevel?: number;
}

@observer
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
        scripthash:"",
        label:""
        
    }

    public setStorage()
    {
        chrome.storage.local.set({name:"notify"},()=>{
        })
    }

    public render() 
    {
        return (
            <div className="notifyContainer">
                {/* 这里是Notify页面 来自{this.state.title}
                url:{this.state.domain}
                <Button text="开始"/> */}
                {
                    <Home {...this.props}/>
                }
            </div>
        )
    }
}
