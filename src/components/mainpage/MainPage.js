import React from 'react';
import { Link } from 'react-router-dom';

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.doLogin();
    }

    render() {
        // console.log(this.props)
        return (
            <div>
                <div>hello {this.props.displayName}</div>
                <Link to='/login'>login</Link><br />
                <Link to='/mypage'>マイページ</Link>
                {/* <AuthContainer /> */}
                {/* <DrawImage />
                <UploadImage /> */}
            </div>
        );
    }
}

export default MainPage