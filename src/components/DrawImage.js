import React from 'react';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom/build-es';
import { firebaseStorage } from '../firebase';
import { AutoSizer } from 'react-virtualized';

class DrawImage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Viewer = null;
        this.state = {
            isLoading: false,
            isDeleteMode: false,
            imageUrl: "",
            imageWidth: 1,
            imageHeight: 1,
            circles: []
        };
    }

    componentDidMount() {
        this.imageLoad();
    }

    imageLoad = () => {
        this.setState({ isLoading: true });
        firebaseStorage.ref().child(`images/${this.props.uid}/${this.props.selectedImageName}`).getDownloadURL().then((url) => {
            let img = new Image();
            img.onload = () => { this.setState({ imageWidth: img.naturalWidth, imageHeight: img.naturalHeight }) };
            img.src = url;
            this.setState({ imageUrl: url, isLoading: false });
        })
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

    // handleMouseDown = (e) => {
    //     console.log(e.target)
    //     const circle = e.target
    //     circle.addEventListener('mousemove', this.handleMouseMove);
    // }
    // handleMouseUp = (e) => {
    //     // console.log(e.target)
    //     const circle = e.target
    //     circle.removeEventListener('mousemove', this.handleMouseMove);
    // }
    // getMousePosition = (e) => {
    //     const svg = document.getElementById('svg').firstElementChild.firstElementChild.firstElementChild;
    //     var CTM = svg.getScreenCTM();
    //     return {
    //         x: (e.clientX - CTM.e) / CTM.a,
    //         y: (e.clientY - CTM.f) / CTM.d
    //     };
    // }
    // handleMouseMove = (e) => {
    //     const id = e.target.id
    //     console.log(e.offsetX, e.offsetY)
    //     const p = this.getMousePosition(e)

    //     const pastCircles = this.state.circles.slice();
    //     pastCircles[id] = { x: p.x, y: p.y };
    //     this.setState({ circles: pastCircles })
    // }

    render() {
        console.log(this.state.circles)

        return (
            <div>
                <button className="btn" onClick={this.imageLoad}>LOAD</button>
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
                                            <circle key={index} id={index} cx={point.x} cy={point.y} r={45}
                                                style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: "5", opacity: "0.7", fillOpacity: "0.0" }}
                                                // onMouseDown={this.handleMouseDown}
                                                // onMouseUp={this.handleMouseUp}
                                                onClick={this.deleteCircle}
                                                onContextMenu={this.deleteCircle}
                                            ></circle>
                                        ))}
                                    </g>
                                </svg>
                            </UncontrolledReactSVGPanZoom>
                        ))}
                    </AutoSizer>
                </div>
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