import React from 'react';
import { Link } from 'react-router-dom'

class MyCourses extends React.Component {

    render() {
        return (
            <div>
                <div>your courses:</div>
                <div>
                    {this.props.myCourses.map((val, index) => (
                        <div key={index}>
                            {index} . {val.courseName}
                            <Link to={{
                                pathname: '/mypage/create',
                                state: {
                                    courseInfo: val,
                                    // courseName: val.courseName
                                }
                            }}>編集</Link>/
                            <Link to={{
                                pathname: '/mypage/show',
                                state: {
                                    courseName: val.courseName,
                                    imageUrl: val.imageUrl,
                                    circles: val.circles,
                                    paths: val.paths,
                                    selectedImageName: val.selectedImageName
                                }
                            }}>コースを見る</Link>
                        </div>
                    ))}
                </div>
            </div >
        );
    }
}

export default MyCourses;