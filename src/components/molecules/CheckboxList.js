import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import GoodIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import NormalIcon from '@material-ui/icons/SentimentDissatisfied';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
class CheckboxList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            voted: props.voteList,
        }
    }

    handleClick = (route, uid) => {
        const current = this.state.voted.find(v => v.id === route.id);
        const newVoted = current.good.includes(uid) ? current.good.filter(v => v !== uid) : [...current.good, uid];
        const newCount = current.good.includes(uid) ? current.favCount - 1 : current.favCount + 1;
        this.setState({
            voted: this.state.voted.map(vote => vote.id === route.id ? { id: route.id, good: newVoted, favCount: newCount } : vote)
        });
        this.props.onClick(route, "good");
    }

    render() {
        return (
            <div>
                <List dense>
                    {(this.props.values).map(route => (
                        <ListItem dense key={route.id} button onClick={(e) => this.props.selectRoute(e, route)}>
                            <Typography variant="caption">
                                {this.state.voted.find(v => v.id === route.id).favCount}fav
                            </Typography>
                            <Checkbox
                                tabIndex={-1}
                                style={{ color: route.pathColor }}
                                checked={this.props.selectedRouteIds.includes(route.id)}
                                onChange={(e) => this.props.selectRoute(e, route)}
                                value={route.routeName} />
                            <ListItemText
                                primary={route.routeName}
                                secondary={route.comment}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    color={this.state.voted.find(v => v.id === route.id).good.includes(this.props.uid) ? "secondary" : "default"}
                                    onClick={() => this.handleClick(route, this.props.uid)}
                                    disabled={this.props.uid === null}
                                >
                                    <Badge badgeContent={this.state.voted.find(v => v.id === route.id).favCount} color="secondary">
                                        {this.state.voted.find(v => v.id === route.id).good.includes(this.props.uid) ? <GoodIcon /> : <NormalIcon />}
                                    </Badge>
                                </IconButton>
                                {this.props.uid === null && <Typography variant="caption">
                                    please login!
                                </Typography>}
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </div>
        );
    }
}

export default CheckboxList;