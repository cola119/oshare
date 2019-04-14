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
            imageUrl: "",
            imageWidth: 0,
            imageHeight: 0,
            circles: []
        };
    }

    imageLoad = () => {
        this.setState({ isLoading: true });
        firebaseStorage.ref().child('images/E255F31B-EE12-4246-8D05-DCD676FA07B9.jpeg').getDownloadURL().then((url) => {
            let img = new Image();
            img.onload = () => { this.setState({ imageWidth: img.naturalWidth, imageHeight: img.naturalHeight }) };
            img.src = url;
            this.setState({ imageUrl: url, isLoading: false });
        })
    }

    addCircle = (e) => {
        // console.log('click', e.x, e.y, e.originalEvent)
        this.setState({ circles: [...this.state.circles, ...[{ x: e.x, y: e.y }]] })
    }

    render() {
        return (
            <div>
                <button className="btn" onClick={this.imageLoad}>LOAD</button>
                <span>{(this.state.isLoading) ? "loading..." : ""}</span>
                <div style={{ width: "100vw", height: "80vh" }}>
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
                                            <circle key={index} cx={point.x} cy={point.y} r={45} style={{ fill: "none", stroke: "#9400D3", strokeWidth: "5", opacity: "0.7" }}></circle>
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