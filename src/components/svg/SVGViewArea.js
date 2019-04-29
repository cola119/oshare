import React from 'react';
import { ReactSVGPanZoom, INITIAL_VALUE } from 'react-svg-pan-zoom/build-es';
import { AutoSizer } from 'react-virtualized';
import { withStyles } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import TouchApp from '@material-ui/icons/TouchApp';
import EditIcon from '@material-ui/icons/Edit';
import Zoom from '@material-ui/core/Zoom';

const styles = theme => ({
    utility: {
        display: "flex",
        alignItems: "center",
        zIndex: 1,
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
        cursor: "pointer"
    },
    fab: {

    },
    tooltip: {
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: "5px"
    }
});

class SVGViewArea extends React.Component {
    state = {
        tool: "pan",
        value: INITIAL_VALUE,
        caution: false
    }

    changeTool = (nextTool) => {
        this.setState({ tool: nextTool })
    }
    changeValue = (nextValue) => {
        this.setState({ value: nextValue })
    }

    render() {
        const props = this.props;
        const fabs = [
            {
                tool: "pan",
                nextTool: "none",
                color: 'primary',
                className: props.classes.fab,
                icon: <TouchApp />,
                text: "ドラッグモード",
            },
            {
                tool: "none",
                nextTool: "pan",
                color: 'secondary',
                className: props.classes.fab,
                icon: <EditIcon />,
                text: "クリックモード"
            },
        ];
        const transitionDuration = {
            enter: props.theme.transitions.duration.enteringScreen,
            exit: props.theme.transitions.duration.leavingScreen,
        };
        return (
            <React.Fragment>
                {this.props.notShowUtiliys || fabs.map(fab => (
                    <Zoom
                        key={fab.color}
                        in={this.state.tool === fab.tool}
                        timeout={transitionDuration}
                        style={{
                            transitionDelay: `${this.state.tool === fab.tool ? transitionDuration.exit : 0}ms`,
                        }}
                        unmountOnExit
                    >
                        <div className={props.classes.utility} onClick={() => this.changeTool(fab.nextTool)}>
                            <div className={props.classes.tooltip}>
                                {fab.text}
                            </div>
                            <Fab
                                size="small"
                                className={fab.className}
                                color={fab.color}
                            >
                                {fab.icon}
                            </Fab>
                        </div>
                    </Zoom>
                ))}
                <AutoSizer>
                    {(({ width, height }) => width === 0 || height === 0 ? null : (
                        <ReactSVGPanZoom width={width} height={height}
                            tool={this.state.tool}
                            onChangeTool={tool => this.changeTool(tool)}
                            value={this.state.value}
                            onChangeValue={value => this.changeValue(value)}
                            onClick={(e) => props.clickEvent(e)}
                            // onPan={() => this.onPan()}
                            miniatureProps={{ position: "none" }}
                            toolbarProps={{ position: "none" }}
                            ref={props.Viewer}>
                            <svg width={props.width} height={props.height} >
                                <g transform={`rotate(${props.rotate || 0} ${props.width / 2} ${props.height / 2})`}>
                                    <image
                                        xlinkHref={props.imageUrl}
                                        x="0" y="0"
                                        width={props.width} height={props.height}
                                        opacity={props.imageOpacity}
                                    />
                                    {props.children}
                                </g>
                            </svg>
                        </ReactSVGPanZoom>
                    ))}
                </AutoSizer>
            </React.Fragment>
        );
    }
}


export default withStyles(styles, { withTheme: true })(SVGViewArea);