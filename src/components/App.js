import React from 'react';
import Counter from './Counter.js';
import store from '../store.js';

export default class App extends React.Component {
    render() {
        return (
            <div>
                <Counter store={store} />
            </div>
        );
    }
}