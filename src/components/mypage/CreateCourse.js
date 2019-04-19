import React from 'react';
// import { firebaseDB } from '../../firebase';

import SVGViewArea from '../svg/SVGViewArea';
import CirclesAndPaths from '../svg/CirclesAndPaths';

class CreateCourse extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Viewer = React.createRef();
        this.state = {
            isDeleteMode: false,
            isPathMode: false,
            isEdited: false,
            circles: [],
            pathName: "",
            selectedCircleForPath: [],
            paths: [],
        };
    }

    componentDidMount() {
        this.props.loadBackgroundImage(this.props.location.state.imageUrl);
    }

    isEdited = () => this.setState({ isEdited: true });

    // ABOUT circle
    addCircle = (e) => {
        if (this.state.isDeleteMode || this.state.isPathMode) return;
        const newCircles = [...this.state.circles, ...[{ id: Date.now(), x: e.x, y: e.y }]]
        this.setState({ circles: newCircles });
        this.isEdited();
    }
    deleteCircle = (e) => {
        e.preventDefault();
        const id = Number(e.target.id);
        if (this.state.paths.some(v => v.points.includes(id))) return;
        this.setState(state => ({ circles: state.circles.filter(circles => circles.id !== id) }));
        this.isEdited();
    }

    // ABOUT path
    addPath = () => {
        if (this.state.pathName === "") return;
        this.setState({ isPathMode: true })
        this.isEdited();
    }
    selectCirclesForPath = (e) => {
        const id = Number(e.target.id);
        const selectedCircleForPath = this.state.selectedCircleForPath;
        const last = (selectedCircleForPath.length > 0) ? selectedCircleForPath[selectedCircleForPath.length - 1] : null;
        if (last !== id) this.setState({ selectedCircleForPath: [...selectedCircleForPath, id] })
        this.isEdited();
    }
    savePath = () => {
        this.setState(state => ({
            paths: [...state.paths, { name: state.pathName, points: state.selectedCircleForPath }],
            pathName: "",
            selectedCircleForPath: [],
            isPathMode: false
        }));
    }
    deletePath = (e) => {
        const newPaths = this.state.paths.filter((_, i) => i !== Number(e.target.id));
        this.setState({ paths: newPaths });
        this.isEdited();
    }

    render() {
        return (
            <div>
                {(this.state.isPathMode) ? "" : <button className="btn" onClick={() => this.setState({ isDeleteMode: !this.state.isDeleteMode })}>{this.state.isDeleteMode ? "Delete mode now" : "Add mode now"}</button>}

                <label>courseName :
                    <input type="text" name="courseName" value={this.props.courseName}
                        onChange={e => this.props.changeCourseName(e.target.value)} />
                </label>

                <button className="btn" onClick={() => this.props.saveCourse(this.state.circles, this.state.paths)}>SAVE{(this.state.isEdited) && "*"}</button>

                <div>
                    <label>R:
                        <input type="number" name="r" value={this.props.circleStyle.r}
                            onChange={e => this.props.changeCircleStyle({ ...this.props.circleStyle, r: e.target.value })} />
                    </label>
                    <label>strokeWidth:
                        <input type="number" name="strokeWidth" value={this.props.circleStyle.strokeWidth}
                            onChange={e => this.props.changeCircleStyle({ ...this.props.circleStyle, strokeWidth: e.target.value })} />
                    </label>
                    <label>opacity:
                        <input type="number" name="opacity" step={0.1} value={this.props.circleStyle.opacity}
                            onChange={e => this.props.changeCircleStyle({ ...this.props.circleStyle, opacity: e.target.value })} />
                    </label>
                </div>


                <div style={{ width: "100vw", height: "80vh" }}>
                    <SVGViewArea
                        Viewer={this.Viewer}
                        clickEvent={this.addCircle}
                        width={this.props.imageSize.width}
                        height={this.props.imageSize.height}
                        imageUrl={this.props.location.state.imageUrl}
                    >
                        <CirclesAndPaths
                            circles={this.state.circles}
                            paths={this.state.paths}
                            r={this.props.circleStyle.r}
                            strokeWidth={this.props.circleStyle.strokeWidth}
                            opacity={this.props.circleStyle.opacity}
                            event={{
                                onClick: this.state.isPathMode ? this.selectCirclesForPath : this.deleteCircle,
                                onContextMenu: this.state.isPathMode ? this.selectCirclesForPath : this.deleteCircle
                            }} />
                    </SVGViewArea>
                </div>

                <label>path add :
                    <input type="text" name="pathName" value={this.state.pathName}
                        onChange={e => this.setState({ pathName: e.target.value })} />
                </label>
                <button className="btn" onClick={this.addPath}>add</button>
                {(this.state.isPathMode) &&
                    <div>
                        {this.state.pathName}
                        {this.state.selectedCircleForPath}
                        {(this.state.selectedCircleForPath.length > 1) && < button className="btn" onClick={this.savePath}>save</button>}
                    </div>
                }
                {(this.state.paths).map((path, index) => (
                    <div key={index}>
                        {index} . {path.name} {path.points.map((p) => this.state.circles.map((c, i) => (c.id === p) && i))}
                        <button className="btn" onClick={this.deletePath} id={index}>delete</button>
                    </div>
                ))}
            </div>

        );
    }
}



export default CreateCourse;