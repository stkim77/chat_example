import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from './config';
import { Root } from './containers';

const store = configureStore();

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Root/>
            </Provider>
        );
    }
}

export default App;
