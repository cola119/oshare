import React from 'react';
import { Link } from 'react-router-dom'

class MyCoursesAndRoutes extends React.Component {

    render() {
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
                                pathname: '/mypage/show',
                                state: {
                                    courseInfo: val,
                                }
                            }}>コースを見る</Link>
                            <br />
                            <div>
                                {val.haveRoutes.map((v, i) => (
                                    <div key={i}>
                                        - {i} . {v.routesName} <button className="btn" onClick={() => this.props.deleteRoute(v.key)}>delete</button>
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