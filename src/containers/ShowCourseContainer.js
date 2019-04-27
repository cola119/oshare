import { connect } from 'react-redux';
import { firebaseDB } from '../firebase';
import ShowCourse from '../components/mypage/ShowCourse';
import * as actions from '../actions';

const mapStateToProps = (state) => {
    const allUserRoutes = state.firebaseDbReducer.routes;
    const myCourses = state.firebaseDbReducer.courses.map(course => {
        const haveRoutes = allUserRoutes.filter(route => route.courseKey === course.key);
        return { ...course, haveRoutes: haveRoutes, haveRouteIds: haveRoutes.map(route => route.id) };
    })
    return {
        isLoading: (state.firebaseDbReducer.isCourseLoading || state.firebaseDbReducer.isRouteLoading),
        isCourseLoading: state.firebaseDbReducer.isCourseLoading,
        isRouteLoading: state.firebaseDbReducer.isRouteLoading,
        myCourses: myCourses[0] || [],
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadCourse: (time) => {
            dispatch(actions.loadCoursesSuccess([]));
            const ref = firebaseDB.collection("courses");
            // ref.orderBy("created_at", "desc").get().then((snapshot) => {
            ref.where("created_at", "==", Number(time)).get().then((snapshot) => {
                dispatch(actions.loadCoursesSuccess(snapshot.docs));
            });
        },
        loadPublicRoutes: () => {
            const ref = firebaseDB.collection("routes");
            ref.orderBy("created_at", "desc").onSnapshot((snapshot) => {
                const publics = snapshot.docs.filter(val => val.data().isOpen === true);
                dispatch(actions.loadRoutesSuccess(publics));
            })
        },
    }
}

const ShowCourseContainer = connect(mapStateToProps, mapDispatchToProps)(ShowCourse);

export default ShowCourseContainer;