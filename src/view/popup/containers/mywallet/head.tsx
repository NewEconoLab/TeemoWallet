// 输入框组件
import * as React from 'react';
import { ICON } from '../../../image';

// @observer
export default class Input extends React.Component<any, {}> {
	constructor(props: any) {
		super(props);
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
                            <img src={ICON.FUNCTION} height={20} />
                        </div>
                        <div className="out">
                            <img src={ICON.LOGOUT} height={20}/>
                        </div>
                    </div>
                    <div className="address">ALp9DVGJAvApjLWSQbA6S9qX7dEwnRwdaf</div>
                </div>
                <div className="lablelist">
                    <div className="lable active"><span>交易记录</span></div>
                    <div className="lable"><span>资产</span></div>
                </div>
            </div>
		);
	}
}