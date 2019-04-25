import React from 'react';
import { withRouter } from 'react-router'

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    media: {
        paddingTop: '56.25%', // 16:9
    },
};

class PublicCourse extends React.Component {
    handleClick = (e, course) => {
        this.props.history.push({
            pathname: '/show/' + course.created_at,
            state: {
                courseInfo: course,
                smallCircle: false,
                myRoutes: this.props.myRoutes
            }
        });
    }

    render() {
        const { classes, course } = this.props;
        // console.log(course)
        return (
            <Card className={classes.card}>
                <CardActionArea onClick={(e) => this.handleClick(e, course)}>
                    <CardMedia
                        className={classes.media}
                        image={course.imageUrl}
                        title={course.courseName}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {course.courseName}
                        </Typography>
                        <Typography component="p">
                            {course.comment}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                {/* <CardActions>
                    <Button size="small" color="primary">
                        Share
                    </Button>
                    <Button size="small" color="primary">
                        Learn More
                    </Button>
                </CardActions> */}
            </Card>
        );
    }
}

export default withRouter(withStyles(styles)(PublicCourse));