import React from 'react';
import { Link } from 'react-router-dom'

import MyImages from './mypage/MyImages';

class Mypage extends React.Component {

    constructor(props) {
        super(props);
        this.props.loadUserImages(this.props.uid)
    }

    render() {
        return (
            <div>
                Hello: {this.props.displayName}
                <MyImages myImages={this.props.myImages} />
                <Link to='/create'>コースを作る</Link>
            </div>
        );
    }
}

export default Mypage;