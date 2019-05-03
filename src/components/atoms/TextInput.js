import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({

});

const TextInput = (props) => {
    return (
        <TextField
            required={props.required}
            type={props.type}
            label={props.label}
            value={props.value}
            step={props.step}
            multiline={props.multiline || false}
            placeholder={props.placeholder}
            margin="dense"
            onChange={e => props.onChange(e)}
            variant="outlined"
        />
    )
}

export default withStyles(styles)(TextInput);