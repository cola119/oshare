import * as actionTypes from '../utils/actionTypes';

const initialState = {
    src: "",
};

const createUIReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SELECTED_BACKGROUND_IMAGE:
            return {
                ...state,
                src: action.src
            };
        default:
            return state;
    };
};

export default createUIReducer;

