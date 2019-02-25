/**
 * 交易记录组件
 */
import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import Transfer from '../transfer';
import { neotools } from '../../utils/neotools';
// @observer
export default class Assets extends React.Component<any, {}> 
{
	constructor(props: any)
	{
		super(props);		
    }

    componentDidMount(){
        
        neotools.invokeTest();
    }
    
    public state={
        transfer:false
    }

	// 监控输入内容
	public onClick = () =>
	{
        this.setState({transfer:true})
	}

	public render()
	{
		return (
            <div className="assets">
                <div className="btn-list">
                    <div className="address">
                        <Button text="收款" size="adaptation" />
                    </div>
                    <div className="transfer">
                        <Button text="转账" size="adaptation" onClick={this.onClick} />
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
                <Transfer show={this.state.transfer}></Transfer>
            </div>
		);
	}
}
