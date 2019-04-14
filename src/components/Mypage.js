import React from 'react';
import { firebaseStorage } from '../firebase';

class Mypage extends React.Component {

    render() {
        console.log(this.props)
        const imageRef = firebaseStorage.ref().child(`images/${this.props.uid}/`);
        console.log(imageRef)
        return (
            <div>

            </div>
        );
    }
}

export default Mypage