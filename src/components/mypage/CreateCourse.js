import React from 'react';
import { firebaseDB } from '../../firebase';

import SVGViewArea from '../svg/SVGViewArea';
import CirclesAndPaths from '../svg/CirclesAndPaths';

class CreateCourse extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Viewer = React.createRef();
        const courseInfo = this.props.location.state.courseInfo;
        this.state = {
            uid: courseInfo.uid,
            isDeleteMode: false,
            isPathMode: false,
            isEdited: false,
            imageWidth: 1,
            imageHeight: 1,
            imageUrl: courseInfo.imageUrl,
            courseName: courseInfo.courseName,
            circles: courseInfo.circles,
            paths: courseInfo.paths,
            circleR: courseInfo.circleR || 45,
            strokeWidth: courseInfo.strokeWidth || 5,
            opacity: courseInfo.opacity || 0.7,
            pathName: "",
            selectedCircleForPath: [],
        };
    }

    componentDidMount() {
        let img = new Image();
        img.onload = () => this.setState({ imageWidth: img.naturalWidth, imageHeight: img.naturalHeight });
        img.src = this.state.imageUrl;
    }

    isEdited = () => this.setState({ isEdited: true });

    // ABOUT circle
    addCircle = (e) => {
        if (this.state.isDeleteMode || this.state.isPathMode) return;
        const newCircles = [...this.state.circles, ...[{ x: e.x, y: e.y, id: Date.now() }]]
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


    // ABOUT save
    saveCourse = () => {
        if (this.state.courseName === "" || this.state.circles.length === 0) return;
        firebaseDB.collection('courses').doc(`${this.state.courseName}-${this.state.uid}`).set({
            circles: this.state.circles,
            paths: this.state.paths,
            uid: this.state.uid,
            imageUrl: this.state.imageUrl,
            courseName: this.state.courseName,
            circleR: this.state.circleR,
            strokeWidth: this.state.strokeWidth,
            opacity: this.state.opacity,
            created_at: Date.now()
        }).then(() => {
            this.setState({ isEdited: false });
            console.log("done");
            alert("保存しました");
        });
    }

    render() {
        console.log(this.state.imageWidth)
        return (
            <div>
                {(this.state.isPathMode) ? "" : <button className="btn" onClick={() => this.setState({ isDeleteMode: !this.state.isDeleteMode })}>{this.state.isDeleteMode ? "Delete mode now" : "Add mode now"}</button>}
                <label>courseName : </label>
                <input type="text" name="courseName" value={this.state.courseName} onChange={e => this.setState({ courseName: e.target.value })} />
                <button className="btn" onClick={this.saveCourse}>SAVE{(this.state.isEdited) && "*"}</button>
                <div>
                    <label>R:<input type="number" name="circleR" value={this.state.circleR} onChange={e => this.setState({ circleR: e.target.value })} /></label>
                    <label>strokeWidth:<input type="number" name="strokeWidth" value={this.state.strokeWidth} onChange={e => this.setState({ strokeWidth: e.target.value })} /></label>
                    <label>opacity:<input type="number" name="opacity" step={0.1} value={this.state.opacity} onChange={e => this.setState({ opacity: e.target.value })} /></label>
                </div>


                <div style={{ width: "100vw", height: "80vh" }}>
                    <SVGViewArea
                        Viewer={this.Viewer}
                        clickEvent={this.addCircle}
                        width={this.state.imageWidth}
                        height={this.state.imageHeight}
                        imageUrl={this.state.imageUrl}
                    >
                        <CirclesAndPaths
                            circles={this.state.circles}
                            paths={this.state.paths}
                            r={this.state.circleR}
                            strokeWidth={this.state.strokeWidth}
                            opacity={this.state.opacity}
                            event={{
                                onClick: this.state.isPathMode ? this.selectCirclesForPath : this.deleteCircle,
                                onContextMenu: this.state.isPathMode ? this.selectCirclesForPath : this.deleteCircle
                            }} />
                    </SVGViewArea>
                </div>

                <label>path add : </label>
                <input type="text" name="pathName" value={this.state.pathName}
                    onChange={e => this.setState({ pathName: e.target.value })} />
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