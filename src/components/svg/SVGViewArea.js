import React from 'react';
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom/build-es';
import { AutoSizer } from 'react-virtualized';

const SVGViewArea = (props) => {
    if (props.tool) {
        return (
            <>
                <AutoSizer>
                    {(({ width, height }) => width === 0 || height === 0 ? null : (
                        <UncontrolledReactSVGPanZoom width={width} height={height}
                            onClick={(e) => props.clickEvent(e)} ref={props.Viewer} tool={props.tool}>
                            <svg width={props.width} height={props.height}>
                                <g transform={`rotate(${props.rotate} ${props.width / 2} ${props.height / 2})`}>
                                    <image
                                        xlinkHref={props.imageUrl}
                                        x="0" y="0"
                                        width={props.width} height={props.height}
                                        opacity={0.5}
                                    />
                                    {props.children}
                                </g>
                            </svg>
                        </UncontrolledReactSVGPanZoom>
                    ))}
                </AutoSizer>
            </>
        );
    }
    return (
        <React.Fragment>
            <AutoSizer>
                {(({ width, height }) => width === 0 || height === 0 ? null : (
                    <UncontrolledReactSVGPanZoom width={width} height={height}
                        onClick={(e) => props.clickEvent(e)} ref={props.Viewer}>
                        <svg width={props.width} height={props.height} >
                            <image
                                xlinkHref={props.imageUrl}
                                x="0" y="0"
                                width={props.width} height={props.height}
                                opacity={props.imageOpacity}
                            />
                            {props.children}
                        </svg>
                    </UncontrolledReactSVGPanZoom>
                ))}
            </AutoSizer>
        </React.Fragment>
    );
}

export default SVGViewArea;