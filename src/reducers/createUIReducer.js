import * as actionTypes from '../utils/actionTypes';

const initialState = {
    src: "",
    imageSize: {
        width: 1,
        height: 1
    },
    courseName: "",
    circleStyle: {
        r: 45,
        strokeWidth: 5,
        opacity: 0.7,
        rotate: 0,
    }
};

const createUIReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SELECTED_BACKGROUND_IMAGE:
            return {
                ...state,
                src: action.src
            };
        case actionTypes.LOAD_BACKGROUND_IMAGE_SUCCESS:
            return {
                ...state,
                imageSize: {
                    width: action.image.naturalWidth,
                    height: action.image.naturalHeight
                }
            };
        case actionTypes.CHANGE_COURSE_NAME:
            return {
                ...state,
                courseName: action.courseName
            };
        // case actionTypes.CHANGE_CIRCLE_STYLE:
        //     return {
        //         ...state,
        //         circleStyle: action.circleStyle
        //     };
        case actionTypes.CHANGE_CIRCLE_STYLE:
            // init
            if (action.label === undefined) {
                return {
                    ...state,
                    circleStyle: {
                        r: 45,
                        strokeWidth: 5,
                        opacity: 0.7,
                        rotate: 0
                    }
                }
            }
            return {
                ...state,
                circleStyle: {
                    ...state.circleStyle,
                    [action.label]: action.value
                }
            };
        default:
            return state;
    };
};

export default createUIReducer;

