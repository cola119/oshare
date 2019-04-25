import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import ListItemSecondaryAction from '@material-ui/core/ListItemText';

// import NormalButton from '../atoms/Buttons/NormalButton';

class CheckboxList extends React.Component {
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
                                {/* showページで自分のルートを消せる。
                                    BUG: propsで受け取っているので更新してもpropsのデータが引き継がれるので削除が反映されない
                                    データベースからは消えている
                                 */}
                                {/* <ListItemSecondaryAction>
                                    {this.props.myRoutes.find(my => my.id === route.id) &&
                                        <NormalButton
                                            onClick={() => this.props.deleteRoute(route.key)}
                                            noMargin={true}
                                            text="delete"
                                        />
                                    }
                                </ListItemSecondaryAction> */}
                            </ListItem>
                        </List>
                    </div>
                ))}
            </div>
        );
    }
}

export default CheckboxList;