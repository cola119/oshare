import React from 'react';
import { Link } from 'react-router-dom'

class MyRoutes extends React.Component {

    render() {
        console.log(this.props.myRoutes)
        return (
            <>
                <div>my routes:</div>
                <div>
                    {this.props.myRoutes.map((val, index) => (
                        <div key={index}>
                            {index} . {val.routeName}
                            {/* <Link to={{
                                pathname: '/mypage/edit',
                                state: {
                                    courseInfo: val,
                                }
                            }}>編集</Link>/
                            <Link to={{
                                pathname: '/mypage/route',
                                state: {
                                    courseInfo: val,
                                }
                            }}>ルートを書く</Link>/
                            <Link to={{
                                pathname: '/mypage/show',
                                state: {
                                    courseInfo: val,
                                }
                            }}>コースを見る</Link> */}
                        </div>
                    ))}
                </div>
            </>
        );
    }
}

export default MyRoutes;