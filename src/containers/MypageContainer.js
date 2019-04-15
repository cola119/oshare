import { connect } from 'react-redux';
import Mypage from '../components/Mypage';
import * as actions from '../actions';
import { firebaseDB } from '../firebase';

const mapStateToProps = (state) => {
    return {
        // waitingLogin: state.firebaseAuthReducer.waitingLogin,
        // isAuth: state.firebaseAuthReducer.isAuth,
        uid: state.firebaseAuthReducer.uid,
        displayName: state.firebaseAuthReducer.displayName,
        myImages: state.firebaseDbReducer.myImages,
        // email: state.firebaseAuthReducer.email,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadUserImages: (uid) => {
            const imageRef = firebaseDB.collection(`images`);
            imageRef.get().then((snapshot) => {
                const myImages = snapshot.docs.filter((val) => val.data().uid === uid);
                dispatch(actions.loadMyImagesSuccess(myImages));
            });
        },
    }
}

const MypageContainer = connect(mapStateToProps, mapDispatchToProps)(Mypage);

export default MypageContainer;