import React from 'react';
import Votes from 'Components/votes/votes';
import Dropdown from 'Components/dropdown/dropdown';
import Textarea from 'react-textarea-autosize';
import './topic-style';

// Specify BEM block name
const block = 'topic';

export default class Topic extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: props.editing || false,
            title: props.topic.title,
            description: props.topic.description
        };
    }
    
    render() {
        let { className = '', user, admin, topic, votes, token } = this.props,
            { editing, title, description } = this.state;

        return (
            <div className={ `${block} ${className}` }>
                <section className={ `${block}__content` }>
                    <div className={ `${block}__title` }>
                        { !editing ? title : (
                            <input 
                                type="text" 
                                value={ title } 
                                onChange={ this._changeTitle.bind(this) } />
                        )}

                        { admin ? (
                            <Dropdown
                                className={ `${block}__settings` }
                                width={ 125 }
                                tipOffset={ 2 }
                                onChange={ this._changeSettings.bind(this) }
                                options={[
                                    { label: `${topic.locked ? 'Unlock' : 'Lock'} Topic`, locked: !topic.locked },
                                    { label: `${topic.archived ? 'Revive' : 'Archive'} Topic`, archived: !topic.archived },
                                    { label: 'Edit Topic', onClick: this._edit.bind(this) }
                                ]}>
                                <svg width="15px" viewBox="-99 88.8 55 55">
                                    <path d="M-68.3,137H-52c1.1,0,2-0.9,2-2s-0.9-2-2-2h-16.3c-0.9-2.9-3.5-5-6.7-5c-3.2,0-5.8,2.1-6.7,5H-92c-1.1,0-2,0.9-2,2s0.9,2,2,2h10.3c0.9,2.9,3.5,5,6.7,5C-71.8,142-69.2,139.9-68.3,137L-68.3,137z M-53.3,118h1.3c1.1,0,2-0.9,2-2s-0.9-2-2-2h-1.3c-0.9-2.9-3.5-5-6.7-5c-3.2,0-5.8,2.1-6.7,5H-92c-1.1,0-2,0.9-2,2s0.9,2,2,2h25.3c0.9,2.9,3.5,5,6.7,5C-56.8,123-54.2,120.9-53.3,118z M-77.3,99H-52c1.1,0,2-0.9,2-2s-0.9-2-2-2h-25.3c-0.9-2.9-3.5-5-6.7-5c-3.2,0-5.8,2.1-6.7,5H-92c-1.1,0-2,0.9-2,2s0.9,2,2,2h1.3c0.9,2.9,3.5,5,6.7,5C-80.8,104-78.2,101.9-77.3,99L-77.3,99z" />
                                </svg>
                            </Dropdown>
                        ) : null }
                    </div>
                    <div className={ `${block}__inner` }>
                        <div className={ `${block}__description` }>
                            { !editing ? description : (
                                <Textarea 
                                    value={ description } 
                                    onChange={ this._changeDescription.bind(this) } />
                            )}
                        </div>

                        { editing ? (
                            <button
                                className={ `${block}__save` }
                                onClick={ this._saveChanges.bind(this) }>
                                Done Editing
                            </button>
                        ) : null }

                        <div className={ `${block}__sponsors` }>
                            <h4 className={ `${block}__subtitle` }>Sponsors</h4>
                            <div className={ `${block}__people` }>Coming soon...</div>
                        </div>
                    </div>
                </section>

                <section className={ `${block}__vote` }>
                    <div className={ `${block}__title ${block}__title--vote` }>
                        Place Your Vote
                    </div>
                    <div className={ `${block}__inner` }>
                        { votes.map((currency, i) => (
                            <Votes
                                key={ currency.name }
                                className={ `${block}__field` }
                                currency={ currency }
                                current={ topic.votes.find(obj => obj.name === currency.name) }
                                locked={ topic.locked }
                                user={{
                                    votes: topic.userVotes && topic.userVotes.find(obj => obj.name === currency.name),
                                    currency: user && user.currencies.find(obj => obj.name === currency.currency)
                                }}
                                onVote={ this._vote.bind(this, currency) } />
                        ))}
                        <div className={ `${block}__total` }>
                            { topic.score }
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    /**
     * Trigger voting process
     *
     * @param {object} settings   - Data describing the type of vote
     * @param {number} difference - Amount to change influence
     */
    _vote(settings = {}, difference) {
        let { topic } = this.props;

        this.props.onVote(
            topic.id, 
            settings.name, 
            difference, 
            settings.currency, 
            settings.score
        );
    }

    /**
     * Enable topic editing
     * 
     * @param {object} e - React synthetic event
     */
    _edit(e) {
        this.setState({
            editing: true
        });
    }

    /**
     * Update the topic's title
     * 
     * @param  {object} e - React synthetic event
     */
    _changeTitle(e) {
        this.setState({ 
            title: e.target.value 
        });
    }

    /**
     * Update the topic's description
     * 
     * @param {object} e - React synthetic event
     */
    _changeDescription(e) {
        this.setState({ 
            description: e.target.value 
        });
    }

    /**
     * Update topic settings
     * 
     * @param {object} option - The dropdown object (a label and settings)
     */
    _changeSettings({ label, ...settings}) {
        let { topic } = this.props;

        this.props.onChangeSettings(
            topic.id,
            settings
        );
    }

    /**
     * Pass changes up via this.props.save
     * 
     * @param {object} e - React synthetic event
     */
    _saveChanges(e) {
        let { topic } = this.props,
            { title, description } = this.state;

        this.props
            .onChangeSettings(topic.id, { title, description })
            .then(success => {
                if (success) {
                    this.setState({
                        editing: false
                    });
                }
            });
    }
}
