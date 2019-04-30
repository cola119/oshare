import React from 'react';

import TextInput from '../atoms/TextInput'
import SubmitButton from '../atoms/Buttons/SubmitButton'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
});

const InputWithButton = (props) => {
    const { classes } = props;
    return (
        <div className={classes.container}>
            {/* <form className={classes.container}> */}
            <TextInput
                label={props.label}
                value={props.value}
                placeholder={props.placeholder}
                type={props.type}
                onChange={props.onChange}
                multiline={props.multiline || false}
            />
            <SubmitButton
                onClick={props.onClick}
                disabled={props.disabled}
            >
                {props.children || props.text}
            </SubmitButton>
            {/* </form> */}
        </div>
    )
}

export default withStyles(styles)(InputWithButton);