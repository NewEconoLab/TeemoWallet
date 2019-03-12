/**
 * 代币管理
 */
import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import { observer } from 'mobx-react';

@observer
export default class ManageAsset extends React.Component<any, {}>
{
  constructor(props: any)
  {
    super(props);
  }
  public state = {
    checkedList: []
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
  public chooseStatus = (event: any) =>
  {
    const item = event.target.value;
    console.log(item)
    const index = this.state.checkedList.indexOf(item);
    if(index>-1){
      console.log("存在过，删除");
      this.state.checkedList.splice(index,1)
    }else{
      console.log("不存在，添加");
      this.state.checkedList.push(item);
    }
    console.log(this.state.checkedList)
  }
  public render()
  {
    return (
      <div className="manage-wrapper">
        <p className="tips-text">选择要显示在主页的token类型</p>
        <div className="search-asset">
          <input type="text" placeholder="请输入代币名称或哈希进行搜索" />
          <img className="search-icon" src={require('../../../image/search.png')} alt="" />
        </div>
        {/* <div className="nodata-wrapper">
          <img className="nodata-img" src={require("../../../image/quesheng.png")} alt=""/>
          <p>没有搜索结果哦</p>
        </div> */}
        <div className="manage-list">
          {
            this.checkList.map((k, v) =>
            {
              const index = this.state.checkedList.indexOf(k.value);
              return (
                <div className="asset-wrapper">
                  <label>
                    <input type="checkbox" name='assets' value={k.value} onChange={this.chooseStatus} />
                    <img className="checked-img" src={(index>-1)?require("../../../image/tick.png"):require("../../../image/unchecked.png")} alt="" />
                  </label>
                  <span>{k.name}</span>
                  <div className="asset-amount">{k.amount}</div>
                </div>
              )
            })
          }
        </div>
        <div className="manage-footer">
          <Button text="取消" size="adaptation" type="warn" />
          <Button text="保存" size="adaptation" />
        </div>
      </div>
    );
  }
}
