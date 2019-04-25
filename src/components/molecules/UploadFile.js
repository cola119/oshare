import React from 'react';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class UploadFile extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <>
                <input
                    id="contained-button-file"
                    accept={this.props.accept}
                    style={{ display: "none" }}
                    type="file"
                    onChange={this.props.onChange}
                />
                <label htmlFor="contained-button-file">
                    <Button
                        variant="outlined"
                        component="span"
                        className={classes.button}
                        disabled={this.props.disabled}
                    >
                        {this.props.text}
                    </Button>
                </label>
            </>
        )
    }
}

export default withStyles(styles)(UploadFile);