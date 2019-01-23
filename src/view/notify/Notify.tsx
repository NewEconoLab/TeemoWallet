import * as React from 'react';

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
    
    public componentDidMount() 
    {
        chrome.storage.local.get(notify=>{
            console.log(notify);
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
                这里是Notify页面
                <button onClick={this.setStorage}>塞入信息</button>
            </div>
        )
    }
}
