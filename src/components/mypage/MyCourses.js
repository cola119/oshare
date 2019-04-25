import React from 'react';
import { Link } from 'react-router-dom'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import NormalButton from '../atoms/Buttons/NormalButton'

class MyCourses extends React.Component {

    render() {
        return (
            <div>
                <div>my courses:</div>
                <div>
                    <List dense={true}>
                        {this.props.myCourses.map((course, index) => (
                            <ListItem key={course.id}>
                                {course.courseName}
                                <ListItemSecondaryAction>
                                    <NormalButton
                                        // onClick={}
                                        noMargin={true}
                                        text="view"
                                    />
                                    <NormalButton
                                        // onClick={}
                                        noMargin={true}
                                        text="delete"
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </div>
            </div>
        );
    }
}

export default MyCourses;