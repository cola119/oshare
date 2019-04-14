import React from 'react';
import { Link } from 'react-router-dom'

import UploadImage from '../UploadImage';

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
                <UploadImage uid={this.props.uid} />
                <Link to='/login'>login</Link><br />
                <Link to='/mypage'>マイページ</Link><br />
                <Link to='/create'>コースを作る</Link>
                {/* <AuthContainer /> */}
                {/* <DrawImage />
                <UploadImage /> */}
            </div>
        );
    }
}

export default MainPage