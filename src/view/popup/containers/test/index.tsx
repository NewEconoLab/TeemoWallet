import * as React from 'react';
import './index.less';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Select from '../../../components/Select';

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
        value:"",
        type:'addr1'
    }
    public options = [
        {
            id: 'addr1',
            name: "my address 1",
        },
        {
            id: 'addr2',
            name: "my address 2",
        }
    ]

    componentDidMount() {
        // Example of how to send a message to eventPage.ts.
    }

    test=(event)=>
    {        
        this.setState({value:event})
    }
    
    public onCallback = (item) =>
    {
        if (item.id === this.state.type)
        {
            return;
        }
        if (item.id === 'addr1')
        {
            this.setState({
                type: 'addr1'
            })
        } else
        {
            this.setState({
                type: 'addr2'
            })
        }
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
                <div>
                    <Input value={this.state.value} placeholder="测试输入框" type="password" onChange={this.test} />
                </div>
                <div>
                    <Select options={this.options} text={"这么好的吗"} onCallback={this.onCallback} />
                </div>
            </div>
        )
    }
}
