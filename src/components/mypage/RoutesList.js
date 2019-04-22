import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

class RoutesList extends React.Component {

    // selectRoute = (e, id, route) => {
    //     this.setState({ selectedRouteId: id });
    //     this.props.selectRoute(route);
    // }

    render() {
        return (
            <div>
                {(this.props.routes).map((route, index) => (
                    <div key={index}>
                        <FormControlLabel
                            key={index}
                            control={
                                <Radio
                                    checked={this.props.selectedRouteId === index}
                                    onChange={(e) => this.props.selectRoute(e, index, route)}
                                    value={index}
                                />
                            }
                            label={route.routeName}
                        />
                    </div>
                ))}
            </div>
            // <div>
            //     {(this.props.routes).map((haveRoute, index) => (
            //         <div key={index}>
            //             {index}.{haveRoute.routesName}
            //             {haveRoute.routes.map((route, i) => (
            //                 <FormControlLabel
            //                     key={i}
            //                     control={
            //                         <Radio
            //                             checked={this.props.selectedRouteId === i}
            //                             onChange={(e) => this.props.selectRoute(e, i, route)}
            //                             value={i}
            //                         />
            //                     }
            //                     label={route.routeName}
            //                 />
            //             ))}
            //         </div>

            //     ))}
            // </div>
        );
    }
}

export default RoutesList;