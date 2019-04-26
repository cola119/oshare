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
    get_date = (_timestamp) => {
        const _d = new Date(_timestamp);
        const Y = _d.getFullYear();
        const m = ("0" + (_d.getMonth() + 1)).slice(-2);
        const d = ("0" + _d.getDate()).slice(-2);
        // const H = ("0" + _d.getHours()).slice(-2);
        // const i = ("0" + _d.getMinutes()).slice(-2);
        // const s = ("0" + _d.getSeconds()).slice(-2);
        return `${Y}/${m}/${d}`;
        // return `${Y}/${m}/${d} ${H}:${i}:${s}`;
    }

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
        const { classes, course, user } = this.props;
        // console.log(course)
        return (
            <Card className={classes.card}>
                <CardActionArea onClick={(e) => this.handleClick(e, course)}>
                    <CardMedia
                        className={classes.media}
                        image={course.thumbnail || course.imageUrl}
                        title={course.courseName}
                    />
                    <CardContent>
                        <Typography component="p" gutterBottom>
                            {this.get_date(course.created_at)}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h2">
                            {course.courseName}
                        </Typography>
                        <Typography component="p">
                            {course.comment}
                        </Typography>
                        <Typography component="p" align="right">
                            作成者：{user.displayName}
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