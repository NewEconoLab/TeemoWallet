import React from "react";
import { RouteComponentProps } from "react-router";
import './index.less'

interface AppProps extends RouteComponentProps {
    develop:boolean;
}

interface AppState {
    develop:boolean;
}
export default class WalletHeader extends React.Component<any> {
    constructor(props: any, state: AppState) {
        super(props, state);
    }
    
    render() {
        return (
            <div className="walletHead">
                <div className="functionRow">
                    <div className='header'>
                        <img src="" alt=""/>
                        <span>我的钱包1</span>
                    </div>
                    <div className="function">
                        <div className="functionlist">
                            <img src="../../../image/function.png" alt="" />
                        </div>
                        <div className="out">
                            <img src="../../../image/logout.png" alt=""/>
                        </div>
                    </div>
                </div>
                <div className="lablelist">
                    <div className="lable">交易记录</div>
                    <div className="lable">资产</div>
                </div>
            </div>
        )
    }
}