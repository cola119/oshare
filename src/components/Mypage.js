import React from 'react';
import { firebaseDB } from '../firebase';

class Mypage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            myImages: null,
        };
    }

    loadImages = () => {
        const imageRef = firebaseDB.collection(`images`);
        imageRef.get().then((snapshot) => {
            const myImages = snapshot.docs.filter((val) => val.data().uid === this.props.uid);
            console.log(myImages)
            snapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
            });
        })
    }

    render() {
        console.log(this.props)
        return (
            <div>
                <button onClick={this.loadImages} type="button">LOAD</button>
            </div>
        );
    }
}

export default Mypage