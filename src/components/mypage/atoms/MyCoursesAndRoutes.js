import React from 'react';
import { withRouter } from 'react-router'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';

import PublicIcon from '@material-ui/icons/Public';
import PrivateIcon from '@material-ui/icons/VpnLock';

import NormalButton from '../../atoms/Buttons/NormalButton';

class MyCoursesAndRoutes extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: new Array(props.myCourses.length).fill(false) }
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
    render() {
        if (this.props.myCourses.length === 0) return <div></div>;
        return (
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
                                // noMargin={true}
                                text="編集する"
                            />
                            <NormalButton
                                onClick={(e) => this.handleClick(e, 'route', course)}
                                // noMargin={true}
                                text="ルートを書く"
                            />
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
        );
    }
}

export default withRouter(MyCoursesAndRoutes);