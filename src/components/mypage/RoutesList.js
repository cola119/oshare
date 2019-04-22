import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class RoutesList extends React.Component {
    render() {
        return (
            <div>
                {(this.props.routes).map(route => (
                    <div key={route.id}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.props.selectedRouteIds.includes(route.id)}
                                    onChange={(e) => this.props.selectRoute(e, route)}
                                    value={route.routeName} />
                            }
                            label={route.routeName}
                        />
                    </div>
                ))}
            </div>
        );
    }
}

export default RoutesList;