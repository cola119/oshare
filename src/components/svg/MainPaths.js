import React from 'react';
import { createPathString } from '../../svg/createPathString';

const MainPaths = (props) => {
    return (
        props.paths.map((path, index) => (
            <path
                key={index}
                d={createPathString(props.circles, path.points, props.r)}
                style={{ fill: "#9400D3", stroke: "#9400D3", ...props.style }}
            />
        ))
    );
}

export default MainPaths;