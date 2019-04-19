import React from 'react';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom/build-es';
import { AutoSizer } from 'react-virtualized';
import MyPreventDefault from './MyPreventDefault';

const SVGViewArea = (props) => {
    return (
        <React.Fragment>
            <AutoSizer>
                {(({ width, height }) => width === 0 || height === 0 ? null : (
                    <UncontrolledReactSVGPanZoom width={width} height={height} onClick={(e) => props.clickEvent(e)} ref={props.Viewer}>
                        <svg width={props.width} height={props.height}>
                            <text x={props.width} y="0">{props.width}</text>
                            <image xlinkHref={props.imageUrl} x="0" y="0" width={props.width} height={props.height} />
                            {props.children}
                        </svg>
                    </UncontrolledReactSVGPanZoom>
                ))}
            </AutoSizer>
            <MyPreventDefault />
        </React.Fragment>
    );
}

export default SVGViewArea;