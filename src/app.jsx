import React from 'react';
import ReactDOM from 'react-dom';
import DevContainer from 'Components/dev-container/dev-container';
import Wrapper from 'Components/wrapper/wrapper';

ReactDOM.render((
    <DevContainer>
        <Wrapper />
    </DevContainer>
), document.getElementById('root'));

// export default ({ section, page }) => {
//   let arr = page.url.split('/');
//   let name = arr[arr.length - 1];

//   return (
//     <Container className="vote-list">

//       <section className="vote-list__content">
//         <Interactive
//           id="components/vote/app.jsx"
//           component={ VoteApp }
//           name={ name === 'vote' ? 'todo' : name }
//         />
//       </section>
//     </Container>
//   );
// };