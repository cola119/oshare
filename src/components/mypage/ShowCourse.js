import React from 'react';

import CirclesAndPaths from '../svg/CirclesAndPaths';
import SVGViewArea from '../svg/SVGViewArea';

class ShowCourse extends React.Component {
    constructor(props) {
        super(props);
        this.Viewer = React.createRef();
        this.courseInfo = this.props.location.state.courseInfo;
        this.state = {
            selectedPath: [],
            selectedCircles: []
        };
    }

    componentDidMount() {
        // this.props.changeCourseName(this.courseInfo.courseName)
        // this.props.changeCircleStyle(this.courseInfo.circleStyle)
        // this.imageLoad();
    }

    selectPath = (e) => {
        const id = e.target.id;
        const selectedCircles = this.courseInfo.paths[id].points.map((val) => this.courseInfo.circles.find((circle) => circle.id === val));
        this.setState({ selectedPath: [this.courseInfo.paths[id]], selectedCircles: selectedCircles });
    }

    render() {
        return (
            <div>
                <div>
                    <button className="btn" onClick={(e) => this.setState({ selectedPath: [], selectedCircles: this.courseInfo.circles })}>all controls</button>
                    {(this.courseInfo.paths).map((path, index) => (
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
                        width={this.courseInfo.imageSize.width}
                        height={this.courseInfo.imageSize.height}
                        imageUrl={this.courseInfo.imageUrl}
                    >
                        <CirclesAndPaths
                            circles={this.state.selectedCircles}
                            paths={this.state.selectedPath}
                            r={this.courseInfo.circleStyle.r}
                            strokeWidth={this.courseInfo.circleStyle.strokeWidth}
                            opacity={this.courseInfo.circleStyle.opacity}
                            event={{}}
                        />
                    </SVGViewArea>
                </div>
            </div>
        );
    }
}

export default ShowCourse;