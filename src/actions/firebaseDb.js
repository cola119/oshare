import * as actionTypes from "../utils/actionTypes";

export const loadMyImagesSuccess = (myImages) => ({
    type: actionTypes.LOAD_MYIMAGES_SUCCESS,
    myImages: myImages
});