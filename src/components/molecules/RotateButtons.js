import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '../atoms/Buttons/IconButton';
import RotateLeft from '@material-ui/icons/RotateLeft';
import RotateRight from '@material-ui/icons/RotateRight';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

const RotateButtons = (props) => {
    return (
        <div>
            <IconButton
                onClick={() => props.onClick(-1)}
                disabled={props.disabled}
                icon={<RotateLeft />}
            />
            <IconButton
                onClick={() => props.onClick(1)}
                disabled={props.disabled}
                icon={<RotateRight />}
            />
        </div>
    )
}

export default withStyles(styles)(RotateButtons);