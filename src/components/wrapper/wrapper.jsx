import React from 'react';
import * as api from 'Utils/js/api';
import VoteButton from 'Components/button/button';
import Influence from 'Components/influence/influence';
import Account from 'Components/account/account';
import CreateTopic from 'Components/create-topic/create-topic';
import './wrapper-style';

// Specify BEM block name
const block = 'wrapper';

function updateByProperty(array, property, propertyValue, update) {
    return array.map(item => {
        if (item[property] === propertyValue) {
            return update(item);

        } else return item;
    });
}

export default class Wrapper extends React.Component {
    constructor(props) {
        super(props);

        this._supportedBrowser = typeof localStorage === 'object';

        this.state = {
            selfInfo: undefined,
            listInfo: undefined,
            isFetchingSelf: false,
            isVoting: 0
        };
    }

    componentDidMount() {
        let { selfInfo, listInfo } = this.state;

        if ( !this._supportedBrowser ) return;

        if ( api.isLoginActive() ) {
            this.setState({
                isLoginActive: true
            });

            api.continueLogin().then(token => {
                window.localStorage.voteAppToken = token;
            });

        } else {
            if (!selfInfo) this._updateUser();
            if (!listInfo) this._updateList();
        }
    }

    componentWillReceiveProps(props) {
        if ( !this._supportedBrowser ) return;

        this._updateList(props);
    }

    localVote(itemId, voteName, diffValue, currencyName, score) {
        let { selfInfo, listInfo } = this.state;

        this.setState({
            isVoting: this.state.isVoting + 1,
            listInfo: listInfo && {
                ...listInfo,
                items: updateByProperty(listInfo.items, 'id', itemId, item => ({
                    ...item,
                    votes: updateByProperty(item.votes, 'name', voteName, vote => ({
                        ...vote,
                        votes: vote.votes + diffValue
                    })),
                    userVotes: updateByProperty(item.userVotes, 'name', voteName, vote => ({
                        ...vote,
                        votes: vote.votes + diffValue
                    })),
                    score: item.score + score * diffValue
                }))
            },
            selfInfo: selfInfo && {
                ...selfInfo,
                currencies: updateByProperty(selfInfo.currencies, 'name', currencyName, currency => ({
                    ...currency,
                    used: currency.used + diffValue,
                    remaining: currency.remaining - diffValue
                }))
            }
        });
    }

    vote(itemId, voteName, diffValue, currencyName, score) {
        let { voteAppToken } = localStorage;

        if (!diffValue) return;

        this.localVote(itemId, voteName, diffValue, currencyName, score);

        api.vote(voteAppToken, itemId, voteName, diffValue)
            .catch(e => {
                console.error(e);

                // revert local vote
                this.localVote(itemId, voteName, -diffValue, currencyName, score);
                this.setState({
                    isVoting: this.state.isVoting - 1
                });
            })
            .then(() => {
                this.setState({
                    isVoting: this.state.isVoting - 1
                });
            });
    }

    render() {
        let { voteAppToken } = localStorage,
            { isVoting, isFetchingList, isFetchingSelf, isCreating, isLoginActive } = this.state,
            { selfInfo, listInfo, editItem, editItemTitle, editItemDescription } = this.state,
            maxVoteInfo = listInfo && listInfo.possibleVotes.map(() => 0);

        const inProgress = isFetchingList || isFetchingSelf || isCreating || isVoting;

        if ( !this._supportedBrowser ) {
            return <div>Your browser is not supported.</div>;
        }

        if ( isLoginActive ) {
            return <div>Logging in...</div>;
        }

        if ( listInfo ) listInfo.items.forEach(item => {
            if ( item.userVotes ) {
                maxVoteInfo.forEach((max, idx) => {
                    let votes = item.userVotes[idx].votes;

                    if (votes > max) maxVoteInfo[idx] = votes;
                });
            }
        });

        return (
            <div className={ block }>
                <div className={ `${block}__influence` }>
                    <div className={ `${block}__top` }>
                        <div className={ `${block}__influence` }>
                            <div className={ `${block}__influence-description` }>
                                <Influence 
                                    className={ `${block}__influence-section` } 
                                    type="normal" />
                                <Influence 
                                    className={ `${block}__influence-section`} 
                                    type="golden" />
                            </div>

                            <div className={ `${block}__influence-disclaimer` }>
                                DISCLAIMER: Since this feature is its Alpha stages, the formula for calculating influence may change.
                            </div>
                        </div>

                        <div className={ `${block}__user-section` }>
                            <Account
                                loading={ inProgress }
                                userData={ selfInfo }
                                possibleVotes={ listInfo && listInfo.possibleVotes }
                                refresh={ this._refresh.bind(this) } />
                        </div>
                    </div>
                </div>

                { listInfo && (
                    <div>
                        <h1>{ listInfo.displayName }</h1>
                        <div>{ listInfo.description }</div>

                        <ul className={ `${block}__items-list` }>
                            { listInfo.items.map(item => (
                                <li key={ item.id }>
                                    <div className={ `${block}__item-card` }>
                                        <div className={ `${block}__score-section` }>
                                            <div className={ `${block}__item-score` }>
                                                { item.score }
                                            </div>

                                            { listInfo.possibleVotes.map((voteSettings, idx) => {
                                                let vote = item.votes[idx],
                                                    userVote = item.userVotes && item.userVotes[idx],
                                                    currencyInfo = selfInfo && voteSettings.currency && selfInfo.currencies.find(currency => currency.name === voteSettings.currency),
                                                    maximum = voteSettings.maximum || 1000,
                                                    minimum = voteSettings.minimum || 0,
                                                    value = (userVote && userVote.votes) ? userVote.votes: 0;

                                                if (currencyInfo && currencyInfo.remaining + value < maximum) {
                                                    maximum = currencyInfo.remaining + value;
                                                }

                                                return (
                                                    <div key={ voteSettings.name } className={ `${block}__item-button` }>
                                                        <VoteButton
                                                            className={ `${block}__vote-${voteSettings.name}` }
                                                            value={ vote.votes }
                                                            myValue={ value }
                                                            maxUp={ userVote ? maximum - value : 0 }
                                                            maxDown={ userVote ? value - minimum : 0 }
                                                            color={ this._getInfluenceColor(voteSettings.name) }
                                                            canVote = { !!voteAppToken && !item.locked }
                                                            onVote={(diffValue) => {
                                                                this.vote(item.id, voteSettings.name, diffValue, voteSettings.currency, voteSettings.score);
                                                            }} />
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        { editItem !== item.id && (
                                            <div className={ `${block}__item-content` }>
                                                <span className={ `${block}__item-title` }>
                                                    { item.title }
                                                </span>

                                                <span>{ item.description }</span>

                                                { listInfo.isAdmin && (
                                                    <div>
                                                        <button onClick={ 
                                                            this._changeTopicSettings.bind(this, item.id, { locked: true }) 
                                                        }>
                                                            Lock
                                                        </button>

                                                        <button onClick={
                                                            this._changeTopicSettings.bind(this, item.id, { locked: false })
                                                        }>
                                                            Unlock
                                                        </button>

                                                        <button onClick={
                                                            this._changeTopicSettings.bind(this, item.id, { archived: true })
                                                        }>
                                                            Archive
                                                        </button>

                                                        <button onClick={
                                                            this._changeTopicSettings.bind(this, item.id, { archived: false })
                                                        }>
                                                            Unarchive
                                                        </button>

                                                        <button onClick={() => {
                                                            this.setState({
                                                                isCreating: true,
                                                                editItem: item.id,
                                                                editItemTitle: item.title,
                                                                editItemDescription: item.description
                                                            });
                                                        }}>
                                                            Edit
                                                        </button>
                                                    </div> 
                                                )}
                                            </div> 
                                        )}

                                        { editItem === item.id && (
                                            <div className={ `${block}__item-content` }>
                                                <div className={ `${block}__item-title` }>
                                                    <input 
                                                        className={ `${block}__item-edit-title` } 
                                                        type="text" 
                                                        value={ editItemTitle } 
                                                        onChange={e => this.setState({ editItemTitle: e.target.value })} />
                                                </div>

                                                <div>
                                                    <textarea 
                                                        className={ `${block}__item-edit-description` } 
                                                        value={ editItemDescription } 
                                                        onChange={e => this.setState({ editItemDescription: e.target.value })} />
                                                </div>

                                                <div>
                                                    <button onClick={() => {
                                                        this.setState({
                                                            editItem: null,
                                                            isCreating: true
                                                        });

                                                        api.configItem(voteAppToken, item.id, {
                                                            description: editItemDescription,
                                                            title: editItemTitle
                                                        }).then(() => {
                                                            this.setState({
                                                                isCreating: false
                                                            });

                                                            this._updateList();
                                                        });
                                                    }}>
                                                        Done Editing
                                                    </button>
                                                </div>
                                            </div> 
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div> 
                )}

                { listInfo && listInfo.isAdmin && (
                    <CreateTopic onCreate={ this._createTopic.bind(this) } />
                )}
            </div>
        );
    }

    /**
     * Get color for the given influence [name]
     * 
     * @param {string} name - Infuence type
     * @return {string} - A valid CSS color value
     */
    _getInfluenceColor(name) {
        switch (name) {
            case 'influence': return 'blue';
            case 'golden': return '#bfa203';
            case 'thumb': return '#535353';
            default: return undefined;
        }
    }

    /**
     * Fetch user information and available influence
     * 
     */
    _updateUser() {
        let { voteAppToken } = localStorage;

        if (voteAppToken) {
            this.setState({
                isFetchingSelf: true
            });

            api.getSelf(voteAppToken)
                .then(result => {
                    this.setState({ selfInfo: result });
                })
                .catch(error => {
                    console.error('Failed to fetch user information: ', error);
                    this.setState({ selfInfo: null });
                })
                .then(() => {
                    this.setState({ isFetchingSelf: false });
                });
        }
    }

    /**
     * Fetch the list of voting topics
     * 
     * @param  {object} props - The props to use
     */
    _updateList(props = this.props) {
        let { name } = props,
            { voteAppToken } = localStorage;

        this.setState({
            isFetchingList: true
        });

        api.getList(voteAppToken, name)
            .then(result => {
                this.setState({ listInfo: result });
            })
            .catch(error => {
                console.error('Failed to fetch topic list: ', error);
                this.setState({ listInfo: null });
            })
            .then(() => {
                this.setState({ isFetchingList: false });
            });
    }

    /**
     * Create a new topic for voting
     * 
     * @param  {string} title       - The topic title
     * @param  {string} description - The topic description
     */
    _createTopic(title = '', description = '') {
        let { name } = this.props,
            { listInfo } = this.state,
            { voteAppToken } = localStorage;

        this.setState({
            isCreating: true
        });

        api.createItem(voteAppToken, name, title, description)
            .then(item => {
                this.setState({
                    isCreating: false,
                    listInfo: listInfo && {
                        ...listInfo,
                        items: [
                            ...listInfo.items,
                            item
                        ]
                    }
                });
            });
    }

    /**
     * Change a topics settings (e.g. archive status)
     * 
     * @param  {number} id      - The ID of the topic
     * @param  {object} options - The new settings
     */
    _changeTopicSettings(id, options = {}) {
        let { voteAppToken } = localStorage;

        this.setState({
            isCreating: true
        });

        api.configItem(voteAppToken, id, options)
            .then(() => {
                this.setState({
                    isCreating: false
                });

                this._updateList();
            });
    }

    /**
     * Refresh user information and topic list
     * 
     */
    _refresh() {
        this._updateUser();
        this._updateList();
    }
}
