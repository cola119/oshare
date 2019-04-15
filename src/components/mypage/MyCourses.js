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
                                pathname: '/create',
                                state: {
                                    circles: val.circles,
                                    courseName: val.courseName,
                                    selectedImageName: val.selectedImageName
                                }
                            }}>編集</Link>
                        </div>
                    ))}
                </div>
            </div >
        );
    }
}

export default MyCourses;