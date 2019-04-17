import React from 'react';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom/build-es';
import { AutoSizer } from 'react-virtualized';
import MyPreventDefault from '../../utils/MyPreventDefault';

import { createPathString } from '../../svg/createPathString';

class CreateRoute extends React.Component {
    constructor(props) {
        super(props);
        this.Viewer = null;
        const courseInfo = this.props.location.state.courseInfo;
        this.state = {
            isCreateRouteMode: false,
            isMouseDown: false,
            imageWidth: 1,
            imageHeight: 1,
            imageUrl: courseInfo.imageUrl,
            courseName: courseInfo.courseName,
            circles: courseInfo.circles,
            paths: courseInfo.paths,
            circleR: courseInfo.circleR,
            strokeWidth: courseInfo.strokeWidth,
            opacity: courseInfo.opacity,
            selectedPath: [],
            selectedCircles: [],
            routeName: "",
            pointsOfRoute: [],
            routes: []
        };
    }

    componentDidMount() {
        const img = new Image();
        img.onload = () => { this.setState({ imageWidth: img.naturalWidth, imageHeight: img.naturalHeight }) };
        img.src = this.state.imageUrl;
    }
    initRouteInfo = () => {
        this.setState({ routeName: "", pointsOfRoute: [] });
    }

    selectPath = (id) => {
        const selectedCircles = this.state.paths[id].points.map(val => this.state.circles.find(circle => circle.id === val));
        this.setState({ selectedPath: this.state.paths[id], selectedCircles });
    }

    // ABOUT create route
    createRoute = () => {
        if (this.state.routeName === "") alert("名前を入力してください");
        else this.setState({ isCreateRouteMode: true, pointsOfRoute: [] });
    }
    addRoutePoint = (e) => {
        if (!this.state.isCreateRouteMode) return;
        this.setState({ pointsOfRoute: [...this.state.pointsOfRoute, { id: Date.now(), x: e.x, y: e.y }] })
    }
    deleteRoutePoint = (e) => {
        if (!this.state.isCreateRouteMode) return;
        e.preventDefault();
        const newPointsOfRoute = this.state.pointsOfRoute.filter(val => val.id !== Number(e.target.id));
        this.setState({ pointsOfRoute: newPointsOfRoute })
    }
    createRoutePathString = (circles, points) => {
        const from = circles[0]
        const to = circles[circles.length - 1]
        return createPathString([from, ...points, to], [from.id, ...points.map(v => v.id), to.id], 10)
    }
    saveRoute = () => {
        const routeInfo = { routeName: this.state.routeName, points: this.state.pointsOfRoute, haveCircles: this.state.selectedCircles, havePath: this.state.selectedPath };
        this.setState({ routes: [...this.state.routes, routeInfo] });
        this.initRouteInfo();
        this.setState({ isCreateRouteMode: false })
    }
    viewRoute = (id) => {
        this.setState({ pointsOfRoute: this.state.routes[id].points, selectedCircles: this.state.routes[id].haveCircles, selectedPath: this.state.routes[id].havePath })
    }
    editRoute = (id) => {
        this.viewRoute(id);
        this.setState({ isCreateRouteMode: true, routeName: this.state.routes[id].routeName });
    }
    deleteRoute = (id) => {
        this.setState({ routes: this.state.routes.filter((_, i) => i !== id) });
        this.initRouteInfo();
    }

    // ABOUT draggable svg
    screenPointToSVGPoint = (svg, target, x, y) => {
        const p = svg.createSVGPoint();
        [p.x, p.y] = [x, y];
        return p.matrixTransform(target.getScreenCTM().inverse());
    }
    onMouseDown = (e) => {
        this.setState({ isMouseDown: true });
        e.preventDefault();
        const targetId = Number(e.target.id);
        const targetCircle = this.state.pointsOfRoute.find(val => val.id === targetId);
        const svg = this.Viewer.Viewer.ViewerDOM;
        const p = this.screenPointToSVGPoint(svg, e.target, e.clientX, e.clientY);
        const [offsetX, offsetY] = [p.x - targetCircle.x, p.y - targetCircle.y];
        document.onmousemove = (_e) => {
            if (!this.state.isMouseDown) return;
            const newP = this.screenPointToSVGPoint(svg, _e.target, _e.clientX, _e.clientY);
            [targetCircle.x, targetCircle.y] = [newP.x - offsetX, newP.y - offsetY];
            const newPointsOfRoute = this.state.pointsOfRoute.map(val => val.id === targetId ? targetCircle : val);
            this.setState({ pointsOfRoute: newPointsOfRoute });
        }
        document.onmouseup = () => { this.setState({ isMouseDown: false }) };
    }

    render() {
        return (
            <div>
                <MyPreventDefault />
                <div>
                    <button className="btn" onClick={() => this.setState({ selectedPath: [], selectedCircles: this.state.circles })}>all controls</button>
                    {(this.state.paths).map((path, index) => <div key={index}>{index}.{path.name} <button className="btn" onClick={e => this.selectPath(e.target.id)} id={index}>show</button></div>)}
                </div>
                <div id="svg" style={{ width: "100vw", height: "80vh" }}>
                    <AutoSizer>
                        {(({ width, height }) => width === 0 || height === 0 ? null : (
                            <UncontrolledReactSVGPanZoom width={width} height={height} ref={Viewer => this.Viewer = Viewer} onClick={e => this.addRoutePoint(e)}>
                                <svg width={this.state.imageWidth} height={this.state.imageHeight}>
                                    <image xlinkHref={this.state.imageUrl} x="0" y="0" width={this.state.imageWidth} height={this.state.imageHeight} />
                                    <g>
                                        {this.state.selectedCircles.map((circle, index) => (
                                            <g key={index}>
                                                <circle id={circle.id} cx={circle.x} cy={circle.y} r={this.state.circleR}
                                                    style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: this.state.strokeWidth, opacity: this.state.opacity, fillOpacity: "0.0" }} />
                                                <circle id={circle.id} cx={circle.x} cy={circle.y} r={4}
                                                    style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: "1", opacity: "1", fillOpacity: "0.5" }} />
                                                <text x={circle.x + 45} y={circle.y - 45} style={{ fill: "#9400D3", fontFamily: "Verdana", fontSize: "40" }}>{index + 1}</text>
                                            </g>
                                        ))}
                                        <path d={createPathString(this.state.circles, this.state.selectedPath.points, this.state.circleR)}
                                            style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: this.state.strokeWidth, opacity: this.state.opacity }} />
                                    </g>
                                    <g>
                                        {this.state.pointsOfRoute.map((point, index) =>
                                            <circle key={index} id={point.id} cx={point.x} cy={point.y} r={10}
                                                style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: "3", opacity: "1", fillOpacity: "0.3" }}
                                                onClick={this.deleteRoutePoint} onContextMenu={this.deleteRoutePoint} onMouseDown={this.onMouseDown} />)}
                                        {(this.state.pointsOfRoute.length > 0) &&
                                            <path d={this.createRoutePathString(this.state.selectedCircles, this.state.pointsOfRoute)}
                                                style={{ fill: "none", stroke: "#9400D3", strokeWidth: "5", opacity: "0.5" }} />}
                                    </g>
                                </svg>
                            </UncontrolledReactSVGPanZoom>
                        ))}
                    </AutoSizer>
                </div>
                <label>route add : </label><input type="text" name="routeName" value={this.state.routeName} onChange={e => this.setState({ routeName: e.target.value })} />
                {(this.state.selectedCircles.length > 0) && <button className="btn" onClick={this.createRoute}>add</button>}
                {(this.state.isCreateRouteMode) &&
                    <div>
                        {this.state.routeName}.{Object.keys(this.state.pointsOfRoute)}
                        {(this.state.pointsOfRoute.length > 0) && < button className="btn" onClick={this.saveRoute}>save</button>}
                    </div>
                }
                {(this.state.routes).map((route, index) => (
                    <div key={index}>
                        {index} . {route.routeName} {route.points.length}コントロール
                        <button className="btn" onClick={e => this.viewRoute(Number(e.target.id))} id={index}>view</button>
                        <button className="btn" onClick={e => this.editRoute(Number(e.target.id))} id={index}>edit</button>
                        <button className="btn" onClick={e => this.deleteRoute(Number(e.target.id))} id={index}>delete</button>
                    </div>
                ))}
            </div>
        );
    }
}

export default CreateRoute;