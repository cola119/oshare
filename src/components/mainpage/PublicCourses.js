import React from 'react';
import { Link } from 'react-router-dom'

class PublicCourses extends React.Component {
    render() {
        // console.log(this.props)
        return (
            <div>
                {this.props.courses.map(course => (
                    <div key={course.created_at}>
                        {course.courseName}
                        <Link to={{
                            pathname: '/show/' + course.created_at,
                            state: {
                                courseInfo: course,
                                smallCircle: false,
                            }
                        }}>コースを見る</Link>
                    </div>
                ))}
            </div>
        );
    }
}

export default PublicCourses;