import React, { Component } from 'react';
import { firebaseStorage } from '../firebase';

class UploadImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUploading: false,
            files: null,
        };
    }

    handleChangeFile = (e) => {
        const files = e.target.files;
        this.setState({
            files: files,
        });
    }
    clickPostBtn = () => {
        this.setState({ isUploading: true });
        const imageRef = firebaseStorage.ref().child(`images/${this.state.files[0].name}`);
        imageRef.put(this.state.files[0]).then(() => {
            console.log("uploaded");
            this.setState({ isUploading: false });
        });
    }
    render() {
        return (
            <div>
                <input type="file" accept="image/png,image/jpeg" ref="file" onChange={this.handleChangeFile} />
                <button onClick={this.clickPostBtn} type="button">投稿する</button>
                <div>{this.state.isUploading ? "uploading" : ""}</div>
            </div>
        );
    }
}

export default UploadImage;