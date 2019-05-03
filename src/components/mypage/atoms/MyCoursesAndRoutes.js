import React from 'react';
import { withRouter } from 'react-router'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import PublicIcon from '@material-ui/icons/Public';
import PrivateIcon from '@material-ui/icons/VpnLock';

import NormalButton from '../../atoms/Buttons/NormalButton';
import DangerButton from '../../atoms/Buttons/DangerButton';
// import MyDialog from '../../atoms/MyDialog';

class MyCoursesAndRoutes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: new Array(props.myCourses.length).fill(false),
            dialogOpen: false,
            selectedCourse: null
        }
    }

    openCllapse = (e, index) => {
        const current = this.state.open;
        const newOpen = current.map((open, i) => i === index ? !open : open)
        this.setState({ open: newOpen })
    }

    handleClick = (e, to, course) => {
        this.props.history.push({
            pathname: '/mypage/' + to,
            state: {
                courseInfo: course,
            }
        });
    }

    deleteCourse = (course) => {
        this.props.deleteCourse(course);
        this.setState({ dialogOpen: false })
    }

    render() {
        if (this.props.myCourses.length === 0) return <div></div>;
        return (
            <>
                <List subheader={<ListSubheader component="div">My Courses</ListSubheader>}>
                    <Divider />
                    {this.props.myCourses.map((course, index) => (
                        <React.Fragment key={course.key}>
                            <ListItem button onClick={(e) => this.openCllapse(e, index)}>
                                <ListItemText primary={course.courseName} secondary={course.isOpen ? "public" : "private"} />
                                <ListItemSecondaryAction>
                                    <NormalButton
                                        onClick={() => this.props.changeCourseStatus(course.key, course.isOpen)}
                                        noMargin={true}
                                    >
                                        {course.isOpen ? <PrivateIcon /> : <PublicIcon />}
                                        <span style={{ paddingLeft: "10px" }}>{course.isOpen ? "非公開にする" : "公開する"}</span>

                                    </NormalButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Collapse in={this.state.open[index]} timeout="auto" unmountOnExit>
                                <NormalButton
                                    onClick={(e) => this.handleClick(e, 'edit', course)}
                                    text="編集する"
                                />
                                <NormalButton
                                    onClick={(e) => this.handleClick(e, 'route', course)}
                                    text="ルートを書く"
                                />

                                <span style={{ float: "right" }}>
                                    <DangerButton
                                        onClick={() => this.setState({ dialogOpen: true, selectedCourse: course })}
                                        text="削除"
                                    />
                                </span>
                                <List dense subheader={<ListSubheader component="div">routes</ListSubheader>}>
                                    {course.haveRoutes.map((v, i) => (
                                        <ListItem key={v.id}>
                                            {v.routeName}
                                            <ListItemSecondaryAction>
                                                <NormalButton
                                                    onClick={() => this.props.deleteRoute(v.key)}
                                                    noMargin={true}
                                                    text="delete"
                                                />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
                <Dialog
                    open={this.state.dialogOpen}
                    onClose={() => this.setState({ dialogOpen: false, selectedCourse: null })}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{this.state.selectedCourse && this.state.selectedCourse.courseName}を削除しますか？</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            この操作は元に戻せません。
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <DangerButton
                            onClick={() => this.deleteCourse(this.state.selectedCourse)}
                            text="削除する"
                        />
                        <NormalButton
                            onClick={() => this.setState({ dialogOpen: false, selectedCourse: null })}
                            text="キャンセル"
                        />
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

export default withRouter(MyCoursesAndRoutes);