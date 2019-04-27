import { connect } from 'react-redux';
import { firebaseDB } from '../firebase';
import CreateRoute from '../components/mypage/CreateRoute';
import * as actions from '../actions';

import red from '@material-ui/core/colors/red';
import purple from '@material-ui/core/colors/purple';
import deepPurple from '@material-ui/core/colors/deepPurple';
import indigo from '@material-ui/core/colors/indigo';
import teal from '@material-ui/core/colors/teal';
import lime from '@material-ui/core/colors/lime';
import orange from '@material-ui/core/colors/orange';
const colorList = [red, purple, deepPurple, indigo, teal, lime, orange];
const [min, max] = [5, 9];

const randomColor = () => {
    const hue = colorList[Math.floor(Math.random() * colorList.length)];
    const shade = Math.floor(Math.random() * (max - min) + min) * 100;
    return hue[shade]
}

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
        saveRoutes: (routes, comments, stateProps) => {
            const courseInfo = ownProps.location.state.courseInfo;
            const batch = firebaseDB.batch();
            routes.forEach((route, index) => {
                const newRef = firebaseDB.collection('routes').doc();
                const data = {
                    courseKey: courseInfo.key,
                    id: route.id,
                    routeName: route.routeName,
                    pathId: route.pathId,
                    points: route.points,
                    key: newRef.id,
                    uid: stateProps.uid,
                    comment: comments[index],
                    isOpen: true,
                    pathColor: randomColor(),
                    created_at: Date.now()
                }
                batch.set(newRef, data);
            });
            batch.commit().then(function () {
                alert("保存しました");
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
        saveRoutes: (routes, comments) => dispatchProps.saveRoutes(routes, comments, stateProps)
    }
}

const CreateRouteContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(CreateRoute);

export default CreateRouteContainer;