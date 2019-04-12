import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class Auth extends React.Component {

    constructor(props) {
        super(props);
        this.props.dologin();
    }
    // componentDidMount() {
    //     this.props.dologin();
    // }

    render() {
        if (this.props.waitingLogin) return <div>loading</div>;

        if (this.props.isAuth) {
            return (
                <div>
                    <p>hello: {this.props.uid}</p>
                    <button onClick={this.props.doLogout}>Logout</button>
                </div>
            )
        } else {
            return <StyledFirebaseAuth uiConfig={this.props.uiConfig} firebaseAuth={this.props.firebaseAuth} />;
        }
    }
};

export default Auth;

