import { connect } from 'react-redux';
import Auth from '../components/Auth';
import * as actions from '../actions';
import firebase from '../firebase';

const mapStateToProps = (state) => {
    return {
        waitingLogin: state.firebaseAuthReducer.waitingLogin,
        isAuth: state.firebaseAuthReducer.isAuth,
        uid: state.firebaseAuthReducer.uid,
        displayName: state.firebaseAuthReducer.displayName,
        email: state.firebaseAuthReducer.email,
        uiConfig: state.firebaseAuthReducer.uiConfig,
        firebaseAuth: state.firebaseAuthReducer.firebaseAuth,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dologin: () => {
            firebase.auth().onAuthStateChanged(user => {
                (user) ? dispatch(actions.loginSuccess(user)) : dispatch(actions.loginFailure(user));
            });
        },
        doLogout: () => {
            firebase.auth().signOut().then(() => {
                dispatch(actions.logoutSuccess());
            });
        }
    }
}

const AuthContainer = connect(mapStateToProps, mapDispatchToProps)(Auth);

export default AuthContainer