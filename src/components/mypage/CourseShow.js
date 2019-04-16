import React from 'react';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom/build-es';
import { AutoSizer } from 'react-virtualized';

class CourseShow extends React.Component {
    constructor(props) {
        super(props);
        this.Viewer = null;
        this.state = {
            isLoading: false,
            imageWidth: 1,
            imageHeight: 1,
            imageUrl: this.props.location.state.imageUrl,
            selectedImageName: this.props.location.state.selectedImageName,
            courseName: this.props.location.state.selectedImageName,
            circles: this.props.location.state.circles,
            paths: this.props.location.state.paths,
            selectedPath: [],
            selectedCircles: []
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.imageLoad();
    }

    imageLoad = () => {
        let img = new Image();
        img.onload = () => { this.setState({ imageWidth: img.naturalWidth, imageHeight: img.naturalHeight, isLoading: false }) };
        img.src = this.state.imageUrl;
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
        if (path.length === 0) return;
        const circles = this.state.circles;
        return path.points.reduce((prev, curr, i, arr) => {
            if (i + 1 === arr.length) return prev;
            const [x1, y1, x2, y2] = this.calcPointsOnCircle(circles[curr].x, circles[curr].y, circles[arr[i + 1]].x, circles[arr[i + 1]].y, 45)
            return [...prev, `M${x1} ${y1}L${x2} ${y2}`];
        }, []);
    }

    selectPath = (e) => {
        const id = e.target.id;
        const selectedCircles = this.state.paths[id].points.map((val) => this.state.circles[val]);
        this.setState({ selectedPath: this.state.paths[id], selectedCircles: selectedCircles });
    }

    render() {
        return (
            <div>
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
                                        {this.state.selectedCircles.map((point, index) => (
                                            <g key={index}>
                                                <circle id={index} cx={point.x} cy={point.y} r={45}
                                                    style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: "5", opacity: "0.7", fillOpacity: "0.0" }}
                                                ></circle>
                                                <circle id={index} cx={point.x} cy={point.y} r={4}
                                                    style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: "1", opacity: "1", fillOpacity: "0.5" }}
                                                ></circle>
                                                <text x={point.x} y={point.y} fontFamily="Verdana" fontSize="20">{index}</text>
                                            </g>
                                        ))}
                                        <path d={this.createPathString(this.state.selectedPath)}
                                            style={{ fill: "#9400D3", stroke: "#9400D3", strokeWidth: "5", opacity: "0.7" }} ></path>
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