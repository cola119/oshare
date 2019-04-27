import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

const RadioList = (props) => {
    return (
        <div>
            {(props.values).map((v, index) => (
                <FormControlLabel
                    key={index}
                    control={
                        <Radio
                            checked={props.selectedId === v.id}
                            onChange={(e) => props.onChange(e, v)}
                            value={v.id}
                        />
                    }
                    label={v.name}
                />
            ))}
        </div>
    );
}

export default RadioList;