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
import intl from '../../store/intl';

@observer
export default class Assets extends React.Component<any, {}> 
{
	constructor(props: any)
	{
		super(props);		
    } 
    public state={
        showNumber:0,  // 0为不显示弹框，1为显示收款弹框，2为显示转账弹框
        tranAsset:HASH_CONFIG.ID_GAS,
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
            tranAsset:HASH_CONFIG.ID_NEO
        },()=>{
            this.setState({
                showNumber:2})
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
                        <Button text={intl.message.assets.receiving} size="adaptation" onClick={this.onShowQrcode} />
                    </div>
                    <div className="transfer">
                        <Button text={intl.message.assets.transfer} size="adaptation" onClick={this.onShowTransfer} />
                    </div>
                </div>
                <div className="asset-list">
                    <div className="title">{intl.message.assets.assetlist}</div>
                    <div className="asset-panel" onClick={this.transferNEO}>
                        <div className="asset-name">NEO</div>
                        <div className="asset-amount">{Neo.Fixed8.fromNumber(common.balances.NEO).toString()}</div>
                    </div>
                    <div className="asset-panel" onClick={this.transferGas}>
                        <div className="asset-name">GAS</div>
                        <div className="asset-amount">{Neo.Fixed8.fromNumber(common.balances.GAS).toString()}</div>
                    </div>
                    <div className="asset-panel" onClick={this.transferCGAS}>
                        <div className="asset-name">CGAS</div>
                        <div className="asset-amount">{Neo.Fixed8.fromNumber(common.balances.CGAS).toString()}</div>
                    </div>
                    <div className="asset-panel" onClick={this.transferNNC}>
                        <div className="asset-name">NNC</div>
                        <div className="asset-amount">{Neo.Fixed8.fromNumber(common.balances.NNC).toString()}</div>
                    </div>
                </div>
                <QrCodeBox show={this.state.showNumber === 1} onHide={this.onCloseModel} />
                {this.state.showNumber==2&&<Transfer show={this.state.showNumber === 2} onHide={this.onCloseModel} asset={this.state.tranAsset} />                }
            </div>
		);
	}
}
