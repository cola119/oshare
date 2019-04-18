import React from 'react';

import { createPathString } from '../../svg/createPathString';
import CirclesAndPaths from '../svg/CirclesAndPaths';
import SVGViewArea from '../svg/SVGViewArea';

class CreateRoute extends React.Component {
    constructor(props) {
        super(props);
        this.Viewer = React.createRef();
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
        this.setState(state => ({ selectedPath: [state.paths[id]], selectedCircles }));
    }

    // ABOUT create route
    createRoute = () => {
        if (this.state.routeName === "") alert("名前を入力してください");
        else this.setState({ isCreateRouteMode: true, pointsOfRoute: [] });
    }
    addRoutePoint = (e) => {
        if (!this.state.isCreateRouteMode) return;
        const newPointsOfRoute = [...this.state.pointsOfRoute, { id: Date.now(), x: e.x, y: e.y }]
        this.setState({ pointsOfRoute: newPointsOfRoute });
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
        this.setState(state => ({ routes: [...state.routes, routeInfo] }));
        this.initRouteInfo();
        this.setState({ isCreateRouteMode: false })
    }
    viewRoute = (id) => {
        this.setState(state => ({ pointsOfRoute: state.routes[id].points, selectedCircles: state.routes[id].haveCircles, selectedPath: state.routes[id].havePath }))
    }
    editRoute = (id) => {
        this.viewRoute(id);
        this.setState(state => ({ isCreateRouteMode: true, routeName: state.routes[id].routeName }));
    }
    deleteRoute = (id) => {
        this.setState(state => ({ routes: state.routes.filter((_, i) => i !== id) }));
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
        const svg = this.Viewer.current.Viewer.ViewerDOM;
        const p = this.screenPointToSVGPoint(svg, e.target, e.clientX, e.clientY);
        const [offsetX, offsetY] = [p.x - targetCircle.x, p.y - targetCircle.y];
        document.onmousemove = (_e) => {
            if (!this.state.isMouseDown) return;
            const newP = this.screenPointToSVGPoint(svg, _e.target, _e.clientX, _e.clientY);
            [targetCircle.x, targetCircle.y] = [newP.x - offsetX, newP.y - offsetY];
            const newPointsOfRoute = this.state.pointsOfRoute.map(val => val.id === targetId ? targetCircle : val);
            this.setState({ pointsOfRoute: newPointsOfRoute });
        }
        document.onmouseup = () => this.setState({ isMouseDown: false });
    }

    returnPathsForRoute = () => {
        if (this.state.pointsOfRoute.length === 0) return [{ points: [] }];
        return [{ points: [this.state.selectedCircles[0].id, ...this.state.pointsOfRoute.map(v => v.id), this.state.selectedCircles[this.state.selectedCircles.length - 1].id] }];
    }

    render() {
        return (
            <div>
                <div>
                    <button className="btn" onClick={() => this.setState({ selectedPath: [], selectedCircles: this.state.circles })}>all controls</button>
                    {(this.state.paths).map((path, index) => <div key={index}>{index}.{path.name} <button className="btn" onClick={e => this.selectPath(e.target.id)} id={index}>show</button></div>)}
                </div>
                <div style={{ width: "100vw", height: "80vh" }}>
                    <SVGViewArea
                        Viewer={this.Viewer}
                        clickEvent={this.addRoutePoint}
                        width={this.state.imageWidth}
                        height={this.state.imageHeight}
                        imageUrl={this.state.imageUrl}
                    >
                        <CirclesAndPaths
                            circles={this.state.selectedCircles}
                            paths={this.state.selectedPath}
                            r={this.state.circleR}
                            strokeWidth={this.state.strokeWidth}
                            opacity={this.state.opacity}
                            event={{}}
                        />
                        <CirclesAndPaths
                            circles={[...this.state.selectedCircles, ...this.state.pointsOfRoute]}
                            paths={this.returnPathsForRoute()}
                            r={0}
                            strokeWidth={3}
                            opacity={this.state.opacity}
                            event={{
                                onClick: this.deleteRoutePoint,
                                onContextMenu: this.deleteRoutePoint,
                                onMouseDown: this.onMouseDown
                            }} />
                        />
                    </SVGViewArea>
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