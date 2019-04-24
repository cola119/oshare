import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/lab/Slider';

const styles = theme => ({
    root: {
        width: 300,
    },
});

const MySlider = (props) => {
    return (
        <div className={props.classes.root}>
            <Slider
                value={props.value}
                aria-labelledby="label"
                onChange={props.onChange}
                min={props.min}
                max={props.max}
            />
        </div>
    )
}

export default withStyles(styles)(MySlider);