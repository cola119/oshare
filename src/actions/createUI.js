import * as actionTypes from "../utils/actionTypes";

export const selectImage = (src) => ({
    type: actionTypes.SELECTED_BACKGROUND_IMAGE,
    src: src
});

export const loadBackgroundImageSuccess = (image) => ({
    type: actionTypes.LOAD_BACKGROUND_IMAGE_SUCCESS,
    image: image,
});

export const changeCourseName = (courseName) => ({
    type: actionTypes.CHANGE_COURSE_NAME,
    courseName: courseName
});

export const changeCircleStyle = (circleStyle) => ({
    type: actionTypes.CHANGE_CIRCLE_STYLE,
    circleStyle: circleStyle
});

export const saveCourse = () => ({
    type: actionTypes.SAVE_COURSE,
})