import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/lab/Slider';

const styles = theme => ({
    root: {
        // paddingLeft: "10px",
        width: "100%",
        // width: theme.spacing.unit * 15,
    },
    slider: {
        // margin: "10 10"
    }
});

const MySlider = (props) => {
    return (
        <div className={props.classes.root}>
            <Slider
                className={props.classes.slider}
                value={props.value}
                aria-labelledby="label"
                onChange={props.onChange}
                min={props.min}
                max={props.max}
                step={props.step}
            />
        </div>
    )
}

export default withStyles(styles)(MySlider);