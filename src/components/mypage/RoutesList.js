import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

class RoutesList extends React.Component {
    state = {
        selectedId: null,
    }

    selectRoute = (e, id, route) => {
        this.setState({ selectedId: id });
        this.props.selectRoute(route);
    }

    render() {
        return (
            <div>
                {(this.props.routes).map((haveRoute, index) => (
                    <div key={index}>
                        {index}.{haveRoute.routesName}
                        {haveRoute.routes.map((route, i) => (
                            <FormControlLabel
                                key={i}
                                control={
                                    <Radio
                                        checked={this.state.selectedId === i}
                                        onChange={(e) => this.selectRoute(e, i, route)}
                                        value={i}
                                    />
                                }
                                label={route.routeName}
                            />
                        ))}
                    </div>

                ))}
            </div>
        );
    }
}

export default RoutesList;