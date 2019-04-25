import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/IconButton';

const styles = theme => ({
    // button: {
    //     margin: theme.spacing.unit,
    // },
});

const IconButton = (props) => {
    return (
        <Button
            variant="outlined"
            className={props.classes.button}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.icon}
        </Button>
    )
}

export default withStyles(styles)(IconButton);