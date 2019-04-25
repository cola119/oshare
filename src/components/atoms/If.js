import React from 'react';

const If = (props) => {
    if (props.if) return props.children;
    else return <></>;
}

export default If;