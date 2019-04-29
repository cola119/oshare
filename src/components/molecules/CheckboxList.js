import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import GoodIcon from '@material-ui/icons/SentimentSatisfiedAlt';
// import BadIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import IconButton from '@material-ui/core/IconButton';
// import Typography from '@material-ui/core/Typography';

class CheckboxList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            voted: props.voteList
        }
        // console.log(props)
    }

    handleClick = (route, uid) => {
        const current = this.state.voted.find(v => v.id === route.id).good || [];
        // console.log(current)
        const newVoted = current.includes(uid) ? current.filter(v => v !== uid) : [...current, uid];
        // console.log(newVoted)
        this.setState({ voted: this.state.voted.map(vote => vote.id === route.id ? { id: route.id, good: newVoted } : vote) });
        this.props.onClick(route, "good")
    }

    render() {
        // console.log(this.state.voted)

        return (
            <div>
                {(this.props.values).map(route => (
                    <div key={route.id}>
                        <List>
                            <ListItem dense role={undefined} button onClick={(e) => this.props.selectRoute(e, route)}>
                                <Checkbox
                                    tabIndex={-1}
                                    style={{ color: route.pathColor }}
                                    checked={this.props.selectedRouteIds.includes(route.id)}
                                    onChange={(e) => this.props.selectRoute(e, route)}
                                    value={route.routeName} />
                                <ListItemText
                                    primary={
                                        <>
                                            {route.routeName}
                                        </>
                                    }
                                    secondary={
                                        <>
                                            {route.comment}
                                            {/* {route.owner && <Typography variant="caption" gutterBottom>
                                                made by {route.owner}
                                            </Typography>} */}
                                        </>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        color={this.state.voted.find(v => v.id === route.id).good.includes(this.props.uid) ? "secondary" : "default"}
                                        onClick={() => this.handleClick(route, this.props.uid)}
                                    >
                                        <GoodIcon />
                                    </IconButton>
                                    {/* <IconButton
                                        color={route.bad !== undefined && route.bad.includes(this.props.uid) ? "secondary" : "default"}
                                        onClick={() => this.props.onClick(route, "bad")}
                                    >
                                        <BadIcon />
                                    </IconButton> */}
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    </div>
                ))}
            </div>
        );
    }
}

export default CheckboxList;