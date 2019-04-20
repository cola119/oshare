import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';

import PublicCourses from './PublicCourses';

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

class MainPage extends React.Component {
    state = {
        anchorElOfAuth: null,
    }

    constructor(props) {
        super(props);
        this.props.doLogin();
    }

    componentDidMount() {
        this.props.loadPublicCourses();
        this.props.loadPublicRoutes();
    }

    handleToAboutPage = () => {
        this.props.history.push('/mypage')
    }

    render() {
        // console.log(this.props.courses)
        const { classes } = this.props;
        return (
            <>
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" color="inherit" className={classes.grow}>
                                Oshare
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
                                        <MenuItem onClick={() => this.props.history.push('/mypage')}>マイページ</MenuItem>
                                        <MenuItem onClick={() => this.props.history.push('/login')}>ログアウト</MenuItem>
                                    </Menu>
                                </div>
                            ) : (
                                    <Button color="inherit" onClick={() => this.props.history.push('/login')}>Login</Button>
                                )}
                        </Toolbar>
                    </AppBar>
                </div>
                <div>
                    {/* <div>hello {this.props.displayName}</div>
                    <Link to='/login'>{this.props.isAuth ? "ログアウト" : "ログイン"}</Link><br />
                    <Link to='/mypage'>マイページ</Link> */}
                    {this.props.courses !== undefined && <PublicCourses courses={this.props.courses} />}
                    {/* <ShowCourse courseInfo={this.props.courses[1]} /> */}
                </div>
            </>
        );
    }
}

export default withRouter(withStyles(styles)(MainPage));