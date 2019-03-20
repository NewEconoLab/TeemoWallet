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
import common from '../../store/common';
import { HASH_CONFIG } from '../../../config';

@observer
export default class Assets extends React.Component<any, {}> 
{
	constructor(props: any)
	{
		super(props);		
    } 
    public state={
        showNumber:0,  // 0为不显示弹框，1为显示收款弹框，2为显示转账弹框
        tranAsset:'',
    }
    componentDidMount(){
        common.initAccountBalance();
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
    
    public transferNEO=()=>{
        this.setState({
            showNumber:2,
            tranAsset:HASH_CONFIG.ID_NEO
        })
    }

    public transferCGAS=()=>{
        this.setState({
            showNumber:2,
            tranAsset:HASH_CONFIG.ID_CGAS.toString()
        })
    }

    public transferGas=()=>{
        this.setState({
            showNumber:2,
            tranAsset:HASH_CONFIG.ID_GAS
        })
    }
    
    public transferNNC=()=>{
        this.setState({
            showNumber:2,
            tranAsset:HASH_CONFIG.ID_NNC.toString()
        })
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
                    <div className="asset-panel" onClick={this.transferNEO}>
                        <div className="asset-name">NEO</div>
                        <div className="asset-amount">{common.balances.NEO}</div>
                    </div>
                    <div className="asset-panel" onClick={this.transferGas}>
                        <div className="asset-name">GAS</div>
                        <div className="asset-amount">{common.balances.GAS}</div>
                    </div>
                    <div className="asset-panel" onClick={this.transferCGAS}>
                        <div className="asset-name">CGAS</div>
                        <div className="asset-amount">{common.balances.CGAS}</div>
                    </div>
                    <div className="asset-panel" onClick={this.transferNNC}>
                        <div className="asset-name">NNC</div>
                        <div className="asset-amount">{common.balances.NNC}</div>
                    </div>
                </div>
                <QrCodeBox show={this.state.showNumber === 1} onHide={this.onCloseModel} />
                <Transfer show={this.state.showNumber === 2} onHide={this.onCloseModel} asset={this.state.tranAsset} />                
            </div>
		);
	}
}
