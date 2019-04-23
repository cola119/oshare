import React from 'react';

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
        return (
            <div>
                <UploadImage uid={this.props.uid} />
                <MyImages
                    myImages={this.props.myImages}
                    selectImage={this.props.selectImage}
                // selectedImageSrc={this.props.selectedImageSrc}
                />
                {/* {this.props.selectedImageSrc && <Link to={{
                    pathname: '/mypage/create',
                    state: {
                        imageUrl: this.props.selectedImageSrc,  // リロードの為必要
                    }
                }}>コースを作る</Link>} */}
                <MyCoursesAndRoutes myCourses={this.props.myCourses} deleteRoute={this.props.deleteRoute} />
            </div>
        );
    }
}

export default Mypage;