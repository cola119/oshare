import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers';
import * as serviceWorker from './serviceWorker';

import AuthContainer from './containers/AuthContainer';

import UploadImage from './components/UploadImage';
import BackgroundImage from './components/BackgroundImage';

const store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
        {/* <AuthContainer /> */}
        <BackgroundImage />
        {/* <UploadImage /> */}
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
