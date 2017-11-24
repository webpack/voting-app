import React from 'react';
import CurrencyIcon from 'Components/currency-icon/currency-icon';
import './votes-style';

// Specify BEM block name
const block = 'votes';

export default class Votes extends React.Component {
    render() {
        let { className = '', currency, current, locked, user } = this.props;
        
        return (
            <div className={ `${block} ${className}` }>
                <span className={ `${block}__currency` }>
                    { !locked && user.currency && (
                        <figure
                            className={ `${block}__up` }
                            onClick={ () => this._vote(1) }
                            onMouseDown={ () => this._startCounter(true) }
                            onMouseUp={ () => this._stopCounter() }
                            onMouseOut={ () => this._stopCounter() }
                            onTouchStart={ () => this._startCounter(true) }
                            onTouchEnd={ () => this._stopCounter() }
                            onTouchCancel={ () => this._stopCounter() } />
                    )}

                    <CurrencyIcon
                        size="large"
                        type={ currency.currency } />

                    { !locked && user.currency && (
                        <figure
                            className={ `${block}__down` }
                            onClick={ () => this._vote(-1) }
                            onMouseDown={ () => this._startCounter(false) }
                            onMouseUp={ () => this._stopCounter() }
                            onMouseOut={ () => this._stopCounter() }
                            onTouchStart={ () => this._startCounter(false) }
                            onTouchEnd={ () => this._stopCounter() }
                            onTouchCancel={ () => this._stopCounter() } />
                    )}
                </span>
                <span className={ `${block}__score` }>
                    { current.votes }

                    <span className={ `${block}__multiplier` }>
                        x { currency.score }
                    </span>
                </span>
            </div>
        );
    }

    /**
     * Computes the maximum amount of votes that can be used
     * 
     * @return {number} - The maximum number of votes allowed
     */
    get _maximum() {
        let { user, currency } = this.props,
            { maximum = 1000 } = currency;

        if ( user.currency && (user.currency.remaining + user.votes.votes) < maximum ) {
            return user.currency.remaining + user.votes.votes;

        } else return maximum;
    }
    
    /**
     * Trigger a new `number` of votes to be added
     * 
     * @param {number} number - The number of votes to use
     */
    _vote(number) {
        let { user } = this.props,
            { votes } = user.votes,
            limit = this._maximum - votes;

        this.props.onVote(
            Math.min(
                limit, 
                Math.max(number, -votes)
            )
        );
    }

    /**
     * Continually increase or decrease the vote with a dynamic change
     * based on how the long the button has been held
     * 
     * @param {boolean} increase - Indicates whether to increase or decrease
     */
    _startCounter(increase) {
        let current = 0;
        let change = 0;

        if (this._interval) {
            clearInterval(this._interval);
        }

        this._interval = setInterval(() => {
            if ( current <= 5 ) {
                current++;
                change = 1;

            } else if ( current <= 10 ) {
                current += 2;
                change = 2;

            } else if ( current <= 40 ) {
                current += 5;
                change = 5;

            } else if ( current <= 70 ) {
                current += 10;
                change = 10;

            } else {
                current += 15;
                change = 15;
            }

            if ( !increase ) {
                change *= -1;
            }

            this._vote(change);
        }, 200);
    }

    /**
     * Stop the continual increase or decrease interval
     * 
     */
    _stopCounter() {
        if (this._interval) {
            clearInterval(this._interval);
        }
    }
}
