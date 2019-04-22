import React from 'react';

import TextInput from '../atoms/TextInput'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
});

class TextInputForm extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <form className={classes.container} noValidate autoComplete="off">
                {this.props.labels.map(label => (
                    <TextInput
                        key={label}
                        label={label}
                        type={this.props.type}
                        // placeholder={this.props.placeholder}
                        value={this.props.values[label]}
                        onChange={(e) => this.props.onChange(label, Number(e.target.value))}
                    />
                ))}
            </form>
        )
    }
}

export default withStyles(styles)(TextInputForm);