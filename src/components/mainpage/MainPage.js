import React from 'react';
import { withRouter } from 'react-router';

import PublicCourses from './PublicCourses';

class MainPage extends React.Component {

    constructor(props) {
        super(props);
        this.props.doLogin();
        this.props.loadPublicCourses();
        this.props.loadPublicRoutes();
    }

    render() {
        if (this.props.isLoading) return <div>loading...</div>
        return (
            <PublicCourses courses={this.props.courses} myRoutes={this.props.myRoutes} />
        );
    }
}

export default withRouter(MainPage);