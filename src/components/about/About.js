import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { contents } from './howto';

const styles = theme => ({
    root: {
        width: '100%',
    },
    // heading: {
    //     fontSize: theme.typography.pxToRem(25),
    //     // flexBasis: '33.33%',
    //     flexShrink: 0,
    // },
});

class About extends React.Component {
    state = {
        expanded: this.props.width === 'xs' ? [] : new Array(contents.length).fill(0).map((_, i) => `panel${i + 1}`)
    };

    handleChange = panel => (event, expanded) => {
        const current = this.state.expanded;
        const nextVal = current.includes(panel) ? current.filter(c => c !== panel) : [...current, panel]
        this.setState({
            expanded: nextVal
        });
    };

    render() {
        const { classes } = this.props;
        const { expanded } = this.state;

        return (
            <div className={classes.root}>
                {contents.map((content, i) => (
                    <ExpansionPanel key={content.content} expanded={expanded.includes(`panel${i + 1}`)} onChange={this.handleChange(`panel${i + 1}`)}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>{content.title}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <HTMLComponent htmlstring={content.content} />
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                ))}
            </div>
        );
    }
}

const HTMLComponent = (props) => {
    return (
        <span dangerouslySetInnerHTML={{ __html: props.htmlstring }}></span>
    );
}

About.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withWidth()(withStyles(styles)(About));