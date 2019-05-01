import React from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router'
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DangerButton from '../../atoms/Buttons/DangerButton';
import NormalButton from '../../atoms/Buttons/NormalButton';

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

    state = {
        dialogOpen: false,
        selectedImage: null
    }

    handleClick = (e, val) => {
        this.props.history.push({
            pathname: '/mypage/create',
            state: {
                imageUrl: val.downloadUrl,
                thumbnail: val.downloadThumbnailUrl,
            }
        });
    }

    handleDeleteImage = (val) => {
        this.props.deleteImage(val);
        this.setState({ dialogOpen: false });
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classNames(classes.layout, classes.cardGrid)}>
                <Grid
                    container
                    spacing={24}
                >
                    {this.props.myImages.map((val, i) => (
                        <Grid item key={val.downloadUrl} xs={12} sm={3}>
                            <Card className={classes.card}>
                                <CardActionArea onClick={(e) => this.handleClick(e, val)}>
                                    <CardMedia
                                        className={classes.media}
                                        image={val.downloadThumbnailUrl}
                                        title={val.fileName}
                                    />
                                    <CardContent>
                                        <Typography variant="subtitle1" noWrap={false}>
                                            {val.showName}
                                        </Typography>
                                        <Typography variant="caption" noWrap={false}>
                                            クリックしてコースを作成
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => this.setState({ dialogOpen: true, selectedImage: val })}
                                    >
                                        削除
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Dialog
                    open={this.state.dialogOpen}
                    onClose={() => this.setState({ dialogOpen: false, selectedImage: null })}
                    aria-labelledby={`alert-dialog-title`}
                    aria-describedby={`alert-dialog-description`}
                >
                    <DialogTitle id={`alert-dialog-title`}>{this.state.selectedImage && this.state.selectedImage.showName}を削除しますか？</DialogTitle>
                    <DialogContent>
                        <DialogContentText id={`alert-dialog-description`}>
                            この画像を使用しているすべてのコースとルートが削除されます。この操作は元に戻せません。
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <DangerButton
                            onClick={() => this.handleDeleteImage(this.state.selectedImage)}
                            text="削除する"
                        />
                        <NormalButton
                            onClick={() => this.setState({ dialogOpen: false, selectedImage: null })}
                            text="キャンセル"
                        />
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(MyImages));