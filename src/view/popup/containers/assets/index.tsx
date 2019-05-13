/**
 * 交易记录组件
 */
/// <reference path="../../../../../src/lib/neo-thinsdk.d.ts" />
import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import { observer } from 'mobx-react';
import common from '../../store/common';
import ClaimGAS from './claimgas';
import intl from '../../store/intl';
import classnames from 'classnames';
import NoAsset from './noasset';
import manageStore from '../manage/store/manage.store';
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
        tranAsset: "",
        assetData: null,
        activeLable: "assets",
        showAlert:0
    }
    componentDidMount()
    {        
        manageStore.initAssetList()
        // common.initAccountBalance();
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
        if(manageStore.myAssets.length<1)
        {
            this.setState({showAlert:1});
        }
        else if (this.props.lableChange)
        {
            console.log("按钮触发转账");
            
            this.props.lableChange('transfer', this.state.tranAsset);
        }
    }
    // 显示NEO转账
    public transfer = (assetID:string) =>
    {
        this.setState({
            tranAsset: assetID
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
    public onCloseModel =()=>{
        this.props.lableChange('manage');
        this.setState({
            showAlert:0
        })
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
                        <Button text={intl.message.assets.receiving} onClick={this.onShowQrcode} />
                    </div>
                    <div className="transfer">
                        <Button text={intl.message.assets.transfer} onClick={this.onShowTransfer} />
                    </div>
                </div>
                <div className="asset-list">
                    <div className="title">
                        {intl.message.assets.assetlist}
                        <div className="add-balance" onClick={this.showManage}>
                            <img className="add-icon" src={require("../../../image/add.png")} alt=""/>
                            <span className="add-text">{intl.message.assets.manager}</span>
                        </div>
                    </div>
                    {   
                        // common.balances && JSON.stringify(common.balances)!=='{}'&&
                        common.balances && common.balances.map(asset=>{                         
                            return(                                
                                <div className="asset-panel" onClick={this.transfer.bind(this,asset.assetID)}>
                                    <div className="asset-name">{asset.symbol}</div>
                                    <div className={loadClassName}>{Neo.Fixed8.parse(asset.amount.toString()).toString()}</div>
                                </div>
                            )
                        })
                    }
                </div>
                
                <NoAsset show={this.state.showAlert === 1} onHide={this.onCloseModel} />
            </div>
        );
    }
}
