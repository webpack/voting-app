import React from 'react';
import ReactDOM from 'react-dom';
import DevContainer from 'Components/dev-container/dev-container';
import Wrapper from 'Components/wrapper/wrapper';

// TODO: Re-evaluate, why exactly are we passing it this way?
// Can we just always keep it in a working state, maybe just disabling or imitating voting?
// export default ({ section, page }) => {
// let arr = page.url.split('/');
// let name = arr[arr.length - 1];
// name={ name === 'vote' ? 'todo' : name }

ReactDOM.render((
    <DevContainer>
        <Wrapper name="todo" />
    </DevContainer>
), document.getElementById('root'));
