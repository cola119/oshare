import { connect } from 'react-redux';
import Mypage from '../components/Mypage';
import * as actions from '../actions';
import { firebaseDB } from '../firebase';

const mapStateToProps = (state) => {
    const myCourses = (state.firebaseDbReducer.myRoutes !== undefined) ?
        state.firebaseDbReducer.myCourses.map(course => {
            const haveRoutes = state.firebaseDbReducer.myRoutes.filter(route => route.courseKey === course.key)
            return { ...course, haveRoutes: haveRoutes }
        }) : [];
    return {
        uid: state.firebaseAuthReducer.uid,
        displayName: state.firebaseAuthReducer.displayName,
        myImages: state.firebaseDbReducer.myImages,
        selectedImageSrc: state.createUIReducer.src,
        myCourses: myCourses,
        // myCourses: state.firebaseDbReducer.myCourses,
        myRoutes: state.firebaseDbReducer.myRoutes,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadUserImages: (uid) => {
            const imageRef = firebaseDB.collection("images");
            imageRef.get().then((snapshot) => {
                const myImages = snapshot.docs.filter((val) => val.data().uid === uid);
                // console.log(myImages[0].data())
                dispatch(actions.loadMyImagesSuccess(myImages));
            });
        },
        loadUserCourses: (uid) => {
            const ref = firebaseDB.collection("courses");
            ref.orderBy("created_at", "desc").get().then((snapshot) => {
                const myCourses = snapshot.docs.filter((val) => val.data().uid === uid);
                dispatch(actions.loadMyCoursesSuccess(myCourses));
            })
        },
        loadUserRoutes: (uid) => {
            const ref = firebaseDB.collection("routes");
            ref.orderBy("created_at", "desc").get().then((snapshot) => {
                const myRoutes = snapshot.docs.filter((val) => val.data().uid === uid);
                dispatch(actions.loadMyRoutesSuccess(myRoutes));
            })
        },
        deleteRoute: (key) => {
            firebaseDB.collection("routes").doc(key).delete().then(() => console.log("deleted"));
        },
        selectImage: (e) => {
            const src = e.target.src;
            dispatch(actions.selectImage(src));
        }
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