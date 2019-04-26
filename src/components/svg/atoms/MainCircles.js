import React from 'react';
import MainCircle from './MainCircle';

const MainCircles = (props) => {
    // console.log(props.selectedCircleIds)
    return (
        props.circles.map((circle, index) => (
            <MainCircle
                key={index}
                circle={{ ...circle, r: props.r }}
                style={{ ...props.style, fill: (props.selectedCircleIds.includes(circle.id)) ? "#fff" : "transparent" }}
                event={props.event}
                text={props.text === undefined ? index : props.text}
                smallCircle={props.smallCircle}
            />
        ))
    );
}

export default MainCircles;