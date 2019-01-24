import * as React from 'react';
import './index.less';
import Button from '../../components/Button';
import Input from '../../components/Input';

interface AppProps {
    develop:boolean;
}

interface AppState {
    develop:boolean;
}

export default class Popup extends React.Component<AppProps> {
    constructor(props: AppProps, state: AppState) {
        super(props, state);
    }

    public state = {
        value:""
    }

    componentDidMount() {
        // Example of how to send a message to eventPage.ts.
        if(!this.props.develop)
        {
            chrome.runtime.sendMessage({ popupMounted: true });
        }
    }

    test=(event)=>
    {        
        this.setState({value:event})
    }

    render() {
        return (
            <div className="testContainer">
                <div className="btn">                    
                    <Button text="test1"/>
                    <Button text="test2" type="warn"/>
                    <Button text="test3" type="white"/>
                    <Button text="test4" type="primary" size="long"></Button>
                </div>
                <Input value={this.state.value} placeholder="测试输入框" type="password" onChange={this.test} />
            </div>
        )
    }
}
