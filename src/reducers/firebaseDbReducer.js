import * as actionTypes from '../utils/actionTypes';

const initialState = {
    myImages: [],
    myCourses: [],
    myRoutes: [],
};

const firebaseDbReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_MYIMAGES_SUCCESS:
            const myImages = action.myImages.map(val => val.data());
            return {
                ...state,
                myImages: myImages,
            };
        // load_courses? myは限定的
        case actionTypes.LOAD_MYCOURSES_SUCCESS:
            const myCourses = action.myCourses.map(val => val.data());
            return {
                ...state,
                myCourses: myCourses,
            };
        case actionTypes.LOAD_MYROUTES_SUCCESS:
            const myRoutes = action.myRoutes.map(val => val.data());
            return {
                ...state,
                myRoutes: myRoutes,
            };
        default:
            return state;
    };
};

export default firebaseDbReducer;