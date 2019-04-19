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
                <MyImages myImages={this.props.myImages} selectImage={this.props.selectImage} selectedImageSrc={this.props.selectedImageSrc} />
                {this.props.selectedImageSrc && <Link to={{
                    pathname: '/mypage/create',
                    state: {
                        imageUrl: this.props.selectedImageSrc,  // リロードの為必要
                        courseInfo: {
                            uid: this.props.uid,
                            circles: [],
                            paths: [],
                            courseName: "",
                            // imageUrl: this.props.selectedImageSrc,  // リロードの為必要
                        }
                    }
                }}>コースを作る</Link>}
                <MyCourses myCourses={this.props.myCourses} />
                <UploadImage uid={this.props.uid} />
            </div>
        );
    }
}

export default Mypage;