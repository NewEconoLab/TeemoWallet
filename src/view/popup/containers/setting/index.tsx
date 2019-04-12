/**
 * 设置
 */
import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import { observer } from 'mobx-react';
import Select, { IOption } from '../../../components/Select';
interface IProps
{
    lableChange: (table: string) => void
}
@observer
export default class Setting extends React.Component<IProps, {}>
{
    constructor(props: any)
    {
        super(props);
    }
    public timeOptions: IOption[] = [
        { id: '0.3', name: '30秒' },
        { id: '5', name: '5分钟' },
        { id: '15', name: '15分钟' },
        { id: '30', name: '30分钟' },
        { id: '0', name: '不上锁' }
    ]
    // 返回上一页
    // public goBack = ()=> {
    //     if (this.props.lableChange)
    //     {
    //         this.props.lableChange('history');
    //     }
    // }
    public render()
    {
        return (
            <div className="setting-wrapper">
                <div className="setting-content">
                    <div className="normal-setting">
                        <div className="normal-left">
                            <span className="bold-text">自动上锁 </span>
                        </div>
                        <div className="normal-right">
                            <Select options={this.timeOptions} text="" />
                        </div>
                    </div>
                    <div className="normal-setting">
                        <div className="normal-left">
                            <span className="bold-text">清空交易记录 </span>
                        </div>
                        <div className="normal-right">
                            <Button text="清空" size="small" />
                        </div>
                    </div>
                    <div className="normal-setting">
                        <div className="normal-left">
                            <span className="bold-text">清除授权</span>                            
                        </div>
                        <div className="normal-right">
                            <Button text="清除" size="small" />
                        </div>
                    </div>
                    <p className="normal-text">所有应用都需要重新请求授权，才能发起交易请求。</p>
                </div>
                {/* <div className="setting-footer">
                    <Button text="确认" size="adaptation" onClick={this.goBack}/>
                </div> */}
            </div>
        );
    }
}
