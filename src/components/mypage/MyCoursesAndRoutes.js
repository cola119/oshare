import React from 'react';
import { Link } from 'react-router-dom'

class MyCoursesAndRoutes extends React.Component {

    render() {
        if (this.props.myCourses.length === 0) return <div>a</div>;
        return (
            <>
                <div>my courses:</div>
                <div>
                    {this.props.myCourses.map((val, index) => (
                        <div key={index}>
                            {index} . {val.courseName}
                            <Link to={{
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
                                pathname: '/show/' + val.created_at,
                                state: {
                                    courseInfo: val,
                                }
                            }}>コースを見る</Link>
                            <br />
                            <div>
                                {val.haveRoutes.map((v, i) => (
                                    <div key={i}>
                                        - {i} . {v.routeName} <button className="btn" onClick={() => this.props.deleteRoute(v.key)}>delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    }
}

export default MyCoursesAndRoutes;