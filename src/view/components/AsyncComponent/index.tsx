import * as React from 'react';
 
interface IState {
  component:any
}

export default function AsyncComponent(importComponent:any) {
  class AsyncComponent extends React.Component<{}, IState> {
    constructor(props:any) {
      super(props);
 
      this.state = {
        component: null
      };
    }
 
    public async componentDidMount() {
      const { default: component } = await importComponent();
 
      this.setState({
        component,
      });
    }


    public componentWillUnmount () {
      this.setState = ()=>{
        return;
      };
    }
 
    public render() {
      const C = this.state.component;
 
      return C ? <C {...this.props} /> : null;
    }
  }
 
  return AsyncComponent;
}
