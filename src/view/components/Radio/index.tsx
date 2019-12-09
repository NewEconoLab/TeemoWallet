/**
 * checkbox
 */
import * as React from 'react';
import './index.less';
import { ICON } from '../../image';
import classNames from 'classnames';

interface Ioption {
    label: string;
    value: string;
}

interface IProps {
    onChange?: (call: string) => void,
    style?: object,
    disabled?: boolean, // 按钮是否禁止点击
    options: Ioption[]
    text?: string
}

// @observer
export default class Radio extends React.Component<IProps, {}>
{
    public state = {
        value: ''
    };
    constructor(props: IProps) {
        super(props);
    }
    // 监控输入内容
    public onClick = () => {
        if (this.props.disabled) {
            this.setState({
                value: ''
            })
        }
        else {
            this.setState({
                value: !this.state.value
            },
                () => {
                    if (this.props.onChange) {
                        this.props.onChange(this.state.value);
                    }
                })
        }
    }
    public render() {
        const text = classNames("text", { "active": this.state.value })
        return (
            <div className="radio-group" onClick={this.onClick}>
                {this.props.options.map(option => {
                    return (<div className={`radio ${this.state.value === option.value ? 'active' : ''}`} >
                        {
                            option.label
                        }
                    </div>)
                })}
                <div className={text} style={this.props.style}>{this.props.text}</div>
            </div>
        );
    }
}
