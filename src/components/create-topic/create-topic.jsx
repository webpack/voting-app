import React from 'react';
import './create-topic-style';

const block = 'create-topic';

export default class CreateTopic extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            description: ''
        };
    }

    render() {
        return (
            <form
                className={ block } 
                onSubmit={ this._submit }>
                <div className={ `${block}__title` }>
                    <input 
                        type="text" 
                        placeholder="Enter a new topic..."
                        value={ this.state.title } 
                        onChange={ this._changeTitle.bind(this) } />
                </div>

                <div className={ `${block}__description` }>
                    <textarea 
                        rows="4" 
                        placeholder="Describe the topic..."
                        value={ this.state.description } 
                        onChange={ this._changeDescription.bind(this) } />
                </div>

                <button 
                    type="submit"
                    className={ `${block}__submit` }
                    onClick={ this._submit.bind(this) }>
                    Create Item
                </button>
            </form>
        );
    }

    /**
     * Update the current title
     * 
     * @param {object} e - React synthetic event
     */
    _changeTitle(e) {
        this.setState({
            title: e.target.value
        });
    }

    /**
     * Update the current description
     * 
     * @param {object} e - React synthetic event
     */
    _changeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    /**
     * Submit new topic and clear fields
     * 
     * @param {object} e - React synthetic event
     */
    _submit(e) {
        e.preventDefault();

        let { title, description } = this.state;
        
        if ( title.length && description.length ) {
            this.props.onCreate(title, description);

            this.setState({
                title: '',
                description: ''
            });

        } else alert(
            'Please enter a valid title and description.'
        );
    }
}