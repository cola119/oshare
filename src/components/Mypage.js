import React from 'react';
import { firebaseDB } from '../firebase';

class Mypage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            myImages: [],
        };
    }

    loadImages = () => {
        const imageRef = firebaseDB.collection(`images`);
        imageRef.get().then((snapshot) => {
            const myImages = snapshot.docs.filter((val) => val.data().uid === this.props.uid);
            this.setState({ myImages: myImages });
        })
    }

    render() {
        return (
            <div>
                <button onClick={this.loadImages} type="button">LOAD</button>
                {this.state.myImages.map((val, index) => (
                    <div key={index}>
                        {val.data().downloadUrl}
                    </div>
                ))}
            </div>
        );
    }
}

export default Mypage