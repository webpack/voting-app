import React from 'react';
import ReactDOM from 'react-dom';
import DevContainer from 'Components/dev-container/dev-container';
import Wrapper from 'Components/wrapper/wrapper';

ReactDOM.render((
    <DevContainer>
        <Wrapper development />
    </DevContainer>
), document.getElementById('root'));
