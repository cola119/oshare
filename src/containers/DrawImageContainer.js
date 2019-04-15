import { connect } from 'react-redux';
import DrawImage from '../components/DrawImage';

const mapStateToProps = (state) => {
    return {
        uid: state.firebaseAuthReducer.uid,
        selectedImageName: state.createUIReducer.src,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        saveCoursePlan: () => {

        }
    }
}

const DrawImageContainer = connect(mapStateToProps, mapDispatchToProps)(DrawImage);

export default DrawImageContainer;