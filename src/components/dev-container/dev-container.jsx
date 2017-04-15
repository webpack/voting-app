// WARNING: This component is only used in development and will not be exported in dist
// It simply provides some base styling for the site

import React from 'react';
import './dev-container-style';

export default props => (
    <div className="dev-container">
        { props.children }
    </div>
);