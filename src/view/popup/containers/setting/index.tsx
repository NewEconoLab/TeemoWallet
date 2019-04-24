/**
 * 设置
 */
import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import { observer } from 'mobx-react';
import Select, { IOption } from '../../../components/Select';
import { bg } from '../../utils/storagetools';
import Toast from '../../../components/Toast';
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
        const time = localStorage.getItem('Teemo-setting-disconnection')
        this.setState({
            currentOptins:time
        })
    }

    public state={
        currentOptin:'0'
    }

    public timeOptions: IOption[] = [
        { id: '0', name: '不上锁' },
        { id: '30000', name: '30秒' },
        { id: '300000', name: '5分钟' },
        { id: '900000', name: '15分钟' },
        { id: '1800000', name: '30分钟' },
    ]
    // 返回上一页
    
    public componentDidMount()
    {
        console.log("进来了");
        
        const time = localStorage.getItem('Teemo-setting-disconnection');
        console.log(time);
        
        this.setState({
            currentOptin:time
        },()=>{
            console.log('初始化结束',this.state.currentOptin);
            
        });
    }

    public settingDisconne=(event:IOption)=>{
        this.setState({currentOptin:event.id});
        bg.AccountManager.settingDisconnection(parseInt(event.id));
    }

    public cleanTrustList = ()=>{
        bg.AccountManager.cleanTrustList();
        Toast('授权已清除')
    }

    public render()
    {
        const timeOptions: IOption[] = [
            { id: '0', name: '不上锁' },
            { id: '30000', name: '30秒' },
            { id: '300000', name: '5分钟' },
            { id: '900000', name: '15分钟' },
            { id: '1800000', name: '30分钟' },
        ]
        return (
            <div className="setting-wrapper">
                <div className="setting-content">
                    <div className="normal-setting">
                        <div className="normal-left">
                            <span className="bold-text">自动上锁 </span>
                        </div>
                        <div className="normal-right">
                            <Select options={timeOptions} text="" onCallback={this.settingDisconne}  currentOption={timeOptions.find(opt => opt.id == this.state.currentOptin)} />
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
                            <Button text="清除" size="small" onClick={this.cleanTrustList} />
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
