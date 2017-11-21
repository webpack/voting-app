import React from 'react';
import './currency-icon-style';

// Specify BEM block name
const block = 'currency-icon';

export default props => (
    <span className={ `${block} ${block}--${props.type}` } />
);