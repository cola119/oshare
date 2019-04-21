import React from 'react';
import { Link } from 'react-router-dom'

import MyImages from './MyImages';
import MyCoursesAndRoutes from './MyCoursesAndRoutes';
// import MyRoutes from './mypage/MyRoutes';
import UploadImage from '../UploadImage';

class Mypage extends React.Component {

    constructor(props) {
        super(props);
        this.props.loadUserImages(this.props.uid)
        this.props.loadUserCourses(this.props.uid)
        this.props.loadUserRoutes(this.props.uid)
    }


    render() {
        // console.log(this.props)
        return (
            <div>
                <MyImages
                    myImages={this.props.myImages}
                    selectImage={this.props.selectImage}
                    selectedImageSrc={this.props.selectedImageSrc}
                />
                {this.props.selectedImageSrc && <Link to={{
                    pathname: '/mypage/create',
                    state: {
                        imageUrl: this.props.selectedImageSrc,  // リロードの為必要
                    }
                }}>コースを作る</Link>}
                <MyCoursesAndRoutes myCourses={this.props.myCourses} deleteRoute={this.props.deleteRoute} />
                {/* <MyRoutes myRoutes={this.props.myRoutes} /> */}
                <UploadImage uid={this.props.uid} />
            </div>
        );
    }
}

export default Mypage;