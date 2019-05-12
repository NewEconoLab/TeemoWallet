/**
 * 钱包编辑
 */
import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import { observer } from 'mobx-react';
import Toast from '../../../components/Toast';
import common from '../../store/common';
import { bg } from '../../utils/storagetools';
import intl from '../../store/intl';
import { ICON } from '../../../image';
// import PrivateKey from './privatekey';
// import DeleteWallet from './deletewallet';
interface IProps
{
    lableChange: (table: string) => void,
}
@observer
export default class About extends React.Component<IProps, {}>
{
    constructor(props: any)
    {
        super(props);
    }

    componentDidMount(){
        
    }
    
    public render()
    {
        return(
            <div className="about-wrapper">
                <div className="about-content">
                    <div className="about-info about-line">
                        <div className="icon-box">
                            <img src={ICON.icon} alt=""/>
                        </div>
                        <div className="icon-title"></div>
                        <div className="about-version">{intl.message.about.version}  V1.2.0</div>
                    </div>
                    <div className="href-line about-line">
                        <a href="">{intl.message.about.website}</a>
                    </div>
                    <div className="href-line about-line">
                        <a href="">{intl.message.about.help}</a>
                    </div>
                    <div className="about-foot">
                        <a href="">{intl.message.about.policy} </a>
                        {intl.message.about.and}
                        <a href="">{intl.message.about.disclaimer}</a>
                    </div>
                </div>
            </div>
        )
    }
}