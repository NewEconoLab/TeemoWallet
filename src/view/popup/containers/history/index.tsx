/**
 * 交易记录组件
 */
import * as React from 'react';
import './index.less';
import Panel from '../../../components/Panel';
import Select, { IOption } from '../../../components/Select';
import Checkbox from '../../../components/Checkbox';
import { observer } from 'mobx-react';
import { TaskState, IHistory, ConfirmType } from './store/interface/history.interface';
import historyStore from './store/history.store';
import intl from '../../store/intl';
interface IState
{
    hasFee:boolean;
    currentOption:IOption;
}

@observer
export default class History extends React.Component<any, {}>
{
    constructor(props: any)
    {
        super(props);
    }

    state: IState = {
        currentOption:{ id: "all", name: intl.message.history.all },
        hasFee:false
    }

    componentDidMount()
    {
        setInterval(()=>{
            historyStore.initHistoryList();
        },2000)        
    }

    // 监控输入内容
    public onClick = () =>
    {
        if (this.props.onClick)
        {
            this.props.onClick();
        }
    }
    public options: IOption[] =
    [
        { id: "all", name: intl.message.history.all },
        { id: "GAS", name: "GAS" },
        { id: "CGAS", name: "CGAS" },
        { id: "NEO", name: "NEO" },
    ];
    onSelectModule = (call: IOption) =>
    {
        this.setState({ currentOption: call })
    }

    onCheck=(hasFee:boolean)=>{
        this.setState({hasFee})
    }

    groupBy=(historylist:IHistory[])=>{
        const list:IHistory[] = [];
        for (const history of historylist) {
            if(this.state.hasFee)
            {
                if(history.type==ConfirmType.contract)
                {
                    if(history.invokeHistory.netfee&&history.invokeHistory.netfee!='0')
                        list.push(history)
                }
                else
                {
                    if(history.sendHistory.fee&&history.sendHistory.fee!='0')
                        list.push(history)
                }
            }
            else
            {
                list.push(history)
            }
        }
        const tasklist:IHistory[] = [];
        for (const task of list) {
            if(this.state.currentOption.id=='all')
                tasklist.push(task);
            else
            {
                if(task.type==ConfirmType.contract){                    
                    const res =task.invokeHistory.expenses.findIndex(task=>task.symbol==this.state.currentOption.name);
                    if(res>-1)
                    {                        
                        tasklist.push(task);
                    }
                }
                else
                {
                    if(task.sendHistory.symbol==this.state.currentOption.id)
                    tasklist.push(task);
                }
            }
        }
        const panellist = tasklist.sort((a,b)=>{
            return b.startTime-a.startTime
        })
        return panellist;
    }

    public render()
    {
        const waitlist=[];
        const historylist:IHistory[] = [];
        historyStore.taskList.forEach((task) =>
        {
            if (task.state == TaskState.watting || task.state == TaskState.watForLast)
                waitlist.push(task);
            else
                historylist.push(task);
        })
        return (
            <div className="transactionlist">
                {
                waitlist.length > 0 &&
                <div className={historyStore.taskList.length > 0?'waitlist mbottom':'waitlist'}>
                    <div className="title">{intl.message.history.wait}</div>
                    {waitlist.sort((a,b)=>b.startTime-a.startTime).map(task=><Panel task={task} ></Panel>)}
                </div>
                }
                <div className="history">
                    <div className="title">{intl.message.history.tranHistory}</div>
                    <div className="filter">
                        <div className="filter-select">
                            <Select text="" options={this.options} onCallback={this.onSelectModule} />
                        </div>
                        <div className="filter-checkbox">
                            <Checkbox text={intl.message.history.hide} onClick={this.onCheck}></Checkbox>
                        </div>
                    </div>
                    { historylist.length !== 0 && this.groupBy(historylist).map(task=><Panel task={task} ></Panel>) }
                </div>
            </div>
        );
    }
}
