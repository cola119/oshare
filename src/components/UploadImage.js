import React, { Component } from 'react';
import firebase, { firebaseStorage } from '../firebase';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { withStyles } from '@material-ui/core/styles';

import green from '@material-ui/core/colors/green'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CircularProgress from '@material-ui/core/CircularProgress';

import RotateButtons from './molecules/RotateButtons';
import TextInput from './atoms/TextInput';
import UploadFile from './molecules/UploadFile';
import NormalButton from './atoms/Buttons/NormalButton';
import MySlider from './atoms/MySlider';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: "wrap",
        alignItems: 'center',
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
    cropperArea: {
        marginBottom: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
    },
    cropper: {
        maxWidth: "100%",
        width: "100vw",
        height: "60vh"
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
        const cropResult = this.cropper.getCroppedCanvas({
            width: 1000,
            height: 1000,
            minWidth: 256,
            minHeight: 256,
            maxWidth: 4096,
            maxHeight: 4096,
            fillColor: '#fff',
        });

        cropResult.toBlob((blob) => {
            console.log(blob)
            this.setState({ cropResult: blob })
        })
    }

    rotateImage = (angle) => {
        this.setState(state => ({ rotate: state.rotate + angle }),
            () => this.cropper.rotateTo(this.state.rotate)
        );
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
            <>
                <div className={classes.root}>
                    <UploadFile
                        accept="image/*"
                        onChange={this.handleChangeFile}
                        disabled={this.state.files !== null}
                        text="画像をアップロードする"
                    />
                    {(this.state.files !== null) &&
                        <>
                            <MySlider
                                value={this.state.rotate}
                                onChange={(e, value) => this.setState({ rotate: value }, () => this.cropper.rotateTo(this.state.rotate))}
                                min={0} max={360}
                            />
                            <RotateButtons
                                onClick={this.rotateImage}
                            />
                            <NormalButton
                                onClick={this.cropImage}
                                disabled={this.state.showName.length === 0 || this.state.uploadProgress > 0}
                                text="cut"
                            />
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
                                <NormalButton
                                    onClick={this.clickPostBtn}
                                    disabled={this.state.showName.length === 0 || this.state.uploadProgress > 0}
                                >
                                    Upload<CloudUploadIcon className={classes.rightIcon} />
                                </NormalButton>
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
                    <div className={classes.cropperArea}>
                        <Cropper
                            // viewMode={1}
                            className={classes.cropper}
                            src={this.state.src}
                            ref={cropper => { this.cropper = cropper; }}
                        />
                    </div>
                }
            </>
        );
    }
}

export default withStyles(styles)(UploadImage);