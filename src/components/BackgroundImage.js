import React from 'react';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom/build-es';
import { firebaseStorage } from '../firebase';
import { AutoSizer } from 'react-virtualized';

class BackgroundImage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.Viewer = null;

        this.state = {
            imageUrl: ""
        };
    }

    imageLoad = () => {
        firebaseStorage.ref().child('images/allJapan.jpg').getDownloadURL().then((url) => {
            console.log(url);
            this.setState({ imageUrl: url });
        })
    }

    render() {
        return (
            <div>
                <button className="btn" onClick={this.imageLoad}>LOAD</button>
                <div style={{ width: "100vw", height: "80vh" }}>
                    <AutoSizer>
                        {(({ width, height }) => width === 0 || height === 0 ? null : (
                            <UncontrolledReactSVGPanZoom
                                tool="auto"
                                width={width} height={height}
                                // detectPinchGesture={true}
                                ref={Viewer => this.Viewer = Viewer}
                                onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
                            >
                                <svg width={100} height={100}>
                                    <g>
                                        <image xlinkHref={this.state.imageUrl} x="0" y="0" width={100} height={100} />
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

export default BackgroundImage;