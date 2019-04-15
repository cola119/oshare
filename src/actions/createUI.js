import * as actionTypes from "../utils/actionTypes";

export const selectImage = (src) => ({
    type: actionTypes.SELECTED_BACKGROUND_IMAGE,
    src: src
});