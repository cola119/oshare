import { connect } from 'react-redux';
// import { firebaseDB } from '../firebase';
import CreateRoute from '../components/mypage/CreateRoute';
import * as actions from '../actions';

// コンテナ不要
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
        saveRoutes: (circles, paths, stateProps) => {
            console.log(circles, paths, stateProps)
            // 名前の一意性などはfunction?
            // if (stateProps.courseName === "") return;
            // firebaseDB.collection('courses').doc(`${stateProps.courseName}-${stateProps.uid}`).update({
            //     circles: circles,
            //     paths: paths,
            //     circleStyle: stateProps.circleStyle,
            //     created_at: Date.now()
            // }).then(() => {
            //     console.log("done");
            //     alert("保存しました");
            // });
        }
    }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        ...stateProps,
        ...ownProps,
        ...dispatchProps,
        saveRoutes: (circles, paths) => dispatchProps.saveRoutes(circles, paths, stateProps)
    }
}

const CreateRouteContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(CreateRoute);

export default CreateRouteContainer;