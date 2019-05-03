import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class MyDialog extends React.Component {
    state = {
        open: false,
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        return (
            <>
                <Button variant="contained" color="secondary" onClick={this.handleClickOpen}>
                    {this.props.dialogButtonTitle}
                </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    {/* <DialogTitle id="alert-dialog-title">{this.props.dialogTitle}</DialogTitle> */}
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.props.children}
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </>
        );
    }
}

export default MyDialog;