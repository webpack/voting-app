import React from 'react';
import Votes from 'Components/votes/votes';
import Dropdown from 'Components/dropdown/dropdown';
import './topic-style';

// Specify BEM block name
const block = 'topic';

export default class Topic extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editable: false,
            title: props.topic.title,
            description: props.topic.description
        };
    }
    
    render() {
        let { user, admin, topic, votes, token } = this.props,
            { editable, title, description } = this.state;

        return (
            <div className={ block }>
                <section className={ `${block}__content` }>
                    <div className={ `${block}__title` }>
                        { !editable ? title : (
                            <input 
                                type="text" 
                                value={ title } 
                                onChange={ this._changeTitle.bind(this) } />
                        )}

                        { admin ? (
                            <Dropdown
                                className={ `${block}__settings` }
                                width={ 125 }
                                onChange={ this._changeSettings }
                                options={[
                                    { label: 'Lock Topic', locked: true },
                                    { label: 'Unlock Topic', locked: false },
                                    { label: 'Archive Topic', archived: true },
                                    { label: 'Revive Topic', archived: false },
                                    { label: 'Edit Topic', onClick: this._edit.bind(this) }
                                ]}>
                                +
                            </Dropdown>
                        ) : null }
                    </div>
                    <div className={ `${block}__inner` }>
                        <div className={ `${block}__description` }>
                            { !editable ? description : (
                                <textarea 
                                    value={ description } 
                                    onChange={ this._changeDescription.bind(this) } />
                            )}
                        </div>

                        <div className={ `${block}__sponsors` }>
                            <div><b>Sponsors</b></div>
                            <p>Coming soon...</p>
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
                {/* editable ? (
                    <button onClick={ this._saveChanges.bind(this) }>
                        Done Editing
                    </button>
                ) : null }*/}
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
        // TODO: Set isCreating in Wrapper via a this.props.edit callback?
        this.setState({
            editable: true
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
     * @param {object} settings - 
     */
    _changeSettings(settings = {}) {
        let { topic } = this.props;

        this.props.onSettingsChange(topic.id, settings);
    }

    /**
     * Pass changes up via this.props.save
     * 
     * @param {object} e - React synthetic event
     */
    _saveChanges(e) {
        let { title, description } = this.state;

        // TODO: This is one approach using promises
        this.props
            .save(title, description)
            .then(success => this.setState({
                editable: false
            }));

        // this.setState({
        //     editItem: null,
        //     isCreating: true
        // });

        // api.configItem(voteAppToken, item.id, {
        //     description: editItemDescription,
        //     title: editItemTitle
        // }).then(() => {
        //     this.setState({
        //         isCreating: false
        //     });

        //     this._updateList();
        // });
    }
}
