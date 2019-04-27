import React from 'react';
import MainCircles from './atoms/MainCircles';
import MainPaths from './atoms/MainPaths';

// circles: [{id: , x: , y: }, {}, ...]
// paths  : [{name: , points:[...]}, {}, ...]  //points: 円のid（結ぶ順）
// circlesとcirclesを結ぶパスを描画
const CirclesAndPaths = (props) => {
    // console.log(props.selectedCircleIds)
    return (
        <g>
            <MainPaths
                paths={props.paths}
                circles={props.circles}
                r={props.r}
                pathColor={props.pathColor}
                style={{ strokeWidth: props.strokeWidth, opacity: props.pathOpacity }}
            />
            <MainCircles
                circles={props.circles}
                selectedCircleIds={props.selectedCircleIds || []}
                r={props.r}
                style={{ strokeWidth: props.strokeWidth, opacity: props.circleOpacity }}
                event={props.event}
                text={props.text}
                smallCircle={props.smallCircle}
            />
        </g>
    );
}

export default CirclesAndPaths;