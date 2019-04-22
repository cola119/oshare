import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

class PathsList extends React.Component {

    render() {
        return (
            <div>
                {(this.props.paths).map((path, index) => (
                    <FormControlLabel
                        key={index}
                        control={
                            <Radio
                                checked={this.props.selectedPathId === path.id}
                                onChange={(e) => this.props.selectPath(e, path.id)}
                                value={path.id}
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