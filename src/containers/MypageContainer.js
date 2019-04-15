import { connect } from 'react-redux';
import Mypage from '../components/Mypage';
import * as actions from '../actions';
import { firebaseDB } from '../firebase';

const mapStateToProps = (state) => {
    return {
        uid: state.firebaseAuthReducer.uid,
        displayName: state.firebaseAuthReducer.displayName,
        myImages: state.firebaseDbReducer.myImages,
        selectedImageName: state.createUIReducer.src,
        myCourses: state.firebaseDbReducer.myCourses,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadUserImages: (uid) => {
            const imageRef = firebaseDB.collection("images");
            imageRef.get().then((snapshot) => {
                const myImages = snapshot.docs.filter((val) => val.data().uid === uid);
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
        selectImage: (e) => {
            const src = e.target.alt;
            dispatch(actions.selectImage(src));
        }
    }
}

const MypageContainer = connect(mapStateToProps, mapDispatchToProps)(Mypage);

export default MypageContainer;