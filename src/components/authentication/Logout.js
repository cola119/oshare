import React from 'react';

import SubmitButton from '../atoms/Buttons/SubmitButton'

const Logout = (props) => {
    return (
        <div style={{ textAlign: "center", paddingTop: "50px" }}>
            <SubmitButton
                onClick={props.doLogout}
                text="Logout"
            />
        </div>

    );
}

export default Logout;