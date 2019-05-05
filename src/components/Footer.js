import React from 'react';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    footer: {
        padding: theme.spacing.unit * 6,
    },
});

const Footer = (props) => {
    return (
        <footer className={props.classes.footer}>
            {/* <Typography variant="h6" align="center" gutterBottom>
                Footer
            </Typography> */}
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                ©︎2019 oshare.o-app.net
            </Typography>
        </footer>
    )
}

export default withStyles(styles)(Footer);