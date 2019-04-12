import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Logout from './Logout';

class Auth extends React.Component {

    constructor(props) {
        super(props);
        this.props.dologin();
    }

    render() {
        if (this.props.waitingLogin) return <div>loading</div>;

        return (
            <div>
                {/* <p>hello: {this.props.uid}</p> */}
                {(this.props.isAuth) ? <Logout doLogout={this.props.doLogout} /> : <StyledFirebaseAuth uiConfig={this.props.uiConfig} firebaseAuth={this.props.firebaseAuth} />}
            </div>
        );
    };
};

export default Auth;

