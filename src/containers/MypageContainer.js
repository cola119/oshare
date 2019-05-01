import { connect } from 'react-redux';
import Mypage from '../components/mypage/Mypage';
import * as actions from '../actions';
import { firebaseDB, firebaseStorage } from '../firebase';

const deleteCourse = (course) => {
    const batch = firebaseDB.batch();
    const courseRef = firebaseDB.collection("courses").doc(course.key)
    batch.delete(courseRef);
    firebaseDB.collection("routes").where("courseKey", "==", course.key).get().then((snapshot) => {
        snapshot.docs.map(doc => batch.delete(doc.ref));
        batch.commit().then(() => {
            console.log("courses deleted");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        })
    });
}

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
            // const imageRef = firebaseDB.collection("images").orderBy("created_at", "desc");
            const imageRef = firebaseDB.collection("images").orderBy("created_at", "desc");
            imageRef.onSnapshot((snapshot) => {
                const myImages = snapshot.docs.filter((val) => val.data().uid === uid);
                dispatch(actions.loadImagesSuccess(myImages));
            });
        },
        loadUserCourses: (uid) => {
            dispatch(actions.loadCoursesSuccess([]));
            const ref = firebaseDB.collection("courses");
            // ref.orderBy("created_at", "desc").get().then((snapshot) => {
            ref.orderBy("created_at", "desc").onSnapshot((snapshot) => {
                const myCourses = snapshot.docs.filter((val) => val.data().uid === uid);
                dispatch(actions.loadCoursesSuccess(myCourses));
            });
        },
        loadUserRoutes: (uid) => {
            dispatch(actions.loadRoutesSuccess([]));
            const ref = firebaseDB.collection("routes");
            // ref.orderBy("created_at", "desc").get().then((snapshot) => {
            ref.orderBy("created_at", "desc").onSnapshot((snapshot) => {
                const myRoutes = snapshot.docs.filter((val) => val.data().uid === uid);
                dispatch(actions.loadRoutesSuccess(myRoutes));
            });
        },
        deleteRoute: (key) => {
            firebaseDB.collection("routes").doc(key).delete().then(() => console.log("deleted"));
        },
        deleteCourse: deleteCourse,
        deleteImage: (image) => {
            // console.log(image);
            firebaseDB.collection("courses").where("imageUrl", "==", image.downloadUrl).get().then((snapshot) => {
                snapshot.docs.map(doc => deleteCourse(doc.data()));
            });
            firebaseDB.collection("images").where("downloadUrl", "==", image.downloadUrl).get().then((snapshot) => {
                snapshot.docs.map(doc => doc.ref.delete());
            });
            const imageRef = firebaseStorage.ref().child(`images/${image.uid}/${image.fileName}`);
            const thumbRef = firebaseStorage.ref().child(`images/${image.uid}/thumb_${image.fileName}`);
            imageRef.delete().then(() => {
                console.log("image deleted")
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
            thumbRef.delete().then(() => {
                console.log("thumbnail deleted")
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        },
        changeCourseStatus: (key, status) => {
            firebaseDB.collection('courses').doc(key).update({
                isOpen: !status
            });
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