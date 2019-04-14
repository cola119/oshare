import { connect } from 'react-redux';
import MainPage from '../components/mainpage/MainPage';
import * as actions from '../actions';
import firebase from '../firebase';

const mapStateToProps = (state) => {
    return {
        waitingLogin: state.firebaseAuthReducer.waitingLogin,
        isAuth: state.firebaseAuthReducer.isAuth,
        // uid: state.firebaseAuthReducer.uid,
        displayName: state.firebaseAuthReducer.displayName,
        // email: state.firebaseAuthReducer.email,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        doLogin: () => {
            firebase.auth().onAuthStateChanged(user => {
                (user) ? dispatch(actions.loginSuccess(user)) : dispatch(actions.loginFailure(user));
            });
        },
    }
}

const MainPageContainer = connect(mapStateToProps, mapDispatchToProps)(MainPage);

export default MainPageContainer;