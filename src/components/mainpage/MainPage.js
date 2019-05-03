import React from 'react';
import ReactGA from 'react-ga';
import { withRouter } from 'react-router';

import HeroUnit from './HeroUnit';
import PublicCourses from './PublicCourses';

class MainPage extends React.Component {

    constructor(props) {
        super(props);
        this.props.doLogin();
        this.props.loadPublicCourses();
        this.props.loadPublicRoutes();
        this.props.loadUsers();
    }

    componentDidMount() {
        const { pathname } = this.props.location;
        ReactGA.set({ page: pathname });
        ReactGA.pageview(pathname);
    }

    render() {
        return (
            <>
                <HeroUnit />
                {this.props.isLoading ? <div>loading...</div> :
                    <PublicCourses
                        users={this.props.users}
                        courses={this.props.courses}
                        myRoutes={this.props.myRoutes}
                    />
                }
            </>
        );
    }
}

export default withRouter(MainPage);