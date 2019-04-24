import React from 'react';

import SVGViewArea from '../svg/SVGViewArea';
import CirclesAndPaths from '../svg/CirclesAndPaths';

import TextInputForm from '../molecules/TextInputForm';
import InputWithButton from '../molecules/InputWithButton';

import SubmitButton from '../atoms/Buttons/SubmitButton'
import NormalButton from '../atoms/Buttons/NormalButton'
import If from '../atoms/If';

import withWidth from '@material-ui/core/withWidth';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

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
        const targetId = Number(e.target.id);
        const targetCircle = this.state.circles.find(val => val.id === targetId);
        if (targetCircle === undefined) return;
        const svg = this.Viewer.current.Viewer.ViewerDOM;
        const p = this.screenPointToSVGPoint(svg, e.target, e.clientX, e.clientY);
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

    render() {
        const utilStyle = (this.props.width !== 'xs') ? {
            display: "flex",
            paddingRight: "10px"
        } : {
                display: "flex",
                position: "absolute",
                zIndex: 1,
                bottom: "0px",
                right: "0px",
                backgroundColor: "rgba(255,255,255,0.7)",
                padding: "10px 10px"
            }
        return (
            <Grid container spacing={0}>
                <Grid item xs={12} sm={4}>
                    <div style={utilStyle}>
                        <NormalButton
                            onClick={() => this.setState({ isDeleteMode: !this.state.isDeleteMode })}
                            disabled={this.state.isPathMode}
                            text={this.state.isDeleteMode ? "Delete mode now" : "Add mode now"}
                        />
                        <TextInputForm
                            labels={["r", "strokeWidth", "opacity"]}
                            values={this.props.circleStyle}
                            type="number"
                            onChange={this.props.changeCircleStyle}
                        />
                    </div>
                    <div>
                        <If if={this.state.circles.length < 2}>クリックしてポストを追加してください</If>
                        <If if={this.state.circles.length >= 2}>
                            <InputWithButton
                                label="レッグ追加"
                                value={this.state.pathName}
                                placeholder="ME4-5/WE1-3"
                                type="text"
                                onChange={e => this.setState({ pathName: e.target.value })}
                                onClick={this.addPath}
                                disabled={(this.state.pathName.length < 3 || this.state.isPathMode)}
                                text="ADD"
                            />
                        </If>
                        <If if={this.state.isPathMode}>
                            円をクリックしてください
                            {this.state.selectedCircleForPath.map(c => `${this.state.circles.findIndex(_c => _c.id === c.id)}-`)}
                            <If if={this.state.selectedCircleForPath.length > 1}>
                                <SubmitButton onClick={this.savePath}>save</SubmitButton>
                            </If>
                        </If>
                    </div>
                    {(this.state.paths).map((path, index) => (
                        <div key={path.id}>
                            {path.name} {path.points.map(p => `${this.state.circles.findIndex(_c => _c.id === p)}-`)}
                            <button className="btn" onClick={(e) => this.selectPath(e, path.id)}>show</button>
                            <button className="btn" onClick={(e) => this.deletePath(e, path.id)}>delete</button>
                        </div>
                    ))}
                    <If if={this.isEditMode}>
                        <button className="btn" onClick={() => this.setState({ selectedPath: [], selectedCircles: this.state.circles })}>all controls</button>
                    </If>
                    <If if={this.state.paths.length > 0}>
                        <Divider style={{ marginTop: "20px" }} />
                        <InputWithButton
                            label={this.isEditMode ? "更新する" : "コースを保存する"}
                            value={this.props.courseName}
                            placeholder="ロングセレ対策練"
                            type="text"
                            onChange={this.isEditMode ? () => { } : (e) => this.props.changeCourseName(e.target.value)}
                            onClick={this.isEditMode ?
                                () => this.props.updateCourse(this.state.circles, this.state.paths) :
                                () => this.props.saveCourse(this.state.circles, this.state.paths)}
                            disabled={(this.props.courseName.length < 4 || this.state.isPathMode)}
                            text="SAVE"
                        />
                    </If>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <div style={{ height: "90vh" }}>
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
                                // circles={this.state.selectedCircles}
                                paths={this.state.selectedPath}
                                r={this.props.circleStyle.r}
                                strokeWidth={this.props.circleStyle.strokeWidth}
                                circleOpacity={this.props.circleStyle.opacity}
                                pathOpacity={0.7}
                                event={{
                                    onClick: this.state.isPathMode ? this.selectCirclesForPath : this.state.isDeleteMode ? this.deleteCircle : () => { },
                                    onContextMenu: this.state.isPathMode ? this.selectCirclesForPath : this.deleteCircle,
                                    onMouseDown: this.onMouseDown
                                }} />
                        </SVGViewArea>
                    </div>
                </Grid>
            </Grid>
        );
    }
}



export default withWidth()(CreateCourse);