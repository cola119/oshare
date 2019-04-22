import React from 'react';
import MainCircles from './MainCircles';
import MainPaths from './MainPaths';

// circles: [{id: , x: , y: }, {}, ...]
// paths  : [{name: , points:[...]}, {}, ...]  //points: 円のid（結ぶ順）
// circlesとcirclesを結ぶパスを描画
const CirclesAndPaths = (props) => {

    return (
        <g>
            <MainPaths
                paths={props.paths}
                circles={props.circles}
                r={props.r}
                style={{ strokeWidth: props.strokeWidth, opacity: props.pathOpacity }}
            />
            <MainCircles
                circles={props.circles}
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