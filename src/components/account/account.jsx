import React from 'react';
import CurrencyIcon from 'Components/currency-icon/currency-icon';
import GithubLogo from './github-logo.svg';
import { startLogin as StartLogin } from 'Utils/js/api';
import './account-style';

// Specify BEM block name
const block = 'account';

export default class Account extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            options: false
        };
    }

    render() {
        let { userData, possibleVotes = [], loading } = this.props,
            { currencies = [] } = userData || {};

        return (
            <div className={ block }>
                { !userData && loading ? (
                    <span>Loading user info...</span>
                    
                ) : !userData ? (
                    <button
                        className={ `${block}__login` }
                        onClick={ this._login.bind(this) }>
                        Login with GitHub&nbsp;
                        <img src={ GithubLogo } />
                    </button>

                ) : (
                    <div className={ `${block}__inner` }>
                        <div className={ `${block}__info` }>
                            <div className={ `${block}__title` }>
                                { userData.name }
                                <span className={ `${block}__separator` }>//</span>
                                { userData.login }
                            </div>
                            <div className={ `${block}__currencies` }>
                                {
                                    possibleVotes
                                        .map(settings => currencies.find(obj => obj.name === settings.currency))
                                        .map(({ name, displayName, remaining, used, value }) => (
                                            <span
                                                key={ name }
                                                className={ `${block}__currency` }
                                                title={ `You used ${used} of a total of ${value} ${displayName}.` }>
                                                { remaining }
                                                <CurrencyIcon type={ name } />
                                            </span>
                                        ))
                                }
                            </div>
                        </div>

                        <img 
                            className={ `${block}__avatar` }
                            alt={ userData.login }
                            src={ userData.avatar }
                            onClick={ this._toggleOptions.bind(this) } />

                        { this.state.options ? (
                            <div className={ `${block}__options` }>
                                <button
                                    className={ `${block}__option` }
                                    onClick={ this.props.refresh }>
                                    Refresh
                                </button>
                                <button
                                    className={ `${block}__option` }
                                    onClick={ this._logout.bind(this) }>
                                    Logout
                                </button>
                            </div>
                        ) : null }
                    </div>
                )}
            </div>
        );
    }

    /**
     * Initiate GitHub login process
     * 
     */
    _login() {
        let { location = '' } = window;

        StartLogin(location);
    }

    /**
     * Log the user out by removing their token
     * 
     */
    _logout() {
        delete window.localStorage.voteAppToken;
        window.location.reload();
    }

    /**
     * Display and hide the options menu
     * 
     */
    _toggleOptions() {
        this.setState({
            options: !this.state.options
        });
    }
}