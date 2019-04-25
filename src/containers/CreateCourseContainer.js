import { connect } from 'react-redux';
import { firebaseDB } from '../firebase';
import CreateCourse from '../components/mypage/CreateCourse';
import * as actions from '../actions';

const mapStateToProps = (state) => {
    return {
        uid: state.firebaseAuthReducer.uid,
        courseName: state.createUIReducer.courseName,
        imageSize: state.createUIReducer.imageSize,
        circleStyle: state.createUIReducer.circleStyle
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadBackgroundImage: (url) => {
            let img = new Image();
            img.onload = () => dispatch(actions.loadBackgroundImageSuccess(img));
            img.src = url;
        },
        changeCourseName: (name = "") => {
            dispatch(actions.changeCourseName(name));
        },
        changeCircleStyle: (label, value) => {
            dispatch(actions.changeCircleStyle(label, value));
        },
        saveCourse: (circles, paths, stateProps) => {
            // 名前の一意性などはfunction?
            // console.log(circles, paths, stateProps, ownProps)
            if (stateProps.courseName === "") return;
            firebaseDB.collection('courses').doc(`${stateProps.courseName}-${stateProps.uid}`).set({
                uid: stateProps.uid,
                key: `${stateProps.courseName}-${stateProps.uid}`,
                imageUrl: ownProps.location.state.imageUrl,
                imageSize: stateProps.imageSize,
                courseName: stateProps.courseName,
                circles: circles,
                paths: paths,
                circleStyle: stateProps.circleStyle,
                isOpen: true,
                created_at: Date.now()
            }).then(() => {
                alert("保存しました");
                ownProps.history.push('/mypage');
            });
        },
        updateCourse: (circles, paths, stateProps) => {
            console.log(circles, paths, stateProps)
            // 名前の一意性などはfunction?
            firebaseDB.collection('courses').doc(`${stateProps.courseName}-${stateProps.uid}`).update({
                circles: circles,
                paths: paths,
                circleStyle: stateProps.circleStyle,
                updated_at: Date.now()
            }).then(() => {
                alert("更新しました");
                ownProps.history.push('/mypage');
            });
        }
    }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        ...stateProps,
        ...ownProps,
        ...dispatchProps,
        saveCourse: (circles, paths) => dispatchProps.saveCourse(circles, paths, stateProps),
        updateCourse: (circles, paths) => dispatchProps.updateCourse(circles, paths, stateProps)
    }
}

const CreateCourseContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(CreateCourse);

export default CreateCourseContainer;