import React from 'react';
import CurrencyIcon from 'Components/currency-icon/currency-icon';
import Dropdown from 'Components/dropdown/dropdown';
import GithubLogo from './github-logo.svg';
import { startLogin as StartLogin } from 'Utils/js/api';
import './account-style';

// Specify BEM block name
const block = 'account';

export default class Account extends React.Component {
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

                        <Dropdown
                            width={ 100 }
                            tipOffset={ 12 }
                            options={[
                                { label: 'Refresh', onClick: this.props.refresh },
                                { label: 'Logout', onClick: this._logout.bind(this) }
                            ]}>
                            <img 
                                className={ `${block}__avatar` }
                                alt={ userData.login }
                                src={ userData.avatar } />
                        </Dropdown>
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
}