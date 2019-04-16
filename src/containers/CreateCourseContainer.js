import { connect } from 'react-redux';
import DrawImage from '../components/CreateCourse';

const mapStateToProps = (state) => {
    return {
        uid: state.firebaseAuthReducer.uid,
        selectedImageName: state.createUIReducer.src,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

const DrawImageContainer = connect(mapStateToProps, mapDispatchToProps)(DrawImage);

export default DrawImageContainer;