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

    componentDidMount() {
    }

    render() {
        // console.log(this.props.myRoutes)
        return (
            <>
                <div style={{}}>
                    {this.props.courses !== undefined && <PublicCourses courses={this.props.courses} myRoutes={this.props.myRoutes} />}
                </div>
            </>
        );
    }
}

export default withRouter(MainPage);