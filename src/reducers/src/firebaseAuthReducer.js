import * as actionTypes from '../../utils/actionTypes';
import firebase from '../../firebase';

const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: "/",
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
    ],
};

const initialState = {
    waitingLogin: true,
    isAuth: false,
    uid: null,
    displayName: null,
    email: null,
    uiConfig: uiConfig,
    // firebaseAuth: firebase.auth(),
};

const firebaseAuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                waitingLogin: false,
                isAuth: true,
                uid: action.payload.uid,
                displayName: action.payload.displayName,
                email: action.payload.email,
            };
        case actionTypes.LOGIN_FAILURE:
            return {
                ...initialState,
                waitingLogin: false,
            };
        case actionTypes.LOGOUT_SUCCESS:
            return {
                ...state,
                isAuth: false,
                uid: null,
                displayName: null,
                email: null,
            };
        default:
            return state;
    };
};

export default firebaseAuthReducer;