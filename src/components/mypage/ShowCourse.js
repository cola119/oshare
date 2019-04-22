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
        // console.log(this.courseInfo)
        this.state = {
            selectedPathId: null,
            selectedRouteId: null,
            selectedPath: [],
            selectedCircles: [],
            selectedPointsOfRoute: [],
        };
    }

    componentDidMount() {
    }

    selectPath = (e, pathId) => {
        // console.log(pathId)
        const id = this.courseInfo.paths.findIndex(path => path.id === pathId);
        this.setState({ selectedPathId: id });
        if (id === -1) {
            this.setState({ selectedPath: [], selectedPointsOfRoute: [], selectedCircles: this.courseInfo.circles })
            return;
        }
        const selectedPath = this.courseInfo.paths.find(path => path.id === pathId)
        const selectedCircles = selectedPath.points.map(val => this.courseInfo.circles.find(circle => circle.id === val));
        this.setState({ selectedPath: [selectedPath], selectedCircles: selectedCircles, selectedPointsOfRoute: [] });
        console.log(this.state.selectedCircles)

        // const selectedCircles = this.courseInfo.paths[id].points.map((val) => this.courseInfo.circles.find((circle) => circle.id === val));
        // this.setState({ selectedPath: [this.courseInfo.paths[id]], selectedCircles: selectedCircles, selectedPointsOfRoute: [] });
    }

    selectRoute = (e, id, route) => {
        // console.log(id, route)
        this.selectPath(e, route.pathId)
        const selectedPath = this.courseInfo.paths.find(path => path.id === route.pathId);
        console.log(selectedPath)
        this.setState({ selectedRouteId: id });
        console.log(this.state.selectedCircles)
        this.setState({ selectedPointsOfRoute: route.points })
    }

    render() {
        return (
            <div>
                {/* Listに抽象化 */}
                <PathsList
                    selectPath={this.selectPath}
                    selectedPathId={this.state.selectedPathId}
                    paths={this.courseInfo.paths}
                />
                <RoutesList
                    selectRoute={this.selectRoute}
                    selectedRouteId={this.state.selectedRouteId}
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
                        {/* {this.state.selectedPointsOfRoute.length > 0 &&
                            <CirclesAndPaths
                                circles={[...this.state.selectedCircles, ...this.state.selectedPointsOfRoute]}
                                paths={[{ points: [this.state.selectedCircles[0].id, ...this.state.selectedPointsOfRoute.map(v => v.id), this.state.selectedCircles[this.state.selectedCircles.length - 1].id] }]}
                                r={0}
                                strokeWidth={3}
                                opacity={0}
                                text={""}
                                smallCircle={this.myProps.smallCircle}
                                event={{}} />} */}
                        {this.state.selectedPointsOfRoute.length > 0 &&
                            <CirclesAndPaths
                                circles={this.state.selectedPointsOfRoute}
                                // paths={[{ points: [this.state.selectedCircles[0].id, ...this.state.selectedPointsOfRoute.map(v => v.id), this.state.selectedCircles[this.state.selectedCircles.length - 1].id] }]}
                                paths={[{ points: this.state.selectedPointsOfRoute.map(v => v.id) }]}
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