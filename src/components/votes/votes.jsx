import React from 'react';
import CurrencyIcon from 'Components/currency-icon/currency-icon';
import './votes-style';

// Specify BEM block name
const block = 'votes';

export default class Votes extends React.Component {
    render() {
        let { className = '', currency, current, locked, user } = this.props,
            { maximum = 1000 } = currency;

        if ( user.currency && user.currency.remaining + user.votes.votes < maximum ) {
            maximum = user.currency.remaining + user.votes.votes;
        }
        
        return (
            <div className={ `${block} ${className}` }>
                <span className={ `${block}__currency` }>
                    { !locked && user.currency && (
                        <figure
                            className={ `${block}__up` }
                            onClick={ () => this._handleClick(1) }
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
                            onClick={ () => this._handleClick(-1) }
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
    
    _handleClick(n) {
        let { maxUp, maxDown } = this.props;

        this.props.onVote(
            Math.min(
                maxUp, 
                Math.max(n, -maxDown)
            )
        );
    }

    _startCounter(increase) {
        let current = 0;
        let add = 0;

        if (this.interval) {
            clearInterval(this.interval);
        }

        this.interval = setInterval(() => {
            // increase for 1 between 0 and 5
            if(current <= 5) {
                current++;
                add = 1;
            }
            // increase for 2 between 6 and 10
            else if(current <= 10) {
                current += 2;
                add = 2;
            }
            // increase for 5 between 11 and 40
            else if(current <= 40) {
                current += 5;
                add = 5;
            }
            // increase for 10 between 41 and 70
            else if(current <= 70) {
                current += 10;
                add = 10;
            }
            // increase for 15 after 71
            else {
                current += 15;
                add = 15;
            }

            if(!increase) {
                add *= -1;
            }

            this._handleClick(add);
        }, 200);
    }

    _stopCounter() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}
