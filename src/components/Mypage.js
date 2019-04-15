import React from 'react';
import { Link } from 'react-router-dom'

import MyImages from './mypage/MyImages';
import UploadImage from './UploadImage';

class Mypage extends React.Component {

    constructor(props) {
        super(props);
        this.props.loadUserImages(this.props.uid)
    }

    render() {
        console.log(this.props.selectedImageName)
        return (
            <div>
                Hello: {this.props.displayName}
                <MyImages myImages={this.props.myImages} selectImage={this.props.selectImage} />
                <Link to='/create'>コースを作る</Link>
                <UploadImage uid={this.props.uid} />
            </div>
        );
    }
}

export default Mypage;