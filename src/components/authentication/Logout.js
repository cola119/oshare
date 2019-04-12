import React from 'react';

const Logout = (props) => {
    return (
        <div>
            <button onClick={props.doLogout}>Logout</button>
        </div>
    );
}

export default Logout;