import { connect } from 'react-redux';
import Mypage from '../components/mypage/Mypage';
import * as actions from '../actions';
import { firebaseDB } from '../firebase';

const mapStateToProps = (state) => {
    const allUserRoutes = state.firebaseDbReducer.routes;
    const myCourses = state.firebaseDbReducer.courses.map(course => {
        const haveRoutes = allUserRoutes.filter(route => route.courseKey === course.key);
        return { ...course, haveRoutes: haveRoutes, haveRouteIds: haveRoutes.map(route => route.id) };
    })
    const myRoutesWithoutMyCourse = allUserRoutes.filter(route =>
        !myCourses.find(course => course.haveRouteIds.includes(route.id))
    );
    return {
        isImageLoading: state.firebaseDbReducer.isImageLoading,
        isCourseLoading: state.firebaseDbReducer.isCourseLoading,
        isRouteLoading: state.firebaseDbReducer.isRouteLoading,
        uid: state.firebaseAuthReducer.uid,
        displayName: state.firebaseAuthReducer.displayName,
        myImages: state.firebaseDbReducer.images,
        myCourses: myCourses,
        myRoutes: myRoutesWithoutMyCourse,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadUserImages: (uid) => {
            const imageRef = firebaseDB.collection("images").orderBy("created_at", "desc");
            imageRef.get().then((snapshot) => {
                const myImages = snapshot.docs.filter((val) => val.data().uid === uid);
                dispatch(actions.loadImagesSuccess(myImages));
            });
        },
        loadUserCourses: (uid) => {
            dispatch(actions.loadCoursesSuccess([]));
            const ref = firebaseDB.collection("courses");
            ref.orderBy("created_at", "desc").get().then((snapshot) => {
                const myCourses = snapshot.docs.filter((val) => val.data().uid === uid);
                dispatch(actions.loadCoursesSuccess(myCourses));
            });
        },
        loadUserRoutes: (uid) => {
            dispatch(actions.loadRoutesSuccess([]));
            const ref = firebaseDB.collection("routes");
            ref.orderBy("created_at", "desc").get().then((snapshot) => {
                const myRoutes = snapshot.docs.filter((val) => val.data().uid === uid);
                dispatch(actions.loadRoutesSuccess(myRoutes));
            });
        },
        deleteRoute: (key) => {
            firebaseDB.collection("routes").doc(key).delete().then(() => console.log("deleted"));
        },
    }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        ...stateProps,
        ...ownProps,
        ...dispatchProps,
        deleteRoute: (key) => {
            dispatchProps.deleteRoute(key);
            dispatchProps.loadUserRoutes(stateProps.uid)
        }
    }
}

const MypageContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Mypage);

export default MypageContainer;