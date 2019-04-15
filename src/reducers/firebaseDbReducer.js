import * as actionTypes from '../utils/actionTypes';

const initialState = {
    myImages: [],
};

const firebaseDbReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_MYIMAGES_SUCCESS:
            const myImages = action.myImages.map(val => val.data());
            return {
                ...state,
                myImages: myImages,
            };
        default:
            return state;
    };
};

export default firebaseDbReducer;