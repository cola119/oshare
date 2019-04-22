import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

class PathsList extends React.Component {

    // selectPath = (e, id) => {
    //     this.setState({ selectedPathId: id });
    //     this.props.selectPath(e, id)
    // }

    render() {
        return (
            <div>
                {/* <FormControlLabel
                    control={
                        <Radio
                            checked={this.props.selectedPathId === -1}
                            onChange={(e) => this.props.selectPath(e, -1)}
                            value={-1}
                        />
                    }
                    label="all controls"
                /> */}
                {(this.props.paths).map((path, index) => (
                    <FormControlLabel
                        key={index}
                        control={
                            <Radio
                                checked={this.props.selectedPathId === index}
                                onChange={(e) => this.props.selectPath(e, path.id)}
                                // onChange={(e) => this.props.selectPath(e, index, path.id)}
                                value={index}
                            />
                        }
                        label={path.name}
                    />
                ))}
            </div>
        );
    }
}

export default PathsList;