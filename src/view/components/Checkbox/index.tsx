/**
 * checkbox
 */
import * as React from 'react';
import './index.less';
import { ICON } from '../../image';
import classNames from 'classnames';

interface IProps
{
	onClick?: (call:boolean) => void,
	style?: object,
	disabled?: boolean, // 按钮是否禁止点击
    text: string
}

// @observer
export default class Checkbox extends React.Component<IProps, {}> 
{
    public state={
        value:false
    };
	constructor(props: IProps)
	{
		super(props);		
	}
	// 监控输入内容
	public onClick = () =>
	{
        this.setState({
            value:!this.state.value
        },
        ()=>{       
            if (this.props.onClick)
            {
                this.props.onClick(this.state.value);
            }
        })
	}
	public render()
	{
        const text = classNames("text",{"active":this.state.value})
		return (
            <div className="checkbox" onClick={this.onClick}>
                <div className="box" >
                    {
                        this.state.value?
                        <img src={ICON.checked} width={14}/>:
                        <img src={ICON.unchecked} height={14}/>
                    }
                </div>
                <div className={text} style={this.props.style}>{this.props.text}</div>
			</div>
		);
	}
}
