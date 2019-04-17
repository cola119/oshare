import React from 'react';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom/build-es';
import { AutoSizer } from 'react-virtualized';
import MyPreventDefault from '../../utils/MyPreventDefault';

import { createPathString } from '../../svg/createPathString';

class CourseShow extends React.Component {
    constructor(props) {
        super(props);
        this.Viewer = null;
        const courseInfo = this.props.location.state.courseInfo;
        this.state = {
            imageWidth: 1,
            imageHeight: 1,
            imageUrl: courseInfo.imageUrl,
            courseName: courseInfo.courseName,
            circles: courseInfo.circles,
            paths: courseInfo.paths,
            circleR: courseInfo.circleR,
            strokeWidth: courseInfo.strokeWidth,
            opacity: courseInfo.opacity,
            selectedPath: [],
            selectedCircles: []
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


    selectPath = (e) => {
        const id = e.target.id;
        const selectedCircles = this.state.paths[id].points.map((val) => this.state.circles.filter((circle) => circle.id === val)[0]);
        this.setState({ selectedPath: this.state.paths[id], selectedCircles: selectedCircles });
    }

    render() {
        return (
            <div>
                <MyPreventDefault />
                <div>
                    <button className="btn" onClick={(e) => this.setState({ selectedPath: [], selectedCircles: this.state.circles })}>all controls</button>
                    {(this.state.paths).map((path, index) => (
                        <div key={index}>
                            {index} . {path.name} {path.points}
                            <button className="btn" onClick={this.selectPath} id={index}>show</button>
                        </div>
                    ))}
                </div>
                <div id="svg" style={{ width: "100vw", height: "80vh" }}>
                    <AutoSizer>
                        {(({ width, height }) => width === 0 || height === 0 ? null : (
                            <UncontrolledReactSVGPanZoom width={width} height={height}
                                tool="auto"
                                ref={Viewer => this.Viewer = Viewer}
                            >
                                <svg width={this.state.imageWidth} height={this.state.imageHeight}>
                                    <g>
                                        <image xlinkHref={this.state.imageUrl} x="0" y="0"
                                            width={this.state.imageWidth} height={this.state.imageHeight} />
                                        {this.state.selectedCircles.map((circle, index) => (
                                            <g key={index}>
                                                <circle id={circle.id} cx={circle.x} cy={circle.y} r={this.state.circleR}
                                                    style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: this.state.strokeWidth, opacity: this.state.opacity, fillOpacity: "0.0" }}
                                                ></circle>
                                                <circle id={circle.id} cx={circle.x} cy={circle.y} r={4}
                                                    style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: "1", opacity: "1", fillOpacity: "0.5" }}
                                                ></circle>
                                                <text x={circle.x + 45} y={circle.y - 45}
                                                    style={{ fill: "#9400D3", fontFamily: "Verdana", fontSize: "40" }}>{index + 1}</text>
                                            </g>
                                        ))}
                                        <path d={createPathString(this.state.circles, this.state.selectedPath.points, this.state.circleR)}
                                            style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: this.state.strokeWidth, opacity: this.state.opacity }} ></path>
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

export default CourseShow;