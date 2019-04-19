import React from 'react';

import CirclesAndPaths from '../svg/CirclesAndPaths';
import SVGViewArea from '../svg/SVGViewArea';

class ShowCourse extends React.Component {
    constructor(props) {
        super(props);
        this.Viewer = React.createRef();
        this.courseInfo = this.props.location.state.courseInfo;
        // console.log(this.courseInfo)
        this.state = {
            selectedPath: [],
            selectedCircles: [],
            selectedPointsOfRoute: [],
        };
    }

    componentDidMount() {
        // this.props.changeCourseName(this.courseInfo.courseName)
        // this.props.changeCircleStyle(this.courseInfo.circleStyle)
        // this.imageLoad();
    }

    selectPath = (e) => {
        const id = e.target.id;
        const selectedCircles = this.courseInfo.paths[id].points.map((val) => this.courseInfo.circles.find((circle) => circle.id === val));
        this.setState({ selectedPath: [this.courseInfo.paths[id]], selectedCircles: selectedCircles, selectedPointsOfRoute: [] });
    }

    showRoute = (route) => {
        // console.log(route)
        this.setState({ selectedCircles: route.haveCircles, selectedPath: route.havePath })
        this.setState({ selectedPointsOfRoute: route.points })
    }

    render() {
        return (
            <div>
                <div>
                    <button className="btn" onClick={(e) => this.setState({ selectedPath: [], selectedPointsOfRoute: [], selectedCircles: this.courseInfo.circles })}>all controls</button>
                    {(this.courseInfo.paths).map((path, index) => (
                        <div key={index}>
                            {index} . {path.name} {path.points}
                            <button className="btn" onClick={this.selectPath} id={index}>show</button>
                        </div>
                    ))}
                </div>

                <div style={{ width: "100vw", height: "80vh" }}>
                    <SVGViewArea
                        Viewer={this.Viewer}
                        clickEvent={() => (null)}
                        width={this.courseInfo.imageSize.width}
                        height={this.courseInfo.imageSize.height}
                        imageUrl={this.courseInfo.imageUrl}
                        tool="pan"
                    >
                        <CirclesAndPaths
                            circles={this.state.selectedCircles}
                            paths={this.state.selectedPath}
                            r={this.courseInfo.circleStyle.r}
                            strokeWidth={this.courseInfo.circleStyle.strokeWidth}
                            opacity={this.courseInfo.circleStyle.opacity}
                            event={{}} />
                        {this.state.selectedPointsOfRoute.length > 0 &&
                            <CirclesAndPaths
                                circles={[...this.state.selectedCircles, ...this.state.selectedPointsOfRoute]}
                                paths={[{ points: [this.state.selectedCircles[0].id, ...this.state.selectedPointsOfRoute.map(v => v.id), this.state.selectedCircles[this.state.selectedCircles.length - 1].id] }]}
                                r={0}
                                strokeWidth={3}
                                opacity={0}
                                text={""}
                                event={{}} />}
                    </SVGViewArea>
                </div>

                <div>
                    {this.courseInfo.haveRoutes.map((haveRoute, index) => (
                        <div key={index}>
                            {index}.{haveRoute.routesName}
                            {haveRoute.routes.map((route, i) => (
                                <div key={i}>
                                    {i} . {route.routeName} {route.points.length}コントロール
                                    <button className="btn" onClick={(_) => this.showRoute(route)} id={index}>view</button>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default ShowCourse;