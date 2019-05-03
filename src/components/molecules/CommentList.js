import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import Textsms from '@material-ui/icons/Textsms';
import Delete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import Expansion from '../atoms/Expansion';

const CommentList = (props) => {

    return (
        <Expansion
            icon={<Textsms />}
            title={props.title}
        >
            <List dense style={{ width: "100%" }}>
                {(props.values).map(val => (
                    <ListItem dense divider key={val.created_at}>
                        <ListItemText
                            primary={val.value}
                        // secondary={val.user}
                        />
                        <ListItemSecondaryAction>
                            <div style={{ display: "inline-flex", alignItems: "center", }}>
                                <Typography variant="caption">{val.user}</Typography>
                                {val.uid === props.uid &&
                                    <IconButton onClick={() => props.onClick(val)}>
                                        <Delete />
                                    </IconButton>
                                }
                            </div>

                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Expansion>
    );
}

export default CommentList;