import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

class PathsList extends React.Component {
    state = {
        selectedPathId: null,
    }

    selectPath = (e, id) => {
        this.setState({ selectedPathId: id });
        this.props.selectPath(e, id)
    }

    render() {
        return (
            <div>
                <FormControlLabel
                    control={
                        <Radio
                            checked={this.state.selectedPathId === -1}
                            onChange={(e) => this.selectPath(e, -1)}
                            value={-1}
                        />
                    }
                    label="all controls"
                />
                {(this.props.paths).map((path, index) => (
                    <FormControlLabel
                        key={index}
                        control={
                            <Radio
                                checked={this.state.selectedPathId === index}
                                onChange={(e) => this.selectPath(e, index)}
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