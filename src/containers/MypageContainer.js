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
        selectImage: (e) => {
            const src = e.target.alt;
            dispatch(actions.selectImage(src));
        }
    }
}

const MypageContainer = connect(mapStateToProps, mapDispatchToProps)(Mypage);

export default MypageContainer;