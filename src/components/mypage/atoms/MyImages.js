import React from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router'
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
            width: 1100,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    cardGrid: {
        // padding: `${theme.spacing.unit * 8}px 0`,
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    media: {
        paddingTop: '56.25%',
    },
});

class MyImages extends React.Component {

    handleClick = (e, val) => {
        this.props.history.push({
            pathname: '/mypage/create',
            state: {
                imageUrl: val.downloadUrl,
                thumbnail: val.downloadThumbnailUrl,
            }
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classNames(classes.layout, classes.cardGrid)}>
                <Grid
                    container
                    spacing={24}
                >
                    {this.props.myImages.map(val => (
                        <Grid item key={val.downloadUrl} xs={12} sm={3}>
                            <Card className={classes.card}>
                                <CardActionArea onClick={(e) => this.handleClick(e, val)}>
                                    <CardMedia
                                        className={classes.media}
                                        image={val.downloadThumbnailUrl}
                                        title={val.fileName}
                                    />
                                    <CardContent>
                                        <Typography variant="subtitle1" noWrap={true}>
                                            {val.showName}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(MyImages));