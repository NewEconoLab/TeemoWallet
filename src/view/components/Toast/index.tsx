/**
 * 提示组件
 */
import * as React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
// import classnames from 'classnames';

interface IProps
{
  message: string,
  type?: string,
}

export default (message: string, type?: "success"|"error") =>
{
  type = type ? type : 'success';
  console.log(ReactDOM);
  // 释放组件
  const disposeNode = () =>
  {
    ReactDOM.unmountComponentAtNode(div);
    if (div.parentNode)
    {
      div.parentNode.removeChild(div);
    }
  };

  // 插入message提示的容器至body
  const div = document.createElement('div');
  document.body.appendChild(div);


  class Toast extends React.Component<IProps>
  {
    public onClose = () =>
    {
      setTimeout(() =>
      {
        disposeNode();
      }, 15000)
    }
    public render()
    {
      return (
        <div className="comp-toast">
        {this.onClose()}
          <div className="img-box">
            {
              type === 'success' && <img src={require('../../image/success.png')} className="alert-success-icon" />
            }
            {
              type === 'error' && <img src={require('../../image/attention.png')} className="alert-success-icon" />
            }
          </div>
          <span className="text" dangerouslySetInnerHTML={{ '__html': this.props.message }} />
        </div>
      );
    }
  }

  // message
  const node = (   
    <Toast message={message} />
  );
  console.log(node);
  
  
  // 渲染message
  ReactDOM.render(node, div);
}