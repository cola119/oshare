import React from 'react';
import { Link } from 'react-router-dom';

import PublicCourses from './PublicCourses';

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.doLogin();
    }

    componentDidMount() {
        this.props.loadPublicCourses();
        this.props.loadPublicRoutes();
    }

    render() {
        // console.log(this.props.courses)
        return (
            <div>
                <div>hello {this.props.displayName}</div>
                <Link to='/login'>{this.props.isAuth ? "ログアウト" : "ログイン"}</Link><br />
                <Link to='/mypage'>マイページ</Link>
                {this.props.courses !== undefined && <PublicCourses courses={this.props.courses} />}
                {/* <ShowCourse courseInfo={this.props.courses[1]} /> */}
            </div>
        );
    }
}

export default MainPage