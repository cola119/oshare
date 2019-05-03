import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PublicCourse from './PublicCourse';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
            width: 1100,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    cardGrid: {
        padding: `${theme.spacing.unit * 8}px 0`,
    },
})

const PublicCourses = (props) => {
    return (
        <div className={classNames(props.classes.layout, props.classes.cardGrid)}>
            <Grid
                container
                spacing={24}
            >
                {props.courses.map(course => (
                    <Grid item key={course.created_at} xs={12} sm={3}>
                        <PublicCourse
                            course={course}
                            user={props.users.find(u => u.uid === course.uid)} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default withStyles(styles)(PublicCourses);