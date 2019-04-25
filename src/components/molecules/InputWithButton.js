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

class InputWithButton extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                {/* <form className={classes.container}> */}
                <TextInput
                    label={this.props.label}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    type={this.props.type}
                    onChange={this.props.onChange}
                />
                <SubmitButton
                    onClick={this.props.onClick}
                    disabled={this.props.disabled}
                >
                    {this.props.children || this.props.text}
                </SubmitButton>
                {/* </form> */}
            </div>
        )
    }
}

export default withStyles(styles)(InputWithButton);