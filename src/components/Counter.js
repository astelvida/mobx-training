import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import DevTools from 'mobx-react-devtools';

@observer class App extends React.Component {    
    render() {
        console.log(this.props.store)
        return (
            <div>
                <DevTools />
                Counter: {this.props.store.count}<br />
                <button onClick={() => this.handleDec()}>-</button>
                <button onClick={() => this.handleInc()}>+</button>
            </div>);
    }

    handleDec() {
        this.props.store.decrement();
    }

    handleInc() {
        this.props.store.increment();
    }
}

export default App;