import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import MySlider from '../atoms/MySlider';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
});

class TextInputForm extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <form className={classes.container} noValidate autoComplete="off">
                {this.props.labels.map(label => (
                    /* <TextInput
                        key={label}
                        label={label}
                        type={this.props.type}
                        // placeholder={this.props.placeholder}
                        value={this.props.values[label]}
                        onChange={(e) => this.props.onChange(label, Number(e.target.value))}
                    /> */
                    <MySlider
                        key={label}
                        value={this.props.values[label]}
                        onChange={(e, value) => this.props.onChange(label, value)}
                        // onChange={(e) => this.props.onChange(label, Number(e.target.value))}
                        min={0} max={label === "opacity" ? 1 : label === "strokeWidth" ? 20 : 100}
                        step={label === "opacity" ? 0.1 : 1}
                    />
                ))}
            </form>
        )
    }
}

export default withStyles(styles)(TextInputForm);