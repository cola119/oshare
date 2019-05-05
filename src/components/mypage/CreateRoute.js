import React from 'react';

import CirclesAndPaths from '../svg/CirclesAndPaths';
import SVGViewArea from '../svg/SVGViewArea';

import PathsList from '../molecules/RadioList';

import If from '../atoms/If';
import SubmitButton from '../atoms/Buttons/SubmitButton'
import NormalButton from '../atoms/Buttons/NormalButton'
import InputWithButton from '../molecules/InputWithButton'

import withWidth from '@material-ui/core/withWidth';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
// import Modal from '@material-ui/core/Modal';

class CreateRoute extends React.Component {
    constructor(props) {
        super(props);
        this.Viewer = React.createRef();
        this.courseInfo = this.props.location.state.courseInfo;
        // console.log(this.courseInfo)
        this.state = {
            isCreateRouteMode: false,
            isEditRouteMode: false,
            isDeleteMode: false,
            isMouseDown: false,
            selectedPathId: null,
            selectedPath: [],
            selectedCircles: [],
            routeName: "",
            pointsOfRoute: [],
            routes: [],
            selectedRouteId: null,
            imageOpacity: 0.8,
            routeComments: [],
            modal: false
        };
    }

    initRouteInfo = () => {
        this.setState({ routeName: "", pointsOfRoute: [] });
    }

    selectPath = (e, pathId) => {
        this.setState({ pointsOfRoute: [] });
        const selectedPath = this.courseInfo.paths.find(path => path.id === pathId)
        const selectedCircles = selectedPath.points.map(p => this.courseInfo.circles.find(c => c.id === p)) // 順番を保つ
        this.setState({ selectedPathId: selectedPath.id, selectedPath: [selectedPath], selectedCircles });
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
        // 同じ点は不可能
        if (this.state.pointsOfRoute.find(val => val.x === e.x && val.y === e.y)) return;
        const newPointsOfRoute = [...this.state.pointsOfRoute, { id: Date.now(), x: e.x, y: e.y }]
        this.setState({ pointsOfRoute: newPointsOfRoute });
    }
    deleteRoutePoint = (e) => {
        if (this.state.isMouseDown) this.setState({ isMouseDown: false });
        if (!this.state.isCreateRouteMode && !this.state.isEditRouteMode) return;
        e.preventDefault();
        const newPointsOfRoute = this.state.pointsOfRoute.filter(val => val.id !== Number(e.target.id));
        this.setState({ pointsOfRoute: newPointsOfRoute })
    }
    returnPathsForRoute = () => {
        if (this.state.pointsOfRoute.length === 0) return [{ points: [] }];
        return [{ points: [this.state.selectedCircles[0].id, ...this.state.pointsOfRoute.map(v => v.id)] }];
        // return [{ points: [this.state.selectedCircles[0].id, ...this.state.pointsOfRoute.map(v => v.id), this.state.selectedCircles[this.state.selectedCircles.length - 1].id] }];
    }
    saveRoute = () => {
        const existedRouteId = this.state.routes.findIndex((_, i) => i === this.state.selectedRouteId)
        if (existedRouteId.length !== -1) this.deleteRoute(existedRouteId);
        const routeInfo = { id: Date.now(), created_at: Date.now(), pathId: this.state.selectedPathId, routeName: this.state.routeName, points: this.state.pointsOfRoute };
        // const routeInfo = { id: Date.now(), created_at: Date.now(), pathId: this.state.selectedPathId, routeName: this.state.routeName, points: this.state.pointsOfRoute, haveCircles: this.state.selectedCircles, havePath: this.state.selectedPath };
        this.setState(state => ({ routes: [...state.routes, routeInfo] }));
        this.setState(state => ({ routeComments: [...state.routeComments, ""] }))
        this.initRouteInfo();
        this.setState({ isCreateRouteMode: false, isEditRouteMode: false, selectedRouteId: null })
    }
    viewRoute = (id) => {
        this.selectPath(null, this.state.routes[id].pathId);
        this.setState(state => ({ pointsOfRoute: state.routes[id].points }))
        // this.setState(state => ({ pointsOfRoute: state.routes[id].points, selectedCircles: state.routes[id].haveCircles, selectedPath: state.routes[id].havePath }))
    }
    editRoute = (id) => {
        this.viewRoute(id);
        this.setState({ isEditRouteMode: true });
        this.setState({ selectedRouteId: id, routeName: this.state.routes[id].routeName })
    }
    deleteRoute = (id) => {
        this.setState(state => ({ routes: state.routes.filter((_, i) => i !== id) }));
        this.setState(state => ({ routeComments: state.routeComments.filter((_, i) => i !== id) }));
        this.initRouteInfo();
    }
    changeRouteComment = (e, index) => {
        const current = this.state.routeComments;
        current[index] = e.target.value;
        this.setState({ routeComments: current });
    }


    // ABOUT draggable svg
    screenPointToSVGPoint = (svg, target, x, y) => {
        const p = svg.createSVGPoint();
        [p.x, p.y] = [x, y];
        try { return p.matrixTransform(target.getScreenCTM().inverse()); }
        catch { return -1; }
    }
    onMouseDown = (e) => {
        this.setState({ isMouseDown: true });
        e.preventDefault();
        const targetId = Number(e.target.id);
        const targetCircle = this.state.pointsOfRoute.find(val => val.id === targetId);
        if (targetCircle === undefined) return;
        const svg = this.Viewer.current.ViewerDOM;
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
    onTouchStart = (e) => {
        this.setState({ isMouseDown: true });
        e.preventDefault();
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        const targetId = Number(e.target.id);
        const targetCircle = this.state.pointsOfRoute.find(val => val.id === targetId);
        if (targetCircle === undefined) return;
        const svg = this.Viewer.current.ViewerDOM;
        const p = this.screenPointToSVGPoint(svg, e.target, clientX, clientY);
        if (p === -1) return; //
        const [offsetX, offsetY] = [p.x - targetCircle.x, p.y - targetCircle.y];
        document.ontouchmove = (_e) => {
            if (!this.state.isMouseDown) return;
            const newP = this.screenPointToSVGPoint(svg, _e.target, _e.touches[0].clientX, _e.touches[0].clientY);
            [targetCircle.x, targetCircle.y] = [newP.x - offsetX, newP.y - offsetY];
            const newPointsOfRoute = this.state.pointsOfRoute.map(val => val.id === targetId ? targetCircle : val);
            this.setState({ pointsOfRoute: newPointsOfRoute });
        }
        document.ontouchend = () => this.setState({ isMouseDown: false })
    }

    utilStyle = {
        display: "flex",
        position: "absolute",
        zIndex: 1,
        top: "0px",
        left: "0px",
        backgroundColor: "rgba(255,255,255,0.7)",
        // padding: "0px 10px",
        // width: "60%"
    }
    render() {
        return (
            <Grid container spacing={0}>
                <Grid item xs={12} sm={8}>
                    <div style={{ height: (this.props.width === 'xs') ? "60vh" : "90vh" }}>
                        <div style={this.utilStyle}>
                            <NormalButton
                                noMargin={true}
                                onClick={() => this.setState({ isDeleteMode: !this.state.isDeleteMode })}
                                disabled={this.state.isPathMode}
                                text={this.state.isDeleteMode ? "Delete mode" : "Add mode"}
                            />
                        </div>
                        <SVGViewArea
                            Viewer={this.Viewer}
                            clickEvent={this.addRoutePoint}
                            width={this.courseInfo.imageSize.width}
                            height={this.courseInfo.imageSize.height}
                            imageUrl={this.courseInfo.imageUrl}
                            imageOpacity={this.state.imageOpacity}
                        >
                            <CirclesAndPaths
                                circles={this.state.selectedCircles}
                                paths={this.state.selectedPath}
                                r={this.courseInfo.circleStyle.r}
                                strokeWidth={this.courseInfo.circleStyle.strokeWidth}
                                circleOpacity={this.props.circleStyle.opacity}
                                pathOpacity={this.props.circleStyle.opacity}
                                event={{}}
                            />
                            <CirclesAndPaths
                                circles={[...this.state.selectedCircles, ...this.state.pointsOfRoute]}
                                paths={this.returnPathsForRoute()}
                                r={0}
                                strokeWidth={3}
                                circleOpacity={0.2}
                                pathOpacity={0.7}
                                text={""}
                                event={{
                                    onClick: this.state.isDeleteMode ? this.deleteRoutePoint : () => { },
                                    onContextMenu: this.deleteRoutePoint,
                                    onMouseDown: this.onMouseDown,
                                    onTouchStart: this.state.isDeleteMode ? this.deleteRoutePoint : this.onTouchStart
                                }} />
                            />
                        </SVGViewArea>
                    </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <PathsList
                        onChange={(e, path) => this.selectPath(e, path.id)}
                        selectedId={this.state.selectedPathId}
                        values={this.courseInfo.paths}
                    />
                    <If if={this.state.selectedCircles.length > 0}>
                        <InputWithButton
                            label="ルート名"
                            value={this.state.routeName}
                            placeholder="(例)ueno0430"
                            type="text"
                            onChange={e => this.setState({ routeName: e.target.value })}
                            onClick={this.createRoute}
                            disabled={(this.state.routeName.length < 2 || this.state.isCreateRouteMode || this.state.isEditRouteMode)}
                            text="ルートを書く"
                        />
                        <If if={this.state.isCreateRouteMode}>
                            クリックモードでルートを書いてください
                            <If if={this.state.pointsOfRoute.length > 0}>
                                <SubmitButton onClick={this.saveRoute} text="finish" />
                            </If>
                        </If>
                    </If>

                    {(this.state.routes).map((route, index) => (
                        <List dense={true} key={index}>
                            <ListItem>
                                {route.routeName}
                                <ListItemSecondaryAction>
                                    <If if={this.state.isEditRouteMode && index === this.state.selectedRouteId && this.state.pointsOfRoute.length > 0}>
                                        <NormalButton
                                            onClick={this.saveRoute}
                                            text="save"
                                        />
                                    </If>
                                    <If if={!(this.state.isEditRouteMode && index === this.state.selectedRouteId && this.state.pointsOfRoute.length > 0)}>
                                        <NormalButton
                                            onClick={e => this.viewRoute(index)}
                                            noMargin={true}
                                            disabled={this.state.isEditRouteMode}
                                            text="view"
                                        />
                                        <NormalButton
                                            onClick={e => this.editRoute(index)}
                                            noMargin={true}
                                            disabled={this.state.isEditRouteMode}
                                            text="edit"
                                        />
                                        <NormalButton
                                            onClick={e => this.deleteRoute(index)}
                                            noMargin={true}
                                            disabled={this.state.isEditRouteMode}
                                            text="delete"
                                        />
                                    </If>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                                <TextField
                                    label="コメント"
                                    multiline
                                    rowsMax="4"
                                    value={this.state.routeComments[index]}
                                    onChange={e => this.changeRouteComment(e, index)}
                                    margin="normal"
                                    fullWidth
                                    variant="outlined"
                                />
                            </ListItem>
                            <Divider />
                        </List>
                    ))}
                    <If if={this.state.routes.length >= 1}>
                        <div style={{ float: "right" }}>
                            <SubmitButton
                                onClick={() => this.props.saveRoutes(this.state.routes, this.state.routeComments)}
                                disabled={this.state.isCreateRouteMode}
                                text="保存して終わる"
                            />
                        </div>

                        {/* <SubmitButton
                            onClick={() => this.setState({ modal: true })}
                            text="保存して終わる"
                        />
                        <Modal
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            open={this.state.modal}
                            onClose={() => this.setState({ modal: false })}
                        >
                            <div style={{ top: "50%", left: "50%" }}>
                                <SubmitButton
                                    onClick={() => this.props.saveRoutes(this.state.routes, this.state.routeComments)}
                                    text="保存して終わる"
                                />
                            </div>
                        </Modal> */}
                    </If>
                </Grid>
            </Grid>
        );
    }
}

export default withWidth()(CreateRoute);