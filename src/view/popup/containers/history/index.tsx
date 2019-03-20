/**
 * 交易记录组件
 */
import * as React from 'react';
import './index.less';
import Panel from '../../../components/Panel';
import Select, { IOption } from '../../../components/Select';
import Checkbox from '../../../components/Checkbox';
import { Storage_local } from '../../../../common/util';
import { observer } from 'mobx-react';
interface IState
{
    tasklist: Task[];
}
export enum TaskState
{
    watting = 0,
    success = 1,
    fail = 2,
    watForLast = 3,
    failForLast = 4
}
export enum ConfirmType
{
    tranfer = 0,
    contract = 1
}
export interface Task
{
    height: number;
    confirm: number;
    type: ConfirmType;
    txid: string;
    message: any;
    state: TaskState;
    startTime: number;
    next?: TransferGroup;
}
export interface TransferGroup
{
    txid: string;
    txhex: string;
    executeError?: {
        type: string;
        data: string;
        description: string;
    };
}
@observer
export default class History extends React.Component<any, {}>
{
    constructor(props: any)
    {
        super(props);
    }

    state: IState = {
        tasklist: []
    }

    componentDidMount()
    {
        Storage_local.get<{ [txid: string]: Task }>("Task-Manager-shed")
            .then(shed =>
            {
                if (shed)
                {
                    const list: Task[] = [];
                    for (const txid in shed)
                    {
                        if (shed.hasOwnProperty(txid))
                        {
                            const task = shed[txid];
                            list.push(task);
                        }
                    }
                    list.sort((a, b) => b.startTime - a.startTime)
                    this.setState({
                        tasklist: list
                    }, () =>
                    {
                        console.log(this.state.tasklist);
                    })
                }
            })
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
            { id: "all", name: "全部" },
            { id: "gas", name: "GAS" },
            { id: "cgas", name: "CGAS" },
            { id: "neo", name: "NEO" },
        ];
    onSelectModule = (call: IOption) =>
    {
        this.setState({ currentOption: call })
    }

    public render()
    {
        console.log("--------------------任务列表数量是");

        return (
            <div className="transactionlist">
                <div className={this.state.tasklist.length > 0?'waitlist mbottom':'waitlist'}>
                    {
                        this.state.tasklist.length > 0 && <div className="title">排队中</div>
                    }
                    {this.state.tasklist.length > 0 && this.state.tasklist.map((task, key) =>
                    {
                        if (task.state == TaskState.watting || task.state == TaskState.watForLast)
                            return (<Panel task={task} ></Panel>)
                    })}
                </div>
                <div className="history">
                    <div className="title">交易历史</div>
                    <div className="filter">
                        <div className="filter-select">
                            <Select text="" options={this.options} onCallback={this.onSelectModule} />
                        </div>
                        <div className="filter-checkbox">
                            <Checkbox text="隐藏0GAS"></Checkbox>
                        </div>
                    </div>
                    {this.state.tasklist.length !== 0 && (this.state.tasklist.map((task, key) =>
                    {
                        if (task.state != TaskState.watting && task.state != TaskState.watForLast)
                            return (<Panel task={task} ></Panel>)
                    }))}
                </div>
            </div>
        );
    }
}
