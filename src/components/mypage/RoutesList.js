import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class RoutesList extends React.Component {
    render() {
        return (
            <div>
                {(this.props.routes).map(route => (
                    <div key={route.id}>
                        <List dense={true}>
                            <ListItem>
                                <ListItemText
                                    primary={
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.props.selectedRouteIds.includes(route.id)}
                                                    onChange={(e) => this.props.selectRoute(e, route)}
                                                    value={route.routeName} />
                                            }
                                            label={route.routeName}
                                        />
                                    }
                                    secondary={route.comment}
                                />
                            </ListItem>
                        </List>
                    </div>
                ))}
            </div>
        );
    }
}

export default RoutesList;