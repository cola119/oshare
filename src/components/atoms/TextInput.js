import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({

});

class TextInput extends React.Component {
    render() {
        return (
            <TextField
                id="standard-name"
                type={this.props.type}
                label={this.props.label}
                value={this.props.value}
                placeholder={this.props.placeholder}
                margin="dense"
                onChange={e => this.props.onChange(e)}
                variant="outlined"
            />
        )
    }
}

export default withStyles(styles)(TextInput);