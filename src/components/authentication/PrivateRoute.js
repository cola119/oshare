import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import firebase from '../../firebase';

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        firebase.auth().currentUser !== null ? (<Route {...rest} render={props => <Component {...props} />} />) : (<Redirect to='/login' />)
    );
}

export default PrivateRoute;