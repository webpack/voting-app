import React from 'react';
import './currency-icon-style';

// Specify BEM block name
const block = 'currency-icon';

// ...
const sizes = {
    small: 10,
    large: 16,
    huge: 19
};

export default ({
    type,
    size = 'small',
    ...props
}) => (
    <svg
        className={ block }
        width={ sizes[size] }
        height={ sizes[size] }
        viewBox="0 0 78 78">
        <g className={ `${block}--${type}` } >
            <polygon points="5 19.6258065 38.4980127 0 73 19.6258065 73 57.3677419 38.5 78 5 57.3677419" />
        </g>
    </svg>
);