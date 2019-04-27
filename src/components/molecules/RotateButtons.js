import React from 'react';

import { withStyles } from '@material-ui/core/styles';
// import IconButton from '../atoms/Buttons/IconButton';
import IconButton from '@material-ui/core/IconButton';
import RotateLeft from '@material-ui/icons/RotateLeft';
import RotateRight from '@material-ui/icons/RotateRight';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

const RotateButtons = (props) => {
    return (
        <>
            <IconButton
                onClick={() => props.onClick(props.step * (-1) || -1)}
                disabled={props.disabled}
            ><RotateLeft /></IconButton>
            <IconButton
                onClick={() => props.onClick(props.step || 1)}
                disabled={props.disabled}
            ><RotateRight /></IconButton>
        </>
    )
}

export default withStyles(styles)(RotateButtons);