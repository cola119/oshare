import * as actionTypes from "../utils/actionTypes";

export const selectImage = (src) => ({
    type: actionTypes.SELECTED_BACKGROUND_IMAGE,
    src: src
});

export const changeCircleStyle = (circleR, strokeWidth, opacity) => ({
    type: actionTypes.CHANGE_CIRCLE_STYLE,
    circleR: circleR,
    strokeWidth: strokeWidth,
    opacity: opacity
});