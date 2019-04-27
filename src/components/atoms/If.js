import React from 'react';

const If = (props) => {
    if (props.if) return props.children;
    return <></>;
}

export default If;