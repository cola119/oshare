import React from 'react';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom/build-es';
import { AutoSizer } from 'react-virtualized';
import MyPreventDefault from './MyPreventDefault';

const SVGViewArea = (props) => {
    if (props.tool) {
        return (
            <React.Fragment>
                <AutoSizer>
                    {(({ width, height }) => width === 0 || height === 0 ? null : (
                        <UncontrolledReactSVGPanZoom width={width} height={height}
                            onClick={(e) => props.clickEvent(e)} ref={props.Viewer} tool={props.tool}>
                            <svg width={props.width} height={props.height}>
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
    return (
        <React.Fragment>
            <AutoSizer>
                {(({ width, height }) => width === 0 || height === 0 ? null : (
                    <UncontrolledReactSVGPanZoom width={width} height={height}
                        onClick={(e) => props.clickEvent(e)} ref={props.Viewer}>
                        <svg width={props.width} height={props.height}>
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