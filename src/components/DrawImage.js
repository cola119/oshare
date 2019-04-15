import React from 'react';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom/build-es';
import { firebaseStorage, firebaseDB } from '../firebase';
import { AutoSizer } from 'react-virtualized';

class DrawImage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Viewer = null;
        this.state = {
            isLoading: false,
            isDeleteMode: false,
            isPathMode: false,
            courseDoc: `${this.props.location.state.courseName}-${this.props.uid}`,
            imageWidth: 1,
            imageHeight: 1,
            imageUrl: "",
            selectedImageName: this.props.selectedImageName,
            courseName: "",
            circles: [],
            pathName: "",
            selectedCircleForPath: [],
            paths: [],
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.courseLoad();
    }

    imageLoad = () => {
        firebaseStorage.ref().child(`images/${this.props.uid}/${this.state.selectedImageName}`).getDownloadURL().then((url) => {
            let img = new Image();
            img.onload = () => { this.setState({ imageWidth: img.naturalWidth, imageHeight: img.naturalHeight }) };
            img.src = url;
            this.setState({ imageUrl: url, isLoading: false });
        })
    }
    // async await
    courseLoad = () => {
        firebaseDB.collection('courses').doc(`${this.state.courseDoc}`).get().then((doc) => {
            if (doc.data() !== undefined) {
                this.setState({
                    imageUrl: doc.data().imageUrl,
                    selectedImageName: doc.data().selectedImageName,
                    courseName: doc.data().courseName,
                    circles: doc.data().circles,
                    paths: []
                    // paths: [{ name: "aa", points: [0, 2, 1] }, { name: "aa", points: [3, 4] }]
                });
            }
            this.imageLoad();
        });
    }


    setDragmode = () => {
        this.setState({ isDeleteMode: !this.state.isDeleteMode })
    }

    // ABOUT circle
    addCircle = (e) => {
        if (this.state.isDeleteMode || this.state.isPathMode) return;
        this.setState({ circles: [...this.state.circles, ...[{ x: e.x, y: e.y }]] })
    }
    deleteCircle = (e) => {
        e.preventDefault();
        const id = Number(e.target.id);
        const newCircles = this.state.circles.filter((e, i) => i !== id);
        this.setState({ circles: newCircles })
    }

    // ABOUT path
    addPath = () => {
        if (this.state.pathName === "") return;
        this.setState({ isPathMode: true })
    }
    selectCirclesForPath = (e) => {
        const id = Number(e.target.id)
        const last = (this.state.selectedCircleForPath.length > 0) ? this.state.selectedCircleForPath[this.state.selectedCircleForPath.length - 1] : null;
        if (last !== id) this.setState({ selectedCircleForPath: [...this.state.selectedCircleForPath, id] })
    }
    savePath = () => {
        this.setState({
            paths: [...this.state.paths, { name: this.state.pathName, points: this.state.selectedCircleForPath }],
            pathName: "",
            selectedCircleForPath: [],
            isPathMode: false
        }, () => console.log(this.state.paths));
    }
    calcPointsOnCircle = (x1, y1, x2, y2, r) => {
        const c = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
        const cos = (x2 - x1) / c;
        const sin = (y2 - y1) / c;
        const [_x1, _y1] = [r * cos, r * sin];
        const [_x2, _y2] = [(c - r) * cos, (c - r) * sin];
        return [x1 + _x1, y1 + _y1, x1 + _x2, y1 + _y2];
    }
    createPathString = (path) => {
        const circles = this.state.circles;
        return path.points.reduce((prev, curr, i, arr) => {
            if (i + 1 === arr.length) return prev;
            const [x1, y1, x2, y2] = this.calcPointsOnCircle(circles[curr].x, circles[curr].y, circles[arr[i + 1]].x, circles[arr[i + 1]].y, 45)
            return [...prev, `M${x1} ${y1}L${x2} ${y2}`];
        }, []);
    }

    saveCoursePlan = () => {
        if (this.state.courseName === "" || this.state.circles.length === 0) return;
        firebaseDB.collection('courses').doc(`${this.state.courseDoc}`).set({
            circles: this.state.circles,
            paths: this.state.paths,
            uid: this.props.uid,
            imageUrl: this.state.imageUrl,
            courseName: this.state.courseName,
            selectedImageName: this.state.selectedImageName,
            created_at: Date.now()
        }).then(() => {
            console.log("done");
        });
    }

    render() {
        return (
            <div>
                {(this.state.isPathMode) ? "" : <button className="btn" onClick={this.setDragmode}>{this.state.isDeleteMode ? "Delete mode now" : "Add mode now"}</button>}
                <label>courseName : </label>
                <input type="text" name="courseName" value={this.state.courseName}
                    onChange={(e) => this.setState({ courseName: e.target.value })} />
                <button className="btn" onClick={this.saveCoursePlan}>SAVE</button>
                <span>{(this.state.isLoading) ? "loading..." : ""}</span>
                <div id="svg" style={{ width: "100vw", height: "80vh" }}>
                    <AutoSizer>
                        {(({ width, height }) => width === 0 || height === 0 ? null : (
                            <UncontrolledReactSVGPanZoom width={width} height={height}
                                // tool="pan"
                                ref={Viewer => this.Viewer = Viewer}
                                onClick={e => this.addCircle(e)}
                            >
                                <svg width={this.state.imageWidth} height={this.state.imageHeight}>
                                    <g>
                                        <image xlinkHref={this.state.imageUrl} x="0" y="0"
                                            width={this.state.imageWidth} height={this.state.imageHeight} />
                                        {this.state.circles.map((point, index) => (
                                            <g key={index}>
                                                <circle id={index} cx={point.x} cy={point.y} r={45}
                                                    style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: "5", opacity: "0.7", fillOpacity: "0.0" }}
                                                    onClick={(this.state.isPathMode) ? this.selectCirclesForPath : this.deleteCircle}
                                                    onContextMenu={(this.state.isPathMode) ? this.selectCirclesForPath : this.deleteCircle}
                                                ></circle>
                                                <circle id={index} cx={point.x} cy={point.y} r={4}
                                                    style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: "1", opacity: "1", fillOpacity: "0.5" }}
                                                // onClick={this.deleteCircle}
                                                // onContextMenu={this.deleteCircle}
                                                ></circle>
                                                <text x={point.x} y={point.y} fontFamily="Verdana" fontSize="20">{index}</text>
                                            </g>
                                        ))}
                                        {this.state.paths.map((path, index) => (
                                            <g key={index}>
                                                <path d={this.createPathString(path)} style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: "5", opacity: "0.7" }} ></path>
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

            </div>
        );
    }
}

const EVENTS_TO_MODIFY = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'wheel'];

const originalAddEventListener = document.addEventListener.bind();
document.addEventListener = (type, listener, options, wantsUntrusted) => {
    let modOptions = options;
    if (EVENTS_TO_MODIFY.includes(type)) {
        if (typeof options === 'boolean') {
            modOptions = {
                capture: options,
                passive: false,
            };
        } else if (typeof options === 'object') {
            modOptions = {
                ...options,
                passive: false,
            };
        }
    }

    return originalAddEventListener(type, listener, modOptions, wantsUntrusted);
};

const originalRemoveEventListener = document.removeEventListener.bind();
document.removeEventListener = (type, listener, options) => {
    let modOptions = options;
    if (EVENTS_TO_MODIFY.includes(type)) {
        if (typeof options === 'boolean') {
            modOptions = {
                capture: options,
                passive: false,
            };
        } else if (typeof options === 'object') {
            modOptions = {
                ...options,
                passive: false,
            };
        }
    }
    return originalRemoveEventListener(type, listener, modOptions);
};

export default DrawImage;