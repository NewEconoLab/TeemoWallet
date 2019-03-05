/**
 * 按钮组件
 */
import * as React from 'react';
import { observer } from 'mobx-react';
import './index.less';
import Modal from '../../../components/Modal';
import common from '../../store/common';
import QrMakeCode from '../../utils/qrcode';
import Toast from '../../../components/Toast'

interface IProps
{
	show: boolean,
	onHide?:()=>void
}
interface IState
{
	codeLink:string
}

@observer
export default class QrCodeBox extends React.Component<IProps, IState>
{
	constructor(props: IProps)
	{
		super(props);
	}	
	public state = {
		codeLink: '',
	  }
	public componentDidMount(){
		const div = document.getElementById('qrcode')
		QrMakeCode(div,common.account.address);
	}
	public onHide=()=>{
		this.props.onHide?this.props.onHide():null;
	}
	// 复制地址
	public onCopyAddress = () => {		
		const oInput = document.createElement('input');
		oInput.value = this.state.codeLink;
		document.body.appendChild(oInput);
		oInput.select(); // 选择对象
		document.execCommand("Copy"); // 执行浏览器复制命令
		oInput.className = 'oInput';
		oInput.style.display = 'none';
		// alert(2)
		Toast("复制成功");
		
	  }
	public render()
	{
		return (
			<Modal title="收款" show={this.props.show}>
				<div className="qrcode-wrapper">
					<div className="qrcode-code" id="qrcode" />
					<div className="qrcode-addr" onClick={this.onCopyAddress}>{common.account.address}</div>
					<p className="qrcode-copy">（点击地址直接复制）</p>
				</div>
				<div className="qrcode-close" onClick={this.onHide}>
					<img src={require("../../../image/close.png")} alt="" />
				</div>
			</Modal>
		);
	}
}