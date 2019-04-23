import React, { Component } from 'react';
import firebase, { firebaseStorage } from '../firebase';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextInput from './atoms/TextInput';

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

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
    cropper: {
        margin: theme.spacing.unit * 4,
        width: "100vw",
        height: "40vh"
    }
});


class UploadImage extends Component {
    constructor(props) {
        super(props);
        this.cropper = null;
        this.state = {
            isUploading: false,
            uploadProgress: 0,
            files: null,
            src: null,
            showName: "",
            cropResult: null,
            rotate: 0,
        };
    }

    handleChangeFile = (e) => {
        const files = e.target.files;
        this.setState({
            files: files,
            showName: files[0].name
        });
        const reader = new FileReader();
        reader.onload = () => {
            this.setState({ src: reader.result });
        };
        reader.readAsDataURL(files[0]);

    }

    cropImage = () => {
        if (typeof this.cropper.getCroppedCanvas() === 'undefined') return;
        const a = this.cropper.getCroppedCanvas({
            width: 1000,
            height: 1000,
            minWidth: 256,
            minHeight: 256,
            maxWidth: 4096,
            maxHeight: 4096,
            fillColor: '#fff',
        });

        a.toBlob((blob) => {
            // this.cropper.getCroppedCanvas().toBlob((blob) => {
            console.log(blob)
            this.setState({ cropResult: blob })
        })
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
        console.log(this.state.cropResult)
        const uploadTask = imageRef.put(this.state.cropResult, metadata);
        // const uploadTask = imageRef.put(this.state.files[0], metadata);
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

    imageResize = () => {
        const imageData = this.cropper.getImageData();
        console.log(imageData)
        if (imageData.naturalWidth >= 1000) {
            console.log(imageData)
            this.cropper.setCanvasData({
                width: 1000,
                height: 1000 * imageData.naturalWidth / imageData.naturalHeight
            })
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <>
                <div className={classes.root}>
                    <input
                        id="contained-button-file"
                        accept="image/*"
                        style={{ display: "none" }}
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
                                type="number"
                                label="rotate"
                                step={0.1}
                                value={this.state.rotate}
                                onChange={(e) => this.setState({ rotate: e.target.value }, () => this.cropper.rotateTo(this.state.rotate))}
                            />
                            <Button
                                disabled={this.state.showName.length === 0 || this.state.uploadProgress > 0}
                                variant="contained"
                                color="default"
                                className={classes.button}
                                onClick={this.cropImage}
                            >
                                Cut
                            </Button>
                        </>
                    }
                    {(this.state.files !== null && this.state.cropResult !== null) &&
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
                {(this.state.files !== null) &&
                    <>
                        <Cropper
                            viewMode={1}
                            className={classes.cropper}
                            src={this.state.src}
                            ref={cropper => { this.cropper = cropper; }}
                        />
                    </>
                }
            </>
        );
    }
}

export default withStyles(styles)(UploadImage);