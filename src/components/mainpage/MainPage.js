import React from 'react';
import { withRouter } from 'react-router';

import PublicCourses from './PublicCourses';

class MainPage extends React.Component {

    constructor(props) {
        super(props);
        this.props.doLogin();
        this.props.loadPublicCourses();
        this.props.loadPublicRoutes();
        this.props.loadUsers();
    }

    render() {
        if (this.props.isLoading) return <div>loading...</div>
        if (this.props.courses.length === 0) return <div>no course</div>
        return (
            <PublicCourses
                users={this.props.users}
                courses={this.props.courses}
                myRoutes={this.props.myRoutes}
            />
        );
    }
}

export default withRouter(MainPage);