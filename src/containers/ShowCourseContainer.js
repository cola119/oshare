import { connect } from 'react-redux';
import { firebaseDB } from '../firebase';
import ShowCourse from '../components/mypage/ShowCourse';
import * as actions from '../actions';

const mapStateToProps = (state) => {
    const allRoutes = state.firebaseDbReducer.routes;
    const voteList = allRoutes.map(route => ({ id: route.id, good: route.good, favCount: route.good.length }));
    const myCourses = state.firebaseDbReducer.courses.map(course => {
        const haveRoutes = allRoutes.filter(route => route.courseKey === course.key);
        return { ...course, haveRoutes: haveRoutes, haveRouteIds: haveRoutes.map(route => route.id) };
    })
    return {
        uid: state.firebaseAuthReducer.uid,
        isAuth: state.firebaseAuthReducer.isAuth,
        displayName: state.firebaseAuthReducer.displayName,
        isLoading: (state.firebaseDbReducer.isCourseLoading || state.firebaseDbReducer.isRouteLoading),
        isCourseLoading: state.firebaseDbReducer.isCourseLoading,
        isRouteLoading: state.firebaseDbReducer.isRouteLoading,
        myCourses: myCourses[0] || [],
        voteList: voteList
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadCourse: (time) => {
            dispatch(actions.loadCoursesSuccess([]));
            const ref = firebaseDB.collection("courses");
            ref.where("created_at", "==", Number(time)).onSnapshot((snapshot) => {
                dispatch(actions.loadCoursesSuccess(snapshot.docs));
            });
        },
        loadPublicRoutes: () => {
            const ref = firebaseDB.collection("routes");
            ref.orderBy("created_at", "desc").get().then((snapshot) => {
                const publics = snapshot.docs.filter(val => val.data().isOpen === true);
                dispatch(actions.loadRoutesSuccess(publics));
            })
        },
        voteRoute: (uid, route, key) => {
            firebaseDB.collection('routes').doc(route.key).get().then((snapshot) => {
                const data = snapshot.data();
                const newVal = data.good.includes(uid) ? data.good.filter(v => v !== uid) : [...data.good, uid];
                firebaseDB.collection('routes').doc(route.key).update({
                    [key]: newVal
                })
            })
        },
        commentRoute: (key, value, userName, uid) => {
            if (userName === undefined || value === "") return;
            firebaseDB.collection('courses').doc(key).get().then((snapshot) => {
                const data = snapshot.data();
                const newVal = [...data.commentOfRoute, { value: value, user: userName, created_at: Date.now(), uid: uid }];
                firebaseDB.collection('courses').doc(key).update({
                    commentOfRoute: newVal
                });
            })
        },
        deleteComment: (comment, key) => {
            firebaseDB.collection('courses').doc(key).get().then((snapshot) => {
                const current = snapshot.data().commentOfRoute;
                const newVal = current.filter(c => c.created_at !== comment.created_at);
                firebaseDB.collection('courses').doc(key).update({
                    commentOfRoute: newVal
                });
            })
        }
    }
}

const ShowCourseContainer = connect(mapStateToProps, mapDispatchToProps)(ShowCourse);

export default ShowCourseContainer;