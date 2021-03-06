import React, { Component } from 'react';
import firebase, { firebaseStorage } from '../../firebase';
import { withRouter } from 'react-router'

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CircularProgress from '@material-ui/core/CircularProgress';

import RotateButtons from '../molecules/RotateButtons';
import UploadFile from '../molecules/UploadFile';
import TextInput from '../atoms/TextInput';
import NormalButton from '../atoms/Buttons/NormalButton';
import MySlider from '../atoms/MySlider';
import If from '../atoms/If';

const styles = theme => ({
    utils: {
        display: 'flex',
        flexWrap: "wrap",
        alignItems: 'center',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative',
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
        reader.onload = () => this.setState({ src: reader.result });
        reader.readAsDataURL(files[0]);
    }

    cropImage = () => {
        if (typeof this.cropper.getCroppedCanvas() === 'undefined') return;
        const cropResult = this.cropper.getCroppedCanvas({
            // width: 1000, height: 1000,
            minWidth: 256, minHeight: 256,
            maxWidth: 4096, maxHeight: 4096,
            fillColor: '#fff',
        });
        cropResult.toBlob((blob) => {
            // console.log(blob)
            if (blob.size > 5 * (10 ** 6)) alert(`ファイルサイズ${blob.size}が大きすぎます（５MB制限）`)
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
            // this.props.history.push('/mypage');
            window.location.reload()
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <>
                <If if={this.state.files === null}>
                    <UploadFile
                        accept="image/*"
                        onChange={this.handleChangeFile}
                        disabled={this.state.files !== null}
                        text="画像をアップロードする"
                    />
                </If>
                <If if={this.state.files !== null}>
                    <div className={classes.utils}>
                        <span style={{ width: "20vw" }}>
                            <MySlider
                                value={this.state.rotate}
                                onChange={(e, value) => this.setState({ rotate: value }, () => this.cropper.rotateTo(this.state.rotate))}
                                min={0} max={360}
                            />
                        </span>
                        <RotateButtons
                            onClick={this.rotateImage}
                        />
                        <NormalButton
                            onClick={this.cropImage}
                            disabled={this.state.showName.length === 0 || this.state.uploadProgress > 0}
                            text="cut"
                        />
                        {/* <NormalButton
                            onClick={() => window.location.reload()}
                            disabled={this.state.showName.length === 0 || this.state.uploadProgress > 0}
                            text="cancel"
                        /> */}
                        <If if={this.state.cropResult !== null && this.state.cropResult.size <= 5 * (10 ** 6)}>
                            <TextInput
                                required={true}
                                label="name"
                                placeholder="画像名"
                                value={this.state.showName}
                                onChange={e => this.setState({ showName: e.target.value })}
                            />
                            <div className={classes.wrapper}>
                                <NormalButton
                                    onClick={this.clickPostBtn}
                                    disabled={this.state.showName.length === 0 || this.state.uploadProgress > 0}
                                    text={<CloudUploadIcon />}
                                />
                                <If if={this.state.uploadProgress > 0 && this.state.uploadProgress < 100}>
                                    <CircularProgress
                                        size={24}
                                        className={classes.buttonProgress}
                                    />
                                </If>
                            </div>
                        </If>
                    </div>
                </If>

                <If if={this.state.files !== null}>
                    <div className={classes.cropperArea}>
                        <Cropper
                            className={classes.cropper}
                            src={this.state.src}
                            ref={cropper => { this.cropper = cropper; }}
                        />
                    </div>
                </If>
            </>
        );
    }
}

export default withRouter(withStyles(styles)(UploadImage));