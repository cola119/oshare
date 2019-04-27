import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import GoodIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import BadIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import IconButton from '@material-ui/core/IconButton';
// import Typography from '@material-ui/core/Typography';

class CheckboxList extends React.Component {
    render() {
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
                                    <IconButton color="secondary"><GoodIcon /></IconButton>
                                    <IconButton><BadIcon /></IconButton>
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