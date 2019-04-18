import React from 'react';
import MainCircle from './MainCircle';

const MainCircles = (props) => {
    return (
        props.circles.map((circle, index) => (
            <MainCircle
                key={index}
                circle={{ ...circle, r: props.r }}
                style={props.style}
                event={props.event}
                text={index}
            />
        ))
    );
}

export default MainCircles;