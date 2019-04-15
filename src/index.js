import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './configureStore';

import * as serviceWorker from './serviceWorker';

import MainPageContainer from './containers/MainPageContainer';
import MypageContainer from './containers/MypageContainer';
import DrawImageContainer from './containers/DrawImageContainer';
import LoginPage from './components/mainpage/LoginPage';

import PrivateRoute from './components/authentication/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';

const NoMatch = ({ location }) => {
    return (
        <div>
            <h3>No match for <code>{location.pathname}</code></h3>
        </div>
    );
}

// const store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <ScrollToTop>
                    <Switch>
                        <Route exact path='/' component={MainPageContainer} />
                        <Route path='/login' component={LoginPage} />
                        <PrivateRoute path='/mypage' component={MypageContainer} />
                        <PrivateRoute path='/create' component={DrawImageContainer} />
                        <Route component={NoMatch} />
                    </Switch>
                </ScrollToTop>
            </BrowserRouter>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
