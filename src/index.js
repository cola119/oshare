import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './configureStore';
import ReactGA from 'react-ga';

import * as serviceWorker from './serviceWorker';

import MainPageContainer from './containers/MainPageContainer';
import LoginPage from './components/mainpage/LoginPage';
import MypageContainer from './containers/MypageContainer';
import CreateCourseContainer from './containers/CreateCourseContainer';
import ShowCourseContainer from './containers/ShowCourseContainer';
import CreateRouteContainer from './containers/CreateRouteContainer';
// import ShowCourse from './components/mypage/ShowCourse';

import PrivateRoute from './components/authentication/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';

import MenuBar from './components/MenuBar';

ReactGA.initialize('UA-116749510-3');
const history = createBrowserHistory();
history.listen(({ pathname }) => {
    ReactGA.set({ page: pathname });
    ReactGA.pageview(pathname);
});

const NoMatch = ({ location }) => {
    return (
        <div>
            <h3>No match for <code>{location.pathname}</code></h3>
        </div>
    );
}

// const store = createStore(reducer);
const EVENTS_TO_MODIFY = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'wheel'];

const originalAddEventListener = document.addEventListener.bind();
document.addEventListener = (type, listener, options, wantsUntrusted) => {
    let modOptions = options;
    if (EVENTS_TO_MODIFY.includes(type)) {
        if (typeof options === 'boolean') {
            modOptions = {
                capture: options,
                passive: false,
            };
        } else if (typeof options === 'object') {
            modOptions = {
                passive: false,
                ...options,
            };
        }
    }

    return originalAddEventListener(type, listener, modOptions, wantsUntrusted);
};

const originalRemoveEventListener = document.removeEventListener.bind();
document.removeEventListener = (type, listener, options) => {
    let modOptions = options;
    if (EVENTS_TO_MODIFY.includes(type)) {
        if (typeof options === 'boolean') {
            modOptions = {
                capture: options,
                passive: false,
            };
        } else if (typeof options === 'object') {
            modOptions = {
                passive: false,
                ...options,
            };
        }
    }
    return originalRemoveEventListener(type, listener, modOptions);
};
ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <ScrollToTop>
                    <MenuBar />
                    <Switch>
                        <Redirect from='/_show/:id' to='/show/:id' />
                        <Route exact path='/' component={MainPageContainer} />
                        <Route exact path='/login' component={LoginPage} />
                        <Route exact path='/show/:id' component={ShowCourseContainer} />
                        {/* <Route exact path='/_show/:id' component={ShowCourseContainer} /> */}
                        <PrivateRoute exact path='/mypage' component={MypageContainer} />
                        <PrivateRoute exact path='/mypage/create' component={CreateCourseContainer} />
                        <PrivateRoute exact path='/mypage/edit' component={CreateCourseContainer} />
                        {/* <PrivateRoute exact path='/mypage/edit' component={EditCourseContainer} /> */}
                        <PrivateRoute exact path='/mypage/route' component={CreateRouteContainer} />
                        <PrivateRoute exact path='/show/:id/route' component={CreateRouteContainer} />
                        <PrivateRoute exact path='/mypage/show' component={ShowCourseContainer} />
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
