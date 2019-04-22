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
            selectedRouteIds: [],
            selectedPath: [],
            showRoutes: [],
            selectedCircles: [],
            selectedCirclesOfRoute: [],
            selectedPointsOfRoute: [],
        };
    }

    componentDidMount() {
    }

    selectPath = (e, pathId) => {
        this.setState({ selectedPathId: pathId, selectedRouteIds: [] });
        const selectedPath = this.courseInfo.paths.find(path => path.id === pathId)
        const selectedCircles = selectedPath.circles;
        this.setState({ selectedPath: [selectedPath], selectedCircles: selectedCircles, selectedPointsOfRoute: [] });
        this.setState({ showRoutes: this.courseInfo.haveRoutes.filter(route => route.pathId === pathId) })
    }

    selectRoute = (e, route) => {
        const currentIds = this.state.selectedRouteIds
        const newIds = (currentIds.includes(route.id)) ? currentIds.filter(id => id !== route.id) : [...currentIds, route.id]
        this.setState({ selectedRouteIds: newIds });
        this.setShowCircles(newIds)
    }
    setShowCircles = (newIds) => {
        const selectedRoutes = this.courseInfo.haveRoutes.filter(route => newIds.includes(route.id))
        const selectedCirclesOfRoute = [...selectedRoutes.map(route => route.points).flat(), ...this.state.selectedCircles]
        const from = this.state.selectedCircles[0];
        const to = this.state.selectedCircles[this.state.selectedCircles.length - 1];
        const selectedPointsOfRoute = selectedRoutes.map(route => ({ points: [from.id, ...route.points.map(val => val.id), to.id] }))
        this.setState({ selectedCirclesOfRoute: selectedCirclesOfRoute })
        this.setState({ selectedPointsOfRoute: selectedPointsOfRoute })
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
                    selectedRouteIds={this.state.selectedRouteIds}
                    routes={this.state.showRoutes}
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
                            circleOpacity={this.courseInfo.circleStyle.opacity}
                            pathOpacity={this.courseInfo.circleStyle.opacity}
                            event={{}} />
                        {this.state.selectedCirclesOfRoute.length > 0 &&
                            <CirclesAndPaths
                                circles={this.state.selectedCirclesOfRoute}
                                paths={this.state.selectedPointsOfRoute}
                                r={0}
                                strokeWidth={3}
                                circleOpacity={0.2}
                                pathOpacity={0.7}
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