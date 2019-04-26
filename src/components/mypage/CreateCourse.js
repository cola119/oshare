import React from 'react';

import SVGViewArea from '../svg/SVGViewArea';
import CirclesAndPaths from '../svg/CirclesAndPaths';

import ChangeStyles from '../molecules/ChangeStyles';
import InputWithButton from '../molecules/InputWithButton';

import SubmitButton from '../atoms/Buttons/SubmitButton'
import NormalButton from '../atoms/Buttons/NormalButton'
import If from '../atoms/If';

import withWidth from '@material-ui/core/withWidth';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

class CreateCourse extends React.PureComponent {
    constructor(props) {
        super(props);
        this.courseInfo = props.location.state.courseInfo;
        this.isEditMode = this.courseInfo !== undefined;
        this.Viewer = React.createRef();
        this.state = {
            isDeleteMode: false,
            isPathMode: false,
            isEdited: false,
            isMouseDown: false,
            imageOpacity: 0.8,
            circles: this.isEditMode ? this.courseInfo.circles : [],
            pathName: "",
            selectedCircles: this.isEditMode ? this.courseInfo.circles : [],
            selectedPath: [],
            selectedCircleForPath: [],
            paths: this.isEditMode ? this.courseInfo.paths : [],
            courseComment: this.isEditMode ? this.courseInfo.comment : "",
        };
    }

    componentDidMount() {
        if (this.isEditMode) {
            this.props.changeCourseName(this.courseInfo.courseName);
            ["r", "strokeWidth", "opacity"].forEach(label => this.props.changeCircleStyle(label, this.courseInfo.circleStyle[label]))
        } else {
            this.props.loadBackgroundImage(this.props.location.state.imageUrl);
            this.props.changeCourseName()
            this.props.changeCircleStyle()
        }
    }

    isEdited = () => this.setState({ isEdited: true });

    // ABOUT circle
    addCircle = (e) => {
        if (this.state.isMouseDown) {
            this.setState({ isMouseDown: false })
            return;
        }
        if (this.state.isDeleteMode || this.state.isPathMode) return;
        // mobileでバグ。svgを動かすと解消される
        if (isNaN(e.x)) return;
        const newCircles = [...this.state.circles, ...[{ id: Date.now(), x: e.x, y: e.y }]];
        this.setState({ circles: newCircles });
        this.isEdited();
    }
    deleteCircle = (e) => {
        if (this.state.isMouseDown) this.setState({ isMouseDown: false });
        e.preventDefault();
        const id = Number(e.target.id);
        if (this.state.paths.some(v => v.points.includes(id))) return;
        this.setState(state => ({ circles: state.circles.filter(circles => circles.id !== id) }));
        this.isEdited();
    }

    // ABOUT path
    addPath = () => {
        if (this.state.pathName === "") return;
        this.setState({ isPathMode: true, imageOpacity: 0.5, selectedPath: [] })
        this.isEdited();
    }
    selectCirclesForPath = (e) => {
        const id = Number(e.target.id);
        const thisCircle = this.state.circles.find(circle => circle.id === id);
        const current = this.state.selectedCircleForPath;
        // 二重選択禁止
        const lastId = (current.length > 0) ? current[current.length - 1].id : null;
        if (lastId !== id) this.setState({ selectedCircleForPath: [...current, thisCircle] })
        this.isEdited();
    }
    savePath = () => {
        this.setState(state => ({
            paths: [...state.paths, { id: Date.now(), name: state.pathName, circles: state.selectedCircleForPath, points: state.selectedCircleForPath.map(circle => circle.id) }],
            pathName: "",
            selectedCircleForPath: [],
            isPathMode: false,
            imageOpacity: 0.8
        }));
    }
    selectPath = (e, pathId) => {
        const selectedPath = this.state.paths.find(path => path.id === pathId);
        const selectedCircles = this.state.circles.filter(circle => selectedPath.points.includes(circle.id))
        this.setState({ selectedPath: [selectedPath], selectedCircles: selectedCircles })
        this.isEdited();
    }
    deletePath = (e, pathId) => {
        const newPaths = this.state.paths.filter(path => path.id !== pathId);
        this.setState({ paths: newPaths, selectedPath: [] });
        this.isEdited();
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
        const clientX = e.clientX;
        const clientY = e.clientY;
        const targetId = Number(e.target.id);
        const targetCircle = this.state.circles.find(val => val.id === targetId);
        if (targetCircle === undefined) return;
        const svg = this.Viewer.current.ViewerDOM;
        const p = this.screenPointToSVGPoint(svg, e.target, clientX, clientY);
        if (p === -1) return; //
        const [offsetX, offsetY] = [p.x - targetCircle.x, p.y - targetCircle.y];
        document.onmousemove = (_e) => {
            if (!this.state.isMouseDown) return;
            const newP = this.screenPointToSVGPoint(svg, _e.target, _e.clientX, _e.clientY);
            [targetCircle.x, targetCircle.y] = [newP.x - offsetX, newP.y - offsetY];
            const newCircles = this.state.circles.map(val => val.id === targetId ? targetCircle : val);
            this.setState({ circles: newCircles });
        }
    }
    onTouchStart = (e) => {
        this.setState({ isMouseDown: true });
        e.preventDefault();
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        const targetId = Number(e.target.id);
        const targetCircle = this.state.circles.find(val => val.id === targetId);
        if (targetCircle === undefined) return;
        const svg = this.Viewer.current.ViewerDOM;
        const p = this.screenPointToSVGPoint(svg, e.target, clientX, clientY);
        if (p === -1) return; //
        const [offsetX, offsetY] = [p.x - targetCircle.x, p.y - targetCircle.y];
        document.ontouchmove = (_e) => {
            if (!this.state.isMouseDown) return;
            const newP = this.screenPointToSVGPoint(svg, _e.target, _e.touches[0].clientX, _e.touches[0].clientY);
            [targetCircle.x, targetCircle.y] = [newP.x - offsetX, newP.y - offsetY];
            const newCircles = this.state.circles.map(val => val.id === targetId ? targetCircle : val);
            this.setState({ circles: newCircles });
        }
        document.ontouchend = () => this.setState({ isMouseDown: false })
    }

    render() {
        const utilStyle = {
            display: "flex",
            position: "absolute",
            zIndex: 1,
            top: "0px",
            left: "0px",
            backgroundColor: "rgba(255,255,255,0.7)",
            padding: "0px 10px",
            width: "60%"
        }
        return (
            <Grid container spacing={0}>
                <Grid item xs={12} sm={8}>
                    <div style={{ height: (this.props.width === 'xs') ? "60vh" : "90vh" }} >
                        <div style={utilStyle}>
                            <ChangeStyles
                                labels={["r", "strokeWidth", "opacity"]}
                                values={this.props.circleStyle}
                                type="number"
                                onChange={this.props.changeCircleStyle}
                            />
                            <NormalButton
                                onClick={() => this.setState({ isDeleteMode: !this.state.isDeleteMode })}
                                disabled={this.state.isPathMode}
                                text={this.state.isDeleteMode ? "Delete mode" : "Add mode"}
                            />
                        </div>
                        <SVGViewArea
                            Viewer={this.Viewer}
                            clickEvent={this.addCircle}
                            width={this.isEditMode ? this.courseInfo.imageSize.width : this.props.imageSize.width}
                            height={this.isEditMode ? this.courseInfo.imageSize.height : this.props.imageSize.height}
                            imageUrl={this.isEditMode ? this.courseInfo.imageUrl : this.props.location.state.imageUrl}
                            imageOpacity={this.state.imageOpacity}
                        >
                            <CirclesAndPaths
                                circles={this.state.circles}
                                selectedCircleIds={this.state.selectedCircleForPath.map(circle => circle.id) || []}
                                paths={this.state.selectedPath}
                                r={this.props.circleStyle.r}
                                strokeWidth={this.props.circleStyle.strokeWidth}
                                circleOpacity={this.props.circleStyle.opacity}
                                pathOpacity={0.7}
                                event={{
                                    onClick: this.state.isPathMode ? this.selectCirclesForPath : this.state.isDeleteMode ? this.deleteCircle : () => { },
                                    onContextMenu: this.state.isPathMode ? this.selectCirclesForPath : this.deleteCircle,
                                    onMouseDown: this.onMouseDown,
                                    onTouchStart: this.state.isPathMode ? this.selectCirclesForPath : this.state.isDeleteMode ? this.deleteCircle : this.onTouchStart
                                }} />
                        </SVGViewArea>
                    </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <div>
                        <If if={this.state.circles.length < 2}>クリックモードでポストを追加してください</If>
                        <If if={this.state.circles.length >= 2}>
                            <InputWithButton
                                label="レッグ追加"
                                value={this.state.pathName}
                                placeholder="(例)ME4-5/WE1-3"
                                type="text"
                                onChange={e => this.setState({ pathName: e.target.value })}
                                onClick={this.addPath}
                                disabled={(this.state.pathName.length < 2 || this.state.isPathMode)}
                                text="ADD"
                            />
                        </If>
                        <If if={this.state.isPathMode}>
                            クリックモードで円を選択してください
                            {this.state.selectedCircleForPath.map(c => `${this.state.circles.findIndex(_c => _c.id === c.id)}-`)}
                            <If if={this.state.selectedCircleForPath.length > 1}>
                                <SubmitButton onClick={this.savePath}>save</SubmitButton>
                            </If>
                        </If>
                    </div>

                    <List dense={true}>
                        {(this.state.paths).map(path => (
                            <ListItem key={path.id}>
                                {path.name} {path.points.map(p => `${this.state.circles.findIndex(_c => _c.id === p)}`).join("ー")}
                                <ListItemSecondaryAction>
                                    <NormalButton
                                        onClick={(e) => this.selectPath(e, path.id)}
                                        noMargin={true}
                                        text="view"
                                    />
                                    <NormalButton
                                        onClick={(e) => this.deletePath(e, path.id)}
                                        noMargin={true}
                                        text="delete"
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                    <If if={this.state.paths.length > 0}>
                        <Divider style={{ marginTop: "20px" }} />
                        <TextField
                            label="コメント"
                            multiline
                            rowsMax="4"
                            value={this.state.courseComment}
                            onChange={e => this.setState({ courseComment: e.target.value })}
                            margin="normal"
                            fullWidth
                            variant="outlined"
                        />
                        <InputWithButton
                            label={this.isEditMode ? "更新する" : "コースを保存する"}
                            value={this.props.courseName}
                            placeholder="ロングセレ対策練"
                            type="text"
                            onChange={this.isEditMode ? () => { } : (e) => this.props.changeCourseName(e.target.value)}
                            onClick={this.isEditMode ?
                                () => this.props.updateCourse(this.state.circles, this.state.paths, this.state.courseComment) :
                                () => this.props.saveCourse(this.state.circles, this.state.paths, this.state.courseComment)}
                            disabled={(this.props.courseName.length < 4 || this.state.isPathMode)}
                            text="SAVE"
                        />
                    </If>
                </Grid>
            </Grid>
        );
    }
}



export default withWidth()(CreateCourse);