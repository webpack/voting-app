import React from 'react';
import { startLogin as StartLogin } from 'Utils/js/api';
import GithubLogo from './github-logo.svg';
import './account-style';

// Specify BEM block name
const block = 'account';

export default class Account extends React.Component {
    render() {
        let { userData, loading } = this.props;

        if ( !userData ) {
            if ( loading ) {
                return (
                    <div className={ `${block}__inner` }>
                        Loading user info...
                    </div>
                );
            }
            
            return (
                <div className={ `${block}__login` }>
                    <button onClick={ this._login.bind(this) }>
                        Login with Github&nbsp;
                        <img src={ GithubLogo } />
                    </button>
                </div>
            );

        } else {
            return (
                <div className={ `${block}__inner` }>
                    <div className={ `${block}__info` }>
                        <img alt={ userData.login } src={ userData.avatar } />
                        { userData.login }
                    </div>

                    { userData && (
                        <ul className={ `${block}__currencies` }>
                            { this._currencies }
                        </ul> 
                    )}

                    <div className={ `${block}__options` }>
                        <button onClick={ this.props.refresh }>
                            Refresh
                        </button>
                        <button onClick={ this._logout.bind(this) }>
                            Logout
                        </button>
                    </div>
                </div>
            );
        }
    }

    /**
     * Amount of influence available to the current user
     * 
     * @return {array} - List of markup
     */
    get _currencies() {
        let { userData = {}, possibleVotes = [] } = this.props,
            { currencies = [] } = userData;

        return currencies.filter(currency => {
                return possibleVotes.some(voteSettings => {
                    return voteSettings.currency === currency.name;
                });
            })
            .map(currency => (
                <li 
                    key={ currency.name } 
                    className={ `${block}__currency-${currency.name}` } 
                    title={ `${currency.description}\nYou used ${currency.used} of a total of ${currency.value} ${currency.displayName}.` }>
                    { currency.remaining } { currency.displayName }
                </li>
            )); 
    }

    /**
     * Initiate github login process
     * 
     * @param {object} e - React synthetic event
     */
    _login(e) {
        let { location = '' } = window;

        StartLogin(location);
    }

    /**
     * Log the user out by removing their token
     * 
     * @param {object} e - React synthetic event
     */
    _logout(e) {
        delete window.localStorage.voteAppToken;
        window.location.reload();
    }
}