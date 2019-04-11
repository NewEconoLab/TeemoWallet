/**
 * 交易记录组件
 */
/// <reference path="../../../../../src/lib/neo-thinsdk.d.ts" />
import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import Transfer from '../transfer';
// import QrCodeBox from '../qrcode';
// import { neotools } from '../../utils/neotools';
import { observer } from 'mobx-react';
import common from '../../store/common';
import { HASH_CONFIG } from '../../../config';
import ClaimGAS from './claimgas';
import intl from '../../store/intl';
import classnames from 'classnames';
interface IProps
{
    lableChange: (table: string, asset?: string) => void
}
@observer
export default class Assets extends React.Component<IProps, {}>
{
    constructor(props: IProps)
    {
        super(props);
    }
    public state = {
        showNumber: 0,  // 0为不显示弹框，1为显示收款弹框，2为显示转账弹框
        tranAsset: HASH_CONFIG.ID_GAS,
        assetData: null,
        activeLable: "assets"
    }
    componentDidMount()
    {
        common.initAccountBalance();
    }
    // 显示收款码
    public onShowQrcode = () =>
    {
        if (this.props.lableChange)
        {
            this.props.lableChange('qrcode');
        }
    }
    // 显示转账
    public onShowTransfer = () =>
    {
        if (this.props.lableChange)
        {
            this.props.lableChange('transfer', this.state.tranAsset);
        }
    }
    // 显示NEO转账
    public transferNEO = () =>
    {
        this.setState({
            tranAsset: HASH_CONFIG.ID_NEO
        }, () =>
            {
                this.onShowTransfer();
            })
    }
    // 显示CGAS转账
    public transferCGAS = () =>
    {
        this.setState({
            tranAsset: HASH_CONFIG.ID_CGAS.toString()
        }, () =>
            {
                this.onShowTransfer();
            })
    }
    // 显示GAS转账
    public transferGas = () =>
    {
        this.setState({
            tranAsset: HASH_CONFIG.ID_GAS
        }, () =>
            {
                this.onShowTransfer();
            })
    }
    // 显示NNC转账
    public transferNNC = () =>
    {
        this.setState({
            tranAsset: HASH_CONFIG.ID_NNC.toString()
        }, () =>
            {
                this.onShowTransfer();
            })
    }
    // 跳转到管理代币
    public showManage = () =>
    {
        if (this.props.lableChange)
        {
            this.props.lableChange('manage');
        }
    }
    public render()
    {
        const loadClassName = classnames('asset-amount', {
            'loading-amount': !this.state.assetData ? true : false
        })
        return (
            <div className="assets">
                <ClaimGAS />
                <div className="btn-list">
                    <div className="address">
                        <Button text={intl.message.assets.receiving} size="adaptation" onClick={this.onShowQrcode} />
                    </div>
                    <div className="transfer">
                        <Button text={intl.message.assets.transfer} size="adaptation" onClick={this.onShowTransfer} />
                    </div>
                </div>
                <div className="asset-list">
                    <div className="title">
                        {intl.message.assets.assetlist}
                        <div className="add-balance" onClick={this.showManage}>
                            <img className="add-icon" src={require("../../../image/add.png")} alt=""/>
                            <span className="add-text">管理代币</span>
                        </div>
                    </div>
                    <div className="asset-panel" onClick={this.transferNEO}>
                        <div className="asset-name">NEO</div>
                        <div className={loadClassName}>{Neo.Fixed8.fromNumber(common.balances.NEO).toString()}</div>
                    </div>
                    <div className="asset-panel" onClick={this.transferGas}>
                        <div className="asset-name">GAS</div>
                        <div className={loadClassName}>{Neo.Fixed8.fromNumber(common.balances.GAS).toString()}</div>
                    </div>
                    <div className="asset-panel" onClick={this.transferCGAS}>
                        <div className="asset-name">CGAS</div>
                        <div className={loadClassName}>{Neo.Fixed8.fromNumber(common.balances.CGAS).toString()}</div>
                    </div>
                    <div className="asset-panel" onClick={this.transferNNC}>
                        <div className="asset-name">NNC</div>
                        <div className={loadClassName}>{Neo.Fixed8.fromNumber(common.balances.NNC).toString()}</div>
                    </div>
                </div>

            </div>
        );
    }
}
