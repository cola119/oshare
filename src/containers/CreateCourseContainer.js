import { connect } from 'react-redux';
import CreateCourse from '../components/CreateCourse';
import * as actions from '../actions';

const mapStateToProps = (state) => {
    return {
        uid: state.firebaseAuthReducer.uid,
        selectedImageName: state.createUIReducer.src,
        circleR: state.createUIReducer.circleR,
        strokeWidth: state.createUIReducer.strokeWidth,
        opacity: state.createUIReducer.opacity,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeCircleStyle: (circleR, strokeWidth, opacity) => {
            dispatch(actions.changeCircleStyle(circleR, strokeWidth, opacity));
        }
    }
}

const CreateCourseContainer = connect(mapStateToProps, mapDispatchToProps)(CreateCourse);

export default CreateCourseContainer;