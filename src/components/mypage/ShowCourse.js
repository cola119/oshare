import React from 'react';

import CirclesAndPaths from '../svg/CirclesAndPaths';
import SVGViewArea from '../svg/SVGViewArea';

import PathsList from './PathsList';
import RoutesList from './RoutesList';

class ShowCourse extends React.Component {
    constructor(props) {
        super(props);
        this.Viewer = React.createRef();
        this.myProps = (this.props.location) ? this.props.location.state : this.props
        this.courseInfo = this.myProps.courseInfo;
        this.state = {
            selectedPath: [],
            selectedCircles: [],
            selectedPointsOfRoute: [],
        };
    }

    componentDidMount() {
    }

    selectPath = (e, id) => {
        if (id === -1) {
            this.setState({ selectedPath: [], selectedPointsOfRoute: [], selectedCircles: this.courseInfo.circles })
            return;
        }
        const selectedCircles = this.courseInfo.paths[id].points.map((val) => this.courseInfo.circles.find((circle) => circle.id === val));
        this.setState({ selectedPath: [this.courseInfo.paths[id]], selectedCircles: selectedCircles, selectedPointsOfRoute: [] });
    }

    selectRoute = (route) => {
        this.setState({ selectedCircles: route.haveCircles, selectedPath: route.havePath })
        this.setState({ selectedPointsOfRoute: route.points })
    }

    render() {
        return (
            <div>
                <PathsList
                    selectPath={this.selectPath}
                    paths={this.courseInfo.paths}
                />
                <RoutesList
                    selectRoute={this.selectRoute}
                    routes={this.courseInfo.haveRoutes}
                />

                <div style={{ width: "100vw", height: "50vh" }}>
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
                                smallCircle={this.myProps.smallCircle}
                                event={{}} />}
                    </SVGViewArea>
                </div>
            </div>
        );
    }
}

export default ShowCourse;