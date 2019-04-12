import * as actionTypes from "../utils/actionTypes";

export const loginSuccess = (user) => ({
    type: actionTypes.LOGIN_SUCCESS,
    payload: {
        displayName: user.displayName,
        email: user.email,
        uid: user.uid
    }
});
export const loginFailure = () => ({
    type: actionTypes.LOGIN_FAILURE
});
export const logoutSuccess = () => ({
    type: actionTypes.LOGOUT_SUCCESS
});