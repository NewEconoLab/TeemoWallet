/**
 * 代币管理
 */
import * as React from 'react';
import './index.less';
import { observer } from 'mobx-react';
import manageStore from './store/manage.store';
import intl from '../../store/intl';
interface IProps {
  lableChange: (table: string) => void
}

interface CheckedAsset extends AssetInfo{
  checked:boolean;
}

interface IState {
  checkedAssets: CheckedAsset[];
  searchList: AssetInfo[]
  checkedList: { name: string, amount: string, value: string, check: boolean }[],
  inputName: string
}

@observer
export default class ManageAsset extends React.Component<IProps, IState>
{
  constructor(props: any) {
    super(props);
    // manageStore.initAssetList()
    this.initMyCheckedAssets();

  }
  
  public componentDidMount()
  {
    manageStore.initAssetList()
    this.initMyCheckedAssets();
  }
  public state: IState = {
    checkedAssets: [],
    searchList: [],
    checkedList: [],
    inputName: '',// 搜索代币
  }

  public initMyCheckedAssets=()=>{
    const arr:CheckedAsset[]=[];
    for (const asset of manageStore.myAssets) {
      asset['checked']=true;
      arr.push(asset as CheckedAsset)
    }
    this.setState({checkedAssets:arr});
  }

  // 筛选状态
  public chooseStatus = (assetid:string) => {    
    const checkeds = this.state.checkedAssets;
    const index = checkeds.findIndex(info=>info.assetid===assetid);
    if(index>=0)
    {
      checkeds[index].checked = !checkeds[index].checked
    }
    else
    {
      const assetInfo = manageStore.allAsset.find(info=>info.assetid===assetid)
      assetInfo['checked']=true;
      checkeds.push(assetInfo as CheckedAsset)
    }
    this.setState({
      checkedAssets:checkeds
    })
  }
  public onChangeInput = (e: any) => {
    this.setState({
      inputName: e.target.value,
    },()=>{
    })
    const list = manageStore.queryAssetInfo(e.target.value);
    this.setState({
      searchList: list
    })
  }
  public onClearInput = () => {
    this.setState({
      inputName: ''
    })
  }
  // 返回上一页
  public goBack = () => {
    if (this.props.lableChange) {
      this.props.lableChange('history');
    }
  }
  public onSaveManage = () => {
    const arr = this.state.checkedAssets.filter(info=>info.checked).map(info=>info.assetid)
    manageStore.saveAssets(arr);
    if (this.props.lableChange) {
      this.props.lableChange('');
    }
  }
  public onCancel = () => {
    this.setState({
      checkedAssets: [],
      inputName: ''
    })
  }
  public onAddBalance = () => {
    for (const key in this.state.checkedAssets) {
      if (this.state.checkedAssets.hasOwnProperty(key)) {
        const value = this.state.checkedAssets[ key ];
        if (value) {
          manageStore.addAssetInfo(key);
        }
      }
    }
    manageStore.initAssetList();
  }
  public isChecked = (assetid: string) => {
    const checked = this.state.checkedAssets.find(info=>info.assetid==assetid)
    return checked?checked.checked:false;
  }
  public render() {
    return (
      <div className="manage-wrapper">
        <p className="tips-text">{intl.message.assets.message1}</p>
        <div className="search-asset">
          <input type="text" placeholder={intl.message.assets.message2} value={this.state.inputName} onChange={this.onChangeInput} />
          <img className="search-icon" src={require('../../../image/search.png')} alt="" />
          {
            this.state.inputName !== '' && <img className="clear-search" src={require("../../../image/close3.png")} alt="" onClick={this.onClearInput} />
          }

        </div>
        {/* <div className="nodata-wrapper">
          <img className="nodata-img" src={require("../../../image/quesheng.png")} alt=""/>
          <p>没有搜索结果哦</p>
        </div> */}
        <div className="manage-list">
          {
            this.state.inputName === '' ? (
              <>
                {
                  this.state.checkedAssets.map(info => {
                    // const index = this.state.checkedList.indexOf(k as never);
                    return (
                      <div className="asset-wrapper" onClick={this.chooseStatus.bind(this,info.assetid)} >
                        <label>
                          <div>
                            <img className="checked-img" src={this.isChecked(info.assetid) ? require("../../../image/tick.png") : require("../../../image/unchecked.png")} alt="" />
                          </div>
                        </label>
                        <span>{info.symbol}{info.type == 'nep5' ? `（${info.name}）` : ''}</span>
                        <div className="asset-amount">{info.assetid.substr(0, 4) + "..." + info.assetid.substr(info.assetid.length - 4, 4)}</div>
                      </div>
                    )
                  })
                }
                {
                  manageStore.allAsset.map(info => {
                    if (this.state.checkedAssets.findIndex(myasset => info.assetid == myasset.assetid) < 0) {
                      return (
                        <div className="asset-wrapper" onClick={this.chooseStatus.bind(this,info.assetid)} >
                          <label>
                            <div>
                              <img className="checked-img" src={this.isChecked(info.assetid) ? require("../../../image/tick.png") : require("../../../image/unchecked.png")} alt="" />
                            </div>
                          </label>
                          <span>{info.symbol}{info.type == 'nep5' ? `（${info.name}）` : ''}</span>
                          <div className="asset-amount">{info.assetid.substr(0, 4) + "..." + info.assetid.substr(info.assetid.length - 4, 4)}</div>
                        </div>
                      )
                    }
                  })
                }
              </>
            ) :
            (
              this.state.searchList.map(info => {
                return (
                  <div className="asset-wrapper" onClick={this.chooseStatus.bind(this,info.assetid)} >
                    <label>
                      <div>
                        <img className="checked-img" src={this.isChecked(info.assetid) ? require("../../../image/tick.png") : require("../../../image/unchecked.png")} alt="" />
                      </div>
                    </label>
                    <span>{info.symbol}{info.type == 'nep5' ? `（${info.name}）` : ''}</span>
                    <div className="asset-amount">{info.assetid.substr(0, 4) + "..." + info.assetid.substr(info.assetid.length - 4, 4)}</div>
                  </div>
                )
              })
            )
          }
        </div>
      </div>
    );
  }
}