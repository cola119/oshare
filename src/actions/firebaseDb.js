import * as actionTypes from "../utils/actionTypes";

export const loadMyImagesSuccess = (myImages) => ({
    type: actionTypes.LOAD_MYIMAGES_SUCCESS,
    myImages: myImages
});

export const loadMyCoursesSuccess = (myCourses) => ({
    type: actionTypes.LOAD_MYCOURSES_SUCCESS,
    myCourses: myCourses
});