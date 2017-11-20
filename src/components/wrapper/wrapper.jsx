import React from 'react';
import * as api from 'Utils/js/api';
import Influence from 'Components/influence/influence';
import Account from 'Components/account/account';
import Topic from 'Components/topic/topic';
import CreateTopic from 'Components/create-topic/create-topic';
import './wrapper-style';

// Specify BEM block name
const block = 'wrapper';

export default class Wrapper extends React.Component {
    constructor(props) {
        super(props);

        this._supportedBrowser = typeof localStorage === 'object';

        this.state = {
            selfInfo: undefined,
            listInfo: undefined,
            isFetchingSelf: false,
            isFetchingList: false,
            isCreating: false,
            isLoginActive: false,
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

    render() {
        let { isVoting, isFetchingList, isFetchingSelf, isCreating, isLoginActive } = this.state,
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
                <div className={ `${block}__top` }>
                    <h1 className={ `${block}__title` }>
                        Vote and Prioritize
                    </h1>

                    <Account
                        loading={ inProgress }
                        userData={ selfInfo }
                        possibleVotes={ listInfo && listInfo.possibleVotes }
                        refresh={ this._refresh.bind(this) } />
                </div>
                <p className={ `${block}__description` }>
                    This mini-application allows you to browse and vote on new features for webpack. Log in with
                    your GitHub credentials and you will notice that you have a certain amount of points/influence
                    that can be used to vote for or against any of the features listed below. The following two
                    sections describe the different types of influence and how they can be attained.
                </p>
                <div className={ `${block}__influences` }>
                    <Influence 
                        className={ `${block}__influence-section` } 
                        type="normal" />
                    <Influence 
                        className={ `${block}__influence-section`} 
                        type="golden" />
                </div>

                { listInfo && (
                    <ul className={ `${block}__topics` }>
                        { listInfo.items.map(topic => (
                            <li key={ topic.id }>
                                <Topic
                                    user={ selfInfo }
                                    admin={ listInfo.isAdmin }
                                    topic={ topic }
                                    votes={ listInfo.possibleVotes }
                                    onVote={ this._vote.bind(this) }
                                    onChangeSettings={ this._changeTopicSettings.bind(this) } />
                            </li>
                        ))}
                    </ul>
                )}

                { listInfo && listInfo.isAdmin && (
                    <CreateTopic onCreate={ this._createTopic.bind(this) } />
                )}
            </div>
        );
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
     * @param {object} props - The props to use
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
     * @param {string} title       - The topic title
     * @param {string} description - The topic description
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
     * @param {number} id      - The ID of the topic
     * @param {object} options - The new settings
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

    /**
     * Register new vote on a topic
     * 
     * @param {number} id         - ID of the topic being voted on
     * @param {string} influence  - The name of influence used
     * @param {number} difference - The change in influence
     * @param {string} currency   - The type of influence used
     * @param {number} score      - Amount influence is worth (?)
     */
    _vote(id, influence, difference, currency, score) {
        let { voteAppToken } = localStorage;

        if ( !difference ) return;

        this._localVote(id, influence, difference, currency, score);

        api.vote(voteAppToken, id, influence, difference)
            .catch(e => {
                console.error(e);

                // Revert local vote
                this._localVote(id, influence, -difference, currency, score);
            })
            .then(() => {
                this.setState({
                    isVoting: this.state.isVoting - 1
                });
            });
    }

    /**
     * Update local data to reflect new vote
     * 
     * @param {number} id         - ID of the topic being voted on
     * @param {string} influence  - The name of influence used
     * @param {number} difference - The change in influence
     * @param {string} currency   - The type of influence used
     * @param {number} score      - Amount influence is worth (?)
     */
    _localVote(id, influence, difference, currency, score) {
        let { listInfo, selfInfo } = this.state;

        this.setState({
            isVoting: this.state.isVoting + 1,
            listInfo: listInfo && {
                ...listInfo,
                items: this._updateByProperty(listInfo.items, 'id', id, item => ({
                    ...item,
                    votes: this._updateByProperty(item.votes, 'name', influence, vote => ({
                        ...vote,
                        votes: vote.votes + difference
                    })),
                    userVotes: this._updateByProperty(item.userVotes, 'name', influence, vote => ({
                        ...vote,
                        votes: vote.votes + difference
                    })),
                    score: item.score + score * difference
                }))
            },
            selfInfo: selfInfo && {
                ...selfInfo,
                currencies: this._updateByProperty(selfInfo.currencies, 'name', currency, currency => ({
                    ...currency,
                    used: currency.used + difference,
                    remaining: currency.remaining - difference
                }))
            }
        });
    }

    /**
     * Update an object within an array
     * 
     * @param  {array}    array    - The array containing the object to update
     * @param  {string}   property - A key used to find the target object
     * @param  {any}      value    - A value used to find the target object
     * @param  {function} update   - A callback to update that object (takes object as parameter)
     * @return {array}             - The modified array
     */
    _updateByProperty(array, property, value, update) {
        return array.map(item => {
            if (item[property] === value) {
                return update(item);

            } else return item;
        });
    }
}
