import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    authBox: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
};

class MenuBar extends React.Component {
    state = {
        anchorElOfAuth: null,
    }

    handleClick = (e, to) => {
        this.setState({ anchorElOfAuth: null });
        this.props.history.push('/' + to);
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="static">
                    <Toolbar>
                        <Typography
                            variant="h6"
                            color="inherit"
                            className={classes.grow}
                        >
                            <span style={{ cursor: "pointer" }} onClick={() => this.props.history.push('/')}>Oshare</span>
                        </Typography>
                        {this.props.isAuth ? (
                            <div className={classes.authBox}>
                                <AccountCircle />
                                <Button
                                    color="inherit"
                                    aria-owns={Boolean(this.state.anchorElOfAuth) ? 'menu-appbar' : undefined}
                                    aria-haspopup="true"
                                    onClick={(e) => this.setState({ anchorElOfAuth: e.currentTarget })}
                                >
                                    {this.props.displayName}
                                </Button>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={this.state.anchorElOfAuth}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right', }}
                                    open={Boolean(this.state.anchorElOfAuth)}
                                    onClose={() => this.setState({ anchorElOfAuth: null })}
                                >
                                    {/* <MenuItem onClick={() => this.props.history.push('/mypage')}>マイページ</MenuItem>
                                    <MenuItem onClick={() => this.props.history.push('/login')}>ログアウト</MenuItem> */}
                                    <MenuItem onClick={(e) => this.handleClick(e, 'mypage')}>マイページ</MenuItem>
                                    <MenuItem onClick={(e) => this.handleClick(e, 'login')}>ログアウト</MenuItem>
                                </Menu>
                            </div>
                        ) : (
                                <Button color="inherit" onClick={() => this.props.history.push('/login')}>Login</Button>
                            )}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuth: state.firebaseAuthReducer.isAuth,
        uid: state.firebaseAuthReducer.uid,
        displayName: state.firebaseAuthReducer.displayName,
    };
};

const mapDispatch = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatch)(withRouter(withStyles(styles)(MenuBar)));
