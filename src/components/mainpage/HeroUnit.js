import React from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import backgroundImage from '../../img/background.png';

const styles = theme => ({
    heroUnit: {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
    },
    heroContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
    },
    heroButtons: {
        marginTop: theme.spacing.unit * 4,
    },
});

const HeroUnit = (props) => {
    return (
        <div className={props.classes.heroUnit}>
            <div className={props.classes.heroContent}>
                <Typography component="h3" variant="h3" align="center" color="textPrimary" gutterBottom>
                    ルートを共有しよう
                </Typography>
                <Typography variant="h6" align="center" color="textPrimary" paragraph>
                    地図読み練習、ルート検討・議論に活用してください
                </Typography>
                <div className={props.classes.heroButtons}>
                    <Grid container justify="center">
                        <Grid item>
                            <Button variant="contained" color="primary">
                                使い方
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    );
}

export default withStyles(styles)(HeroUnit);