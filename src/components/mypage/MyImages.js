import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const styles = theme => ({
});

class MyImages extends React.Component {

    render() {
        // const { classes } = this.props;
        return (
            <div>
                <FormControl component="fieldset" >
                    <FormLabel component="legend">my images:</FormLabel>
                    <RadioGroup
                        aria-label="Gender"
                        name="myimages"
                        value={this.props.selectedImageSrc}
                        onChange={this.props.selectImage}
                    >
                        {this.props.myImages.map(val => (
                            <FormControlLabel
                                key={val.downloadUrl}
                                value={val.downloadUrl}
                                control={<Radio />}
                                label={val.fileName}
                            />
                        ))}
                        <FormControlLabel
                            value="disabled"
                            disabled
                            control={<Radio />}
                            label="(Disabled option)"
                        />
                    </RadioGroup>
                </FormControl>
            </div>
        );
    }
}

export default withStyles(styles)(MyImages);