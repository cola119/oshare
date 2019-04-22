import React from 'react';
import { firebaseDB } from '../../firebase';

import CirclesAndPaths from '../svg/CirclesAndPaths';
import SVGViewArea from '../svg/SVGViewArea';

class CreateRoute extends React.Component {
    constructor(props) {
        super(props);
        this.Viewer = React.createRef();
        this.courseInfo = this.props.location.state.courseInfo;
        this.state = {
            uid: this.courseInfo.uid,    // ルート作成者のUIDにしたい(props化)
            isCreateRouteMode: false,
            isEditRouteMode: false,
            isMouseDown: false,
            selectedPathId: null,
            selectedPath: [],
            selectedCircles: [],
            routeName: "",
            pointsOfRoute: [],
            routes: [],
            // routesName: "",
            selectedRouteId: null,
        };
    }

    componentDidMount() {

    }
    initRouteInfo = () => {
        this.setState({ routeName: "", pointsOfRoute: [] });
    }

    selectPath = (id) => {
        // console.log(this.courseInfo.paths[id])
        const selectedCircles = this.courseInfo.paths[id].points.map(val => this.courseInfo.circles.find(circle => circle.id === val));
        this.setState({ selectedPathId: this.courseInfo.paths[id].id, selectedPath: [this.courseInfo.paths[id]], selectedCircles });
    }

    // ABOUT create route
    createRoute = () => {
        if (this.state.routeName === "") alert("名前を入力してください");
        else this.setState({ isCreateRouteMode: true, pointsOfRoute: [] });
    }
    addRoutePoint = (e) => {
        if (this.state.isMouseDown) {
            this.setState({ isMouseDown: false })
            return;
        }
        if (!this.state.isCreateRouteMode && !this.state.isEditRouteMode) return;
        if (this.state.pointsOfRoute.find(val => val.x === e.x && val.y === e.y)) return;
        const newPointsOfRoute = [...this.state.pointsOfRoute, { id: Date.now(), x: e.x, y: e.y }]
        this.setState({ pointsOfRoute: newPointsOfRoute });
    }
    deleteRoutePoint = (e) => {
        if (!this.state.isCreateRouteMode && !this.state.isEditRouteMode) return;
        e.preventDefault();
        const newPointsOfRoute = this.state.pointsOfRoute.filter(val => val.id !== Number(e.target.id));
        this.setState({ pointsOfRoute: newPointsOfRoute })
    }
    returnPathsForRoute = () => {
        if (this.state.pointsOfRoute.length === 0) return [{ points: [] }];
        return [{ points: [this.state.selectedCircles[0].id, ...this.state.pointsOfRoute.map(v => v.id), this.state.selectedCircles[this.state.selectedCircles.length - 1].id] }];
    }
    saveRoute = () => {
        const existedRouteId = this.state.routes.findIndex((_, i) => i === this.state.selectedRouteId)
        if (existedRouteId.length !== -1) this.deleteRoute(existedRouteId);
        const routeInfo = { created_at: Date.now(), pathId: this.state.selectedPathId, routeName: this.state.routeName, points: this.state.pointsOfRoute, haveCircles: this.state.selectedCircles, havePath: this.state.selectedPath };
        this.setState(state => ({ routes: [...state.routes, routeInfo] }));
        this.initRouteInfo();
        this.setState({ isCreateRouteMode: false, isEditRouteMode: false, selectedRouteId: null })
    }
    viewRoute = (id) => {
        this.setState(state => ({ pointsOfRoute: state.routes[id].points, selectedCircles: state.routes[id].haveCircles, selectedPath: state.routes[id].havePath }))
    }
    editRoute = (id) => {
        this.viewRoute(id);
        this.setState({ isEditRouteMode: true });
        this.setState({ selectedRouteId: id, routeName: this.state.routes[id].routeName })
    }
    deleteRoute = (id) => {
        this.setState(state => ({ routes: state.routes.filter((_, i) => i !== id) }));
        this.initRouteInfo();
    }

    // ABOUT draggable svg
    screenPointToSVGPoint = (svg, target, x, y) => {
        const p = svg.createSVGPoint();
        [p.x, p.y] = [x, y];
        try {
            return p.matrixTransform(target.getScreenCTM().inverse());
        } catch {
            return -1;
        }
    }
    onMouseDown = (e) => {
        this.setState({ isMouseDown: true });
        e.preventDefault();
        const targetId = Number(e.target.id);
        const targetCircle = this.state.pointsOfRoute.find(val => val.id === targetId);
        if (targetCircle === undefined) return;
        const svg = this.Viewer.current.Viewer.ViewerDOM;
        const p = this.screenPointToSVGPoint(svg, e.target, e.clientX, e.clientY);
        if (p === -1) return; //
        const [offsetX, offsetY] = [p.x - targetCircle.x, p.y - targetCircle.y];
        document.onmousemove = (_e) => {
            if (!this.state.isMouseDown) return;
            const newP = this.screenPointToSVGPoint(svg, _e.target, _e.clientX, _e.clientY);
            [targetCircle.x, targetCircle.y] = [newP.x - offsetX, newP.y - offsetY];
            const newPointsOfRoute = this.state.pointsOfRoute.map(val => val.id === targetId ? targetCircle : val);
            this.setState({ pointsOfRoute: newPointsOfRoute });
        }
    }

    saveRouteToFirestore = () => {
        if (this.state.routes.length === 0) return;
        const batch = firebaseDB.batch();
        this.state.routes.forEach(route => {
            // console.log(route)
            const newRef = firebaseDB.collection('routes').doc();
            const data = {
                courseKey: this.courseInfo.key,
                // key: newRef,
                routeName: route.routeName,
                pathId: route.pathId,
                points: route.points,
                uid: this.state.uid,
                isOpen: true,
                created_at: Date.now()
            }
            batch.set(newRef, data);
        });
        batch.commit().then(function () {
            console.log("done");
            alert("保存しました");
        });
        // console.log(this.state.routes)
        // firebaseDB.collection('routes').doc(`${this.state.routesName}-${this.state.uid}`).set({
        //     courseKey: this.courseInfo.key,
        //     key: `${this.state.routesName}-${this.state.uid}`,
        //     routesName: this.state.routesName,
        //     routes: this.state.routes,
        //     uid: this.state.uid,
        //     isOpen: true,
        //     created_at: Date.now()
        // }).then(() => {
        //     console.log("done");
        //     alert("保存しました");
        // });
    }

    render() {
        // console.log(this.state.selectedPathId)
        return (
            <div>
                {/* <label>RoutesName :
                    <input type="text" name="routesName" value={this.state.routesName}
                        onChange={e => this.setState({ routesName: e.target.value })} />
                </label>
                <button className="btn" onClick={this.saveRouteToFirestore}>SAVE</button> */}
                <div>
                    {/* <button className="btn" onClick={() => this.setState({ selectedPath: [], selectedCircles: this.courseInfo.circles })}>all controls</button> */}
                    {(this.courseInfo.paths).map((path, index) =>
                        <div key={index}>
                            {index}.{path.name} <button className="btn" onClick={e => this.selectPath(e.target.id)} id={index}>show</button>
                        </div>
                    )}
                </div>
                <div style={{ width: "100vw", height: "60vh" }}>
                    <SVGViewArea
                        Viewer={this.Viewer}
                        clickEvent={this.addRoutePoint}
                        width={this.courseInfo.imageSize.width}
                        height={this.courseInfo.imageSize.height}
                        imageUrl={this.courseInfo.imageUrl}
                    >
                        <CirclesAndPaths
                            circles={this.state.selectedCircles}
                            paths={this.state.selectedPath}
                            r={this.courseInfo.circleStyle.r}
                            strokeWidth={this.courseInfo.circleStyle.strokeWidth}
                            opacity={this.courseInfo.circleStyle.opacity}
                            event={{}}
                        />
                        <CirclesAndPaths
                            circles={[...this.state.selectedCircles, ...this.state.pointsOfRoute]}
                            paths={this.returnPathsForRoute()}
                            r={0}
                            strokeWidth={3}
                            opacity={0}
                            text={""}
                            event={{
                                // onClick: this.deleteRoutePoint,
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
                {/* 汚い edit createのフラグ周り整理 */}
                {(this.state.routes).map((route, index) => (
                    <div key={index}>
                        {index} . {route.routeName} {route.points.length}コントロール
                        <button className="btn" onClick={e => this.viewRoute(Number(e.target.id))} id={index}>view</button>
                        {(this.state.isEditRouteMode && index === this.state.selectedRouteId && this.state.pointsOfRoute.length > 0) ?
                            <button className="btn" onClick={this.saveRoute}>save</button> : (
                                <>
                                    <button className="btn" onClick={e => this.editRoute(Number(e.target.id))} id={index}>edit</button>
                                    <button className="btn" onClick={e => this.deleteRoute(Number(e.target.id))} id={index}>delete</button></>)
                        }
                    </div>
                ))}
                <br></br>
                <button className="btn" onClick={this.saveRouteToFirestore}>SAVE ALL</button>
            </div>
        );
    }
}

export default CreateRoute;