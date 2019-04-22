import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
});

class NormalButton extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <Button
                variant="outlined"
                className={classes.button}
                onClick={this.props.onClick}
            >
                {this.props.children}
            </Button>
        )
    }
}

export default withStyles(styles)(NormalButton);