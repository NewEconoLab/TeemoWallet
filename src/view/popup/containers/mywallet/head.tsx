// 输入框组件
import * as React from 'react';
import { ICON } from '../../../image';
import Chooser, { IOption } from '../../../components/Chooser';
import Modal from '../../../components/Modal';
import Exchange from '../exchange';

// @observer
export default class Input extends React.Component<any, {}> {
	constructor(props: any) {
		super(props);
    }

    public state={
        exchange:false
    }

    public options:IOption[]=[
        {id:'exchange',name:'CGAS兑换',icon:ICON.exchange},
        {id:'browser',name:'区块链浏览器',icon:ICON.bc},
        {id:'nns',name:'NNS',icon:ICON.nns},
        {id:'dice',name:'DICE',icon:ICON.nns}
    ]

    public cutFunction =(option:IOption)=>
    {
        if(option.id == 'exchange')
        {
            this.setState({
                exchange:true
            })
        }
    }

	public render() {
		return (
            <div className="head">
                <div className="functionRow">
                    <div className="list">
                        <div className="walletCode">
                            <img  width='30px' height='30px'/>
                            <span>我的钱包1</span>
                        </div>
                        <div className="function">
                            <Chooser options={this.options} onCallback={this.cutFunction} >
                                <img src={ICON.FUNCTION} height={24} />
                            </Chooser>
                        </div>
                        <div className="out">
                            <img src={ICON.LOGOUT} height={24}/>
                        </div>
                    </div>
                    <div className="address">ALp9DVGJAvApjLWSQbA6S9qX7dEwnRwdaf</div>
                </div>
                <div className="lablelist">
                    <div className="lable active"><span>交易记录</span></div>
                    <div className="lable"><span>资产</span></div>
                </div>
                <Exchange show={this.state.exchange} ></Exchange>
            </div>
		);
	}
}