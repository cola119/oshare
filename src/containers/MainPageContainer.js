import { connect } from 'react-redux';
import MainPage from '../components/mainpage/MainPage';
import * as actions from '../actions';
import firebase, { firebaseDB } from '../firebase';

const mapStateToProps = (state) => {
    const courses = state.firebaseDbReducer.courses.map(course => {
        const haveRoutes = state.firebaseDbReducer.routes.filter(route => route.courseKey === course.key)
        return { ...course, haveRoutes: haveRoutes }
    });
    const myRoutesWithoutMyCourse = state.firebaseDbReducer.routes.filter(route => route.uid === state.firebaseAuthReducer.uid);
    return {
        isLoading: (state.firebaseDbReducer.isCourseLoading || state.firebaseDbReducer.isRouteLoading || state.firebaseDbReducer.isUserLoading),
        waitingLogin: state.firebaseAuthReducer.waitingLogin,
        isAuth: state.firebaseAuthReducer.isAuth,
        uid: state.firebaseAuthReducer.uid,
        displayName: state.firebaseAuthReducer.displayName,
        users: state.firebaseDbReducer.users,
        courses: courses,
        myRoutes: myRoutesWithoutMyCourse
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        doLogin: () => {
            firebase.auth().onAuthStateChanged(user => {
                (user) ? dispatch(actions.loginSuccess(user)) : dispatch(actions.loginFailure(user));
            });
        },
        loadPublicRoutes: () => {
            const ref = firebaseDB.collection("routes");
            ref.orderBy("created_at", "desc").onSnapshot((snapshot) => {
                const publics = snapshot.docs.filter(val => val.data().isOpen === true);
                dispatch(actions.loadRoutesSuccess(publics));
            })
        },
        loadPublicCourses: () => {
            const ref = firebaseDB.collection("courses");
            ref.orderBy("created_at", "desc").onSnapshot((snapshot) => {
                const publics = snapshot.docs.filter(val => val.data().isOpen === true);
                dispatch(actions.loadCoursesSuccess(publics));
            })
        },
        loadUsers: () => {
            const ref = firebaseDB.collection("users");
            ref.onSnapshot((snapshot) => {
                dispatch(actions.loadUsersSuccess(snapshot.docs));
            })
        }
    }
}

const MainPageContainer = connect(mapStateToProps, mapDispatchToProps)(MainPage);

export default MainPageContainer;