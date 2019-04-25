import React from 'react';

import MyImages from './MyImages';
import MyCoursesAndRoutes from './MyCoursesAndRoutes';
import MyRoutes from './MyRoutes';
import UploadImage from '../UploadImage';

import withWidth from '@material-ui/core/withWidth';
import Expansion from '../atoms/Expansion';
import Collections from '@material-ui/icons/Collections';

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
                {(this.props.width === 'xs') ?
                    <Expansion
                        title="画像一覧"
                        icon={<Collections />}
                    >
                        <MyImages
                            myImages={this.props.myImages}
                            selectImage={this.props.selectImage}
                        />
                    </Expansion> :
                    <MyImages myImages={this.props.myImages} selectImage={this.props.selectImage} />
                }

                {this.props.myCourses.length > 0 && <MyCoursesAndRoutes myCourses={this.props.myCourses} deleteRoute={this.props.deleteRoute} />}
                {this.props.myRoutes.length > 0 && <MyRoutes myRoutes={this.props.myRoutes} deleteRoute={this.props.deleteRoute} />}
            </div>
        );
    }
}

export default withWidth()(Mypage);