import React from 'react';
// import { Link } from 'react-router-dom'

import NormalButton from '../../atoms/Buttons/NormalButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';

class MyRoutes extends React.Component {

    render() {
        return (
            <List subheader={<ListSubheader component="div">My Routes</ListSubheader>}>
                <Divider />
                {this.props.myRoutes.map((route, index) => (
                    <ListItem key={route.key}>
                        {route.routeName}
                        <ListItemSecondaryAction>
                            <NormalButton
                                onClick={() => this.props.deleteRoute(route.key)}
                                noMargin={true}
                                text="delete"
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        );
    }
}

export default MyRoutes;