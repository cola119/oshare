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
            courseDoc: `${this.props.location.state.courseName}-${this.props.uid}`,
            imageWidth: 1,
            imageHeight: 1,
            imageUrl: "",
            selectedImageName: this.props.selectedImageName,
            courseName: "",
            circles: [],
            paths: []
            // paths: [{ from: 0, to: 1 }, { from: 0, to: 2 }]
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
                });
            }
            this.imageLoad();
        });
    }

    setDragmode = () => {
        this.setState({ isDeleteMode: !this.state.isDeleteMode })
    }

    addCircle = (e) => {
        if (this.state.isDeleteMode) return;
        this.setState({ circles: [...this.state.circles, ...[{ x: e.x, y: e.y }]] })
    }
    deleteCircle = (e) => {
        e.preventDefault();
        const id = Number(e.target.id);
        const newCircles = this.state.circles.filter((e, i) => i !== id);
        this.setState({ circles: newCircles })
    }

    createPathString = (path) => {
        const from = this.state.circles[path.from];
        const to = this.state.circles[path.to];
        return `M${from.x} ${from.y}L${to.x} ${to.y}`;
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
                <button className="btn" onClick={this.setDragmode}>{this.state.isDeleteMode ? "Delete mode now" : "Add mode now"}</button>
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
                                                    onClick={this.deleteCircle}
                                                    onContextMenu={this.deleteCircle}
                                                ></circle>
                                                <circle id={index} cx={point.x} cy={point.y} r={4}
                                                    style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: "1", opacity: "1", fillOpacity: "0.5" }}
                                                    onClick={this.deleteCircle}
                                                    onContextMenu={this.deleteCircle}
                                                ></circle>
                                                <text x={point.x} y={point.y} fontFamily="Verdana" fontSize="20">{index}</text>
                                            </g>
                                        ))}
                                        {this.state.paths.map((path, index) => (
                                            <g key={index}>
                                                <path d={this.createPathString(path)} fill="red" stroke="blue" strokeWidth="3"></path>
                                            </g>
                                        ))}
                                    </g>
                                </svg>
                            </UncontrolledReactSVGPanZoom>
                        ))}
                    </AutoSizer>
                </div>
                <label>courseName input</label>
                <input type="text" name="courseName" value={this.state.courseName}
                    onChange={(e) => this.setState({ courseName: e.target.value })} />
                <button className="btn" onClick={this.saveCoursePlan}>SAVE</button>
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