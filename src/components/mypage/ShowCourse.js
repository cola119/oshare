import React from 'react';

import CirclesAndPaths from '../svg/CirclesAndPaths';
import SVGViewArea from '../svg/SVGViewArea';

class ShowCourse extends React.Component {
    constructor(props) {
        super(props);
        this.Viewer = React.createRef();
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
        this.setState({ selectedPath: [this.state.paths[id]], selectedCircles: selectedCircles });
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
                <div style={{ width: "100vw", height: "80vh" }}>
                    <SVGViewArea
                        Viewer={this.Viewer}
                        clickEvent={() => (null)}
                        width={this.state.imageWidth}
                        height={this.state.imageHeight}
                        imageUrl={this.state.imageUrl}
                    >
                        <CirclesAndPaths
                            circles={this.state.selectedCircles}
                            paths={this.state.selectedPath}
                            r={this.state.circleR}
                            strokeWidth={this.state.strokeWidth}
                            opacity={this.state.opacity}
                            event={{}}
                        />
                    </SVGViewArea>
                </div>
            </div>
        );
    }
}

export default ShowCourse;