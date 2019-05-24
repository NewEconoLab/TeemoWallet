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
import intl from '../../store/intl';
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
    // 返回上一页
    
    public componentDidMount()
    {
        const time = localStorage.getItem('Teemo-setting-disconnection');
        // console.log(time);
        
        this.setState({
            currentOptin:time?time:'0'
        },()=>{
            // console.log('初始化结束',this.state.currentOptin);            
        });
    }

    public settingDisconne=(event:IOption)=>{
        this.setState({currentOptin:event.id});
        bg.AccountManager.settingDisconnection(parseInt(event.id));
    }

    public cleanTrustList = ()=>{
        bg.AccountManager.cleanTrustList();
        Toast(intl.message.setting.successful);
    }

    public cleanHistory = ()=>{
        bg.cleanHistory();
        Toast(intl.message.setting.successful);
    }

    public render()
    {
        const timeOptions: IOption[] = [
            { id: '0', name: intl.message.setting.off },
            { id: '30000', name: `30${intl.message.setting.second}` },
            { id: '300000', name: `5${intl.message.setting.minute}` },
            { id: '900000', name: `15${intl.message.setting.minute}` },
            { id: '1800000', name: `30${intl.message.setting.minute}` },
        ]
        const current =timeOptions.find(opt => opt.id == this.state.currentOptin)        
        return (
            <div className="setting-wrapper">
                <div className="setting-content">
                    <div className="normal-setting">
                        <div className="normal-left">
                            <span className="bold-text">{intl.message.setting.autoLock} </span>
                        </div>
                        <div className="normal-right">
                            <Select options={timeOptions} text="" onCallback={this.settingDisconne}  currentOption={current} />
                        </div>
                    </div>
                    <div className="normal-setting">
                        <div className="normal-left">
                            <span className="bold-text">{intl.message.setting.clearTx} </span>
                        </div>
                        <div className="normal-right">
                            <Button text={intl.message.setting.clear} size="small" onClick={this.cleanHistory} />
                        </div>
                    </div>
                    <div className="normal-setting">
                        <div className="normal-left">
                            <span className="bold-text">{intl.message.setting.clearAuthorization}</span>                            
                        </div>
                        <div className="normal-right">
                            <Button text={intl.message.setting.clear} size="small" onClick={this.cleanTrustList} />
                        </div>
                    </div>
                    <p className="normal-text">{intl.message.setting.message}</p>
                </div>
                {/* <div className="setting-footer">
                    <Button text="确认" size="adaptation" onClick={this.goBack}/>
                </div> */}
            </div>
        );
    }
}
