import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

const DangerButton = (props) => {
    return (
        <Button
            variant="contained"
            color="secondary"
            className={props.noMargin ? "" : props.classes.button}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.children || props.text}
        </Button>
    )
}
export default withStyles(styles)(DangerButton);