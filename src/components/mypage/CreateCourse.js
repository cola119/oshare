import React from 'react';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom/build-es';
import { firebaseDB } from '../../firebase';
import { AutoSizer } from 'react-virtualized';

import { createPathString } from '../../svg/createPathString';
import MyPreventDefault from '../../utils/MyPreventDefault';

class CreateCourse extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Viewer = null;
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
        this.imageLoad();
    }
    imageLoad = () => {
        let img = new Image();
        img.onload = () => { this.setState({ imageWidth: img.naturalWidth, imageHeight: img.naturalHeight }) };
        img.src = this.state.imageUrl;
    }

    // ABOUT circle
    addCircle = (e) => {
        if (this.state.isDeleteMode || this.state.isPathMode) return;
        this.setState({ circles: [...this.state.circles, ...[{ x: e.x, y: e.y, id: Date.now() }]], isEdited: true })
    }
    deleteCircle = (e) => {
        e.preventDefault();
        const id = Number(e.target.id);
        if (this.state.paths.filter((v, i) => v.points.includes(id)).length > 0) return;
        const newCircles = this.state.circles.filter((circles) => circles.id !== id);
        this.setState({ circles: newCircles, isEdited: true })
    }

    // ABOUT path
    addPath = () => {
        if (this.state.pathName === "") alert("名前を入力してください");
        else this.setState({ isPathMode: true, isEdited: true })
    }
    selectCirclesForPath = (e) => {
        const id = Number(e.target.id)
        const last = (this.state.selectedCircleForPath.length > 0) ? this.state.selectedCircleForPath[this.state.selectedCircleForPath.length - 1] : null;
        if (last !== id) this.setState({ selectedCircleForPath: [...this.state.selectedCircleForPath, id], isEdited: true })
    }
    savePath = () => {
        this.setState({
            paths: [...this.state.paths, { name: this.state.pathName, points: this.state.selectedCircleForPath }],
            pathName: "",
            selectedCircleForPath: [],
            isPathMode: false
        });
    }
    deletePath = (e) => {
        const id = Number(e.target.id);
        const newPaths = this.state.paths.filter((_, i) => i !== id);
        this.setState({ paths: newPaths, isEdited: true })
    }


    // ABOUT save
    saveCoursePlan = () => {
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
        return (
            <div>
                <MyPreventDefault />

                {(this.state.isPathMode) ? "" : <button className="btn" onClick={() => this.setState({ isDeleteMode: !this.state.isDeleteMode })}>{this.state.isDeleteMode ? "Delete mode now" : "Add mode now"}</button>}
                <label>courseName : </label>
                <input type="text" name="courseName" value={this.state.courseName}
                    onChange={(e) => this.setState({ courseName: e.target.value })} />
                <button className="btn" onClick={this.saveCoursePlan}>SAVE{(this.state.isEdited) ? "*" : ""}</button>
                <div>
                    <label>R:<input type="number" name="circleR" value={this.state.circleR} onChange={(e) => this.setState({ circleR: e.target.value })} /></label>
                    <label>strokeWidth:<input type="number" name="strokeWidth" value={this.state.strokeWidth} onChange={(e) => this.setState({ strokeWidth: e.target.value })} /></label>
                    <label>opacity:<input type="number" name="opacity" step={0.1} value={this.state.opacity} onChange={(e) => this.setState({ opacity: e.target.value })} /></label>
                </div>


                <div id="svg" style={{ width: "100vw", height: "80vh" }}>
                    <AutoSizer>
                        {(({ width, height }) => width === 0 || height === 0 ? null : (
                            <UncontrolledReactSVGPanZoom width={width} height={height}
                                ref={Viewer => this.Viewer = Viewer}
                                onClick={e => this.addCircle(e)}
                            >
                                <svg width={this.state.imageWidth} height={this.state.imageHeight}>
                                    <g>
                                        <image xlinkHref={this.state.imageUrl} x="0" y="0"
                                            width={this.state.imageWidth} height={this.state.imageHeight} />
                                        {this.state.circles.map((circle, index) => (
                                            <g key={index}>
                                                <circle id={circle.id} cx={circle.x} cy={circle.y} r={this.state.circleR}
                                                    style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: this.state.strokeWidth, opacity: this.state.opacity, fillOpacity: "0.0" }}
                                                    onClick={(this.state.isPathMode) ? this.selectCirclesForPath : this.deleteCircle}
                                                    onContextMenu={(this.state.isPathMode) ? this.selectCirclesForPath : this.deleteCircle}
                                                ></circle>
                                                <circle id={circle.id} cx={circle.x} cy={circle.y} r={4}
                                                    style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: "1", opacity: "1", fillOpacity: "0.5" }}
                                                    onClick={this.deleteCircle}
                                                    onContextMenu={this.deleteCircle}
                                                ></circle>
                                                <text x={circle.x} y={circle.y} fontFamily="Verdana" fontSize="20">{index}</text>
                                            </g>
                                        ))}
                                        {this.state.paths.map((path, index) => (
                                            <g key={index}>
                                                <path d={createPathString(this.state.circles, path.points, this.state.circleR)} style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: this.state.strokeWidth, opacity: "0.7" }} ></path>
                                            </g>
                                        ))}
                                    </g>
                                </svg>
                            </UncontrolledReactSVGPanZoom>
                        ))}
                    </AutoSizer>
                </div>
                <label>path add : </label>
                <input type="text" name="pathName" value={this.state.pathName}
                    onChange={(e) => this.setState({ pathName: e.target.value })} />
                <button className="btn" onClick={this.addPath}>add</button>
                {(this.state.isPathMode) ?
                    <div>
                        {this.state.pathName}
                        {this.state.selectedCircleForPath}
                        {(this.state.selectedCircleForPath.length > 1) ? < button className="btn" onClick={this.savePath}>save</button> : ""}
                    </div> : ""
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