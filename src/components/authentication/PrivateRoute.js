import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
// import firebase from '../../firebase';

// セッションの有効期限が切れた時？
// https://qiita.com/YIPG/items/fcf0fa5104afc9848f07
const PrivateRoute = ({ isAuth, component: Component, ...rest }) => {
    return (
        isAuth ? (<Route {...rest} render={props => <Component {...props} />} />) : (<Redirect to='/login' />)
    );
}

const mapStateToProps = state => ({
    isAuth: state.firebaseAuthReducer.isAuth,
})

export default connect(mapStateToProps)(PrivateRoute);