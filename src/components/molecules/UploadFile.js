import React from 'react';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

const UploadFile = (props) => {
    return (
        <>
            <input
                id="contained-button-file"
                accept={props.accept}
                style={{ display: "none" }}
                type="file"
                onChange={props.onChange}
            />
            <label htmlFor="contained-button-file">
                <Button
                    variant="outlined"
                    component="span"
                    className={props.classes.button}
                    disabled={props.disabled}
                >
                    {props.text}
                </Button>
            </label>
        </>
    )
}

export default withStyles(styles)(UploadFile);