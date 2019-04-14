import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from '../reducers';

import MainPageContainer from '../containers/MainPageContainer';
import LoginPage from '../components/mainpage/LoginPage';
import ScrollToTop from '../components/ScrollToTop';

const store = createStore(reducer);


class RoutingContainer extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <ScrollToTop>
                        <Switch>
                            <Route exact path='/' component={MainPageContainer} />
                            <Route exact path='/login' component={LoginPage} />
                            <Route component={NoMatch} />
                        </Switch>
                    </ScrollToTop>

                </BrowserRouter>
            </Provider>
        );
    }
}

const NoMatch = ({ location }) => {
    return (
        <div>
            <h3>No match for <code>{location.pathname}</code></h3>
        </div>
    );
}

export default RoutingContainer;