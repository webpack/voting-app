import React from 'react';
import Topic from 'Components/topic/topic';
import './create-topic-style';

const block = 'create-topic';

export default class CreateTopic extends React.Component {
    render() {
        return (
            <Topic
                className={ block }
                editing
                votes={[]}
                topic={{ title: 'New Topic', description: '...', score: 0 }}
                onChangeSettings={ this._create.bind(this) } />
        );
    }

    /**
     * Submit new topic and clear fields
     * 
     * @param {object} e - React synthetic event
     */
    _create(id, topic) {
        let { title, description } = topic;
        
        if ( title.length && description.length ) {
            this.props.onCreate(this.props.id, title, description);

        } else alert('Please enter a valid title and description.');

        return Promise.resolve(false);
    }
}