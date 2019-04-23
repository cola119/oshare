import React, { Component } from 'react';
import firebase, { firebaseStorage } from '../firebase';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextInput from './atoms/TextInput';

const styles = theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    button: {
        margin: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative',
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
});


class UploadImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUploading: false,
            files: null,
            showName: "",
            uploadProgress: 0
        };
    }

    handleChangeFile = (e) => {
        const files = e.target.files;
        this.setState({
            files: files,
            showName: files[0].name
        });
    }
    clickPostBtn = () => {
        this.setState({ isUploading: true });
        const imageRef = firebaseStorage.ref().child(`images/${this.props.uid}/${this.state.files[0].name}-${Date.now()}`);
        const metadata = {
            customMetadata: {
                'showName': this.state.showName,
                'uid': this.props.uid
            }
        }
        const uploadTask = imageRef.put(this.state.files[0], metadata);
        uploadTask.on('state_changed', (snapshot) => {
            this.setState({ uploadProgress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 })
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED:
                    break;
                case firebase.storage.TaskState.RUNNING:
                    break;
                default:
                    break;
            }
        }, (error) => {
            console.log('error', error);
        }, () => {
            console.log("uploaded");
            this.setState({ isUploading: false });
        });
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={this.handleChangeFile}
                />
                <label htmlFor="contained-button-file">
                    <Button
                        variant="outlined"
                        component="span"
                        className={classes.button}
                        disabled={this.state.files !== null}
                    >
                        画像をアップロードする
                    </Button>
                </label>

                {(this.state.files !== null) &&
                    <>
                        <TextInput
                            required={true}
                            label="name"
                            placeholder="画像名"
                            value={this.state.showName}
                            onChange={e => this.setState({ showName: e.target.value })}
                        />
                        <span className={classes.wrapper}>
                            <Button
                                disabled={this.state.showName.length === 0 || this.state.uploadProgress > 0}
                                variant="contained"
                                color="default"
                                className={classes.button}
                                onClick={this.clickPostBtn}
                            >
                                Upload
                                <CloudUploadIcon className={classes.rightIcon} />
                            </Button>
                            {(this.state.uploadProgress > 0 && this.state.uploadProgress < 100) &&
                                <CircularProgress
                                    size={24}
                                    className={classes.buttonProgress}
                                />
                            }
                        </span>
                    </>
                }
            </div>
        );
    }
}

export default withStyles(styles)(UploadImage);