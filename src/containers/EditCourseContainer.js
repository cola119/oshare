import { connect } from 'react-redux';
import { firebaseDB } from '../firebase';
import EditCourse from '../components/mypage/EditCourse';
import * as actions from '../actions';

const mapStateToProps = (state) => {
    return {
        uid: state.firebaseAuthReducer.uid,
        courseName: state.createUIReducer.courseName,
        // imageSize: state.createUIReducer.imageSize,
        circleStyle: state.createUIReducer.circleStyle
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changeCourseName: (name) => {
            dispatch(actions.changeCourseName(name));
        },
        changeCircleStyle: (circleStyle) => {
            dispatch(actions.changeCircleStyle(circleStyle));
        },
        updateCourse: (circles, paths, stateProps) => {
            console.log(circles, paths, stateProps)
            // 名前の一意性などはfunction?
            if (stateProps.courseName === "") return;
            firebaseDB.collection('courses').doc(`${stateProps.courseName}-${stateProps.uid}`).update({
                circles: circles,
                paths: paths,
                circleStyle: stateProps.circleStyle,
                updated_at: Date.now()
            }).then(() => {
                console.log("done");
                alert("保存しました");
            });
        }
    }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        ...stateProps,
        ...ownProps,
        ...dispatchProps,
        updateCourse: (circles, paths) => dispatchProps.updateCourse(circles, paths, stateProps)
    }
}

const EditCourseContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(EditCourse);

export default EditCourseContainer;