/**
 * 按钮组件
 */
import * as React from 'react';
import { observer } from 'mobx-react';
import './index.less';
import common from '../../store/common';
import QrMakeCode from '../../utils/qrcode';
import Toast from '../../../components/Toast'
import intl from '../../store/intl';

interface IProps
{
	lableChange: (table: string) => void
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
		codeLink: common.account.address,
	  }
	public componentDidMount(){
		const div = document.getElementById('qrcode')
		QrMakeCode(div,common.account.address);
	}
	public onHide=()=>{
		if (this.props.lableChange)
		{
			this.props.lableChange('');
		}
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
		Toast(intl.message.toast.copySuccess);
		
	}
	public render()
	{
		return (
			<div className="qrcode-box">
				<div className="qrcode-wrapper">
					<div className="qrcode-code" id="qrcode" />
					<div className="qrcode-addr" onClick={this.onCopyAddress}>{common.account.address}</div>
					<p className="qrcode-copy">（{intl.message.assets.copy}）</p>
				</div>
			</div>
		);
	}
}