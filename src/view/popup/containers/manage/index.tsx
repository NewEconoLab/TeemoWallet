/**
 * 代币管理
 */
import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import { observer } from 'mobx-react';
interface IProps
{
  lableChange: (table: string) => void
}
@observer
export default class ManageAsset extends React.Component<IProps, {}>
{
  constructor(props: any)
  {
    super(props);
  }
  public state = {
    checkedList: [],
    inputName: '',// 搜索代币
  }
  public checkList = [
    {
      name: "NEO",
      amount: "11111",
      value: 'neo',
      check: false
    },
    {
      name: "NEO",
      amount: "2222",
      value: 'neo2',
      check: false
    },
    {
      name: "NEO",
      amount: "111333311",
      value: 'neo3',
      check: false
    }, {
      name: "NEO",
      amount: "11144411",
      value: 'neo4',
      check: false
    },
    {
      name: "NEO",
      amount: "5555",
      value: 'neo5',
      check: false
    }
  ]
  // 筛选状态
  public chooseStatus = (event: React.ChangeEvent<HTMLInputElement>) =>
  {
    const item: string = event.target.value;
    const checkedList = this.state.checkedList;
    const index = this.state.checkedList.indexOf(item as never);
    if (index > -1)
    {
      console.log("存在过，删除");
      checkedList.splice(index, 1)
    } else
    {
      console.log("不存在，添加");
      checkedList.push(item);
    }
    this.setState({
      checkedList
    })
    console.log(this.state.checkedList)
  }
  public onChangeInput = (e: any) =>
  {
    this.setState({
      inputName: e.target.value
    })
  }
  public onClearInput = () =>
  {
    this.setState({
      inputName: ''
    })
  }
  // 返回上一页
  public goBack = () =>
  {
    if (this.props.lableChange)
    {
      this.props.lableChange('history');
    }
  }
  public onSaveManage = () =>
  {
    alert('保存，并返回')
    if (this.props.lableChange)
    {
      this.props.lableChange('history');
    }
  }
  public onCancel = () =>
  {
    alert('取消添加');
  }
  public onAddBalance = () =>
  {
    alert("添加")
  }
  public render()
  {
    return (
      <div className="manage-wrapper">
        <p className="tips-text">选择要显示在主页的token类型</p>
        <div className="search-asset">
          <input type="text" placeholder="请输入代币名称或哈希进行搜索" value={this.state.inputName} onChange={this.onChangeInput} />
          <img className="search-icon" src={require('../../../image/search.png')} alt="" />
          {
            this.state.inputName !== '' && (
              <>
                <img className="clear-search" src={require("../../../image/close3.png")} alt="" onClick={this.onClearInput} />
                <div className="search-content">
                  <div className="search-list">
                    <div className="small-box active">
                      <div className="small-name">NEO</div>
                      <div className="small-txid">0xc5...7c9b</div>
                    </div>
                    <div className="small-box">
                      <div className="small-name">NEOVERSION（我是全称我...</div>
                      <div className="small-txid">0xc5...7c9b</div>
                    </div>
                    <div className="small-box active">
                      <div className="small-name">NEO</div>
                      <div className="small-txid">0xc5...7c9b</div>
                    </div>
                    <div className="small-box">
                      <div className="small-name">NEOVERSION（我是全称我...</div>
                      <div className="small-txid">0xc5...7c9b</div>
                    </div>
                  </div>
                  <div className="search-btn">
                    <Button text="取消" type="warn" onClick={this.onCancel} />
                    <Button text="添加" type="primary" onClick={this.onAddBalance} />
                  </div>
                </div>
              </>
            )
          }

        </div>
        {/* <div className="nodata-wrapper">
          <img className="nodata-img" src={require("../../../image/quesheng.png")} alt=""/>
          <p>没有搜索结果哦</p>
        </div> */}
        {
          this.state.inputName === '' && (
            <>
              <div className="manage-list">
                {
                  this.checkList.map((k, v) =>
                  {
                    const index = this.state.checkedList.indexOf(k.value as never);
                    return (
                      <div className="asset-wrapper">
                        <label>
                          <input type="checkbox" name='assets' value={k.value} onChange={this.chooseStatus} />
                          <img className="checked-img" src={(index > -1) ? require("../../../image/tick.png") : require("../../../image/unchecked.png")} alt="" />
                        </label>
                        <span>{k.name}</span>
                        <div className="asset-amount">{k.amount}</div>
                      </div>
                    )
                  })
                }
              </div>
              <div className="manage-footer">
                <Button text="取消" type="warn" onClick={this.goBack} />
                <Button text="保存" type="primary" onClick={this.onSaveManage} />
              </div>
            </>
          )
        }

      </div>
    );
  }
}
