import * as actionTypes from '../utils/actionTypes';

const initialState = {
    src: "",
    circleR: 45,
    strokeWidth: 5,
    opacity: 0.7
};

const createUIReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SELECTED_BACKGROUND_IMAGE:
            return {
                ...state,
                src: action.src
            };
        case actionTypes.CHANGE_CIRCLE_STYLE:
            return {
                ...state,
                circleR: action.circleR,
                strokeWidth: action.strokeWidth,
                opacity: action.opacity
            };
        default:
            return state;
    };
};

export default createUIReducer;

