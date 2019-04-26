import * as actionTypes from '../../utils/actionTypes';

const initialState = {
    images: [],
    courses: [],
    routes: [],
    users: [],
    isImageLoading: true,
    isCourseLoading: true,
    isRouteLoading: true,
    isUserLoading: true,
};

const firebaseDbReducer = (state = initialState, action) => {
    switch (action.type) {
        // case actionTypes.START_LOADING:
        //     return {
        //         ...state,
        //         isLoading: true
        //     };
        case actionTypes.LOAD_IMAGES_SUCCESS:
            const images = action.images.map(val => val.data());
            return {
                ...state,
                images: images,
                isImageLoading: false
            };
        case actionTypes.LOAD_COURSES_SUCCESS:
            const courses = action.courses.map(val => val.data());
            return {
                ...state,
                courses: courses,
                isCourseLoading: false
            };
        case actionTypes.LOAD_ROUTES_SUCCESS:
            const routes = action.routes.map(val => val.data());
            return {
                ...state,
                routes: routes,
                isRouteLoading: false
            };
        case actionTypes.LOAD_USERS_SUCCESS:
            const users = action.users.map(val => val.data());
            return {
                ...state,
                users: users,
                isUserLoading: false
            };
        default:
            return state;
    };
};

export default firebaseDbReducer;