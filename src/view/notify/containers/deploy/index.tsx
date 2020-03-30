import * as React from 'react';
// import { injectIntl } from 'react-intl';
import './index.less';
import { observer } from 'mobx-react';
import intl from '../../../popup/store/intl';
import { DeployContractArgs } from '../../../../common/entity';
import { Background } from '../../../../lib/background';
import { Storage_local } from '../../../../common/util';

interface IPorps {
    title: string;
    domain: string;
    data: any;
    address: string;
}

@observer
export default class DeployRequest extends React.Component<IPorps>{

    public bg: Background = chrome.extension.getBackgroundPage() as Background;
    public state = {
        pageNumber: 0, // 0为上一页，1为下一页
        data: null,
        scriptHash: "",
        // contractName: "",
        fee: '0',
        scripthex: "",
        // call: false,           // 是否动态调用
        // storage: false,        // 是否存储区
        // payment: false,        // 是否支持付费
        mainfest: "",
        nefhex: ""
    }
    public componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data
        }, () => {
            this.getRenderState();
        })
    }

    // 更新数据
    public getRenderState = () => {
        if (this.state.data) {
            this.initData(this.state.data);
        }
    }

    // 初始化state
    public initData = (data: DeployContractArgs) => {
        const nef = Neo.SmartContract.NefFile.loadNef(data.nefhex);
        console.log("nef scriptHash", nef.scriptHash);
        console.log("nef scripthex", nef.script.toHexString());
        this.setState({
            scriptHash: nef.scriptHash.toString(),
            scripthex: nef.script.toHexString(),
            mainfest: data.mainfest,
            fee: data.fee
        })
    }

    public netfeeChange = (check: boolean) => {
        Storage_local.set('checkNetFee', check);
    }

    public nextPage = () => {
        this.setState({
            pageNumber: 1
        })
    }
    public previousPage = () => {
        this.setState({
            pageNumber: 0
        })
    }
    public render() {
        return (
            <div className="ncontract-wrap">
                <div className="first-line">
                    {`${intl.message.history.from} ${this.props.domain}`}
                </div>
                <div className="second-line">
                    {intl.message.history.contract}
                </div>
                {/* <div className="second-line">
            请求签名 
          </div> */}
                {
                    this.state.pageNumber === 0 && (
                        <>
                            <div className="contract-title">{intl.message.notify.Info}</div>
                            <div className="transaction-wrap white-wrap">
                                <div className="line-wrap">
                                    <div className="line-left">{intl.message.notify.scriptHash}</div>
                                    <div className="line-right">
                                        <a href="#">{this.state.scriptHash.replace(/^(.{4})(.*)(.{4})$/, '$1...$3')}</a>
                                    </div>
                                </div>
                                {/* <div className="line-wrap">
                                    <div className="line-left">{intl.message.history.amount}</div>
                                    <div className="line-right">
                                        <span>
                                            {(this.state.call ? 500 : 0) + (this.state.storage ? 400 : 0) + 90 + 11} GAS
                                        </span>
                                    </div>
                                </div> */}
                                <div className="line-wrap">
                                    <div className="line-left">{intl.message.history.fee}</div>
                                    <div className="line-right">
                                        <span>{this.state.fee} GAS</span>
                                    </div>
                                </div>
                            </div>
                            <div className="contract-title">{intl.message.notify.dappNote}</div>
                            <div className="remark-content white-wrap">
                                {
                                    // this.state.contractName
                                }
                            </div>
                            <div className="previous-img" onClick={this.nextPage}>
                                <img src={require('../../../image/previous.png')} alt="" />
                            </div>
                        </>
                    )
                }
                {
                    this.state.pageNumber === 1 && (
                        <>
                            {/* <div className="contract-title">交易数据</div> */}
                            <div className="contract-title">{intl.message.notify.tranData}</div>

                            <div className="transaction-wrap white-wrap">
                                <div className="line-wrap">
                                    <div className="line-left">{intl.message.notify.scriptHash}</div>
                                    <div className="line-right">
                                        <a href="#">{this.state.scriptHash.replace(/^(.{4})(.*)(.{4})$/, '$1...$3')}</a>
                                    </div>
                                </div>
                            </div>

                            <div className="contract-title">Script (hex)</div>
                            <div className="remark-content white-wrap hex">
                                {
                                    this.state.scripthex
                                }
                            </div>
                            {/* <div className="transaction-content">
                                    <span>内容</span>
                                </div> 
                            */}
                            <div className="contract-title">Manifest</div>
                            <pre className="remark-content white-wrap">
                                {
                                    JSON.stringify(JSON.parse(this.state.mainfest), null, 3)
                                }
                            </pre>
                            <div className="previous-img" onClick={this.previousPage}>
                                <img src={require('../../../image/next.png')} alt="" />
                            </div>
                        </>
                    )
                }
            </div>
        );
    }
}