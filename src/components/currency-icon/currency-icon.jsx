import React from 'react';
import './currency-icon-style';

// Specify BEM block name
const block = 'currency-icon';

export default ({
    type,
    size = 'small',
    ...props
}) => (
    <span className={ `${block} ${block}--${type} ${block}--${size}` } />
);