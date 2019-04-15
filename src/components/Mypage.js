import React from 'react';
import { Link } from 'react-router-dom'

import MyImages from './mypage/MyImages';
import MyCourses from './mypage/MyCourses';
import UploadImage from './UploadImage';

class Mypage extends React.Component {

    constructor(props) {
        super(props);
        this.props.loadUserImages(this.props.uid)
        this.props.loadUserCourses(this.props.uid)
    }

    render() {
        return (
            <div>
                Hello: {this.props.displayName}
                <MyImages myImages={this.props.myImages} selectImage={this.props.selectImage} selectedImageName={this.props.selectedImageName} />
                <MyCourses myCourses={this.props.myCourses} />
                <Link to={{
                    pathname: '/create',
                    state: {
                        circles: [],
                        courseName: "",
                        selectedImageName: this.props.selectedImageName
                    }
                }}>コースを作る</Link>
                <UploadImage uid={this.props.uid} />
            </div>
        );
    }
}

export default Mypage;