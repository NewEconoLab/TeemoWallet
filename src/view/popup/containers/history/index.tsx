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
    hasAmount:boolean;
    hasFee:boolean;
    currentOption:IOption;
    options:IOption[];
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
        hasFee:false,
        hasAmount:false,
        options:
        [
            { id: "all", name: intl.message.history.all },
            { id: "GAS", name: "GAS" },
            { id: "CGAS", name: "CGAS" },
            { id: "NEO", name: "NEO" },
        ]
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
    onSelectModule = (call: IOption) =>
    {
        this.setState({ currentOption: call })
    }

    onCheck=(hasAmount:boolean)=>{
        // this.setState({hasFee})
        this.setState({hasAmount})
    }

    groupBy=(historylist:IHistory[])=>{
        const list:IHistory[] = [];
        for (const history of historylist) {
            if(this.state.hasAmount)
            {
                if(history.type==ConfirmType.contract)
                {
                    if(history.invokeHistory.expenses&&history.invokeHistory.expenses.length>0)
                    {
                        // if(history.invokeHistory.domain=="TeemoWallet.exchangeCgas")
                        //     console.log(history)
                        list.push(history)
                    }
                }
                else
                {
                    // if(history.sendHistory.fee&&history.sendHistory.fee!='0')
                    if(Neo.Fixed8.parse(history.sendHistory.amount).compareTo(Neo.Fixed8.Zero)>0)
                        list.push(history)
                }
            }
            else
            {
                list.push(history)
            }
        }
        const panellist = list.sort((a,b)=>{
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
                    <div className="filter-checkbox">
                        <Checkbox text={intl.message.history.hide} onClick={this.onCheck}></Checkbox>
                    </div>
                    { historylist.length !== 0 && this.groupBy(historylist).map(task=><Panel task={task} ></Panel>) }
                </div>
            </div>
        );
    }
}
