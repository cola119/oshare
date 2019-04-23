import { connect } from 'react-redux';
import { firebaseDB } from '../firebase';
import CreateRoute from '../components/mypage/CreateRoute';
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
        saveRoutes: (routes, stateProps) => {
            const courseInfo = ownProps.location.state.courseInfo;
            const batch = firebaseDB.batch();
            routes.forEach(route => {
                const newRef = firebaseDB.collection('routes').doc();
                const data = {
                    courseKey: courseInfo.key,
                    id: route.id,
                    // key: newRef,
                    routeName: route.routeName,
                    pathId: route.pathId,
                    points: route.points,
                    uid: stateProps.uid,
                    isOpen: true,
                    created_at: Date.now()
                }
                batch.set(newRef, data);
            });
            batch.commit().then(function () {
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
        saveRoutes: (routes) => dispatchProps.saveRoutes(routes, stateProps)
    }
}

const CreateRouteContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(CreateRoute);

export default CreateRouteContainer;