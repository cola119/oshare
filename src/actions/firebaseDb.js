import * as actionTypes from "../utils/actionTypes";


export const startLoading = () => ({
    type: actionTypes.START_LOADING,
});

export const loadImagesSuccess = (images) => ({
    type: actionTypes.LOAD_IMAGES_SUCCESS,
    images: images
});

export const loadCoursesSuccess = (courses) => ({
    type: actionTypes.LOAD_COURSES_SUCCESS,
    courses: courses
});

export const loadRoutesSuccess = (routes) => ({
    type: actionTypes.LOAD_ROUTES_SUCCESS,
    routes: routes
});

export const loadUsersSuccess = (users) => ({
    type: actionTypes.LOAD_USERS_SUCCESS,
    users: users
});