/**
 * 交易记录组件
 */
/// <reference path="../../../../../src/lib/neo-thinsdk.d.ts" />
import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import Transfer from '../transfer';
import QrCodeBox from '../qrcode';
// import { neotools } from '../../utils/neotools';
import { observer } from 'mobx-react';
import { bg } from '../../utils/storagetools';

@observer
export default class Assets extends React.Component<any, {}> 
{
	constructor(props: any)
	{
		super(props);		
    } 
    public state={
        showNumber:0,  // 0为不显示弹框，1为显示收款弹框，2为显示转账弹框
    }
    componentDidMount(){        
        // neotools.invokeTest();
        // bg.getBalance()
    }   

    public onShowQrcode = () =>
	{
        this.setState({showNumber:1})
    }
    public onCloseModel=()=>{
        this.setState({showNumber:0});
    }

	public onShowTransfer = () =>
	{
        this.setState({showNumber:2})
	}

	public render()
	{
		return (
            <div className="assets">
                <div className="btn-list">
                    <div className="address">
                        <Button text="收款" size="adaptation" onClick={this.onShowQrcode} />
                    </div>
                    <div className="transfer">
                        <Button text="转账" size="adaptation" onClick={this.onShowTransfer} />
                    </div>
                </div>
                <div className="asset-list">
                    <div className="title">资产列表</div>
                    <div className="asset-panel">
                        <div className="asset-name">NEO</div>
                        <div className="asset-amount">999999.99999999</div>
                    </div>
                    <div className="asset-panel">
                        <div className="asset-name">GAS</div>
                        <div className="asset-amount">999999.99999999</div>
                    </div>
                    <div className="asset-panel">
                        <div className="asset-name">CGAS</div>
                        <div className="asset-amount">999999.99999999</div>
                    </div>
                    <div className="asset-panel">
                        <div className="asset-name">CNEO</div>
                        <div className="asset-amount">999999.99999999</div>
                    </div>
                </div>
                <QrCodeBox show={this.state.showNumber === 1} onHide={this.onCloseModel} />
                <Transfer show={this.state.showNumber === 2} onHide={this.onCloseModel} />                
            </div>
		);
	}
}
