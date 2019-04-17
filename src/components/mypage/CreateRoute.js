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
            isRouteMode: false,
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
        this.imageLoad();
    }

    imageLoad = () => {
        let img = new Image();
        img.onload = () => { this.setState({ imageWidth: img.naturalWidth, imageHeight: img.naturalHeight }) };
        img.src = this.state.imageUrl;
    }

    selectPath = (e) => {
        const id = e.target.id;
        const selectedCircles = this.state.paths[id].points.map((val) => this.state.circles.filter((circle) => circle.id === val)[0]);
        this.setState({ selectedPath: this.state.paths[id], selectedCircles: selectedCircles, pointsOfRoute: [] });
    }

    addRoute = () => {
        if (this.state.routeName === "") alert("名前を入力してください");
        else this.setState({ isRouteMode: true, pointsOfRoute: [] });
    }
    addRoutePoint = (e) => {
        if (!this.state.isRouteMode) return;
        this.setState({ pointsOfRoute: [...this.state.pointsOfRoute, ...[{ x: e.x, y: e.y, id: Date.now() }]] })
    }
    deleteRoutePoint = (e) => {
        if (!this.state.isRouteMode) return;
        e.preventDefault();
        const id = Number(e.target.id);
        const newPointsOfRoute = this.state.pointsOfRoute.filter((val) => val.id !== id);
        this.setState({ pointsOfRoute: newPointsOfRoute })
    }

    createRoutePathString = (circles, points) => {
        const from = circles[0];
        const to = circles[circles.length - 1];
        return [from, ...points, to].reduce((prev, curr, index) => {
            const [x, y] = [curr.x, curr.y];
            const str = (index === 0 ? 'M' : 'L') + x + ' ' + y;
            return prev + str;
        }, '');
    }
    saveRoute = () => {
        this.setState({
            routes: [...this.state.routes, { routeName: this.state.routeName, points: this.state.pointsOfRoute, haveCircles: this.state.selectedCircles, havePath: this.state.selectedPath }],
            routeName: "",
            pointsOfRoute: [],
            isRouteMode: false
        }, () => console.log(this.state.routes));
    }
    viewRoute = (e) => {
        this.setState({ pointsOfRoute: this.state.routes[e.target.id].points, selectedCircles: this.state.routes[e.target.id].haveCircles, selectedPath: this.state.routes[e.target.id].havePath })
    }
    editRoute = (e) => {
        this.viewRoute(e)
        console.log(this.state.routes[e.target.id].routeName)
        this.setState({ isRouteMode: true, routeName: this.state.routes[e.target.id].routeName });
    }
    screenPointToSVGPoint(svg, elem, x, y) {
        const p = svg.createSVGPoint();
        p.x = x;
        p.y = y;
        const CTM = elem.getScreenCTM();
        return p.matrixTransform(CTM.inverse());
    }
    onMouseDown = (e) => {
        e.preventDefault();
        const id = Number(e.target.id);
        const dragedCircle = this.state.pointsOfRoute.filter((val) => val.id === id)[0];
        this.setState({ isMouseDown: true });
        const svg = this.Viewer.Viewer.ViewerDOM;
        const p = this.screenPointToSVGPoint(svg, e.target, e.clientX, e.clientY);
        const offsetX = p.x - dragedCircle.x;
        const offsetY = p.y - dragedCircle.y;
        document.onmousemove = (_e) => {
            if (!this.state.isMouseDown) return;
            const newP = this.screenPointToSVGPoint(svg, _e.target, _e.clientX, _e.clientY);
            dragedCircle.x = newP.x - offsetX;
            dragedCircle.y = newP.y - offsetY;
            const newPointsOfRoute = this.state.pointsOfRoute.map((val) => (val.id === id) ? dragedCircle : val);
            this.setState({ pointsOfRoute: newPointsOfRoute });
        }
        document.onmouseup = () => {
            this.setState({ isMouseDown: false });
        }
    }

    render() {
        return (
            <div>
                <MyPreventDefault />
                <div>
                    <button className="btn" onClick={(e) => this.setState({ selectedPath: [], selectedCircles: this.state.circles })}>all controls</button>
                    {(this.state.paths).map((path, index) => (
                        <div key={index}>
                            {index} . {path.name} {path.points}
                            <button className="btn" onClick={this.selectPath} id={index}>show</button>
                        </div>
                    ))}
                </div>
                <div id="svg" style={{ width: "100vw", height: "80vh" }}>
                    <AutoSizer>
                        {(({ width, height }) => width === 0 || height === 0 ? null : (
                            <UncontrolledReactSVGPanZoom width={width} height={height}
                                // tool={this.state.isRouteMode ? "none" : "auto"}
                                ref={Viewer => this.Viewer = Viewer}
                                onClick={e => this.addRoutePoint(e)}
                            >
                                <svg width={this.state.imageWidth} height={this.state.imageHeight}>
                                    <g>
                                        <image xlinkHref={this.state.imageUrl} x="0" y="0"
                                            width={this.state.imageWidth} height={this.state.imageHeight} />
                                        <g>
                                            {this.state.selectedCircles.map((circle, index) => (
                                                <g key={index}>
                                                    <circle id={circle.id} cx={circle.x} cy={circle.y} r={this.state.circleR}
                                                        style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: this.state.strokeWidth, opacity: this.state.opacity, fillOpacity: "0.0" }}
                                                    ></circle>
                                                    <circle id={circle.id} cx={circle.x} cy={circle.y} r={4}
                                                        style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: "1", opacity: "1", fillOpacity: "0.5" }}
                                                    ></circle>
                                                    <text x={circle.x + 45} y={circle.y - 45}
                                                        style={{ fill: "#9400D3", fontFamily: "Verdana", fontSize: "40" }}>{index + 1}</text>
                                                </g>
                                            ))}
                                            <path d={createPathString(this.state.circles, this.state.selectedPath, this.state.circleR)}
                                                style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: this.state.strokeWidth, opacity: this.state.opacity }} ></path>
                                        </g>
                                        <g>
                                            {this.state.pointsOfRoute.map((point, index) => (
                                                <g key={index}>
                                                    <circle id={point.id} cx={point.x} cy={point.y} r={10}
                                                        style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: "3", opacity: "1", fillOpacity: "0.3" }}
                                                        onClick={this.deleteRoutePoint}
                                                        onContextMenu={this.deleteRoutePoint}
                                                        onMouseDown={this.onMouseDown}
                                                    ></circle>
                                                </g>
                                            ))}
                                            {
                                                (this.state.pointsOfRoute.length > 0) && <path d={this.createRoutePathString(this.state.selectedCircles, this.state.pointsOfRoute)}
                                                    style={{ fill: "none", stroke: "#9400D3", strokeWidth: "5", opacity: "0.5" }} ></path>
                                            }
                                        </g>
                                    </g>
                                </svg>
                            </UncontrolledReactSVGPanZoom>
                        ))}
                    </AutoSizer>
                </div>
                <label>route add : </label>
                <input type="text" name="routeName" value={this.state.routeName}
                    onChange={(e) => this.setState({ routeName: e.target.value })} />
                {(this.state.selectedCircles.length > 0) && <button className="btn" onClick={this.addRoute}>add</button>}
                {(this.state.isRouteMode) &&
                    (<div>
                        {this.state.routeName}
                        {Object.keys(this.state.pointsOfRoute)}
                        {(this.state.pointsOfRoute.length > 0) ? < button className="btn" onClick={this.saveRoute}>save</button> : ""}
                    </div>)
                }
                {(this.state.routes).map((route, index) => (
                    <div key={index}>
                        {index} . {route.routeName} {route.points.length}
                        <button className="btn" onClick={this.viewRoute} id={index}>view</button>
                        <button className="btn" onClick={this.editRoute} id={index}>edit</button>
                    </div>
                ))}
            </div>
        );
    }
}

export default CreateRoute;