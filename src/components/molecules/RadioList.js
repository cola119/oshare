import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

const RadioList = (props) => {
    return (
        <div>
            {(props.paths).map((path, index) => (
                <FormControlLabel
                    key={index}
                    control={
                        <Radio
                            checked={props.selectedPathId === path.id}
                            onChange={(e) => props.selectPath(e, path.id)}
                            value={path.id}
                        />
                    }
                    label={path.name}
                />
            ))}
        </div>
    );
}

export default RadioList;